import { ApiError, handleApiError } from "@/lib/api-errors"
import type { ApiResponse } from "@/lib/api-types"

interface ApiClientConfig {
  baseURL: string
  apiKey?: string
  timeout: number
  maxRetries: number
  retryDelay: number
}

const defaultConfig: ApiClientConfig = {
  baseURL: process.env.ATTENDANCE_API_URL ?? "",
  apiKey: process.env.ATTENDANCE_API_KEY,
  timeout: 10000,
  maxRetries: 3,
  retryDelay: 1000,
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeout: number,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    })
    return response
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw ApiError.timeoutError(url)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

async function requestWithRetry<T>(
  endpoint: string,
  init: RequestInit,
  config: ApiClientConfig,
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const backoff = config.retryDelay * Math.pow(2, attempt - 1)
        await delay(backoff)
      }

      const url = `${config.baseURL}${endpoint}`
      const response = await fetchWithTimeout(url, init, config.timeout)

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw ApiError.fromResponse(response.status, body, endpoint)
      }

      const data: ApiResponse<T> = await response.json()

      if (data.status === "error") {
        throw new ApiError(400, data.message, endpoint, false)
      }

      return data.data
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (error instanceof ApiError && !error.retryable) {
        throw error
      }

      if (attempt === config.maxRetries) {
        break
      }
    }
  }

  handleApiError(lastError, endpoint)
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const config = defaultConfig

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  if (config.apiKey) {
    headers["Authorization"] = `Bearer ${config.apiKey}`
  }

  return requestWithRetry<T>(endpoint, { method: "GET", headers }, config)
}

export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  const config = defaultConfig

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  if (config.apiKey) {
    headers["Authorization"] = `Bearer ${config.apiKey}`
  }

  return requestWithRetry<T>(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  }, config)
}

export async function apiPut<T>(endpoint: string, body: unknown): Promise<T> {
  const config = defaultConfig

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  if (config.apiKey) {
    headers["Authorization"] = `Bearer ${config.apiKey}`
  }

  return requestWithRetry<T>(endpoint, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  }, config)
}

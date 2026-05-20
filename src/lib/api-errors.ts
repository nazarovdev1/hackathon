export class ApiError extends Error {
  public readonly statusCode: number
  public readonly apiMessage: string
  public readonly retryable: boolean
  public readonly endpoint: string

  constructor(
    statusCode: number,
    apiMessage: string,
    endpoint: string,
    retryable = false,
  ) {
    super(apiMessage)
    this.name = "ApiError"
    this.statusCode = statusCode
    this.apiMessage = apiMessage
    this.endpoint = endpoint
    this.retryable = retryable
  }

  static fromResponse(status: number, body: unknown, endpoint: string): ApiError {
    const message = typeof body === "object" && body !== null && "message" in body
      ? String((body as Record<string, unknown>).message)
      : `API request failed with status ${status}`

    const retryable = status >= 500 || status === 429

    return new ApiError(status, message, endpoint, retryable)
  }

  static networkError(endpoint: string): ApiError {
    return new ApiError(0, "Network error — internet aloqasini tekshiring", endpoint, true)
  }

  static timeoutError(endpoint: string): ApiError {
    return new ApiError(408, "So'rov vaqti tugadi — qayta urinib ko'ring", endpoint, true)
  }
}

export function handleApiError(error: unknown, endpoint: string): never {
  if (error instanceof ApiError) {
    throw error
  }

  if (error instanceof TypeError && error.message.includes("fetch")) {
    throw ApiError.networkError(endpoint)
  }

  if (error instanceof Error) {
    throw new ApiError(500, error.message, endpoint, true)
  }

  throw new ApiError(500, "Noma'lum xatolik yuz berdi", endpoint, true)
}

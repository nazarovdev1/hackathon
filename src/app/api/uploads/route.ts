export const dynamic = 'force-dynamic'

import { authOptions } from '@/lib/auth'
import fs from 'fs'
import { getServerSession } from 'next-auth'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

function ensureUploadDir() {
	if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

function isAllowedExt(filename: string) {
	const ext = path.extname(filename).toLowerCase()
	return ['.pdf', '.png', '.jpg', '.jpeg'].includes(ext)
}

export async function POST(req: Request) {
	// require authenticated user
	const session = await getServerSession(authOptions as any)
	if (!session)
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
		})
	try {
		const body = await req.json()
		const { filename, data } = body as { filename?: string; data?: string }

		if (!filename || !data) {
			return new Response(
				JSON.stringify({ error: 'filename and data are required' }),
				{ status: 400 },
			)
		}

		if (!isAllowedExt(filename)) {
			return new Response(JSON.stringify({ error: 'Unsupported file type' }), {
				status: 400,
			})
		}

		// strip possible data URL prefix
		const base64 = data.includes(',') ? data.split(',')[1] : data
		const buffer = Buffer.from(base64, 'base64')

		const MAX_BYTES = 5 * 1024 * 1024 // 5MB
		if (buffer.length > MAX_BYTES) {
			return new Response(
				JSON.stringify({ error: 'File too large (max 5MB)' }),
				{ status: 413 },
			)
		}

		ensureUploadDir()

		// sanitize filename
		const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_')
		const target = path.join(UPLOAD_DIR, safeName)

		fs.writeFileSync(target, buffer)

		const url = `/uploads/${safeName}`
		return new Response(JSON.stringify({ url }), { status: 200 })
	} catch (err: any) {
		return new Response(
			JSON.stringify({ error: err?.message ?? 'Upload failed' }),
			{ status: 500 },
		)
	}
}

/**
 * photo-upload Worker — accepts direct photo uploads from the mn4x4.org
 * submit form into the private R2 quarantine bucket `mn4x4-photo-submissions`.
 *
 * Flow: POST /api/photo-upload/session {token} verifies a Turnstile token and
 * returns an HMAC-signed upload ticket (15 min). POST /api/photo-upload/file
 * (raw bytes + ticket headers) validates size and magic bytes, then stores the
 * object. Nothing is ever served from the bucket; a 60-day lifecycle rule
 * deletes unclaimed objects. Publish still goes through Josh's manual review
 * (Matrix card → fetch-submission.sh → add-photo.sh).
 *
 * The Worker is stateless, so per-ticket file count is client-enforced plus a
 * WAF rate-limit rule on /api/photo-upload* — acceptable because the bucket is
 * quarantine-only and worst-case abuse is quota, not security.
 */

interface Env {
  SUBMISSIONS: R2Bucket
  TURNSTILE_SECRET_KEY: string
  UPLOAD_TICKET_SECRET: string
}

const MAX_FILE_BYTES = 20 * 1024 * 1024 // 20 MB
const MAX_FILE_INDEX = 9 // 10 files per submission
const TICKET_TTL_MS = 15 * 60 * 1000

const SIGNATURES: Array<{ ext: string; test: (b: Uint8Array) => boolean }> = [
  { ext: 'jpg', test: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    ext: 'png',
    test: b => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    ext: 'webp',
    test: b =>
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && // RIFF
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50, // WEBP
  },
  {
    // ISO-BMFF: size + 'ftyp' + a heic/heif brand
    ext: 'heic',
    test: b => {
      if (!(b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70)) return false
      const brand = String.fromCharCode(b[8], b[9], b[10], b[11])
      return ['heic', 'heix', 'hevc', 'heim', 'heis', 'hevm', 'hevs', 'mif1', 'msf1'].includes(brand)
    },
  },
]

const CONTENT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function handleSession(request: Request, env: Env): Promise<Response> {
  let token: unknown
  try {
    token = ((await request.json()) as { token?: unknown }).token
  } catch {
    return json(400, { error: 'Invalid JSON body' })
  }
  if (typeof token !== 'string' || !token) {
    return json(400, { error: 'Missing Turnstile token' })
  }

  const form = new FormData()
  form.set('secret', env.TURNSTILE_SECRET_KEY)
  form.set('response', token)
  const remoteip = request.headers.get('CF-Connecting-IP')
  if (remoteip) form.set('remoteip', remoteip)

  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  })
  const outcome = (await verify.json()) as { success?: boolean }
  if (!outcome.success) {
    return json(403, { error: 'Verification failed — please retry the challenge' })
  }

  const submissionId = crypto.randomUUID().slice(0, 8)
  const expiry = Date.now() + TICKET_TTL_MS
  const sig = await hmacHex(env.UPLOAD_TICKET_SECRET, `${submissionId}.${expiry}`)
  return json(200, { ticket: `${submissionId}.${expiry}.${sig}` })
}

async function verifyTicket(
  ticket: string | null,
  env: Env,
): Promise<{ submissionId: string } | null> {
  if (!ticket) return null
  const parts = ticket.split('.')
  if (parts.length !== 3) return null
  const [submissionId, expiryStr, sig] = parts
  const expiry = Number(expiryStr)
  if (!/^[0-9a-f]{8}$/.test(submissionId) || !Number.isFinite(expiry)) return null
  if (Date.now() > expiry) return null
  const expected = await hmacHex(env.UPLOAD_TICKET_SECRET, `${submissionId}.${expiryStr}`)
  return timingSafeEqual(sig, expected) ? { submissionId } : null
}

async function handleFile(request: Request, env: Env): Promise<Response> {
  const session = await verifyTicket(request.headers.get('X-Upload-Ticket'), env)
  if (!session) return json(401, { error: 'Invalid or expired upload ticket' })

  const index = Number(request.headers.get('X-File-Index'))
  if (!Number.isInteger(index) || index < 0 || index > MAX_FILE_INDEX) {
    return json(400, { error: `X-File-Index must be 0–${MAX_FILE_INDEX}` })
  }

  const length = Number(request.headers.get('Content-Length'))
  if (!Number.isFinite(length) || length <= 0 || length > MAX_FILE_BYTES) {
    return json(413, { error: 'File must be under 20 MB' })
  }

  // 20 MB max is well under the 128 MB Worker memory cap, so buffering is fine.
  const buf = await request.arrayBuffer()
  if (buf.byteLength === 0 || buf.byteLength > MAX_FILE_BYTES) {
    return json(413, { error: 'File must be under 20 MB' })
  }

  const head = new Uint8Array(buf.slice(0, 16))
  const match = SIGNATURES.find(s => s.test(head))
  if (!match) {
    return json(415, { error: 'Only JPEG, PNG, WebP, or HEIC images are accepted' })
  }

  const rawName = request.headers.get('X-File-Name') ?? 'photo'
  const basename = rawName
    .replace(/\.[^.]*$/, '')
    .replace(/[^A-Za-z0-9._-]+/g, '_')
    .slice(0, 80) || 'photo'

  const date = new Date().toISOString().slice(0, 10)
  const key = `submissions/${date}-${session.submissionId}/${String(index).padStart(2, '0')}-${basename}.${match.ext}`

  await env.SUBMISSIONS.put(key, buf, {
    httpMetadata: { contentType: CONTENT_TYPES[match.ext] },
  })
  return json(200, { key })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (request.method === 'POST' && url.pathname === '/api/photo-upload/session') {
      return handleSession(request, env)
    }
    if (request.method === 'POST' && url.pathname === '/api/photo-upload/file') {
      return handleFile(request, env)
    }
    return json(404, { error: 'Not found' })
  },
} satisfies ExportedHandler<Env>

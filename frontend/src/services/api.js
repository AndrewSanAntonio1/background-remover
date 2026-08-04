import axios from 'axios'

/**
 * API client.
 *
 * Talks to the FastAPI service in ./backend, which exposes:
 *
 *   POST /remove-background
 *     request:  multipart/form-data  { image: File }
 *     response: image/png (binary, transparent background)
 *     errors:   JSON { detail: "..." } with 400/413/415/500
 *
 * The frontend ships with VITE_USE_MOCK_API=true so the whole flow is
 * testable without the server running. Set it to "false" to hit the real API.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// While there is no server, run the flow against a local simulation so the
// whole UI (loading, success, download, errors) is exercisable end to end.
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false'

/** True when requests are being simulated rather than sent. */
export const isMockMode = USE_MOCK

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
export const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { Accept: 'application/json' },
})

/** Error carrying a message that is safe to show the user as-is. */
export class ApiError extends Error {
  constructor(message, { status = null, cause = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.cause = cause
  }
}

/**
 * Validate a file before we bother the network with it.
 * @returns {string|null} an error message, or null when the file is fine.
 */
export function validateImage(file) {
  if (!file) return 'No file selected. Choose an image to continue.'

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Unsupported format. Please upload a PNG, JPG, or WEBP image.'
  }

  if (file.size > MAX_FILE_SIZE) {
    const mb = (file.size / (1024 * 1024)).toFixed(1)
    return `That image is ${mb} MB. The limit is 10 MB — try a smaller file.`
  }

  if (file.size === 0) {
    return 'That file appears to be empty. Try a different image.'
  }

  return null
}

/** Turn an axios/network failure into a message a person can act on. */
function toFriendlyError(error) {
  if (axios.isCancel?.(error) || error?.code === 'ERR_CANCELED') {
    return new ApiError('Upload cancelled.', { cause: error })
  }

  if (error?.code === 'ECONNABORTED') {
    return new ApiError(
      'This is taking longer than expected. Check your connection and try again.',
      { cause: error }
    )
  }

  const status = error?.response?.status

  if (!error?.response) {
    return new ApiError(
      "We couldn't reach the server. Check your connection and try again.",
      { cause: error }
    )
  }

  const byStatus = {
    413: 'That image is too large for the server. Try one under 10 MB.',
    415: 'Unsupported format. Please upload a PNG, JPG, or WEBP image.',
    429: 'Too many requests right now. Wait a moment and try again.',
  }

  const message =
    usableDetail(error.response?.data?.detail) ||
    byStatus[status] ||
    (status >= 500
      ? 'Our service hit a snag while processing your image. Please try again.'
      : 'We were unable to process that image. Please try another one.')

  return new ApiError(message, { status, cause: error })
}

/**
 * FastAPI writes its own `detail` for our handled errors, and those strings are
 * already user-facing. But framework defaults ("Not Found", "Method Not
 * Allowed") mean the route is missing or misconfigured — a deployment problem,
 * not something the visitor can act on. Reject those so a real message is used.
 */
const FRAMEWORK_DETAILS = new Set([
  'not found',
  'method not allowed',
  'internal server error',
  'unprocessable entity',
  'forbidden',
  'unauthorized',
  'bad request',
])

function usableDetail(detail) {
  if (typeof detail !== 'string') return null

  const trimmed = detail.trim()
  if (!trimmed) return null

  return FRAMEWORK_DETAILS.has(trimmed.toLowerCase()) ? null : trimmed
}

/**
 * Error bodies arrive as Blobs because the request asks for `responseType:
 * 'blob'`. Parse the JSON out so the server's `detail` message survives.
 */
async function readBlobErrorDetail(error) {
  const data = error?.response?.data

  if (!(data instanceof Blob)) return null

  try {
    const parsed = JSON.parse(await data.text())
    return usableDetail(parsed?.detail)
  } catch {
    return null // not JSON — fall back to a status-based message
  }
}

/**
 * Local stand-in for the real endpoint.
 * Returns the original image untouched after a short delay — enough to drive
 * the loading state and the result/download UI without the backend running.
 */
function mockRemoveBackground(file, onUploadProgress) {
  return new Promise((resolve) => {
    let percent = 0

    const tick = setInterval(() => {
      percent = Math.min(100, percent + 12)
      onUploadProgress?.(percent)
      if (percent >= 100) clearInterval(tick)
    }, 180)

    setTimeout(() => {
      clearInterval(tick)
      onUploadProgress?.(100)

      resolve({
        blob: file,
        url: URL.createObjectURL(file),
        mocked: true,
      })
    }, 2200)
  })
}

/**
 * Send an image to the background-removal service.
 *
 * @param {File} file                       image to process
 * @param {object} [options]
 * @param {(percent:number)=>void} [options.onUploadProgress]
 * @param {AbortSignal} [options.signal]    lets the caller cancel in-flight work
 * @returns {Promise<{blob: Blob, url: string, mocked?: boolean}>}
 *          `url` is an object URL for the transparent PNG — revoke it when done.
 */
export async function removeBackground(file, options = {}) {
  const { onUploadProgress, signal } = options

  const validationError = validateImage(file)
  if (validationError) throw new ApiError(validationError)

  if (USE_MOCK) return mockRemoveBackground(file, onUploadProgress)

  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await api.post('/remove-background', formData, {
      responseType: 'blob',
      headers: { 'Content-Type': 'multipart/form-data' },
      signal,
      onUploadProgress: (event) => {
        if (!event.total) return
        onUploadProgress?.(Math.round((event.loaded * 100) / event.total))
      },
    })

    const blob = response.data

    // A JSON body arriving on a blob responseType means the server reported an
    // error rather than returning an image.
    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      const parsed = JSON.parse(text)
      throw new ApiError(
        usableDetail(parsed?.detail) ||
          usableDetail(parsed?.message) ||
          'We were unable to process that image.',
        { status: response.status }
      )
    }

    return { blob, url: URL.createObjectURL(blob) }
  } catch (error) {
    if (error instanceof ApiError) throw error

    // Pull the server's own wording out of the blob body when there is one.
    const detail = await readBlobErrorDetail(error)
    if (detail) {
      throw new ApiError(detail, { status: error.response?.status, cause: error })
    }

    throw toFriendlyError(error)
  }
}

/** Where contact-form submissions are addressed. */
export const CONTACT_EMAIL = 'sgandrew290@gmail.com'

/**
 * Hands the contact form off to the visitor's email client.
 *
 * There is no /contact endpoint — rather than pretend to deliver the message,
 * this opens a pre-filled draft addressed to CONTACT_EMAIL. The visitor sends
 * it themselves, so nothing is silently dropped.
 */
export async function sendContactMessage({ name, email, message }) {
  const subject = `Cutout enquiry from ${name}`
  const body = `${message}\n\n—\nName: ${name}\nEmail: ${email}`

  const mailto =
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`

  // Some browsers ignore a mailto navigation that isn't tied to a user
  // gesture; this runs inside the submit handler, so it counts as one.
  window.location.href = mailto

  return { ok: true, method: 'mailto', to: CONTACT_EMAIL }
}

export default api

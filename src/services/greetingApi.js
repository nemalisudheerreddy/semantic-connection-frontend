import { API_BASE_URL } from '../config'

const GREETING_ENDPOINT =
  API_BASE_URL.includes('://')
    ? `${API_BASE_URL}/api/greet`
    : `${API_BASE_URL.replace(/\/$/, '')}/greet`

export async function requestGreeting(name) {
  let response

  try {
    response = await fetch(GREETING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
  } catch {
    throw new Error(
      `Cannot reach the backend at ${GREETING_ENDPOINT}. Make sure the FastAPI server is running and CORS allows your frontend origin.`,
    )
  }

  const payload = await readJsonSafely(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload))
  }

  return payload
}

async function readJsonSafely(response) {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return null
  }

  return response.json()
}

function getErrorMessage(payload) {
  if (!payload) {
    return 'The backend returned an unexpected response.'
  }

  if (typeof payload.detail === 'string') {
    return payload.detail
  }

  if (Array.isArray(payload.detail)) {
    return payload.detail.map((entry) => entry.msg).join(', ')
  }

  return 'The request failed. Check the backend logs for more details.'
}

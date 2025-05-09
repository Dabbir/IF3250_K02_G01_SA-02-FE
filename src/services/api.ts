const API_URL = import.meta.env.VITE_HOST_NAME

// Helper untuk mendapatkan token
export const getAuthToken = () => {
  return localStorage.getItem("token") || ""
}

// Helper untuk request API
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
)
: Promise<T> =>
{
  const token = getAuthToken()

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

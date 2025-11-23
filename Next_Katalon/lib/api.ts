import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export function encodeProjectPath(path: string): string {
  // Encode the path for URL (handle spaces and special characters)
  return encodeURIComponent(path)
}

export async function getProjectSummary(projectPath: string) {
  const encodedPath = encodeProjectPath(projectPath)
  const response = await axios.get(`${API_BASE_URL}/api/project/summary?project_path=${encodedPath}`)
  return response.data
 }
export async function getProjectInfo(projectPath: string) {
  const encodedPath = encodeProjectPath(projectPath)
  const response = await axios.get(`${API_BASE_URL}/api/project/info?project_path=${encodedPath}`)
  return response.data
 }
export async function getDashboardData(projectPath: string) {
  const encodedPath = encodeProjectPath(projectPath)
  const response = await axios.get(`${API_BASE_URL}/api/project/dashboard?project_path=${encodedPath}`)
  return response.data
 }
export async function getTestCases(projectPath: string, limit?: number, offset: number = 0) {
  const params = new URLSearchParams()
  if (limit) params.append('limit', limit.toString())
  params.append('offset', offset.toString())
  params.append('project_path', projectPath)
  const response = await axios.get(`${API_BASE_URL}/api/project/test-cases?${params}`)
  return response.data
}

export async function getTestSuites(projectPath: string, limit?: number, offset: number = 0) {
  const params = new URLSearchParams()
  if (limit) params.append('limit', limit.toString())
  params.append('offset', offset.toString())
  params.append('project_path', projectPath)
  const response = await axios.get(`${API_BASE_URL}/api/project/test-suites?${params}`)
  return response.data
}

export async function getKeywords(projectPath: string, limit?: number, offset: number = 0) {
  const params = new URLSearchParams()
  if (limit) params.append('limit', limit.toString())
  params.append('offset', offset.toString())
  params.append('project_path', projectPath)
  const response = await axios.get(`${API_BASE_URL}/api/project/keywords?${params}`)
  return response.data
}

export async function getObjectRepository(projectPath: string, limit?: number, offset: number = 0) {
  const params = new URLSearchParams()
  if (limit) params.append('limit', limit.toString())
  params.append('offset', offset.toString())
  params.append('project_path', projectPath)
  const response = await axios.get(`${API_BASE_URL}/api/project/object-repository?${params}`)
  return response.data
}

export async function getCoverage(projectPath: string) {
  const response = await axios.get(`${API_BASE_URL}/api/project/coverage?project_path=${encodeURIComponent(projectPath)}`)
  return response.data
}

export async function searchTestCases(projectPath: string, query: string) {
  const encodedPath = encodeProjectPath(projectPath)
  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty')
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/api/project/search/test-cases?project_path=${encodedPath}&q=${encodeURIComponent(query)}`)
    return response.data
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const info = err.response?.data?.detail || err.response?.data || err.response?.statusText || err.message
      throw new Error(`API Error (${err.response?.status || 'unknown'}): ${JSON.stringify(info)}`)
    }
    throw err
  }
}

export async function searchKeywords(projectPath: string, query: string) {
  const encodedPath = encodeProjectPath(projectPath)
  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty')
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/api/project/search/keywords?project_path=${encodedPath}&q=${encodeURIComponent(query)}`)
    return response.data
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const info = err.response?.data?.detail || err.response?.data || err.response?.statusText || err.message
      throw new Error(`API Error (${err.response?.status || 'unknown'}): ${JSON.stringify(info)}`)
    }
    throw err
  }
}

export async function searchTestSuites(projectPath: string, query: string) {
  const encodedPath = encodeProjectPath(projectPath)
  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty')
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/api/project/search/test-suites?project_path=${encodedPath}&q=${encodeURIComponent(query)}`)
    return response.data
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const info = err.response?.data?.detail || err.response?.data || err.response?.statusText || err.message
      throw new Error(`API Error (${err.response?.status || 'unknown'}): ${JSON.stringify(info)}`)
    }
    throw err
  }
}

export async function searchObjectRepository(projectPath: string, query: string) {
  const encodedPath = encodeProjectPath(projectPath)
  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty')
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/api/project/search/object-repository?project_path=${encodedPath}&q=${encodeURIComponent(query)}`)
    return response.data
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const info = err.response?.data?.detail || err.response?.data || err.response?.statusText || err.message
      throw new Error(`API Error (${err.response?.status || 'unknown'}): ${JSON.stringify(info)}`)
    }
    throw err
  }
}

export async function getProfiles(projectPath: string, q?: string) {
  const params = new URLSearchParams()
  params.append('project_path', projectPath)
  if (q) params.append('q', q)
  try {
    const response = await axios.get(`${API_BASE_URL}/api/project/profiles?${params}`)
    return response.data
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const info = err.response?.data?.detail || err.response?.data || err.response?.statusText || err.message
      throw new Error(`API Error (${err.response?.status || 'unknown'}): ${JSON.stringify(info)}`)
    }
    throw err
  }
}

export async function getScripts(projectPath: string, q?: string) {
  const params = new URLSearchParams()
  params.append('project_path', projectPath)
  if (q) params.append('q', q)
  try {
    const response = await axios.get(`${API_BASE_URL}/api/project/scripts?${params}`)
    return response.data
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const info = err.response?.data?.detail || err.response?.data || err.response?.statusText || err.message
      throw new Error(`API Error (${err.response?.status || 'unknown'}): ${JSON.stringify(info)}`)
    }
    throw err
  }
}


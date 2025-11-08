"use client"

import { useState, useCallback } from "react"

interface UseAPIOptions {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  autoExecute?: boolean
}

export function useAPI<T = any>(apiCall: () => Promise<T>, options: UseAPIOptions = {}) {
  const { onSuccess, onError, autoExecute = false } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall()
      setData(result)
      onSuccess?.(result)
      return result
    } catch (err: any) {
      setError(err)
      onError?.(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiCall, onSuccess, onError])

  return { data, loading, error, execute, refetch: execute }
}

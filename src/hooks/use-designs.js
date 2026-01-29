import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

const STORAGE_KEY = "product-designs"

function getDesignsFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveDesignsToStorage(designs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
}

export function useDesigns() {
  const [designs, setDesigns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const data = getDesignsFromStorage()
      setDesigns(data)
      setIsLoading(false)
    } catch (err) {
      setError(err)
      setIsLoading(false)
    }
  }, [])

  return { data: designs, isLoading, error }
}

export function useSaveDesign() {
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)

  const mutateAsync = useCallback(async (data) => {
    setIsPending(true)
    try {
      const designs = getDesignsFromStorage()
      const newDesign = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      }
      designs.push(newDesign)
      saveDesignsToStorage(designs)
      
      toast({
        title: "Design Saved!",
        description: "Your masterpiece has been stored securely.",
        variant: "default",
      })
      
      setIsPending(false)
      return newDesign
    } catch (error) {
      toast({
        title: "Error Saving Design",
        description: error.message,
        variant: "destructive",
      })
      setIsPending(false)
      throw error
    }
  }, [toast])

  return { mutateAsync, isPending }
}

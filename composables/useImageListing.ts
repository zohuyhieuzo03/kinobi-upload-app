import { ref, reactive, computed } from 'vue'
import { auth } from '~/plugins/firebase.client'

interface ImageItem {
  key: string
  url: string
}

interface ListingState {
  images: ImageItem[]
  isLoading: boolean
  error: string | null
}

export type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc'

export const useImageListing = () => {
  const state = reactive<ListingState>({
    images: [],
    isLoading: false,
    error: null
  })

  const sortOption = ref<SortOption>('newest')

  const sortOptions = [
    { text: 'Newest First', value: 'newest' },
    { text: 'Oldest First', value: 'oldest' },
    { text: 'Name A-Z', value: 'name_asc' },
    { text: 'Name Z-A', value: 'name_desc' }
  ]

  const getImageName = (key: string): string => {
    return key ? key.split('/').pop()?.replace(/^\d+_/, '') || 'Unknown' : 'Unknown'
  }

  const getTimestamp = (key: string): number => {
    if (!key) return 0
    const parts = key.split('/')
    if (parts.length > 1) {
      const filename = parts.pop()
      const timestamp = filename?.match(/^(\d+)_/)
      if (timestamp) {
        return parseInt(timestamp[1])
      }
    }
    return 0
  }

  const sortedImages = computed(() => {
    if (!state.images.length) return []
    
    const images = [...state.images]
    
    switch (sortOption.value) {
      case 'newest':
        return images.sort((a, b) => getTimestamp(b.key) - getTimestamp(a.key))
      case 'oldest':
        return images.sort((a, b) => getTimestamp(a.key) - getTimestamp(b.key))
      case 'name_asc':
        return images.sort((a, b) => getImageName(a.key).localeCompare(getImageName(b.key)))
      case 'name_desc':
        return images.sort((a, b) => getImageName(b.key).localeCompare(getImageName(a.key)))
      default:
        return images
    }
  })

  const loadImages = async (): Promise<{ success: boolean; error?: string }> => {
    if (!auth.currentUser) {
      const error = 'User not authenticated'
      state.error = error
      return { success: false, error }
    }

    state.isLoading = true
    state.error = null

    try {
      const token = await auth.currentUser.getIdToken()
      
      const response = await fetch(`${process.env.BACKEND_URL}/api/files/list-files`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load images')
      }

      state.images = await response.json()
      return { success: true }

    } catch (error: any) {
      console.error('Error loading images:', error)
      const errorMessage = 'Failed to load uploaded images'
      state.error = errorMessage
      return { success: false, error: errorMessage }

    } finally {
      state.isLoading = false
    }
  }

  const clearError = () => {
    state.error = null
  }

  const setSortOption = (option: SortOption) => {
    sortOption.value = option
  }

  return {
    // State
    state,
    sortOption,
    sortOptions,
    sortedImages,

    // Methods
    loadImages,
    clearError,
    setSortOption,
    getImageName,
    getTimestamp
  }
}
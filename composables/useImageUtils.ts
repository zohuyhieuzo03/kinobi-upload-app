export const useImageUtils = () => {
  const formatUploadDate = (key: string): string => {
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

    const timestamp = getTimestamp(key)
    if (timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      
      // Less than 1 day
      if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000))
        if (hours < 1) {
          const minutes = Math.floor(diff / (60 * 1000))
          return minutes < 1 ? 'Just now' : `${minutes}m ago`
        }
        return `${hours}h ago`
      }
      
      // Less than 1 week
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000))
        return `${days}d ago`
      }
      
      // Older than 1 week
      return date.toLocaleDateString()
    }
    return 'Unknown'
  }

  const copyImageUrl = async (url: string): Promise<{ success: boolean; message: string }> => {
    try {
      await navigator.clipboard.writeText(url)
      return {
        success: true,
        message: 'Image URL copied to clipboard!'
      }
    } catch (error) {
      console.error('Failed to copy URL:', error)
      return {
        success: false,
        message: 'Failed to copy URL to clipboard'
      }
    }
  }

  const getImageName = (key: string): string => {
    return key ? key.split('/').pop()?.replace(/^\d+_/, '') || 'Unknown' : 'Unknown'
  }

  const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        error: 'Please select an image file (JPG, PNG, or GIF)'
      }
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        isValid: false,
        error: 'File size must be less than 5MB'
      }
    }

    return { isValid: true }
  }

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return {
    formatUploadDate,
    copyImageUrl,
    getImageName,
    validateImageFile,
    isImageFile,
    formatFileSize
  }
}
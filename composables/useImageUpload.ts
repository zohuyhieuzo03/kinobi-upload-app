import { ref, reactive } from 'vue'
import { auth } from '~/plugins/firebase.client'

interface UploadState {
  isUploading: boolean
  uploadProgress: number
  uploadError: string | null
  uploadSuccess: string | null
}

interface UploadOptions {
  onProgress?: (progress: number) => void
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export const useImageUpload = () => {
  const state = reactive<UploadState>({
    isUploading: false,
    uploadProgress: 0,
    uploadError: null,
    uploadSuccess: null
  })

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
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

  const getPresignedUrl = async (fileName: string, fileType: string) => {
    const token = await auth.currentUser?.getIdToken()
    
    if (!token) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${process.env.BACKEND_URL}/api/files/get-presigned-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fileName,
        fileType
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get upload URL')
    }

    const { url } = await response.json()
    return url
  }

  const uploadToS3 = async (url: string, file: File) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: file
    })

    if (!response.ok) {
      throw new Error('Failed to upload file to storage')
    }
  }

  const uploadFile = async (file: File, options?: UploadOptions): Promise<{ success: boolean; error?: string }> => {
    // Validate file
    const validation = validateFile(file)
    if (!validation.isValid) {
      state.uploadError = validation.error!
      options?.onError?.(validation.error!)
      return { success: false, error: validation.error }
    }

    // Reset state
    state.isUploading = true
    state.uploadProgress = 0
    state.uploadError = null
    state.uploadSuccess = null

    try {
      // Get presigned URL
      const presignedUrl = await getPresignedUrl(file.name, file.type)
      
      // Update progress
      state.uploadProgress = 50
      options?.onProgress?.(50)

      // Upload to S3
      await uploadToS3(presignedUrl, file)

      // Complete upload
      state.uploadProgress = 100
      options?.onProgress?.(100)

      const successMessage = `Successfully uploaded ${file.name}`
      state.uploadSuccess = successMessage
      options?.onSuccess?.(successMessage)

      return { success: true }

    } catch (error: any) {
      console.error('Upload error:', error)
      const errorMessage = error.message || 'Failed to upload file'
      state.uploadError = errorMessage
      options?.onError?.(errorMessage)
      return { success: false, error: errorMessage }

    } finally {
      state.isUploading = false
      // Reset progress after a delay
      setTimeout(() => {
        state.uploadProgress = 0
      }, 2000)
    }
  }

  const clearMessages = () => {
    state.uploadError = null
    state.uploadSuccess = null
  }

  return {
    // State
    state,
    
    // Methods
    uploadFile,
    validateFile,
    clearMessages
  }
}
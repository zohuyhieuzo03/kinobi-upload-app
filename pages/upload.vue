<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" lg="10" xl="8">
        <!-- Header -->
        <v-card elevation="2" class="mb-6">
          <v-card-title class="text-h4 font-weight-bold text-center">
            <v-icon left color="primary" size="36">mdi-cloud-upload</v-icon>
            Image Upload
          </v-card-title>
          <v-card-subtitle class="text-center text-h6 grey--text">
            Upload and manage your images
          </v-card-subtitle>
        </v-card>

        <!-- Authentication Check -->
        <v-alert
          v-if="!isAuthenticated"
          type="warning"
          prominent
          icon="mdi-lock"
          class="mb-6"
        >
          <v-row align="center">
            <v-col class="grow">
              <div class="text-h6">Authentication Required</div>
              <div>Please sign in to upload and manage your images.</div>
            </v-col>
            <v-col class="shrink">
              <v-btn color="primary" to="/login" large>
                <v-icon left>mdi-google</v-icon>
                Sign In
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>

        <!-- Upload Section -->
        <template v-if="isAuthenticated">
          <v-card elevation="3" class="mb-6">
            <v-card-title>
              <v-icon left color="primary">mdi-upload</v-icon>
              Upload Image
            </v-card-title>
            <v-card-text>
              <!-- Drag & Drop Area -->
              <div
                class="upload-area"
                :class="{
                  'drag-over': isDragOver,
                  'uploading': isUploading
                }"
                @drop.prevent="handleDrop"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @click="$refs.fileInput.click()"
              >
                <div class="upload-content">
                  <v-icon 
                    size="80" 
                    :color="isUploading ? 'grey' : 'primary'"
                    class="mb-4"
                  >
                    mdi-cloud-upload-outline
                  </v-icon>
                  <h3 class="text-h6 mb-2">
                    {{ isUploading ? 'Uploading...' : 'Drop your image here, or' }}
                  </h3>
                  <v-btn 
                    v-if="!isUploading"
                    color="primary" 
                    outlined 
                    large
                    @click.stop="$refs.fileInput.click()"
                  >
                    browse
                  </v-btn>
                  <v-progress-circular
                    v-if="isUploading"
                    :value="uploadProgress"
                    size="60"
                    width="4"
                    color="primary"
                  >
                    {{ uploadProgress }}%
                  </v-progress-circular>
                  <p class="caption mt-3 grey--text">
                    Supports: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              </div>

              <!-- Hidden File Input -->
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                style="display: none"
                @change="handleFileSelect"
              />

              <!-- Upload Progress -->
              <v-progress-linear
                v-if="isUploading"
                :value="uploadProgress"
                height="6"
                color="primary"
                class="mt-4"
              />

              <!-- Error/Success Messages -->
              <v-alert
                v-if="uploadError"
                type="error"
                dismissible
                class="mt-4"
                @input="uploadError = null"
              >
                {{ uploadError }}
              </v-alert>

              <v-alert
                v-if="uploadSuccess"
                type="success"
                dismissible
                class="mt-4"
                @input="uploadSuccess = null"
              >
                {{ uploadSuccess }}
              </v-alert>
            </v-card-text>
          </v-card>

          <!-- Uploaded Images Section -->
          <v-card elevation="3">
            <v-card-title class="d-flex align-center">
              <v-icon left color="primary">mdi-image-multiple</v-icon>
              Uploaded Images ({{ sortedImages.length }})
              <v-spacer />
              
              <!-- Sort Filter -->
              <v-select
                v-model="sortOption"
                :items="sortOptions"
                label="Sort by"
                dense
                outlined
                hide-details
                class="mr-3"
                style="max-width: 150px;"
              >
                <template v-slot:prepend-inner>
                  <v-icon small>mdi-sort</v-icon>
                </template>
              </v-select>
              
              <v-btn
                color="primary"
                outlined
                small
                @click="loadUploadedImages"
                :loading="isLoadingImages"
              >
                <v-icon left small>mdi-refresh</v-icon>
                Refresh
              </v-btn>
            </v-card-title>
            <v-card-text>
              <!-- Loading State -->
              <v-skeleton-loader
                v-if="isLoadingImages"
                type="image, image, image"
                class="mx-auto"
              />

              <!-- No Images State -->
              <div 
                v-else-if="sortedImages.length === 0"
                class="text-center py-8"
              >
                <v-icon size="100" color="grey lighten-1" class="mb-4">
                  mdi-image-off-outline
                </v-icon>
                <h3 class="text-h6 grey--text mb-2">No images uploaded yet</h3>
                <p class="grey--text">Upload your first image using the upload area above.</p>
              </div>

              <!-- Images Grid -->
              <v-row v-else dense>
                <v-col
                  v-for="(image, index) in sortedImages"
                  :key="index"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card elevation="2" class="image-card" @click="openImageDialog(image)">
                    <v-img
                      :src="image.url"
                      :alt="`Uploaded image ${index + 1}`"
                      height="200"
                      cover
                      class="white--text align-end cursor-pointer"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <v-progress-circular indeterminate color="grey lighten-5" />
                        </v-row>
                      </template>
                      
                      <!-- Upload Date Badge -->
                      <div class="date-badge">
                        <v-chip small dark color="rgba(0,0,0,0.7)">
                          <v-icon left x-small>mdi-calendar</v-icon>
                          {{ formatUploadDate(image.key) }}
                        </v-chip>
                      </div>
                    </v-img>
                    <v-card-subtitle class="caption">
                      {{ getImageName(image.key) }}
                    </v-card-subtitle>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-row>

    <!-- Image Preview Dialog -->
    <v-dialog v-model="imageDialog" max-width="800">
      <v-card v-if="selectedImage">
        <v-card-title class="d-flex align-center">
          <span>{{ getImageName(selectedImage.key) }}</span>
          <v-spacer />
          <v-btn icon @click="imageDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-img
          :src="selectedImage.url"
          :alt="getImageName(selectedImage.key)"
          contain
          max-height="500"
        />
        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="copyImageUrl(selectedImage.url)"
          >
            <v-icon left>mdi-content-copy</v-icon>
            Copy URL
          </v-btn>
          <v-spacer />
          <v-btn text @click="imageDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { auth } from '~/plugins/firebase.client'

export default {
  name: 'ImageUpload',
  data() {
    return {
      isDragOver: false,
      isUploading: false,
      uploadProgress: 0,
      uploadError: null,
      uploadSuccess: null,
      uploadedImages: [],
      isLoadingImages: false,
      imageDialog: false,
      selectedImage: null,
      sortOption: 'newest',
      sortOptions: [
        { text: 'Newest First', value: 'newest' },
        { text: 'Oldest First', value: 'oldest' },
        { text: 'Name A-Z', value: 'name_asc' },
        { text: 'Name Z-A', value: 'name_desc' }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'user']),
    
    sortedImages() {
      if (!this.uploadedImages.length) return []
      
      const images = [...this.uploadedImages]
      
      switch (this.sortOption) {
        case 'newest':
          return images.sort((a, b) => this.getTimestamp(b.key) - this.getTimestamp(a.key))
        case 'oldest':
          return images.sort((a, b) => this.getTimestamp(a.key) - this.getTimestamp(b.key))
        case 'name_asc':
          return images.sort((a, b) => this.getImageName(a.key).localeCompare(this.getImageName(b.key)))
        case 'name_desc':
          return images.sort((a, b) => this.getImageName(b.key).localeCompare(this.getImageName(a.key)))
        default:
          return images
      }
    }
  },
  async mounted() {
    if (this.isAuthenticated) {
      await this.loadUploadedImages()
    }
  },
  methods: {
    handleDrop(event) {
      this.isDragOver = false
      const files = Array.from(event.dataTransfer.files)
      const imageFile = files.find(file => file.type.startsWith('image/'))
      
      if (imageFile) {
        this.uploadFile(imageFile)
      } else {
        this.uploadError = 'Please drop an image file (JPG, PNG, or GIF)'
      }
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.uploadFile(file)
      }
    },
    
    async uploadFile(file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        this.uploadError = 'Please select an image file (JPG, PNG, or GIF)'
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.uploadError = 'File size must be less than 5MB'
        return
      }
      
      this.isUploading = true
      this.uploadProgress = 0
      this.uploadError = null
      this.uploadSuccess = null
      
      try {
        // Get Firebase token
        const token = await auth.currentUser.getIdToken()
        
        // Get presigned URL from backend
        const response = await fetch(`${process.env.BACKEND_URL}/get-presigned-url`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type
          })
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to get upload URL')
        }
        
        const { url } = await response.json()
        
        // Upload file to S3
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type
          },
          body: file
        })
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file to storage')
        }
        
        this.uploadProgress = 100
        this.uploadSuccess = `Successfully uploaded ${file.name}`
        
        // Refresh the images list
        await this.loadUploadedImages()
        
        // Reset file input
        this.$refs.fileInput.value = ''
        
      } catch (error) {
        console.error('Upload error:', error)
        this.uploadError = error.message || 'Failed to upload file'
      } finally {
        this.isUploading = false
        setTimeout(() => {
          this.uploadProgress = 0
        }, 2000)
      }
    },
    
    async loadUploadedImages() {
      if (!this.isAuthenticated) return
      
      this.isLoadingImages = true
      
      try {
        const token = await auth.currentUser.getIdToken()
        
        const response = await fetch(`${process.env.BACKEND_URL}/list-files`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to load images')
        }
        
        this.uploadedImages = await response.json()
        
      } catch (error) {
        console.error('Error loading images:', error)
        this.uploadError = 'Failed to load uploaded images'
      } finally {
        this.isLoadingImages = false
      }
    },
    
    getImageName(key) {
      return key ? key.split('/').pop().replace(/^\d+_/, '') : 'Unknown'
    },
    
    getTimestamp(key) {
      if (!key) return 0
      const parts = key.split('/')
      if (parts.length > 1) {
        const filename = parts.pop()
        const timestamp = filename.match(/^(\d+)_/)
        if (timestamp) {
          return parseInt(timestamp[1])
        }
      }
      return 0
    },
    
    formatUploadDate(key) {
      const timestamp = this.getTimestamp(key)
      if (timestamp) {
        const date = new Date(timestamp)
        const now = new Date()
        const diff = now - date
        
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
    },
    
    openImageDialog(image) {
      this.selectedImage = image
      this.imageDialog = true
    },
    
    async copyImageUrl(url) {
      try {
        await navigator.clipboard.writeText(url)
        this.$nextTick(() => {
          this.uploadSuccess = 'Image URL copied to clipboard!'
        })
      } catch (error) {
        console.error('Failed to copy URL:', error)
        this.uploadError = 'Failed to copy URL to clipboard'
      }
    }
  }
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed #1976d2;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(25, 118, 210, 0.05);
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #1565c0;
  background: rgba(25, 118, 210, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.upload-area.drag-over {
  border-color: #0d47a1;
  background: rgba(25, 118, 210, 0.15);
  transform: scale(1.02);
}

.upload-area.uploading {
  border-color: #757575;
  background: rgba(117, 117, 117, 0.1);
  cursor: not-allowed;
}

.upload-content {
  width: 100%;
}

.image-card {
  transition: transform 0.2s ease;
  position: relative;
  overflow: hidden;
}

.image-card:hover {
  transform: translateY(-4px);
}

.date-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

.cursor-pointer {
  cursor: pointer;
}

.v-skeleton-loader {
  background: transparent !important;
}
</style>
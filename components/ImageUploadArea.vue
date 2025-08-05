<template>
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
          'uploading': uploadState.isUploading
        }"
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @click="$refs.fileInput.click()"
      >
        <div class="upload-content">
          <v-icon 
            size="80" 
            :color="uploadState.isUploading ? 'grey' : 'primary'"
            class="mb-4"
          >
            mdi-cloud-upload-outline
          </v-icon>
          <h3 class="text-h6 mb-2">
            {{ uploadState.isUploading ? 'Uploading...' : 'Drop your image here, or' }}
          </h3>
          <v-btn 
            v-if="!uploadState.isUploading"
            color="primary" 
            outlined 
            large
            @click.stop="$refs.fileInput.click()"
          >
            browse
          </v-btn>
          <v-progress-circular
            v-if="uploadState.isUploading"
            :value="uploadState.uploadProgress"
            size="60"
            width="4"
            color="primary"
          >
            {{ uploadState.uploadProgress }}%
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
        v-if="uploadState.isUploading"
        :value="uploadState.uploadProgress"
        height="6"
        color="primary"
        class="mt-4"
      />

      <!-- Error/Success Messages -->
      <v-alert
        v-if="uploadState.uploadError"
        type="error"
        dismissible
        class="mt-4"
        @input="clearMessages"
      >
        {{ uploadState.uploadError }}
      </v-alert>

      <v-alert
        v-if="uploadState.uploadSuccess"
        type="success"
        dismissible
        class="mt-4"
        @input="clearMessages"
      >
        {{ uploadState.uploadSuccess }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import { useImageUpload } from '~/composables/useImageUpload'
import { useImageUtils } from '~/composables/useImageUtils'

export default {
  name: 'ImageUploadArea',

  emits: ['upload-success'],

  setup(props, { emit }) {
    const { state: uploadState, uploadFile, clearMessages } = useImageUpload()
    const { isImageFile } = useImageUtils()

    return {
      uploadState,
      uploadFile,
      clearMessages,
      isImageFile
    }
  },

  data() {
    return {
      isDragOver: false
    }
  },

  methods: {
    handleDrop(event) {
      this.isDragOver = false
      const files = Array.from(event.dataTransfer.files)
      const imageFile = files.find(file => this.isImageFile(file))
      
      if (imageFile) {
        this.uploadImage(imageFile)
      } else {
        this.uploadState.uploadError = 'Please drop an image file (JPG, PNG, or GIF)'
      }
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.uploadImage(file)
      }
    },

    async uploadImage(file) {
      const result = await this.uploadFile(file, {
        onSuccess: (message) => {
          this.$emit('upload-success')
          // Reset file input
          this.$refs.fileInput.value = ''
        }
      })
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
</style>
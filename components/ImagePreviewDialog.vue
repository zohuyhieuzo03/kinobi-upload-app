<template>
  <v-dialog :value="isOpen" max-width="800" @input="$emit('close')">
    <v-card v-if="image">
      <v-card-title class="d-flex align-center">
        <span>{{ getImageName(image.key) }}</span>
        <v-spacer />
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-img
        :src="image.url"
        :alt="getImageName(image.key)"
        contain
        max-height="500"
      />
      <v-card-actions>
        <v-btn
          color="primary"
          text
          @click="handleCopyUrl"
          :loading="isCopying"
        >
          <v-icon left>mdi-content-copy</v-icon>
          Copy URL
        </v-btn>
        <v-spacer />
        <v-btn text @click="$emit('close')">
          Close
        </v-btn>
      </v-card-actions>

      <!-- Success/Error Messages -->
      <v-alert
        v-if="copyMessage"
        :type="copySuccess ? 'success' : 'error'"
        dismissible
        class="ma-4 mt-0"
        @input="clearCopyMessage"
      >
        {{ copyMessage }}
      </v-alert>
    </v-card>
  </v-dialog>
</template>

<script>
import { useImageUtils } from '~/composables/useImageUtils'

export default {
  name: 'ImagePreviewDialog',

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    image: {
      type: Object,
      default: null
    }
  },

  emits: ['close'],

  setup() {
    const { copyImageUrl, getImageName } = useImageUtils()

    return {
      copyImageUrl,
      getImageName
    }
  },

  data() {
    return {
      isCopying: false,
      copyMessage: null,
      copySuccess: false
    }
  },

  methods: {
    async handleCopyUrl() {
      if (!this.image?.url) return

      this.isCopying = true
      this.clearCopyMessage()

      try {
        const result = await this.copyImageUrl(this.image.url)
        this.copySuccess = result.success
        this.copyMessage = result.message
      } catch (error) {
        this.copySuccess = false
        this.copyMessage = 'Failed to copy URL to clipboard'
      } finally {
        this.isCopying = false
      }
    },

    clearCopyMessage() {
      this.copyMessage = null
      this.copySuccess = false
    }
  },

  watch: {
    isOpen(newValue) {
      if (!newValue) {
        this.clearCopyMessage()
      }
    }
  }
}
</script>
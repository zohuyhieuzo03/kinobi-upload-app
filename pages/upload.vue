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
        <AuthAlert
          title="Authentication Required"
          message="Please sign in to upload and manage your images."
        />

        <!-- Upload Section -->
        <template v-if="isAuthenticated">
          <ImageUploadArea @upload-success="handleUploadSuccess" />
          
          <!-- Uploaded Images Section -->
          <ImageGallery
            :images="sortedImages"
            :is-loading="listingState.isLoading"
            :sort-option="sortOption"
            :sort-options="sortOptions"
            @image-click="openImageDialog"
            @refresh="loadUploadedImages"
            @sort-change="setSortOption"
          />
        </template>
      </v-col>
    </v-row>

    <!-- Image Preview Dialog -->
    <ImagePreviewDialog
      :is-open="imageDialog"
      :image="selectedImage"
      @close="imageDialog = false"
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { useImageListing } from '~/composables/useImageListing'
import AuthAlert from '~/components/AuthAlert.vue'
import ImageUploadArea from '~/components/ImageUploadArea.vue'
import ImageGallery from '~/components/ImageGallery.vue'
import ImagePreviewDialog from '~/components/ImagePreviewDialog.vue'

export default {
  name: 'ImageUpload',

  components: {
    AuthAlert,
    ImageUploadArea,
    ImageGallery,
    ImagePreviewDialog
  },

  setup() {
    const {
      state: listingState,
      sortOption,
      sortOptions,
      sortedImages,
      loadImages,
      setSortOption
    } = useImageListing()

    return {
      listingState,
      sortOption,
      sortOptions,
      sortedImages,
      loadImages,
      setSortOption
    }
  },

  data() {
    return {
      imageDialog: false,
      selectedImage: null
    }
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'user'])
  },

  async mounted() {
    if (this.isAuthenticated) {
      await this.loadUploadedImages()
    }
  },

  methods: {
    async loadUploadedImages() {
      await this.loadImages()
    },

    async handleUploadSuccess() {
      // Refresh the images list when upload is successful
      await this.loadUploadedImages()
    },

    openImageDialog(image) {
      this.selectedImage = image
      this.imageDialog = true
    }
  }
}
</script>


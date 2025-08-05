<template>
  <v-card elevation="3">
    <v-card-title class="d-flex align-center">
      <v-icon left color="primary">mdi-image-multiple</v-icon>
      Uploaded Images ({{ images.length }})
      <v-spacer />
      
      <!-- Sort Filter -->
      <v-select
        :value="sortOption"
        :items="sortOptions"
        label="Sort by"
        dense
        outlined
        hide-details
        class="mr-3"
        style="max-width: 150px;"
        @input="$emit('sort-change', $event)"
      >
        <template v-slot:prepend-inner>
          <v-icon small>mdi-sort</v-icon>
        </template>
      </v-select>
      
      <v-btn
        color="primary"
        outlined
        small
        @click="$emit('refresh')"
        :loading="isLoading"
      >
        <v-icon left small>mdi-refresh</v-icon>
        Refresh
      </v-btn>
    </v-card-title>
    <v-card-text>
      <!-- Loading State -->
      <v-skeleton-loader
        v-if="isLoading"
        type="image, image, image"
        class="mx-auto"
      />

      <!-- No Images State -->
      <div 
        v-else-if="images.length === 0"
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
          v-for="(image, index) in images"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card elevation="2" class="image-card" @click="$emit('image-click', image)">
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

<script>
import { useImageUtils } from '~/composables/useImageUtils'

export default {
  name: 'ImageGallery',

  props: {
    images: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    sortOption: {
      type: String,
      default: 'newest'
    },
    sortOptions: {
      type: Array,
      default: () => [
        { text: 'Newest First', value: 'newest' },
        { text: 'Oldest First', value: 'oldest' },
        { text: 'Name A-Z', value: 'name_asc' },
        { text: 'Name Z-A', value: 'name_desc' }
      ]
    }
  },

  emits: ['image-click', 'refresh', 'sort-change'],

  setup() {
    const { formatUploadDate, getImageName } = useImageUtils()

    return {
      formatUploadDate,
      getImageName
    }
  }
}
</script>

<style scoped>
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
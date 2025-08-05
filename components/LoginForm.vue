<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    
    <v-card-text>
      <div class="text-center mb-4">
        <h2>{{ welcomeTitle }}</h2>
        <p class="text--secondary">{{ welcomeSubtitle }}</p>
      </div>

      <!-- Error Alert -->
      <v-alert
        v-if="error"
        type="error"
        dismissible
        @input="$emit('clear-error')"
        class="mb-4"
      >
        {{ error }}
      </v-alert>

      <!-- Google Sign In Button -->
      <div class="text-center">
        <v-btn
          color="white"
          class="google-btn"
          large
          :loading="loading"
          :disabled="loading"
          @click="$emit('google-signin')"
          elevation="2"
        >
          <v-icon left color="red">
            mdi-google
          </v-icon>
          <span class="black--text">
            {{ loading ? 'Please wait...' : buttonText }}
          </span>
        </v-btn>
      </div>

      <div class="text-center mt-4">
        <p class="text--secondary caption">
          {{ helpText }}
        </p>
        <p class="text--secondary caption mt-2">
          {{ termsText }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'LoginForm',

  props: {
    title: {
      type: String,
      default: 'Login to Kinobi'
    },
    welcomeTitle: {
      type: String,
      default: 'Welcome to Kinobi!'
    },
    welcomeSubtitle: {
      type: String,
      default: 'Sign in or create account to continue'
    },
    buttonText: {
      type: String,
      default: 'Continue with Google'
    },
    helpText: {
      type: String,
      default: 'New to Kinobi? Your account will be created automatically.'
    },
    termsText: {
      type: String,
      default: 'By continuing, you agree to our Terms of Service and Privacy Policy'
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    }
  },

  emits: ['google-signin', 'clear-error']
}
</script>

<style scoped>
.google-btn {
  width: 100%;
  text-transform: none !important;
  font-weight: 500;
}

.google-btn .v-icon {
  margin-right: 12px;
}

.v-card {
  border-radius: 12px;
}

.v-toolbar {
  border-radius: 12px 12px 0 0;
}
</style>
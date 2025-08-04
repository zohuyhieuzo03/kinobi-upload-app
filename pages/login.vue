<template>
  <div class="login-container">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login to Kinobi</v-toolbar-title>
            </v-toolbar>
            
            <v-card-text>
              <div class="text-center mb-4">
                <h2>Welcome to Kinobi!</h2>
                <p class="text--secondary">Sign in or create account to continue</p>
              </div>

              <!-- Error Alert -->
              <v-alert
                v-if="error"
                type="error"
                dismissible
                @input="clearError"
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
                  @click="handleGoogleSignIn"
                  elevation="2"
                >
                  <v-icon left color="red">
                    mdi-google
                  </v-icon>
                  <span class="black--text">
                    {{ loading ? 'Please wait...' : 'Continue with Google' }}
                  </span>
                </v-btn>
              </div>

              <div class="text-center mt-4">
                <p class="text--secondary caption">
                  New to Kinobi? Your account will be created automatically.
                </p>
                <p class="text--secondary caption mt-2">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LoginPage',
  
  layout: 'default',
  
  computed: {
    ...mapGetters('auth', ['loading', 'error', 'isAuthenticated'])
  },

  mounted() {
    // Redirect if already authenticated
    if (this.isAuthenticated) {
      this.$router.push('/')
    }
  },

  methods: {
    async handleGoogleSignIn() {
      try {
        const { useFirebaseAuth } = await import('~/composables/useFirebaseAuth')
        const { signInWithGoogle } = useFirebaseAuth()
        
        const result = await signInWithGoogle()
        
        if (result.success) {
          this.$router.push('/')
        }
      } catch (error) {
        console.error('Login error:', error)
        this.$store.dispatch('auth/setError', 'Failed to sign in. Please try again.')
      }
    },

    clearError() {
      this.$store.dispatch('auth/clearError')
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

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
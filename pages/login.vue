<template>
  <div class="login-container">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <LoginForm
            :loading="loading"
            :error="error"
            @google-signin="handleGoogleSignIn"
            @clear-error="clearError"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginForm from '~/components/LoginForm.vue'

export default {
  name: 'LoginPage',
  
  layout: 'default',

  components: {
    LoginForm
  },
  
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
</style>
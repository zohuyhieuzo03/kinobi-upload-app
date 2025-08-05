<template>
  <div>
    <!-- Authenticated Status -->
    <v-alert
      v-if="isAuthenticated"
      type="success"
      text
      icon="mdi-check-circle"
      class="mb-4"
    >
      <div class="d-flex align-center">
        <v-avatar size="40" class="mr-3">
          <v-img
            v-if="user && user.photoURL"
            :src="user.photoURL"
            :alt="user.displayName || 'User'"
          />
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-avatar>
        <div>
          <div class="subtitle-1">{{ welcomeMessage }}</div>
          <div class="caption">{{ statusMessage }}</div>
        </div>
      </div>
    </v-alert>
    
    <!-- Not Authenticated Status -->
    <v-alert
      v-else
      type="info"
      text
      icon="mdi-information"
      class="mb-4"
    >
      <div>
        <div class="subtitle-1">{{ notAuthTitle }}</div>
        <div class="caption">{{ notAuthMessage }}</div>
        <v-btn
          color="primary"
          class="mt-2"
          :to="loginPath"
          small
        >
          <v-icon left small>mdi-google</v-icon>
          {{ buttonText }}
        </v-btn>
      </div>
    </v-alert>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AuthStatus',

  props: {
    welcomeMessage: {
      type: String,
      default() {
        return this.user ? `Welcome back, ${this.user.displayName || this.user.email}!` : 'Welcome back, User!'
      }
    },
    statusMessage: {
      type: String,
      default: 'You are successfully authenticated with Google.'
    },
    notAuthTitle: {
      type: String,
      default: 'Authentication Ready'
    },
    notAuthMessage: {
      type: String,
      default: 'Sign in with your Google account to get started.'
    },
    buttonText: {
      type: String,
      default: 'Sign In'
    },
    loginPath: {
      type: String,
      default: '/login'
    }
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'user']),
    
    computedWelcomeMessage() {
      return this.user ? `Welcome back, ${this.user.displayName || this.user.email}!` : 'Welcome back, User!'
    }
  }
}
</script>
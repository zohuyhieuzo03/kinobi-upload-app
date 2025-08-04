<template>
  <div class="user-profile">
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          text
          class="user-profile-btn"
        >
          <v-avatar size="32" class="mr-2">
            <v-img
              v-if="user && user.photoURL"
              :src="user.photoURL"
              :alt="user.displayName || 'User'"
            />
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-avatar>
          <span class="d-none d-sm-inline">
            {{ user ? user.displayName || user.email : 'User' }}
          </span>
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img
              v-if="user && user.photoURL"
              :src="user.photoURL"
              :alt="user.displayName || 'User'"
            />
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ user ? user.displayName || 'User' : 'User' }}</v-list-item-title>
            <v-list-item-subtitle>{{ user ? user.email : '' }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        
        <v-divider />
        
        <v-list-item @click="handleLogout" :disabled="loading">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ loading ? 'Signing out...' : 'Sign Out' }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserProfile',
  
  computed: {
    ...mapGetters('auth', ['user', 'loading'])
  },

  methods: {
    async handleLogout() {
      try {
        const { useFirebaseAuth } = await import('~/composables/useFirebaseAuth')
        const { logout } = useFirebaseAuth()
        
        await logout()
      } catch (error) {
        console.error('Logout error:', error)
        this.$store.dispatch('auth/setError', 'Failed to sign out. Please try again.')
      }
    }
  }
}
</script>

<style scoped>
.user-profile-btn {
  text-transform: none !important;
}

.user-profile-btn .v-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
}
</style>
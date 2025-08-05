<template>
  <v-alert
    v-if="!isAuthenticated"
    type="warning"
    prominent
    icon="mdi-lock"
    class="mb-6"
  >
    <v-row align="center">
      <v-col class="grow">
        <div class="text-h6">{{ title }}</div>
        <div>{{ message }}</div>
      </v-col>
      <v-col class="shrink">
        <v-btn color="primary" :to="loginPath" large>
          <v-icon left>mdi-google</v-icon>
          {{ buttonText }}
        </v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AuthAlert',
  
  props: {
    title: {
      type: String,
      default: 'Authentication Required'
    },
    message: {
      type: String,
      default: 'Please sign in to continue.'
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
    ...mapGetters('auth', ['isAuthenticated'])
  }
}
</script>
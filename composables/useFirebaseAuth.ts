import { auth, googleProvider } from '~/plugins/firebase.client'

export const useFirebaseAuth = () => {
  // Access router and store from global Nuxt instance for Nuxt 2 compatibility
  const app = process.client ? (window as any).$nuxt : null
  const router = app?.$router
  const store = app?.$store

  const signInWithGoogle = async () => {
    try {
      store?.dispatch('auth/setLoading', true)
      store?.dispatch('auth/clearError')
      
      const result = await auth.signInWithPopup(googleProvider)
      const user = result.user
      
      if (!user) {
        throw new Error('No user data returned from Google sign-in')
      }
      
      // Store user data in Vuex
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      }
      
      await store?.dispatch('auth/setUser', userData)
      
      // Redirect to dashboard or home page after successful login
      router?.push('/')
      
      return { success: true, user: userData }
    } catch (error: any) {
      console.error('Error signing in with Google:', error)
      store?.dispatch('auth/setError', error.message || 'Failed to sign in with Google')
      return { success: false, error: error.message }
    } finally {
      store.dispatch('auth/setLoading', false)
    }
  }

  const logout = async () => {
    try {
      store?.dispatch('auth/setLoading', true)
      
      await auth.signOut()
      store?.dispatch('auth/logout')
      
      // Redirect to login page
      router?.push('/login')
      
      return { success: true }
    } catch (error: any) {
      console.error('Error signing out:', error)
      store?.dispatch('auth/setError', error.message || 'Failed to sign out')
      return { success: false, error: error.message }
    } finally {
      store.dispatch('auth/setLoading', false)
    }
  }

  const initAuthStateListener = () => {
    auth.onAuthStateChanged((user: any) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        }
        store?.dispatch('auth/setUser', userData)
      } else {
        store?.dispatch('auth/setUser', null)
      }
    })
  }

  return {
    signInWithGoogle,
    logout,
    initAuthStateListener
  }
}
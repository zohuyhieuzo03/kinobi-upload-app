export default ({ store, app }: any) => {
  // Initialize auth state listener when the plugin loads
  if (process.client) {
    // Import Firebase auth modules using v8 syntax
    import('~/plugins/firebase.client').then(({ auth }) => {
      auth.onAuthStateChanged((user: any) => {
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
          }
          store.dispatch('auth/setUser', userData)
        } else {
          store.dispatch('auth/setUser', null)
        }
      })
    })
  }
}
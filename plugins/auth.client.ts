export default ({ store, app }: any) => {
  // Initialize auth state listener when the plugin loads
  if (process.client) {
    // Import Firebase auth modules
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      import('~/plugins/firebase.client').then(({ auth }) => {
        onAuthStateChanged(auth, (user: any) => {
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
    })
  }
}
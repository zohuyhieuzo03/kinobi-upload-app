# Firebase Google Authentication Setup Guide

This guide will help you set up Google authentication with Firebase in your Nuxt.js application.

## Prerequisites

- A Google account
- Node.js and yarn/npm installed
- A Firebase project

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "kinobi-app")
4. Follow the setup wizard and create the project

## Step 2: Enable Google Authentication

1. In your Firebase project console, go to **Authentication** → **Sign-in method**
2. Click on **Google** in the providers list
3. Click the **Enable** toggle
4. Add your project domains to the authorized domains (for local development, `localhost` should already be there)
5. Save the configuration

## Step 3: Get Firebase Configuration

1. In your Firebase project console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on **Web app** icon (`</>`) to add a web app
4. Register your app with a name (e.g., "Kinobi Web")
5. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 4: Set Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add the following variables with your Firebase config values:

```bash
FIREBASE_API_KEY=your-api-key-here
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

**Important:** Never commit your `.env` file to version control. Add it to your `.gitignore` file.

## Step 5: Update Firebase Configuration

Open `plugins/firebase.client.ts` and verify that the configuration is correctly reading from environment variables.

## Step 6: Test the Application

1. Start your development server:
   ```bash
   yarn dev
   ```

2. Navigate to `http://localhost:3000`
3. Click on "Sign Up" or "Login" in the top navigation
4. Click "Continue with Google" and test the authentication flow

## Features Included

✅ **Google Sign-In**: Users can authenticate using their Google accounts  
✅ **User State Management**: User authentication state is managed with Vuex  
✅ **Protected Routes**: Easy to implement route guards  
✅ **User Profile**: Display user information and logout functionality  
✅ **Responsive Design**: Works on desktop and mobile devices  
✅ **Auto-redirect**: Users are redirected appropriately after login/logout  

## Available Pages

- `/` - Home page with authentication status
- `/login` - Login/Registration page with Google Sign-In (automatically creates account if needed)

## Authentication State

The authentication state is managed in the Vuex store (`store/auth.js`) with the following properties:

- `user` - User object with profile information
- `isAuthenticated` - Boolean indicating if user is logged in
- `loading` - Boolean for loading states
- `error` - Error messages

## Custom Authentication Logic

You can use the `useFirebaseAuth` composable in your components:

```javascript
// In your Vue component
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'

export default {
  setup() {
    const { signInWithGoogle, logout } = useFirebaseAuth()
    
    return {
      signInWithGoogle,
      logout
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/operation-not-allowed)"**
   - Make sure Google authentication is enabled in Firebase Console

2. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to the authorized domains in Firebase Console

3. **Environment variables not working**
   - Make sure your `.env` file is in the project root
   - Restart your development server after adding environment variables

4. **Import errors**
   - Make sure you have the correct Firebase SDK version installed
   - Clear node_modules and reinstall if needed

### Getting Help

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Nuxt.js Documentation](https://nuxtjs.org/docs)
- [Vuetify Documentation](https://vuetifyjs.com/)

## Security Notes

- Always use environment variables for sensitive configuration
- Never commit your `.env` file to version control
- Consider implementing additional security rules in Firebase Security Rules
- Use HTTPS in production

Your Firebase Google authentication is now ready to use! 🎉
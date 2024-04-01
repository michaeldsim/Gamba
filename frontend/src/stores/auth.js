import { writable } from 'svelte/store';

export const auth = writable({ isAuthenticated: false, loading: true })
export const user = writable({});

export async function checkAuth() {
  try {
    const verifySessionResponse = await fetch(
      'http://localhost:4000/auth/verifySession',
      {
        method: 'GET',
        credentials: 'include',
      },
    )

    if (verifySessionResponse.ok) {
      const verifySessionData = await verifySessionResponse.json()

      // TODO: cache this because we are calling this on every page
      // update user data
      const userDataResponse = await fetch(
        `http://localhost:4000/user/${verifySessionData.id}`,
        {
          method: 'GET',
          credentials: 'include',
        },
      )

      const userData = await userDataResponse.json()

      user.set(userData)
      auth.set({ isAuthenticated: true, loading: false })
    } else {
      console.log('Session not valid or not authenticated')
      auth.set({ isAuthenticated: false, loading: false })
      user.set({})
    }
  } catch (error) {
    console.error('Error verifying session:', error)
    auth.set({ isAuthenticated: false, loading: false })
  }
}
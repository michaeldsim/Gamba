<script>
  import { Link, Router, Route } from 'svelte-routing'
  import Home from './routes/Home.svelte'
  import Login from './routes/Login.svelte'
  import { auth, checkAuth, user } from './stores/auth'
  import { backendUrlFound, backendUrl } from './stores/backend'
  import Register from './routes/Register.svelte'
  import Profile from './routes/Profile.svelte'
  import HighLow from './routes/games/HighLow.svelte'
  import Leaderboard from './routes/Leaderboard.svelte'
  import { onDestroy, onMount } from 'svelte'
  import UserProfile from './routes/UserProfile.svelte'

  onMount(async () => {
    if (!$backendUrlFound) {
      backendUrl.set(process.env.VITE_BACKEND_URL)
      backendUrlFound.set(true)
    }

    await checkAuth($backendUrl)
  })

  const logout = async () => {
    const res = await fetch(`${process.env.VITE_BACKEND_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res.ok) {
        auth.set({ isAuthenticated: false, loading: false })
        user.set({})
      }
    })
  }

  let userBalance = ''

  const unsubscribe = user.subscribe($user => {
    if (Object.keys($user).length > 0) {
      console.log('subscribed')
      userBalance = $user.balance
    }
  })

  $: trimmedBalance = userBalance ? parseFloat(userBalance).toFixed(2) : '0.00'

  onDestroy(() => {
    console.log('unsubscribed')
    unsubscribe()
  })
</script>

<Router>
  <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
    <Link to="/" class="navbar-brand ms-2 me-3">Gamba</Link>
    <Link to="/leaderboard" class="navbar-text me-3">Leaderboard</Link>
    <div class="ms-auto d-flex align-items-center">
      {#if $auth.isAuthenticated && !$auth.loading}
        <div class="navbar-text me-3">
          Welcome, <a href="/profile">{$user.username}</a>
        </div>
        <div class="navbar-text me-3">Level: {$user.level}</div>
        <div class="navbar-text me-3">Balance: ${trimmedBalance}</div>
        <button on:click={logout} class="btn btn-secondary me-3">Log out</button
        >
      {:else}
        <Link to="/login" class="navbar-nav me-3">Login</Link>
      {/if}
    </div>
  </nav>

  <Route path="/" component={Home} />
  <Route path="/login" component={Login} />
  <Route path="/register" component={Register} />
  <Route path="/profile" component={Profile} />
  <Route path="/highlow" component={HighLow} />
  <Route path="/leaderboard" component={Leaderboard} />
  <Route path="/user/:id" component={UserProfile} />
</Router>

<script>
  import { onMount } from 'svelte'
  import { user } from '../stores/auth'
  import { navigate } from 'svelte-routing'

  let username = ''
  let password = ''

  const register = async () => {
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/auth/register`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      },
    )

    if (response.ok) {
      const userData = await response.json()
      auth.set({ isAuthenticated: true, loading: false })
      user.set(userData)
      navigate('/')
    } else if (response.status === 409) {
      // Handle register errors
      document.getElementById('error-log').textContent =
        'Username already taken'
    } else {
      document.getElementById('error-log').textContent =
        'Error registering user'
    }
  }

  onMount(() => {
    // Focus on username input on mount
    document.getElementById('username').focus()
  })
</script>

<div class="container">
  <div class="row justify-content-center align-items-center">
    <div class="col-4">
      <div class="card">
        <div class="card-body">
          <h3 class="card-title text-center mb-4">Register</h3>
          <div id="error-log" style="color: red;"></div>
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input id="username" bind:value={username} class="form-control" />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" bind:value={password} class="form-control" />
          </div>
          <div class="d-grid gap-2">
            <button on:click={register} class="btn btn-dark">Register</button>
          </div>
          <div>Already have an account? Login <a href="/login">here</a></div>
        </div>
      </div>
    </div>
  </div>
</div>

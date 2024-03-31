<script>
  import { Link, Router, Route } from 'svelte-routing';
  import Home from './routes/Home.svelte';
  import Login from './routes/Login.svelte';
  import { isAuthenticated, user } from './stores/auth';
  import Register from './routes/Register.svelte';
  import Profile from './routes/Profile.svelte';
  import HighLow from './routes/games/HighLow.svelte';

  (async () => {
    try {
      const verifySessionResponse = await fetch('http://localhost:4000/auth/verifySession', {
          method: 'GET',
          credentials: 'include',
      });

      if (verifySessionResponse.ok) {
          const verifySessionData = await verifySessionResponse.json();

          // update user data
          const userDataResponse = await fetch(`http://localhost:4000/user/${verifySessionData.id}`, {
          method: 'GET',
          credentials: 'include'});

          const userData = await userDataResponse.json();
            
          user.set(userData);
          isAuthenticated.set(true);
        } else {
          console.log("Session not valid or not authenticated");
          isAuthenticated.set(false);
          user.set({});
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        isAuthenticated.set(false);
    }
  })();
</script>



<Router >
  <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
    <Link to="/" class="navbar-brand ms-2">Gamba</Link>
    <div class="ms-auto d-flex align-items-center">
      {#if $isAuthenticated}
      <div class="navbar-text me-3">Welcome, <a href="/profile">{$user.username}</a></div>
      <div class="navbar-text me-3"> Level: {$user.level}</div>
      <div class="navbar-text me-3"> Balance: ${$user.balance}</div>
      {:else}
      <Link to="/login" class="navbar-nav">Login</Link>
      {/if}
    </div>
  </nav>

	<Route path="/" component={Home} />
	<Route path="/login" component={Login} />
  <Route path="/register" component={Register} />
  <Route path="/profile" component={Profile} />
  <Route path="/highlow" component={HighLow} />
</Router>
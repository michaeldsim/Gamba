<script>
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'

  let users = []
  onMount(async () => {
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/user/all?page=1&limit=50`,
    )
    if (response.ok) {
      const data = await response.json()
      users = data.data.sort((a, b) => b.balance - a.balance)
    }
  })

  function navigateToUser(userId) {
    navigate(`/user/${userId}`)
  }
</script>

<div class="container mt-4">
  <h2 class="mb-3">Leaderboard</h2>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {#each users as user, index}
          <tr>
            <td>{index + 1}</td>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <td
              ><a
                href="javascript:void(0)"
                on:click={() => navigateToUser(user._id)}>{user.username}</a
              ></td
            >
            <td>${user.balance.toFixed(2)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

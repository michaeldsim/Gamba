<script>
  import { navigate } from 'svelte-routing'
  import { auth, user } from '../stores/auth'
  import { backendUrl } from '../stores/backend'

  $: if (!$auth.isAuthenticated && !$auth.loading) {
    navigate('/')
  }

  let wageredTowardsNextLevel
  let progressPercentage

  let gamesData = {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    data: [],
  }

  // extract these into a util class
  async function fetchGames(page, id) {
    await fetch(
      `${$backendUrl}/games/${id}?page=${page}&limit=${gamesData.limit}`,
    )
      .then(response => response.json())
      .then(data => {
        gamesData = data
      })
      .catch(error => console.error('Error fetching games:', error))
  }

  function changePage(page) {
    fetchGames(page, $user._id)
  }

  function gameResultToString(result) {
    return result === 1 ? 'Win' : 'Loss'
  }

  function gameTypeToString(gameType) {
    switch (gameType) {
      case 0:
        return 'High Low'
      default:
        return 'Unknown Game'
    }
  }

  async function claimDaily() {
    const res = await fetch(`${$backendUrl}/user/claimDaily`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) {
      const data = res.json()
      user.update(currentUser => {
        currentUser.balance = parseFloat(data.updatedBalance).toFixed(2)
        return currentUser
      })
    }
  }

  let dailyClaimable = false

  $: if (Object.keys($user).length > 0) {
    // Calculate the progress towards the next level
    wageredTowardsNextLevel = $user.wagered % 100
    progressPercentage = (wageredTowardsNextLevel / 100) * 100
    dailyClaimable =
      new Date($user.daily_last_claimed).getTime() - new Date().getTime() >
      24 * 60 * 60 * 1000 // checks if 24 hours has passed

    console.log(dailyClaimable)
    ;(async () => {
      await fetchGames(0, $user._id)
    })()
  }
</script>

{#if $user && Object.keys($user).length > 0}
  <div class="container my-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="mb-4">Profile</h1>
        <div class="mb-3">
          <h2>{$user.username}</h2>
        </div>
        <div class="mb-3">
          <strong>Balance:</strong> ${parseFloat($user.balance).toFixed(2)}
        </div>
        <div class="mb-3">
          <strong>Wagered:</strong> ${$user.wagered}
        </div>
        <div class="mb-3">
          <strong>Level:</strong>
          {$user.level}
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              style="width: {progressPercentage}%;"
              aria-valuenow={wageredTowardsNextLevel}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <p>
            Wager {100 - wageredTowardsNextLevel} more to reach the next level.
          </p>
        </div>
        <button
          class="btn btn-primary mb-2"
          disabled={!dailyClaimable}
          on:click={claimDaily}>Claim Daily Cash</button
        >
        <div class="mb-3">
          <strong>Daily Last Claimed:</strong>
          {new Date($user.daily_last_claimed).toLocaleString()}
        </div>
        <div>
          <strong>Account Created:</strong>
          {new Date($user.created_at).toLocaleString()}
        </div>
        <div class="d-flex flex-column align-items-start mb-3">
          <h1 class="mt-3">Game History</h1>
          {#each gamesData.data as game}
            <div class="p-2 border-bottom w-100">
              <div><strong>Type:</strong> {gameTypeToString(game.game)}</div>
              <div>
                <strong>Result:</strong>
                {gameResultToString(game.result)}
              </div>
              <div><strong>Wagered:</strong> ${game.wagered}</div>
              <div>
                <strong>Earnings:</strong> ${parseFloat(game.earnings).toFixed(
                  2,
                )}
              </div>
              <div>
                <strong>Date:</strong>
                {new Date(game.created_at).toLocaleDateString()}
              </div>
            </div>
          {/each}
        </div>
        {#if gamesData.totalPages > 1}
          <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
              <li class="page-item {gamesData.page === 1 ? 'disabled' : ''}">
                <button
                  class="page-link"
                  on:click={() => changePage(gamesData.page - 1)}
                  >Previous</button
                >
              </li>

              {#each Array(gamesData.totalPages) as _, index (index)}
                <li
                  class="page-item {gamesData.page === index + 1
                    ? 'active'
                    : ''}"
                >
                  <button
                    class="page-link"
                    on:click={() => changePage(index + 1)}>{index + 1}</button
                  >
                </li>
              {/each}

              <li
                class="page-item {gamesData.page === gamesData.totalPages
                  ? 'disabled'
                  : ''}"
              >
                <button
                  class="page-link"
                  on:click={() => changePage(gamesData.page + 1)}>Next</button
                >
              </li>
            </ul>
          </nav>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div class="text-center my-5">
    <p>Loading profile data...</p>
  </div>
{/if}

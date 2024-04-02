<script>
  import { onMount } from 'svelte'
  import { backendUrl } from '../stores/backend'

  export let id

  $: userData = {}

  let gamesData = {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    data: [],
  }

  async function fetchGames(page, id) {
    await fetch(
      `${backendUrl}/games/${id}?page=${page}&limit=${gamesData.limit}`,
    )
      .then(response => response.json())
      .then(data => {
        gamesData = data
      })
      .catch(error => console.error('Error fetching games:', error))
  }

  function changePage(page) {
    fetchGames(page, id)
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

  onMount(async () => {
    const res = await fetch(`${backendUrl}/user/${id}`, {
      method: 'GET',
    })

    if (res.ok) {
      userData = await res.json()
      fetchGames(0, id)
    }
  })

  let wageredTowardsNextLevel
  let progressPercentage

  $: if (Object.keys(userData).length > 0) {
    // Calculate the progress towards the next level
    wageredTowardsNextLevel = userData.wagered % 100
    progressPercentage = (wageredTowardsNextLevel / 100) * 100
  }
</script>

{#if userData && Object.keys(userData).length > 0}
  <div class="container my-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="mb-4">Profile</h1>
        <div class="mb-3">
          <h2>{userData.username}</h2>
        </div>
        <div class="mb-3">
          <strong>Balance:</strong> ${parseFloat(userData.balance).toFixed(2)}
        </div>
        <div class="mb-3">
          <strong>Wagered:</strong> ${userData.wagered}
        </div>
        <div class="mb-3">
          <strong>Level:</strong>
          {userData.level}
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
        <div class="mb-3">
          <strong>Daily Last Claimed:</strong>
          {new Date(userData.daily_last_claimed).toLocaleString()}
        </div>
        <div>
          <strong>Account Created:</strong>
          {new Date(userData.created_at).toLocaleString()}
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

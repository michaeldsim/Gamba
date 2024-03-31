<script>
    import { navigate } from "svelte-routing";
    import { isAuthenticated, user } from "../stores/auth";

    

    $: if (!$isAuthenticated) {
        navigate("/");
    }

    let wageredTowardsNextLevel;
    let progressPercentage;

    $: if (Object.keys($user).length > 0) {
    // Calculate the progress towards the next level
        wageredTowardsNextLevel = $user.wagered % 100;
        progressPercentage = (wageredTowardsNextLevel / 100) * 100;
    }


</script>

<!-- only generate if user data is populated -->
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
        <strong>Level:</strong> {$user.level}
        <div class="progress">
          <div class="progress-bar" role="progressbar" style="width: {progressPercentage}%;" aria-valuenow="{wageredTowardsNextLevel}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <p>Wager {100 - wageredTowardsNextLevel} more to reach the next level.</p>
      </div>
      <div class="mb-3">
        <strong>Daily Last Claimed:</strong> {new Date($user.daily_last_claimed).toLocaleString()}
      </div>
      <div>
        <strong>Account Created:</strong> {new Date($user.created_at).toLocaleString()}
      </div>
    </div>
  </div>
</div>
{:else}
<!-- Optionally, display a loading spinner or message here -->
<div class="text-center my-5">
  <p>Loading profile...</p>
</div>
{/if}

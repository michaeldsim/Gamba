<script>
  import { user } from "../../stores/auth";
  
  let chosenNumber = '';
  let wager = '';
  let message = '';
  let potentialEarningsHigher = 0;
  let potentialEarningsLower = 0;

  function validateInput(value, min, max) {
    if (value !== '') {
      const num = Number(value);
      return Math.min(Math.max(num, min), max).toString(); // Convert back to string to maintain input flexibility
    }
    return value; // Return as is if empty
  }
  
  // Adjusted event handlers
  function handleChosenNumberInput(event) {
    chosenNumber = validateInput(event.target.value, 1, 99);
    updatePotentialEarnings();
  }
  
  function handleWagerInput(event) {
    // Allow empty input and only validate if input is not empty
    wager = event.target.value === '' ? '' : validateInput(Number(event.target.value), 0, Number.MAX_SAFE_INTEGER);
    updatePotentialEarnings();
  }

  // Calculate profit multiplier
  function calculateProfitMultiplier(winChance) {
    return 1 / winChance;
  }
  
  function updatePotentialEarnings() {
    const winChanceHigher = (100 - chosenNumber) / 100; // Chance to win by guessing higher
    const winChanceLower = chosenNumber / 100; // Chance to win by guessing lower

    potentialEarningsHigher = wager * calculateProfitMultiplier(winChanceHigher) - wager;
    potentialEarningsLower = wager * calculateProfitMultiplier(winChanceLower) - wager;
  }
  
  async function makeGuess(isHigher) {
    const profitMultiplier = isHigher ? calculateProfitMultiplier((100 - chosenNumber) / 100) : calculateProfitMultiplier(chosenNumber / 99);
    let potentialEarnings = wager * profitMultiplier;

    const response = await fetch('http://localhost:4000/games/highlow', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guess: isHigher ? 'higher' : 'lower',
        chosenNumber,
        wager
      })
    });

    if (response.ok) {
      const data = await response.json();
      message = `${data.message} The result number was ${data.resultNumber}. Your potential earnings were ${potentialEarnings.toFixed(2)}.`;
      user.update(currentUser => {
        currentUser.balance = data.updatedBalance.toFixed(2);
        return currentUser;
      });
    } else {
      message = 'An error occurred. Please try again.';
    }
  }
</script>

<div class="container mt-5">
  <div class="mb-3">
    <label for="chosenNumber" class="form-label">Choose your number (1-99):</label>
    <input type="number" class="form-control" bind:value={chosenNumber} on:input={handleChosenNumberInput} min="1" max="99">
  </div>
  <div class="mb-3">
    <label for="wager" class="form-label">Your wager:</label>
    <input type="number" class="form-control" bind:value={wager} on:input={handleWagerInput} min="0">
  </div>
  <button class="btn btn-primary me-2" on:click={() => makeGuess(true)}>Guess Higher</button>
  <button class="btn btn-secondary" on:click={() => makeGuess(false)}>Guess Lower</button>
  <p class="mt-3">{message}</p>
  <div class="alert alert-info" role="alert">
    Potential Earnings if Higher: +${potentialEarningsHigher.toFixed(2)}<br>
    Potential Earnings if Lower: +${potentialEarningsLower.toFixed(2)}
  </div>
</div>

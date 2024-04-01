<script>
  const games = [
    {
      title: 'High Low Game',
      description:
        'Choose a number and guess whether the next number will be higher or lower',
      link: '/highlow',
    },
    // Add games here
  ]
</script>

<div class="text-center mt-3 mb-5">
  <h1>Gamba</h1>
  <p>Satisfy your gambling addiction here</p>
  <div class="container mt-5">
    <div class="row">
      {#each games as { title, description, link }}
        <div class="col-md-4 mb-4">
          <div class="card" style="width: 100%;">
            <div class="card-body">
              <h5 class="card-title">{title}</h5>
              <p class="card-text">{description}</p>
              <a href={link} class="btn btn-primary">Play Game</a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

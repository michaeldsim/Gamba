<script>
  import { onMount } from "svelte";
  import { isAuthenticated, user } from "../stores/auth";
</script>
  
  <style>
    /* Basic styling */
    .home-container {
      text-align: center;
      padding: 50px;
    }
  
    h1 {
      color: #333;
    }
  
    p {
      color: #666;
      max-width: 600px;
      margin: auto;
    }
  </style>
  
  <div class="home-container">
    <h1>Gamba</h1>
    <p>Satisfy your gambling addiction here</p>
    <!-- TODO: add games display -->
  </div>
  
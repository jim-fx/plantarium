<!-- views/Layout.svelte -->
<script>
  import NavBar from './components/NavBar.svelte';
</script>

<!doctype html />
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    %head%
  </head>

  <body>
    <NavBar />
    <slot />
  </body>
</html>

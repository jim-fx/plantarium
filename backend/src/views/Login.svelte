<script>
  import Layout from './Layout.svelte';
</script>

<Layout>
  <form action="api/auth/login" method="POST">
    <label for="username"><b>Username</b></label>
    <input type="text" placeholder="Enter Username" name="username" required />

    <label for="password"><b>Password</b></label>
    <input
      type="password"
      placeholder="Enter Password"
      name="password"
      required
    />

    <button type="submit">Login</button>
  </form>
</Layout>

<style>
  form {
    max-width: 500px;
  }

  /* Full-width inputs */
  input[type='text'],
  input[type='password'] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  button {
    background-color: #04aa6d;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 100%;
  }
</style>

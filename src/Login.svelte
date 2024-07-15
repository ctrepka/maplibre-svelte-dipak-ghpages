<script>
    import { createEventDispatcher } from "svelte";
    import { username, password, loggedIn, token, tokenExpiry } from "./stores";

    const dispatch = createEventDispatcher();
    let user = "";
    let pass = "";

    function handleSubmit(event) {
        event.preventDefault();

        username.set(user);
        password.set(pass);
        loggedIn.set(true); 
        dispatch("login");
    }

</script>

<form on:submit={handleSubmit}>
    <h1>Login</h1>
    <div class="input-group">
        <label for="username">Username</label>
        <input type="text" id="username" bind:value={user} required />
    </div>
    <div class="input-group">
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={pass} required />
    </div>
    <button type="submit">Login</button>
</form>

<style>
    :global(body) {
        margin: 0;
        font-family: "Arial", sans-serif;
        background-color: #f0f0f0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: linear-gradient(
            #bf0a30 50%,
            #002868 50%
        );
    }

    form {
        background: white;
        padding: 2rem;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        width: 300px;
        text-align: center;
    }

    h1 {
        margin-bottom: 1rem;
        color: #002868; /* Blue color */
    }

    .input-group {
        margin-bottom: 1rem;
        text-align: left;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: #002868; /* Blue color */
    }

    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
    }

    button {
        background-color: #bf0a30; /* Red color */
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
        font-size: 1rem;
    }

    button:hover {
        background-color: #9b0724; /* Darker red */
    }
</style>

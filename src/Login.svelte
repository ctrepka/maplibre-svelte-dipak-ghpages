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
        // token.set(newToken);
        // tokenExpiry.set(expiry);
        loggedIn.set(true); // Set the loggedIn store to true
        dispatch("login");

        // Simulate an authentication request
        // authenticate(user, pass).then(({ token: newToken, expiry }) => {
        //     // Update the stores
        //     username.set(user);
        //     password.set(pass);
        //     token.set(newToken);
        //     tokenExpiry.set(expiry);
        //     loggedIn.set(true); // Set the loggedIn store to true
        //     dispatch('login');
        // }).catch(error => {
        //     console.error('Authentication failed:', error);
        //     alert('Authentication failed');
        // });
    }

    // async function authenticate(username, password) {
    //     // Simulate a backend authentication call
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             if (username === 'admin' && password === 'password') {
    //                 resolve({
    //                     token: 'fake-jwt-token',
    //                     expiry: new Date(Date.now() + 1000 * 60 * 60).toISOString() // 1 hour expiry
    //                 });
    //             } else {
    //                 reject('Invalid credentials');
    //             }
    //         }, 1000);
    //     });
    // }
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

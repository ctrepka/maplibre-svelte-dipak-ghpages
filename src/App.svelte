<script>
    import { onMount } from "svelte";
    import { loadLocations, showChart, showList } from "./stores";
    import Map from "./Map.svelte";
    import { writable } from "svelte/store";
    import Login from "./Login.svelte";

    const loggedIn = writable(false);

    function handleLogin() {
        loggedIn.set(true);
    }
</script>

<main style="display: flex;">
    {#if $loggedIn}
        <Map />
        <!-- {#if $showChart}
        {/if} -->
    {:else}
        <Login on:login={handleLogin} />
    {/if}
</main>

<script>
    import { onMount } from 'svelte';
    import { loadLocations, showChart, showList } from './stores';
    import Map from './Map.svelte';
    import Controls from './controls.svelte';
    import LocationList from './LocationList.svelte';

    onMount(() => {
        // loadLocations(map);
    });
</script>

<main>
    <Map />
    <!-- <Controls /> -->
    <!-- <LocationList /> -->
    {#if $showChart}
    <div id="rChart" style="width: 300px; height: 400px;">
        <button on:click={() => showChart.set(false)}>Hide</button>
        <canvas id="ratingsChart" style="width: 300px; height: 300px;"></canvas>
    </div>
    {/if}

    <!-- {#if $showList}
    <div id="locations" >
        <h2>Location List</h2>
        <input type="text" id="searchBar" placeholder="Search by name, type, or rating...">
        <ul id="locationList"></ul>
    </div>
    {/if} -->
</main>
<script>
    import { onMount } from 'svelte';
    import { loadLocations, showChart, showList } from './stores';
    import Map from './Map.svelte';
    import Controls from './controls.svelte';
    import LocationList from './LocationList.svelte';

    onMount(() => {
        
    });
</script>

<main>
    <Map />
    
    {#if $showChart}
    <div id="rChart" style="width: 300px; height: 400px;">
        <button on:click={() => showChart.set(false)}>X</button>
        <canvas id="ratingsChart" style="width: 300px; height: 300px;"></canvas>
        <h2>Rating Pie Chart</h2>
    </div>
    {/if}

</main>
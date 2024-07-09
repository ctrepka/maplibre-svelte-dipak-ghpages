<script>
    import { Map } from "maplibre-gl";
    // import { updateMap } from "./Map.svelte";
    import {
        updateMap,
        isChecked,
        tracking,
        showChart,
        showRatingsChart,
        closeRatingsChart,
    } from "./stores";

    export let map;

    function startTracking() {
        console.log("Start Tracking");

        if (!$tracking) {
            tracking.set(true);
            intervalId = setInterval(() => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        let { latitude, longitude } = position.coords;
                        latitude += i;
                        longitude += j;
                        i += Math.random() * 0.02;
                        i -= 0.01;
                        j += Math.random() * 0.03;
                        j -= 0.01;
                        console.log(
                            `Latitude: ${latitude}, Longitude: ${longitude}`,
                        );

                        if (first) {
                            const fMarker = new maplibregl.Marker()
                                .setLngLat([longitude, latitude])
                                .addTo(map);
                            first = false;
                            firstMarker.push(fMarker);
                        } else {
                            firstMarker.forEach((marker) => marker.remove());
                            firstMarker = [];
                        }
                        updateMap(latitude, longitude, map);
                    });
                }
            }, 5000);
        }
    }

    function stopTracking() {
        console.log("Stop Tracking");
        if (tracking) {
            tracking.set(false);
            clearInterval(intervalId);
        }
    }

    function toggleShowChart() {
        showChart.update((value) => !value);
        if ($showChart) {
            showRatingsChart();
        } else {
            closeRatingsChart();
        }
    }

    let intervalId;
    let first = true;
    let i = 0;
    let j = 0;
    let firstMarker = [];
</script>

<div id="controls">
    <button on:click={startTracking}>Start Tracking</button>
    <button on:click={stopTracking}>Stop Tracking</button>
    <button on:click={toggleShowChart}>Show Ratings Chart</button>
    <label class="switch" title="Toggle to ON/OFF Add Location Manually">
        <input type="checkbox" bind:checked={$isChecked} />
        <span class="slider round">
            <span class="on">ON</span>
            <span class="off">OFF</span>
        </span>
    </label>
</div>

<style>
    /* styles for controls */
</style>

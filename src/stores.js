import { writable } from 'svelte/store';
import Dexie from 'dexie';
import Chart from 'chart.js/auto';

export const db = new Dexie("locationsDatabase");
db.version(1).stores({
    locations: "++id, OBJECTID, latitude, longitude, timestamp, note, lname, type, ratings"
});

export const locations = writable([]);
export const isChecked = writable(false);
export const tracking = writable(false);
export const firstMarker = writable([]);
// export const myChart = writable(null);
export const currentLocation = writable({ latitude: 30.28, longitude: -97.69 });
export const showChart = writable(false);
export const showList = writable(false);

export async function loadLocations(map, directions) {
    const locs = await db.locations.toArray();
    const currentLocations = locs.filter(loc => loc.timestamp >= ts);
    const coordinates = currentLocations.map(loc => [loc.longitude, loc.latitude]);
    if (coordinates.length > 0) {
        await ensureMapIsLoaded(map);
        drawRoute(map, coordinates);
        updateLocationList(locs, map);
    }
    locations.set(locs);
}

async function ensureMapIsLoaded(map) {
    return new Promise((resolve) => {
        if (map.style.loaded()) {
            resolve();
        } else {
            map.once('load', resolve);
        }
    });
}

export function updateLocationList(locs, map) {
    const locationList = document.getElementById('locationList');
    locationList.innerHTML = '';

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Type</th>
                <th>Ratings</th>
                <th>Note</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    locationList.appendChild(table);

    const tbody = table.querySelector('tbody');

    locs.forEach(location => {
        const row = document.createElement('tr');
        // listItem.className = 'location-item';
        row.innerHTML = `
            <td><input type="radio" name="location" class="location-radio" data-lat="${location.latitude}" data-lng="${location.longitude}"></td>

            <td style="display:none">${location.latitude}</td>
            <td style="display:none">${location.longitude}</td>
            <td><input type="text" id="lname-${location.id}" value="${location.lname}" /></td>
            <td>
                <select id="type-${location.id}">
                    <option value="" ${location.type === '' ? 'selected' : ''}></option>
                    <option value="Restaurant" ${location.type === 'Restaurant' ? 'selected' : ''}>Restaurant</option>
                    <option value="Monument" ${location.type === 'Monument' ? 'selected' : ''}>Monument</option>
                </select>
            </td>
            <td>
                <select id="ratings-${location.id}">
                    <option value="0" ${location.ratings === '0' ? 'selected' : ''}>0</option>
                    <option value="1" ${location.ratings === '1' ? 'selected' : ''}>1</option>
                    <option value="2" ${location.ratings === '2' ? 'selected' : ''}>2</option>
                    <option value="3" ${location.ratings === '3' ? 'selected' : ''}>3</option>
                    <option value="4" ${location.ratings === '4' ? 'selected' : ''}>4</option>
                    <option value="5" ${location.ratings === '5' ? 'selected' : ''}>5</option>
                </select>
            </td>
            <td><textarea id="note-${location.id}">${location.note}</textarea></td>
            <td><button class="save-button" data-id="${location.id}">Save</button></td>
        `;
        tbody.appendChild(row);
    });

    attachEventListenersToListItems(map);
}

function attachEventListenersToListItems(map) {
    let markers = [];

    document.querySelectorAll('.location-radio').forEach(radio => {
        radio.addEventListener('click', event => {
            const latitude = parseFloat(event.target.getAttribute('data-lat'));
            const longitude = parseFloat(event.target.getAttribute('data-lng'));
            markers.forEach(marker => marker.remove());
            markers = [];
            map.flyTo({ center: [longitude, latitude], zoom: 15 });
            const newMarker = new maplibregl.Marker({ color: 'red' })
                .setLngLat([longitude, latitude])
                .addTo(map);
            markers.push(newMarker);
        });
    });

    document.querySelectorAll('.save-button').forEach(button => {
        button.addEventListener('click', async event => {
            // const li = event.target.parentElement.parentElement;
            // const id = parseInt(event.target.getAttribute('data-id'), 10);
            // const lname = li.querySelector('#lname-${id}').value;
            // const type = li.querySelector('#type-${id}').value;
            // const ratings = li.querySelector('#ratings-${id}').value;
            // const note = li.querySelector('#note-${id}').value;
            // const latitude = parseFloat(li.querySelector('td:nth-child(2)').innerText);
            // const longitude = parseFloat(li.querySelector('td:nth-child(3)').innerText);
            const locationId = button.dataset.id;
            const row = document.querySelector(`button[data-id="${locationId}"]`).closest('tr');

            const id = parseInt(event.target.getAttribute('data-id'), 10);
            const latitude = row.querySelector(`input[name="location"]`).dataset.lat;
            const longitude = row.querySelector(`input[name="location"]`).dataset.lng;
            const lname = row.querySelector(`#lname-${locationId}`).value;
            const type = row.querySelector(`#type-${locationId}`).value;
            const ratings = row.querySelector(`#ratings-${locationId}`).value;
            const note = row.querySelector(`#note-${locationId}`).value;


            await saveNoteToLocation(id, lname, type, ratings, note, map);
            // loadLocations();

            let url = '';
            switch (type) {
                case "Restaurant":
                    url = 'https://img.icons8.com/?size=100&id=qvscHBGB7saA&format=png&color=000000';
                    break;

                case "Monument":
                    url = 'https://img.icons8.com/?size=100&id=17621&format=png&color=000000';
                    break;

                default:
                    break;
            }

            const index = customMarker.findIndex(marker => marker.newMarker._lngLat.lng == longitude && marker.newMarker._lngLat.lat == latitude);
            if (index !== -1) {
                const cmarker = customMarker[index]
                cmarker.newMarker.remove();
                customMarker.splice(index, 1);
            }

            if (url) {

                const el = document.createElement('div');
                el.className = 'marker';
                el.style.backgroundImage =
                    `url(${url})`;
                el.style.backgroundSize = `30px 30px`;
                el.style.backgroundRepeat = `no-repeat`;
                el.style.width = `30px`;
                el.style.height = `30px`;

                const newMarker = new maplibregl.Marker({ element: el })
                    .setLngLat([longitude, latitude])
                    .addTo(map);
                customMarker.push({ newMarker });

                newMarker.getElement().addEventListener('click', () => {
                    // showPopup(ratings,latitude,longitude);
                    new maplibregl.Popup({ closeOnClick: false })
                        .setLngLat([longitude, latitude])
                        .setHTML(`<h3>Rating</h3><p>${ratings}</p>`)
                        .addTo(map);
                });
            }



        });
    });
}

export async function saveLocation(latitude, longitude, map, directions) {
    await db.locations.add({
        OBJECTID: getNextObjectId(),
        latitude,
        longitude,
        timestamp: new Date().getTime(),
        note: '',
        lname: '',
        type: '',
        ratings: 0
    });
    await loadLocations(map, directions);
    if (directions) {
        directions.addWaypoint([longitude, latitude], 0);
    }
}

export async function saveNoteToLocation(id, lname, type, ratings, note, map) {
    await db.locations.update(id, { lname, type, ratings, note });
    loadLocations(map);
}

export async function initLoadLocations(map) {
    const locs = await db.locations.toArray();
    const validLocations = locs.filter(loc => loc.type);
    const invalidLocations = locs.filter(loc => !loc.type);

    for (const location of invalidLocations) {
        await db.locations.delete(location.id);
    }


    validLocations.forEach(location => {

        let url = '';
        switch (location.type) {
            case "Restaurant":
                url = 'https://img.icons8.com/?size=100&id=qvscHBGB7saA&format=png&color=000000';
                break;

            case "Monument":
                url = 'https://img.icons8.com/?size=100&id=17621&format=png&color=000000';
                break;

            default:
                break;
        }

        if (url) {

            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage =
                `url(${url})`;
            el.style.backgroundSize = `30px 30px`;
            el.style.backgroundRepeat = `no-repeat`;
            el.style.width = `30px`;
            el.style.height = `30px`;

            const newMarker = new maplibregl.Marker({ element: el })
                .setLngLat([location.longitude, location.latitude])
                .addTo(map);
            customMarker.push({ newMarker });

            newMarker.getElement().addEventListener('click', () => {
                // showPopup(ratings,latitude,longitude);
                new maplibregl.Popup({ closeOnClick: false })
                    .setLngLat([location.longitude, location.latitude])
                    .setHTML(`<h3>Rating</h3><p>${location.ratings}</p>`)
                    .addTo(map);
            });
        }

    });

    const coordinates = validLocations.map(loc => [loc.longitude, loc.latitude]);
    if (coordinates.length > 0) {
        //drawPoint(coordinates);
        updateLocationList(validLocations, map);
    }

    locations.set(validLocations);
}

export function drawRoute(map, coordinates) {
    if (map.getSource('route')) {
        map.getSource('route').setData({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: coordinates
            }
        });
    } else {
        map.addSource('route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            }
        });

        // map.addLayer({
        //     id: 'route',
        //     type: 'line',
        //     source: 'route',
        //     layout: {
        //         'line-join': 'round',
        //         'line-cap': 'round'
        //     },
        //     paint: {
        //         'line-color': '#888',
        //         'line-width': 6
        //     }
        // });

        map.addLayer({
            id: 'route-points',
            type: 'circle',
            source: 'route',
            paint: {
                'circle-radius': 6,
                'circle-color': '#B42222'
            }

        });
    }
}

export async function showRatingsChart() {
    const locs = await db.locations.toArray();
    const ratingsCount = locs.reduce((acc, loc) => {
        acc[loc.ratings] = (acc[loc.ratings] || 0) + 1;
        return acc;
    }, {});

    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('ratingsChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(ratingsCount),
            datasets: [{
                data: Object.values(ratingsCount),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: context => `${context.label || ''}: ${context.raw}`
                    }
                }
            }
        }
    });

    document.getElementById('rChart').style.display = 'block';
}

export function closeRatingsChart() {
    document.getElementById('rChart').style.display = 'none';
}

export async function searchLocations(query) {
    const locs = await db.locations.toArray();
    return locs.filter(location =>
        location.lname.toLowerCase().includes(query) ||
        location.type.toLowerCase().includes(query) ||
        location.ratings.toString().includes(query) ||
        location.note.toLowerCase().includes(query)
    );
}

function getNextObjectId() {
    return nextObjectId++;
}

export function updateMap(lat, lng, map, directions) {
    saveLocation(lat, lng, map, directions);
    // loadLocations();
    map.flyTo({ center: [lng, lat], zoom: 15 });

}


let nextObjectId = 1;
let ts = Date.now();
let customMarker = [];
let myChart;
<script>
   	 import { locations, currentLocation, saveNoteToLocation } from './stores';
    
   	 let query = '';
    
   	 $: filteredLocations = $locations.filter(location =>
   		 location.lname.toLowerCase().includes(query) ||
   		 location.type.toLowerCase().includes(query) ||
   		 location.ratings.toString().includes(query) ||
   		 location.note.toLowerCase().includes(query)
   	 );
    
   	 function handleLocationClick(location) {
   		 currentLocation.set({ latitude: location.latitude, longitude: location.longitude });
   	 }
    
   	 function handleSaveClick(location) {
   		 saveNoteToLocation(
   			 location.id,
   			 location.lname,
   			 location.type,
   			 location.ratings,
   			 location.note,
   			 location.latitude,
   			 location.longitude
   		 );
   	 }
    </script>
    
    <div id="locations">
   	 <h2>Location List</h2>
   	 <input type="text" bind:value={query} placeholder="Search by name, type, or rating...">
   	 <ul>
   		 {#each filteredLocations as location}
   		 <li class="location-item">
   			 <input type="radio" name="location" on:click={() => handleLocationClick(location)} data-lat={location.latitude} data-lng={location.longitude}>
   			 <label for="latitude">Latitude:</label>
   			 <input type="text" class="latitude-input" id="latitude" name="latitude" bind:value={location.latitude} readonly><br>
   			 <label for="longitude">Longitude:</label>
   			 <input type="text" class="longitude-input" id="longitude" name="longitude" bind:value={location.longitude} readonly><br>
   			 <label for="objectid">OBJECTID:</label>
   			 <input type="text" class="objectid-input" id="objectid" name="objectid" bind:value={location.OBJECTID} readonly><br>
   			 <input class="name-input" type="text" placeholder="Name" bind:value={location.lname} />
   			 <!-- <select class="type-select" bind:value={location.type}>
   				 <option value="" {location.type === '' ? 'selected' : ''}></option>
   				 <option value="Restaraunt" {location.type === 'Restaraunt' ? 'selected' : ''}>Restaraunt</option>
   				 <option value="Monument" {location.type === 'Monument' ? 'selected' : ''}>Monument</option>
   			 </select>
   			 <select class="rating-select" bind:value={location.ratings}>
   				 <option value="0" {location.ratings === '0' ? 'selected' : ''}>0</option>
   				 <option value="1" {location.ratings === '1' ? 'selected' : ''}>1</option>
   				 <option value="2" {location.ratings === '2' ? 'selected' : ''}>2</option>
   				 <option value="3" {location.ratings === '3' ? 'selected' : ''}>3</option>
   				 <option value="4" {location.ratings === '4' ? 'selected' : ''}>4</option>
   				 <option value="5" {location.ratings === '5' ? 'selected' : ''}>5</option>
   			 </select> -->
   			 <textarea class="note-input" placeholder="Add a note..." bind:value={location.note}></textarea>
   			 <button on:click={() => handleSaveClick(location)}>Save</button>
   		 </li>
   		 {/each}
   	 </ul>
    </div>
   
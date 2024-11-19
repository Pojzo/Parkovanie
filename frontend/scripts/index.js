import './events.js';
import { displayGarageList } from './dynamic/displayGarageList.js'
import { fetchGarages } from './api/fetchGarages.js'
import { displayParkingLot } from "./dynamic/displayParkingLot.js";
import { displayGarageInfo } from './dynamic/displayGarageInfo.js';
import { globalState } from './config.js';
import { fetchSpots } from './api/fetchSpots.js';
import { groupParkingSpotsByFloor } from './misc.js';

// Fetch all garages
const garagesData = await fetchGarages();
globalState.garages = garagesData;

// Fetch spots for each garage
for (const garage of globalState.garages) {
    const spots = await fetchSpots(garage.garage_id);
    const groupedSpots = groupParkingSpotsByFloor(spots);
    globalState.garageSpots[garage.garage_id] = groupedSpots;
}

// Set the first garage as the current garage
globalState.currentGarage = garagesData[0];

// Display garage list displayed on top of the page
displayGarageList(garagesData);

// TODO:: For now display the first, note globalStage in config.js
displayGarageInfo();

console.log(globalState.garageSpots[globalState.currentGarage.garage_id]);
console.log(globalState.currentGarage);


displayParkingLot();
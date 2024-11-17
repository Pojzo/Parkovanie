import './events.js';
import './config.js';
import { displayGarages as displayGarageList } from './dynamic/displayGarageList.js'
import { globalState } from './config.js'
import { getGarages as fetchGarages } from './api/fetchGarages.js'
import { generateParkingLot as displayParkingLot } from "./dynamic/displayGarage.js";

const displayGarageInfo = () => {
    // If no garage is selected, don't display anything
    if (!globalState.currentGarage) {
        return;
    }

    const garageInfo = document.getElementById("garage-info");
    garageInfo.id = "garage-info";

    const garageObject = globalState.currentGarage;
    const name = document.createElement("h2");
    name.textContent = garageObject.name;

    const location = document.createElement("p");
    location.textContent = `Location: ${garageObject.location}`;

    const floors = document.createElement("p");
    floors.textContent = `Floors: ${garageObject.floors}`;

    garageInfo.appendChild(name);
    garageInfo.appendChild(location);
    garageInfo.appendChild(floors);
}

// Wait for garages to be fetched and then display them
const garagesData = await fetchGarages();
displayGarageList(garagesData);
displayGarageInfo();

const numRows = 5;
const numCols = 10;

const colMargin = 5;
const rowMargin = 5

displayParkingLot(numRows, numCols, colMargin, rowMargin);
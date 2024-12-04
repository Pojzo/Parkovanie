//import { displayGarageList } from '../dynamic/displayAdminGarageList.js'
//import { fetchGarages } from '../api/fetchGarages.js'
//// import { displayGarageInfo } from '../dynamic/displayGarageInfo.js';
//import { adminData } from './data.js';
//// import { fetchSpots } from '../api/fetchSpots.js';
//// import { groupParkingSpotsByFloor } from '../misc.js';
//// import { displayParkingSpots } from '../dynamic/displayParkingSpots.js';

// // Fetch all garages
//const garagesData = await fetchGarages();
//console.log(garagesData);
//adminData.garages = garagesData;

// Fetch spots for each garage
// for (const garage of adminData.garages) {
//     const spots = await fetchSpots(garage.garage_id);
//     const groupedSpots = groupParkingSpotsByFloor(spots);
//     adminData.garageSpots[garage.garage_id] = groupedSpots;
// }

// // Set the first garage as the current garage
//adminData.currentGarage = garagesData[0];

//const displayInitialGarage = () => {
//     // displayGarageInfo(adminData.currentGarage);
//     // const currenSpots = adminData.garageSpots[adminData.currentGarage.garage_id][adminData.currentFloor];
//     // displayParkingSpots(adminData.currentGarage.num_rows, adminData.currentGarage.num_cols, currenSpots);
//   displayGarageList(adminData.garages);
//}

//// console.log(adminData.garageSpots[adminData.currentGarage.garage_id]);
//// console.log(adminData.currentGarage);

//displayInitialGarage();

import { fetchSpots } from "../api/fetchSpots";
import { fetchGarages } from "../api/fetchGarages";
import { adminData } from "./data";
import { displayAdminParkingSpots } from "../dynamic/displayParkingSpots";
import { createGarage } from "../api/createGarage";
import { displayGarageList } from "../dynamic/displayAdminGarageList";
import { groupParkingSpotsByFloor } from "../misc";

document.addEventListener('DOMContentLoaded', async () => {
    const createGarageBtn = document.getElementById("create-garage-btn");
    const garageEditorContainer = document.getElementById("garage-editor-admin");
    const topContentContainer = document.getElementById("top-content");
    const garageListItems = document.getElementById("garage-list-items");

    if (!createGarageBtn) {
        console.error("Create button not found");
        return;
    }

    createGarageBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        console.log("Create button clicked");

        const newGarage = await createGarage();
        if (newGarage) {
            const garagesData = await fetchGarages();
            adminData.garages = garagesData;

            displayGarageList(adminData.garages);
            adminData.currentGarage = newGarage;

            const currentSpots = adminData.garageSpots[newGarage.garage_id] || {};
            adminData.currentFloor = 1;
            displayAdminParkingSpots(newGarage.num_rows, newGarage.num_cols, currentSpots[1] || [], [], () => { });

            garageEditorContainer.classList.remove('hidden');
            topContentContainer.classList.add('hidden');
        }
    });

    garageListItems.addEventListener("click", async (e) => {
        const garageItem = e.target.closest('.garage-item');
        if (garageItem) {
            const garageId = garageItem.dataset.garageId;
            console.log("Selected garage ID:", garageId);
            const selectedGarage = adminData.garages.find(garage => garage.garage_id == garageId);
            console.log("Selected garage:", selectedGarage);
            adminData.currentGarage = selectedGarage;

            const spots = await fetchSpots(garageId);
            adminData.garageSpots[garageId] = spots;

            displayAdminParkingSpots(selectedGarage.num_rows, selectedGarage.num_cols, spots, [], spotClickCallback);

            garageEditorContainer.classList.remove('hidden');
            topContentContainer.classList.add('hidden');
        }
    });

    const garagesData = await fetchGarages();
    console.log(garagesData);
    adminData.garages = garagesData;

    adminData.currentGarage = garagesData[0];

    const displayInitialGarage = () => {
        displayGarageList(adminData.garages);
    }

    displayInitialGarage();
});

const renderParkingSpots = (clickCallback) => {
    const currentGarage = adminData.currentGarage;
    const currentSpots = adminData.garageSpots[currentGarage.garage_id][adminData.currentFloor];

    if (!Array.isArray(currentSpots)) {
        console.error('currentSpots is not an array:', currentSpots);
        return;
    }

    console.log('displaing');
    displayAdminParkingSpots(currentGarage.num_rows, currentGarage.num_cols, currentSpots, clickCallback);
    // updateCurrentFloorInfo();
    // renderParkingSpots();
}

window.onload = async () => {
    adminData.garages = await fetchGarages();

    for (const garage of adminData.garages) {
        const spots = await fetchSpots(garage.garage_id);
        const groupedSpots = groupParkingSpotsByFloor(spots);
        adminData.garageSpots[garage.garage_id] = groupedSpots;
    }
    adminData.currentGarage = adminData.garages[0];
    adminData.currentFloor = 1;
    renderParkingSpots(spotClickCallback);
}

const spotClickCallback = (row, col) => {
    const currentGarage = adminData.currentGarage;
    const currentSpots = adminData.garageSpots[currentGarage.garage_id] || [];

    const spotIndex = currentSpots.findIndex(spot => spot.spot_row === row && spot.spot_col === col);
    if (spotIndex !== -1) {
        currentSpots.splice(spotIndex, 1);
    } else {
        currentSpots.push({ spot_row: row, spot_col: col });
    }

    adminData.garageSpots[currentGarage.garage_id] = currentSpots;
    // displayParkingSpots(currentGarage.num_rows, currentGarage.num_cols, currentSpots, [], spotClickCallback);
}

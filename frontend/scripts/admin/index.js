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

import { updateGarageSpots } from "../api/updateGarageSpots";

import { fetchSpots } from "../api/fetchSpots";
import { fetchGarages } from "../api/fetchGarages";
import { adminData } from "./data";
import { displayAdminParkingSpots } from "../dynamic/displayParkingSpots";
import { createGarage } from "../api/createGarage";
import { displayGarageList } from "../dynamic/displayAdminGarageList";
import { groupParkingSpotsByFloor, invertSpotOccupancy } from "../misc";
import './events';
import { editorConfig } from "../globalConfig";

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
            displayAdminParkingSpots(newGarage.num_rows, newGarage.num_cols, currentSpots[1] || []);

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

            displayAdminParkingSpots(selectedGarage.num_rows, selectedGarage.num_cols, spots, []);

            garageEditorContainer.classList.remove('hidden');
            topContentContainer.classList.add('hidden');
        }
    });

    const garagesData = await fetchGarages();
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

    console.log(currentSpots);
    const spotIndex = currentSpots.findIndex(spot => spot.spot_row === row && spot.spot_col === col);
    if (spotIndex !== -1) {
        currentSpots.splice(spotIndex, 1);
    } else {
        currentSpots.push({ spot_row: row, spot_col: col });
    }

    adminData.garageSpots[currentGarage.garage_id] = currentSpots;
    // displayParkingSpots(currentGarage.num_rows, currentGarage.num_cols, currentSpots, [], spotClickCallback);
}

const floorUpBtn = document.getElementById("floor-up-btn");
const floorDownBtn = document.getElementById("floor-down-btn");

const garageEditor = document.getElementById("garage-editor");

floorUpBtn.addEventListener("click", e => {
    if (!adminData.currentGarage) {
        return;
    }
    console.log('clicked');
    if (adminData.currentFloor < adminData.currentGarage.floors) {
        adminData.currentFloor++;
        renderParkingSpots();
    }
});


floorDownBtn.addEventListener("click", e => {
    if (!adminData.currentGarage) {
        return;
    }
    if (adminData.currentFloor > 1) {
        adminData.currentFloor--;
        renderParkingSpots();
    }
})

garageEditor.addEventListener("click", (e) => {
    // Absolute position relative to the document
    const absoluteX = e.x;
    const absoluteY = e.y;

    // Calculate the relative position to the garage editor
    const rect = garageEditor.getBoundingClientRect();
    const x = absoluteX - rect.left;
    const y = absoluteY - rect.top;

    // Consistent cell width and height calculation
    const colMargin = editorConfig.colMargin;
    const rowMargin = editorConfig.rowMargin;

    const cellWidth = (garageEditor.offsetWidth - (adminData.currentGarage.num_cols - 1) * colMargin) / adminData.currentGarage.num_cols;
    const cellHeight = (garageEditor.offsetHeight - (adminData.currentGarage.num_rows - 1) * rowMargin) / adminData.currentGarage.num_rows;

    // Adjust x and y to account for margins
    const adjustedX = x - colMargin / 2;
    const adjustedY = y - rowMargin / 2;

    // Calculate the row and col the user clicked on
    const col = Math.floor(adjustedX / (cellWidth + colMargin));
    const row = Math.floor(adjustedY / (cellHeight + rowMargin));

    // Ensure the calculated row and col are within bounds
    if (row >= 0 && row < adminData.currentGarage.num_rows && col >= 0 && col < adminData.currentGarage.num_cols) {
        invertSpotOccupancy(row, col);
        renderParkingSpots();
    } else {
        console.log("Clicked outside grid bounds");
    }
});


const saveGarageBtn = document.getElementById("save-garage-btn");

// ----------------- Event listener for the save garage button -----------------
saveGarageBtn.addEventListener("click", e => {
    updateGarageSpots();

    // reload the page

    location.reload();
})
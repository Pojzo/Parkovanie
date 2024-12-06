import { createGarage } from "../api/createGarage.js";
// import { updateGarageSpots } from "../api/updateGarageSpots.js";
import { adminData } from "./data.js";
// import { editorConfig } from "../globalConfig.js";
import { updateGarageInfo } from "../dynamic/displayGarageInfo.js";
// import { displayParkingSpots } from "../dynamic/displayParkingSpots.js";
// import { invertSpotOccupancy, isSpotOccupied } from "../misc.js";

// DOM elements
const createGarageBtn = document.getElementById("create-garage-btn");




// ----------------- Event listener for the create garage button -----------------
createGarageBtn.addEventListener("click", e => {
    console.log('creating garage');
    e.preventDefault();
    createGarage();
})

const updateCurrentGarage = () => {
    updateGarageInfo(adminData.currentGarage);
    const currentSpots = adminData.garageSpots[adminData.currentGarage.garage_id][adminData.currentFloor];
    displayParkingSpots(adminData.currentGarage.num_rows, adminData.currentGarage.num_cols, currentSpots);
}

// ----------------- Event listeners for the floor up and floor down buttons -----------------



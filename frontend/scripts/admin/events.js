import { createGarage } from "../api/createGarage.js";
// import { updateGarageSpots } from "../api/updateGarageSpots.js";
// import { adminData } from "./data.js";
// import { editorConfig } from "../globalConfig.js";
// import { updateGarageInfo } from "../dynamic/displayGarageInfo.js";
// import { displayParkingSpots } from "../dynamic/displayParkingSpots.js";
// import { invertSpotOccupancy, isSpotOccupied } from "../misc.js";

// DOM elements
const createGarageBtn = document.getElementById("create-garage-btn");
const floorUpBtn = document.getElementById("floor-up-btn");
const floorDownBtn = document.getElementById("floor-down-btn");
const saveGarageBtn = document.getElementById("save-garage-btn");
const garageEditor = document.getElementById("garage-editor");


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

// floorUpBtn.addEventListener("click", e => {
//     if (!adminData.currentGarage) {
//         return;
//     }
//     if (adminData.currentFloor < adminData.currentGarage.floors) {
//         adminData.currentFloor++;
//         updateCurrentGarage();
//     }
// });


// floorDownBtn.addEventListener("click", e => {
//     if (!adminData.currentGarage) {
//         return;
//     }
//     if (adminData.currentFloor > 1) {
//         adminData.currentFloor--;
//         updateCurrentGarage();
//     }
// })


// // ----------------- Event listener for the save garage button -----------------
// saveGarageBtn.addEventListener("click", e => {
//     updateGarageSpots();
// })

// // ----------------- Event listener for the garage editor -----------------
// garageEditor.addEventListener("click", e => {
//     // Absolute position relative to the document
//     const absoluteX = e.x;
//     const absoluteY = e.y;

//     // Calculate the relative position to the garage edito 
//     const rect = garageEditor.getBoundingClientRect();
//     const x = absoluteX - rect.left;
//     const y = absoluteY - rect.top;

//     // Calculate the cell width and height
//     const cellWidth = editorConfig.editorWidth / adminData.currentGarage.num_cols;
//     const cellHeight = editorConfig.editorHeight / adminData.currentGarage.num_rows;

//     // Calculate the row and col the user clicked on
//     const col = Math.floor(x / cellWidth);
//     const row = Math.floor(y / cellHeight);

//     invertSpotOccupancy(row, col);
//     updateCurrentGarage();
// });
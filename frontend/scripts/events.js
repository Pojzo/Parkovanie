import { createGarage } from "./api/createGarage.js";
import { editorConfig, globalState } from "./config.js";
import { updateGarageInfo } from "./dynamic/displayGarageInfo.js";
import { displayParkingSpots } from "./dynamic/displayParkingSpots.js";
import { invertSpotOccupancy, isSpotOccupied } from "./misc.js";

console.log('Setting up event listeners');
const createGarageBtn = document.getElementById("create-garage-btn");
createGarageBtn.addEventListener("click", e => {
    console.log('creating garage');
    e.preventDefault();
    createGarage();
})

const updateCurrentGarage = () => {
    updateGarageInfo();
    displayParkingSpots();
}

const floorUpBtn = document.getElementById("floor-up-btn");

floorUpBtn.addEventListener("click", e => {
    if (!globalState.currentGarage) {
        return;
    }
    if (globalState.currentFloor < globalState.currentGarage.floors) {
        globalState.currentFloor++;
        updateCurrentGarage();
    }
});

const floorDownBtn = document.getElementById("floor-down-btn");

floorDownBtn.addEventListener("click", e => {
    if (!globalState.currentGarage) {
        return;
    }
    if (globalState.currentFloor > 1) {
        globalState.currentFloor--;
        updateCurrentGarage();
    }
})


const garageEditor = document.getElementById("garage-editor");
garageEditor.addEventListener("click", e => {
    // Absolute position relative to the document
    const absoluteX = e.x;
    const absoluteY = e.y;

    // Calculate the relative position to the garage edito 
    const rect = garageEditor.getBoundingClientRect();
    const x = absoluteX - rect.left;
    const y = absoluteY - rect.top;

    // Calculate the cell width and height
    const cellWidth = editorConfig.editorWidth / globalState.currentGarage.num_cols;
    const cellHeight = editorConfig.editorHeight / globalState.currentGarage.num_rows;

    // Calculate the row and col the user clicked on
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    // const spotOccupied = isSpotOccupied(row, col);
    invertSpotOccupancy(row, col);
    // console.log(spotOccupied);
    // Figure out if the space is occupied
    // console.log(x, y);
    // console.log(`User clicked on row ${row} and col ${col}`);
    updateCurrentGarage();
});
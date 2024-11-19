import { createGarage } from "./api/createGarage.js";
import { globalState } from "./config.js";
import { updateGarageInfo } from "./dynamic/displayGarageInfo.js";
import { displayParkingSpots } from "./dynamic/displayParkingSpots.js";

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
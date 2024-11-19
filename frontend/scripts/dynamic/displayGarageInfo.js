import { globalState } from '../config';

export const updateGarageInfo = () => {
    const garageData = globalState.currentGarage;
    const garageInfo = document.getElementById("garage-info");

    const name = document.getElementById("garage-name");
    name.textContent = garageData.name;

    const location = document.getElementById("garage-location");
    location.textContent = `Location: ${garageData.location}`;

    const floors = document.getElementById("garage-floors");
    floors.textContent = `Floors: ${garageData.floors}`;

    const currentFloor = document.getElementById("current-floor");
    currentFloor.textContent = `Current Floor: ${globalState.currentFloor}`;
}


export const displayGarageInfo = () => {
    const garageData = globalState.currentGarage;
    const garageInfo = document.getElementById("garage-info");
    garageInfo.id = "garage-info";

    // const garageData = globalState.currentGarage;
    const name = document.createElement("h2");
    name.textContent = garageData.name;
    name.id = "garage-name";

    const location = document.createElement("p");
    location.textContent = `Location: ${garageData.location}`;
    location.id = "garage-location";

    const floors = document.createElement("p");
    floors.textContent = `Floors: ${garageData.floors}`;
    floors.id = "garage-floors";

    const currentFloor = document.createElement("p");
    currentFloor.textContent = `Current Floor: ${globalState.currentFloor}`;
    currentFloor.id = "current-floor";

    garageInfo.appendChild(name);
    garageInfo.appendChild(location);
    garageInfo.appendChild(floors);
    garageInfo.appendChild(currentFloor);
};

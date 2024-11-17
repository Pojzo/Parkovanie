import { globalState } from '../config';


export const displayGarageInfo = (garageData) => {
    // If no garage is selected, don't display anything
    // if (!globalState.currentGarage) {
    //     return;
    // }

    const garageInfo = document.getElementById("garage-info");
    garageInfo.id = "garage-info";

    // const garageData = globalState.currentGarage;
    const name = document.createElement("h2");
    name.textContent = garageData.name;

    const location = document.createElement("p");
    location.textContent = `Location: ${garageData.location}`;

    const floors = document.createElement("p");
    floors.textContent = `Floors: ${garageData.floors}`;

    garageInfo.appendChild(name);
    garageInfo.appendChild(location);
    garageInfo.appendChild(floors);
};

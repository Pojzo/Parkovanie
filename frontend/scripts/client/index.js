//import { fetchGarages } from "../api/fetchGarages";
//import { displayGarageInfo } from "../dynamic/displayGarageInfo";
//import { displayGarageList } from "../dynamic/displayGarageList";

import { fetchSpots } from "../api/fetchSpots";
import { fetchGarages } from "../api/fetchGarages";
import { clientData } from "./data";
import { groupParkingSpotsByFloor } from "../misc";

console.log("reservation page");

//const garagesData = await fetchGarages();

//clientData.garages = garagesData;

//displayGarageList(garagesData);
//console.log("displayed");

//const displayInitialGarage = () => {
//    if (garagesData.length > 0) {
//        displayGarageInfo(garagesData[0]);
//    }
//}

//displayInitialGarage();

// const garagesData = [
//     { name: "Garáž A", availableSpots: 5, totalSpots: 22 },
//     { name: "Garáž B", availableSpots: 8, totalSpots: 30 },
//     { name: "Garáž C", availableSpots: 2, totalSpots: 18 },
// ];



window.onload = async () => {
    clientData.garages = await fetchGarages();
    for (const garage of clientData.garages) {
        const spots = await fetchSpots(garage.garage_id);
        const groupedSpots = groupParkingSpotsByFloor(spots);
        clientData.garageSpots[garage.garage_id] = groupedSpots;
    }
    renderGarageList(clientData.garages);
    console.log(clientData.garages[0]);
    console.log(clientData.garageSpots[clientData.garages[0].garage_id]);
};

const calculateAvailabeSpots = (garageId) => {
    const spots = clientData.garageSpots[garageId];
    let availableSpots = 0;
    for (const floor in spots) {
        for (const spot of spots[floor]) {
            if (!spot.occupied) {
                availableSpots++;
            }
        }
    }
    return availableSpots;
}

const calculateTotalSpots = (garageId) => {
    const spots = clientData.garageSpots[garageId];
    let totalSpots = 0;
    for (const floor in spots) {
        totalSpots += spots[floor].length;
    }
    return totalSpots;
}

function renderGarageList(garages) {
    const garageListContainer = document.getElementById("garage-list");
    garageListContainer.innerHTML = "";

    garages.forEach((garage) => {
        const availableSpots = calculateAvailabeSpots(garage.garage_id);
        const totalSpots = calculateTotalSpots(garage.garage_id);

        const colDiv = document.createElement("div");
        colDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 d-flex";

        const card = document.createElement("div");
        card.className = "card w-100";

        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src = "./res/images/garage-icon.png";
        img.alt = `${garage.name} image`;

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = garage.name;

        const capacity = document.createElement("p");
        capacity.className = "card-text";
        capacity.textContent = `Voľné miesta: ${availableSpots}/${totalSpots}`;

        cardBody.appendChild(title);
        cardBody.appendChild(capacity);
        card.appendChild(img);
        card.appendChild(cardBody);
        colDiv.appendChild(card);

        garageListContainer.appendChild(colDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const topContentContainer = document.getElementById('top-content');
    const garageListContainer = document.getElementById('garage-list');
    const garageEditorContainer = document.getElementById('garage-editor-container');
    const backButton = document.getElementById('back-btn');

    if (!garageListContainer || !garageEditorContainer || !backButton || !topContentContainer) {
        console.error('Niektorý z potrebných elementov nebol nájdený.');
        return;
    }

    garageListContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            console.log(`Kliknuté na kartu: ${card.querySelector('.card-title').textContent}`);
            garageEditorContainer.classList.remove('hidden');
            topContentContainer.classList.add('hidden');
        }
    });

    backButton.addEventListener('click', () => {
        garageEditorContainer.classList.add('hidden');
        topContentContainer.classList.remove('hidden');
    });
});


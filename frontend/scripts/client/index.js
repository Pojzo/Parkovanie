import { fetchSpots } from "../api/fetchSpots";
import { fetchGarages } from "../api/fetchGarages";
import { clientData } from "./data";
import { displayParkingSpots } from "../dynamic/displayParkingSpots";
import { groupParkingSpotsByFloor, showToast } from "../misc";
import { reserveSpot } from "../api/reserveSpot";
import { fetchMySpots } from "../api/fetchMySpots";

console.log("reservation page");

//displayInitialGarage();

// const garagesData = [
//     { name: "Garáž A", availableSpots: 5, totalSpots: 22 },
//     { name: "Garáž B", availableSpots: 8, totalSpots: 30 },
//     { name: "Garáž C", availableSpots: 2, totalSpots: 18 },
// ];

const updateFetchMySpots = async () => {
    const spots = await fetchMySpots();
    clientData.mySpots = spots;
}

const updateFetchSpots = async (garageId) => {
    const spots = await fetchSpots(garageId);
    const groupedSpots = groupParkingSpotsByFloor(spots);
    clientData.garageSpots[garageId] = groupedSpots;
}

window.onload = async () => {
    clientData.garages = await fetchGarages();
    for (const garage of clientData.garages) {
        const spots = await fetchSpots(garage.garage_id);
        const groupedSpots = groupParkingSpotsByFloor(spots);
        clientData.garageSpots[garage.garage_id] = groupedSpots;
    }
    await updateFetchMySpots();
    console.log(clientData.mySpots);
    renderGarageList(clientData.garages);
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

const renderParkingSpots = (clickCallback) => {
    const currentGarage = clientData.currentGarage;
    const currentSpots = clientData.garageSpots[currentGarage.garage_id];
    clientData.currentGarage = currentGarage;
    clientData.currentFloor = 1;
    const mySpots = clientData.mySpots;
    displayParkingSpots(currentGarage.num_rows, currentGarage.num_cols, currentSpots[1], mySpots, spotClickCallback);
}

const spotClickCallback = (spotId) => {
    if (spotId == clientData.currentSpotId) {
        clientData.currentSpotId = null;
    }
    else {
        clientData.currentSpotId = spotId;
    }

    renderParkingSpots(spotClickCallback);
}

document.addEventListener('DOMContentLoaded', () => {
    const topContentContainer = document.getElementById('top-content');
    const garageListContainer = document.getElementById('garage-list');
    const garageEditorContainer = document.getElementById('garage-editor-container');
    const backButton = document.getElementById('back-btn');
    const floorUpBtn = document.getElementById('floor-up-btn');
    const floorDownBtn = document.getElementById('floor-down-btn');
    const reserveBtn = document.getElementById('reserve-btn');

    if (!garageListContainer || !garageEditorContainer || !backButton || !topContentContainer || !floorUpBtn || !floorDownBtn || !reserveBtn) {
        console.error('Niektorý z potrebných elementov nebol nájdený.');
        return;
    }

    garageListContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            console.log(`Kliknuté na kartu: ${card.querySelector('.card-title').textContent}`);
            clientData.currentGarage = clientData.garages.find(garage => garage.name === card.querySelector('.card-title').textContent);
            garageEditorContainer.classList.remove('hidden');
            topContentContainer.classList.add('hidden');

            renderParkingSpots(spotClickCallback);
        }
    });

    backButton.addEventListener('click', () => {
        garageEditorContainer.classList.add('hidden');
        topContentContainer.classList.remove('hidden');
    });

    floorDownBtn.addEventListener('click', () => {
        if (clientData.currentFloor > 1) {
            clientData.currentFloor--;
            const currentSpots = clientData.garageSpots[clientData.currentGarage.garage_id][clientData.currentFloor];
            const mySpots = clientData.mySpots;
            displayParkingSpots(clientData.currentGarage.num_rows, clientData.currentGarage.num_cols, currentSpots, mySpots, spotClickCallback);
        }
    });

    floorUpBtn.addEventListener('click', () => {
        if (clientData.currentFloor < clientData.currentGarage.floors) {
            clientData.currentFloor++;
            const currentSpots = clientData.garageSpots[clientData.currentGarage.garage_id][clientData.currentFloor];
            const mySpots = clientData.mySpots;
            displayParkingSpots(clientData.currentGarage.num_rows, clientData.currentGarage.num_cols, currentSpots, mySpots, spotClickCallback);
        }
    });

    reserveBtn.addEventListener('click', async () => {
        if (clientData.currentSpotId === null) {
            showToast('Nie je vybrané žiadne miesto', 'info');
            return;
        }
        try {
            await reserveSpot(clientData.currentGarage.garage_id, clientData.currentSpotId);
            showToast('Miesto bolo úspešne rezervované', 'success');
            clientData.currentSpotId = null;
            await updateFetchSpots(clientData.currentGarage.garage_id);
            await updateFetchMySpots();
            renderParkingSpots();
        }
        catch (e) {
            console.error('Chyba pri rezervácii miesta');
            console.error(e);
            showToast('Nastala chyba pri rezervácii miesta', 'danger');
        }
    });
});


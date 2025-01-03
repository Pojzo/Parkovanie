import { fetchSpots } from "../api/fetchSpots";
import { fetchGarages } from "../api/fetchGarages";
import { clientData } from "./data";
import { displayAdminParkingSpots, displayParkingSpots } from "../dynamic/displayParkingSpots";
import { groupParkingSpotsByFloor, showToast } from "../misc";
import { reserveSpot } from "../api/reserveSpot";
import { fetchMySpots } from "../api/fetchMySpots";
import QRCode from 'qrcode';

const updateFetchMySpots = async () => {
    const spots = await fetchMySpots();
    clientData.mySpots = spots;
}

const updateFetchSpots = async (garageId) => {
    const spots = await fetchSpots(garageId);
    const groupedSpots = groupParkingSpotsByFloor(spots);
    clientData.garageSpots[garageId] = groupedSpots;
    updateGarageInfo(clientData.currentGarage);
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
        capacity.textContent = `Voľné miesta na tomto poschodí: ${availableSpots}/${totalSpots}`;

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
    const currentSpots = clientData.garageSpots[currentGarage.garage_id][clientData.currentFloor];
    const mySpots = clientData.mySpots;

    if (!Array.isArray(currentSpots)) {
        console.error('currentSpots is not an array:', currentSpots);
        return;
    }

    displayParkingSpots(currentGarage.num_rows, currentGarage.num_cols, currentSpots, mySpots, clickCallback);
    updateCurrentFloorInfo();

    const availableSpots = calculateAvailableSpots(currentSpots);
    updateAvailableSpotsInfo(availableSpots);
}

const calculateAvailableSpots = (spots) => {
    let availableSpots = 0;
    for (const spot of spots) {
        const leaseTillDate = new Date(spot.lease_till);
        const isOccupied = leaseTillDate > new Date();
        if (!isOccupied) {
            availableSpots++;
        }
    }
    return availableSpots;
}

const updateAvailableSpotsInfo = (availableSpots) => {
    const availableSpotsElement = document.getElementById('available-spots-info');
    const availableSpotsMobileElement = document.getElementById('available-spots-info-mobile');
    if (availableSpotsElement) {
        availableSpotsElement.textContent = `Voľné miesta: ${availableSpots}`;
    } else {
        console.error('Element with ID "available-spots-info" not found.');
    }
    if (availableSpotsMobileElement) {
        availableSpotsMobileElement.textContent = `Voľné miesta: ${availableSpots}`;
    } else {
        console.error('Element with ID "available-spots-info-mobile" not found.');
    }
}

const updateCurrentFloorInfo = () => {
    const currentFloorInfo = document.getElementById('current-floor-info');
    if (currentFloorInfo) {
        currentFloorInfo.textContent = `Current Floor: ${clientData.currentFloor}`;
    } else {
        console.error('Element with ID "current-floor-info" not found.');
    }
}

const spotClickCallback = (spotId) => {
    if (spotId == clientData.currentSpotId) {
        clientData.currentSpotId = null;
    } else {
        clientData.currentSpotId = spotId;
    }

    renderParkingSpots(spotClickCallback);
}

function updateGarageInfo(garage, availableSpots = null) {
    const garageNameElement = document.getElementById('garage-name');
    const garageAvailabilityElement = document.getElementById('garage-availability');
    const garageNameMobileElement = document.getElementById('garage-name-mobile');
    const garageAvailabilityMobileElement = document.getElementById('garage-availability-mobile');
    const availableSpotsElement = document.getElementById('available-spots-info');
    const availableSpotsMobileElement = document.getElementById('available-spots-info-mobile');

    const totalSpots = calculateTotalSpots(garage.garage_id);
    if (availableSpots === null) {
        availableSpots = calculateAvailabeSpots(garage.garage_id);
    }

    if (garageNameElement) garageNameElement.textContent = garage.name;
    if (garageAvailabilityElement) garageAvailabilityElement.textContent = `Voľné miesta: ${availableSpots}/${totalSpots}`;
    if (garageNameMobileElement) garageNameMobileElement.textContent = garage.name;
    if (garageAvailabilityMobileElement) garageAvailabilityMobileElement.textContent = `Voľné miesta: ${availableSpots}/${totalSpots}`;
    if (availableSpotsElement) availableSpotsElement.textContent = `Voľné miesta: ${availableSpots}`;
    if (availableSpotsMobileElement) availableSpotsMobileElement.textContent = `Voľné miesta: ${availableSpots}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const topContentContainer = document.getElementById('top-content');
    const garageListContainer = document.getElementById('garage-list');
    const garageEditorContainer = document.getElementById('garage-editor-container');
    const backButton = document.getElementById('back-btn');
    const floorUpBtn = document.getElementById('floor-up-btn');
    const floorDownBtn = document.getElementById('floor-down-btn');
    const reserveBtn = document.getElementById('reserve-btn');
    const payButton = document.getElementById('payButton');
    const paymentSuccess = document.getElementById('paymentSuccess');
    const qrCodeContainer = document.getElementById('qrCodeContainer');

    if (!garageListContainer || !garageEditorContainer || !backButton || !topContentContainer || !floorUpBtn || !floorDownBtn || !reserveBtn) {
        console.error('Niektorý z potrebných elementov nebol nájdený.');
        return;
    }

    garageListContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            console.log(`Kliknuté na kartu: ${card.querySelector('.card-title').textContent}`);
            clientData.currentGarage = clientData.garages.find(garage => garage.name === card.querySelector('.card-title').textContent);
            clientData.currentFloor = 1;
            garageEditorContainer.classList.remove('hidden');
            topContentContainer.classList.add('hidden');
    
            updateGarageInfo(clientData.currentGarage);
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
            renderParkingSpots(spotClickCallback);
        }
    });

    floorUpBtn.addEventListener('click', () => {
        if (clientData.currentFloor < clientData.currentGarage.floors) {
            clientData.currentFloor++;
            renderParkingSpots(spotClickCallback);
        }
    });

    reserveBtn.addEventListener('click', async () => {
        if (clientData.currentSpotId === null) {
            showToast('Nie je vybrané žiadne miesto', 'info');
            return;
        }
    
        const qrCodeData = `Payment for spot ${clientData.currentSpotId}`;
        qrCodeContainer.innerHTML = '';
        QRCode.toCanvas(document.createElement('canvas'), qrCodeData, (error, canvas) => {
            if (error) console.error(error);
            qrCodeContainer.appendChild(canvas);
        });
    
        const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
        paymentModal.show();
    });

    payButton.addEventListener('click', async () => {
        qrCodeContainer.style.display = 'none';
        paymentSuccess.style.display = 'block';
        payButton.style.display = 'none';
    
        setTimeout(async () => {
            const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
            paymentModal.hide();
    
            try {
                await reserveSpot(clientData.currentGarage.garage_id, clientData.currentSpotId);
                showToast('Miesto bolo úspešne rezervované', 'success');
                clientData.currentSpotId = null;
    
                const availableSpots = calculateAvailabeSpots(clientData.currentGarage.garage_id) - 1;
                updateGarageInfo(clientData.currentGarage, availableSpots);
    
                await updateFetchSpots(clientData.currentGarage.garage_id);
                await updateFetchMySpots();
                renderParkingSpots(spotClickCallback);
            } catch (e) {
                console.error('Chyba pri rezervácii miesta');
                console.error(e);
                showToast('Nastala chyba pri rezervácii miesta', 'danger');
            }
    
            qrCodeContainer.style.display = 'block';
            paymentSuccess.style.display = 'none';
            payButton.style.display = 'block';
        }, 3000);
    });
});
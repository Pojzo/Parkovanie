document.addEventListener('DOMContentLoaded', async () => {
    initializeData();
    clientData.garages = await fetchGarages();
    renderGarageList(clientData.garages);
});

export const clientData = {
    garages: [],
    currentGarage: null,
    currentFloor: 1,
    garageSpots: {},
    currentSpotId: null,
    mySpots: []
};

const clientIdentifier = localStorage.getItem('clientIdentifier');
if (clientIdentifier === undefined || clientIdentifier === null) {
    const newClientIdentifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('clientIdentifier', newClientIdentifier);
    clientData.clientIdentifier = newClientIdentifier;
    console.log(clientData.clientIdentifier);
}

const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const loadFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

const initializeData = () => {
    if (!loadFromLocalStorage('garages')) {
        const garages = [
            { garage_id: 1, name: 'EasyPark Trnava A1', location: 'Trnava', floors: 5, spots: 20 },
            { garage_id: 2, name: 'EasyPark Trnava B4', location: 'Trnava', floors: 5, spots: 15 },
            { garage_id: 3, name: 'EasyPark Trnava C3', location: 'Trnava', floors: 5, spots: 25 }
        ];
        saveToLocalStorage('garages', garages);
    }
    if (!loadFromLocalStorage('spots')) {
        const spots = {};
        for (let garageId = 1; garageId <= 3; garageId++) {
            spots[garageId] = {};
            for (let floor = 1; floor <= 5; floor++) {
                spots[garageId][floor] = Array.from({ length: 5 }, (_, i) => ({
                    spot_id: i + 1 + (floor - 1) * 5,
                    row: Math.floor(i / 5),
                    col: i % 5,
                    occupied: false
                }));
            }
        }
        saveToLocalStorage('spots', spots);
    }
    if (!loadFromLocalStorage('mySpots')) {
        saveToLocalStorage('mySpots', []);
    }
};

const fetchGarages = async () => {
    return loadFromLocalStorage('garages');
};

const fetchSpots = (garageId, floor) => {
    const spots = loadFromLocalStorage('spots');
    if (!spots || !spots[garageId] || !spots[garageId][floor]) {
        console.error(`Spots not found for garageId: ${garageId}, floor: ${floor}`);
        return [];
    }
    return spots[garageId][floor];
};

const fetchMySpots = async () => {
    return loadFromLocalStorage('mySpots');
};

const reserveSpot = async (garageId, spotId) => {
    const garages = loadFromLocalStorage('garages');
    const garage = garages.find(g => g.garage_id === garageId);
    if (garage) {
        garage.availableSpots -= 1;
        saveToLocalStorage('garages', garages);

        const spots = loadFromLocalStorage('spots');
        const spot = spots[garageId][clientData.currentFloor].find(s => s.spot_id === spotId);
        if (spot) {
            spot.occupied = true;
            saveToLocalStorage('spots', spots);
        }

        const mySpots = loadFromLocalStorage('mySpots');
        mySpots.push({ garage_id: garageId, spot_id: spotId });
        saveToLocalStorage('mySpots', mySpots);
    }
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
};

const renderGarageList = (garages) => {
    const garageListContainer = document.getElementById("garage-list");
    garageListContainer.innerHTML = "";

    garages.forEach((garage) => {
        const availableSpots = calculateAvailabeSpots(garage.garage_id);
        const totalSpots = garage.spots;

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
};

const renderParkingSpots = (garageId, floor) => {
    const spots = fetchSpots(garageId, floor);
    const garageEditor = document.getElementById('garage-editor');
    garageEditor.innerHTML = '';

    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(5, 1fr)';
    gridContainer.style.gap = '10px';

    spots.forEach((spot) => {
        const spotDiv = document.createElement('div');
        spotDiv.className = `spot ${spot.occupied ? 'occupied' : 'available'}`;
        spotDiv.textContent = `Spot ${spot.spot_id}`;
        spotDiv.style.border = '1px solid black';
        spotDiv.style.padding = '20px';
        spotDiv.style.textAlign = 'center';
        spotDiv.style.cursor = 'pointer';
        spotDiv.addEventListener('click', () => {
            if (!spot.occupied) {
                clientData.currentSpotId = spot.spot_id;
                document.querySelectorAll('.spot').forEach(s => s.classList.remove('selected'));
                spotDiv.classList.add('selected');
            }
        });
        gridContainer.appendChild(spotDiv);
    });

    garageEditor.appendChild(gridContainer);
};

const updateCurrentFloorInfo = () => {
    const currentFloorInfo = document.getElementById('current-floor-info');
    if (currentFloorInfo) {
        currentFloorInfo.textContent = `Current Floor: ${clientData.currentFloor}`;
    } else {
        console.error('Element with ID "current-floor-info" not found.');
    }
};

const spotClickCallback = (spotId) => {
    if (spotId == clientData.currentSpotId) {
        clientData.currentSpotId = null;
    } else {
        clientData.currentSpotId = spotId;
    }

    renderParkingSpots(clientData.currentGarage.garage_id, clientData.currentFloor);
};

document.addEventListener('DOMContentLoaded', async () => {
    initializeData();
    clientData.garages = await fetchGarages();

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

    const garages = await fetchGarages();
    renderGarageList(garages);

    garageListContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            console.log(`Kliknuté na kartu: ${card.querySelector('.card-title').textContent}`);
            clientData.currentGarage = garages.find(garage => garage.name === card.querySelector('.card-title').textContent);
            clientData.currentFloor = 1;
            garageEditorContainer.classList.remove('hidden');
            topContentContainer.classList.add('hidden');

            renderParkingSpots(clientData.currentGarage.garage_id, clientData.currentFloor);
            updateCurrentFloorInfo();
        }
    });

    backButton.addEventListener('click', () => {
        garageEditorContainer.classList.add('hidden');
        topContentContainer.classList.remove('hidden');
    });

    floorDownBtn.addEventListener('click', () => {
        if (clientData.currentFloor > 1) {
            clientData.currentFloor--;
            renderParkingSpots(clientData.currentGarage.garage_id, clientData.currentFloor);
            updateCurrentFloorInfo();
        }
    });

    floorUpBtn.addEventListener('click', () => {
        if (clientData.currentFloor < clientData.currentGarage.floors) {
            clientData.currentFloor++;
            renderParkingSpots(clientData.currentGarage.garage_id, clientData.currentFloor);
            updateCurrentFloorInfo();
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
                renderParkingSpots(clientData.currentGarage.garage_id, clientData.currentFloor);
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
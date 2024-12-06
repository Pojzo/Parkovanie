import { adminData } from "./admin/data";

export function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');

    // Create a new toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.role = 'alert';
    toast.ariaLive = 'assertive';
    toast.ariaAtomic = 'true';

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    // Append the toast to the container
    toastContainer.appendChild(toast);

    // Initialize the toast using Bootstrap's Toast API
    const bootstrapToast = new bootstrap.Toast(toast);
    bootstrapToast.show();

    // Automatically remove the toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

export const groupParkingSpotsByFloor = spots => {
    const spotByFloor = {}

    for (const spot of spots) {
        if (!spotByFloor[spot.floor_number]) {
            spotByFloor[spot.floor_number] = [];
        }

        spotByFloor[spot.floor_number].push(spot);
    }

    return spotByFloor;
}

const getCurrentSpots = () => {
    const currentFloor = adminData.currentFloor;
    return adminData.garageSpots[adminData.currentGarage.garage_id][currentFloor];
}

export const isSpotOccupied = (row, col) => {
    const currentSpots = getCurrentSpots();

    console.log(currentSpots);
    console.log(row, col);

    return currentSpots.some(spot => spot.spot_row === row && spot.spot_col === col);
}

export const popSpotAtCoords = (row, col) => {
    const index = getCurrentSpots().findIndex(spot => spot.spot_row === row && spot.spot_col === col);
    const currentSpots = getCurrentSpots();
    currentSpots.splice(index, 1);
}

export const invertSpotOccupancy = (row, col) => {
    console.log('inverting');
    console.log(row, col);
    if (isSpotOccupied(row, col)) {
        popSpotAtCoords(row, col);
        return;
    }
    const newSpot = {
        spot_row: row,
        spot_col: col,
        floor_number: adminData.currentFloor
    }
    const currentSpots = getCurrentSpots();
    currentSpots.push(newSpot);
}
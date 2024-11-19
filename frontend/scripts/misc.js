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
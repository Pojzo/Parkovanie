// Glboal state
export const clientData = {
    garages: [],
    currentGarage: null,
    currentFloor: 1,
    garageSpots: {},
    currentSpotId: null,
    mySpots: []
}

// Try to fetch clientIdentifier from localStorage
const clientIdentifier = localStorage.getItem('clientIdentifier');
if (clientIdentifier === undefined) {
    // If it's not present, generate a new one
    const newClientIdentifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('clientIdentifier', newClientIdentifier);
    clientData.clientIdentifier = newClientIdentifier;
    console.log(clientData.clientIdentifier);
}

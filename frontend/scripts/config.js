// Configuration file

const _API_HOST = "http://localhost";
const _API_PORT = "8000";

export const API_URL = `${_API_HOST}:${_API_PORT}`;


// Endpoints
export const garagesEndpoint = `${API_URL}/garages`;
export const globalState = {
    currentGarage: null
}

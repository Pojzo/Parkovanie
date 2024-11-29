import axios from "axios"
import { showToast } from "../misc";

// TODO:: This needs to be tested
// Also check the response.data.data
export const updateGarage = async (garageId, garageData) => {
    try {
        axios.patch(`http://localhost:3000/garages/${garageId}`, garageData)
        showToast('Garage updated successfully', 'success');
    }
    catch (error) {
        console.error('Error updating garage', error);
        showToast(`Failed to update garage: ${error.response.data.message}`, 'danger');
    }
}
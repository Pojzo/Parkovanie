import axios from "axios";
import { showToast } from "../misc";

// TODO:: This needs to be tested
// Also check the response.data.data
export const deleteGarage = async (garageId) => {
    try {
        axios.delete(`http://localhost:3000/garages/${garageId}`);
        showToast('Garage deleted successfully', 'success');
    }
    catch (error) {
        console.error('Error deleting garage', error);
        showToast(`Failed to delete garage: ${error.response.data.message}`, 'danger');
    }
}

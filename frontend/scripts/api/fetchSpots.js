import axios from "axios";
import { showToast } from "../misc";
import { spotsEndpoint } from "../config";

export const fetchSpots = async (garageId) => {
    try {
        const response = await axios.get(spotsEndpoint(garageId));

        return response.data.data;
    }
    catch (error) {
        console.error('Error getting garages', error);
        showToast(`Failed to fetch garages: ${error.response.data.message}`, 'danger');
    }
    console.log('getting all garages');
}

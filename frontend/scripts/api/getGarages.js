import axios from "axios";
import { showToast } from "../misc";
import { getGaragesEndpoint } from "../config";

export const getGarages = async () => {
    try {
        const response = await axios.get(getGaragesEndpoint);

        showToast('Garages fetched successfully', 'success');
        console.log(response.data.data);

        return response.data.data;
    }
    catch (error) {
        console.error('Error getting garages', error);
        showToast(`Failed to fetch garages: ${error.response.data.message}`, 'danger');
    }
    console.log('getting all garages');
}
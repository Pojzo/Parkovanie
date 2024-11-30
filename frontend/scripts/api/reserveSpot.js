import axios from "axios";
import { API_URL } from "../globalConfig";
import { showToast } from "../misc";

export const reserveSpot = async (garageId, spotId) => {
    // lease till 1 hour from now
    const leaseTill = new Date();
    leaseTill.setHours(leaseTill.getHours() + 1);
    console.log(garageId, spotId);
    try {
        const response = await axios.post(`${API_URL}/reserve`, {
            garage_id: garageId,
            spot_id: spotId,
            lease_duration_hours: 1
        })
        return true;
        showToast('Spot reserved', 'success');
    }
    catch (e) {
        showToast(e.response.data.message, 'error');
        console.error(e);
        console.error('Failed to reserve');
        throw e;
    }
}
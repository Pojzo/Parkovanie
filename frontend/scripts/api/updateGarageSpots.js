import axios from "axios";
import { adminData } from "../admin/data";
import { spotsEndpoint } from "../globalConfig";
import { showToast } from "../misc";

const _processSpots = (spots) => {
    const processedSpots = [];

    // Flatten the object into a single array of spots
    const flattenedSpots = Object.values(spots).flat();

    // Iterate over each spot and process it
    for (const spot of flattenedSpots) {
        const obj = {
            spot_row: spot.spot_row,
            spot_col: spot.spot_col,
            floor_number: spot.floor_number
        };
        processedSpots.push(obj);
    }

    return processedSpots;
};

export const updateGarageSpots = async () => {
    const garageId = adminData.currentGarage.garage_id;
    const spots = adminData.garageSpots[garageId];
    const processedSpots = _processSpots(spots);

    let url = spotsEndpoint(garageId);
    url += "?delete_existing=true";
    console.log(url);

    try {
        await axios.post(url, processedSpots);
        showToast('Garage spots updated successfully', 'success');
    }
    catch (error) {
        console.error('Error updating garage spots', error);
        showToast(`Failed to update garage spots: ${error.response.data.message}`, 'danger');
    }

    axios.post()
}
import { API_URL } from "../globalConfig";

const reserveSpot = async (garageId, spotId) => {
    // lease till 1 hour from now
    const leaseTill = new Date();
    leaseTill.setHours(leaseTill.getHours() + 1);
    try {
        const response = await axios.post(`${API_URL}/reserve`, {
            garageId,
            spotId,
            lease_till: leaseTill
        })
        console.log(response);
    }
    catch {
        console.error('Failed to reserve');
    }
}
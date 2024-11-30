import axios from "axios";
import { API_URL } from "../globalConfig";

export const fetchMySpots = async () => {
    const clientIdentifier = localStorage.getItem('clientIdentifier');
    if (!clientIdentifier) {
        return [];
    }
    const response = await axios.get(`${API_URL}/my_spots`, {
        params: {
            client_identifier: clientIdentifier
        }
    }
    );
    return response.data;
}
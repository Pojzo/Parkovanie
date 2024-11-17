import axios from "axios";
import { API_URL, createGarageEndpoint } from "../config";
import { showToast } from "../misc";

const _getGarageForm = () => {
    const formId = "create-garage-form";
    const element = document.getElementById(formId);

    if (!element) {
        return null;
    }

    // extract name, location and floors

    const name = document.getElementById("create-garage-name").value;
    const location = document.getElementById("create-garage-location").value;
    const floors = document.getElementById("create-garage-floors").value;

    return {
        name,
        location,
        floors
    }
}

export const createGarage = async () => {
    const { name, location, floors } = _getGarageForm();

    if (!name || !location || !floors) {
        alert('Please fill out all fields');
    }
    try {
        const response = await axios.post(createGarageEndpoint, {
            name,
            location,
            floors
        });
        showToast('Garage created successfully', 'success');
    }
    catch (error) {
        console.error(error);

        showToast(`Failed to create garage: ${error.response.data.message}`, 'danger');
    }
}
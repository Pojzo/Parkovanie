import axios from "axios";
import { garagesEndpoint } from "../globalConfig";
import { showToast } from "../misc";

const _getGarageForm = () => {
    const formId = "create-garage-form";
    const element = document.getElementById(formId);

    // This should never happen
    if (!element) {
        return null;
    }

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
    // Get the data from the form
    const formData = _getGarageForm();

    // Just in case
    if (!formData) {
        alert('Form not found');
        return;
    }
    const { name, location, floors } = formData;

    // Check if the form is filled out
    if (!name || !location || !floors) {
        alert('Please fill out all fields');
    }
    try {
        // Send the data to the server
        const response = await axios.post(garagesEndpoint, {
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
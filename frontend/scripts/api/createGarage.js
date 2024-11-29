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
    const num_rows = document.getElementById('create-garage-num-rows').value;
    const num_cols = document.getElementById('create-garage-num-cols').value;

    return {
        name,
        location,
        floors,
        num_rows,
        num_cols
    }
}

export const createGarage = async () => {
    // Get the data from the form
    const formData = _getGarageForm();
    console.log(formData);

    // Just in case
    if (!formData) {
        alert('Form not found');
        return;
    }
    const { name, location, floors, num_rows, num_cols } = formData;

    // Check if the form is filled out
    if (!name || !location || !floors || !num_rows || !num_cols) {
        alert('Please fill out all fields');
        return;
    }

    try {
        // Send the data to the server
        const response = await axios.post(garagesEndpoint(), {
            name,
            location,
            floors,
            num_rows,
            num_cols
        });
        showToast('Garage created successfully', 'success');
    } catch (error) {
        console.error(error);
        showToast(`Failed to create garage: ${error.response.data.message}`, 'danger');
    }
};
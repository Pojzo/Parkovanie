import { adminData } from '../admin/data';

function _addGarage(garage) {
    const container = document.getElementById('top-content');

    // Create a div for the garage
    const garageDiv = document.createElement('div');
    garageDiv.className = 'garage-item p-3 mb-2 bg-light border rounded';
    garageDiv.style.cursor = 'pointer';

    // Initial text display
    const initialText = document.createElement('span');
    initialText.textContent = garage.name;
    garageDiv.appendChild(initialText);

    const garageListContainer = document.getElementById('garage-list');

    // Create fields for name, location, and floors (hidden initially)
    const fieldsDiv = document.createElement('div');
    fieldsDiv.style.display = 'none';
    fieldsDiv.innerHTML = `
        <p><strong>Name:</strong> ${garage.name}</p>
        <p><strong>Location:</strong> ${garage.location}</p>
        <p><strong>Floors:</strong> ${garage.floors}</p>
    `;
    garageDiv.appendChild(fieldsDiv);

    garageListContainer.appendChild(garageDiv);


    // Add click event listener to toggle visibility
    garageListContainer.addEventListener('click', () => {
        if (fieldsDiv.style.display === 'none') {
            fieldsDiv.style.display = 'block';
            initialText.style.display = 'none';
        } else {
            fieldsDiv.style.display = 'none';
            initialText.style.display = 'block';
        }
    });

    // Append the garage div to the container
    container.appendChild(garageListContainer);
}

export const displayGarageList = (data) => {
    for (const garage of data) {
        _addGarage(garage);
    }
    adminData.currentGarage = data[0];
}
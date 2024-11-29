console.log("here")

const _addGarage = (garage) => {
    const garageListItemsContainer = document.getElementById('garage-list-items');

    // Construct a div with h2 name and h3 location beneath it

    const name = garage.name;
    const location = garage.location;

    const nameText = document.createElement('h3');
    nameText.textContent = name;

    const locationText = document.createElement('h6');
    locationText.textContent = location;

    const garageDiv = document.createElement('div');
    garageDiv.className = 'garage-item p-3 mb-2 bg-light border rounded';
    garageDiv.style.cursor = 'pointer';
    garageDiv.appendChild(nameText);
    garageDiv.appendChild(locationText);

    garageDiv.style.color = 'black';
    garageDiv.style.textAlign = 'center';
    garageListItemsContainer.appendChild(garageDiv);
}

export const displayGarageList = (data) => {
    for (const garage of data) {
        _addGarage(garage);
    }
    // adminData.currentGarage = data[0];
}

// function _addGarage(garage) {
//     const container = document.getElementById('top-content');

//     // Create a div for the garage
//     const garageDiv = document.createElement('div');
//     garageDiv.className = 'garage-item p-3 mb-2 bg-light border rounded';
//     garageDiv.style.cursor = 'pointer';

//     // Initial text display
//     const initialText = document.createElement('span');
//     initialText.textContent = garage.name;
//     garageDiv.appendChild(initialText);

//     const garageListContainer = document.getElementById('garage-list');

//     // Create fields for name, location, and floors (hidden initially)
//     const fieldsDiv = document.createElement('div');
//     fieldsDiv.style.display = 'none';
//     fieldsDiv.innerHTML = `
//         <p><strong>Name:</strong> ${garage.name}</p>
//         <p><strong>Location:</strong> ${garage.location}</p>
//         <p><strong>Floors:</strong> ${garage.floors}</p>
//     `;
//     garageDiv.appendChild(fieldsDiv);

//     garageListContainer.appendChild(garageDiv);


//     // Add click event listener to toggle visibility
//     garageListContainer.addEventListener('click', () => {
//         if (fieldsDiv.style.display === 'none') {
//             fieldsDiv.style.display = 'block';
//             initialText.style.display = 'none';
//         } else {
//             fieldsDiv.style.display = 'none';
//             initialText.style.display = 'block';
//         }
//     });

//     // Append the garage div to the container
//     container.appendChild(garageListContainer);
// }
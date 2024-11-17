import { getGarages } from "../api/getGarages"

console.log('dispalying garages')

function _addGarageToContainer(garage) {
    const container = document.getElementById('garages-container');
    const garageDiv = document.createElement('div');
    garageDiv.className = 'garage-item';
    garageDiv.innerHTML = `<strong>${garage.name}</strong>`;
    garageDiv.addEventListener('click', function () {
        alert(`Location: ${garage.location}\nFloors: ${garage.floors}`);
    });
    container.appendChild(garageDiv);
}
export const displayGarages = async () => {
    const data = await getGarages();
    for (const garage of data) {
        _addGarageToContainer(garage);
    }
}
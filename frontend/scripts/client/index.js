//import { fetchGarages } from "../api/fetchGarages";
//import { displayGarageInfo } from "../dynamic/displayGarageInfo";
//import { displayGarageList } from "../dynamic/displayGarageList";

console.log("reservation page");

//const garagesData = await fetchGarages();

//clientData.garages = garagesData;

//displayGarageList(garagesData);
//console.log("displayed");

//const displayInitialGarage = () => {
//    if (garagesData.length > 0) {
//        displayGarageInfo(garagesData[0]);
//    }
//}

//displayInitialGarage();

const garagesData = [
    { name: "Garáž A", availableSpots: 5, totalSpots: 22 },
    { name: "Garáž B", availableSpots: 8, totalSpots: 30 },
    { name: "Garáž C", availableSpots: 2, totalSpots: 18 },
];

window.onload = () => {
    renderGarageList(garagesData);
    console.log("Garage list container:", document.getElementById("garage-list"));
    console.log("Garage data:", garagesData);

};

function renderGarageList(garages) {
    const garageListContainer = document.getElementById("garage-list");
    garageListContainer.innerHTML = "";

    garages.forEach((garage) => {
        const colDiv = document.createElement("div");
        colDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 d-flex";

        const card = document.createElement("div");
        card.className = "card w-100";

        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src = "./res/images/garage-icon.png";
        img.alt = `${garage.name} image`;

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = garage.name;

        const capacity = document.createElement("p");
        capacity.className = "card-text";
        capacity.textContent = `Voľné miesta: ${garage.availableSpots}/${garage.totalSpots}`;

        cardBody.appendChild(title);
        cardBody.appendChild(capacity);
        card.appendChild(img);
        card.appendChild(cardBody);
        colDiv.appendChild(card);

        garageListContainer.appendChild(colDiv);
    });
}

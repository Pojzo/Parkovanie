import { createGarage } from "./api/createGarage.js";
import { displayGarages } from "./dynamic/displayGarageList.js";

console.log('Setting up event listeners');
const createGarageBtn = document.getElementById("create-garage-btn");
createGarageBtn.addEventListener("click", e => {
    console.log('creating garage');
    e.preventDefault();
    createGarage();
})

// on page load

// getGarages();
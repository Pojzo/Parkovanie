import "./events.js";
import { displayGarageList } from '../dynamic/displayAdminGarageList.js'
import { fetchGarages } from '../api/fetchGarages.js'
// import { displayGarageInfo } from '../dynamic/displayGarageInfo.js';
import { adminData } from './data.js';
// import { fetchSpots } from '../api/fetchSpots.js';
// import { groupParkingSpotsByFloor } from '../misc.js';
// import { displayParkingSpots } from '../dynamic/displayParkingSpots.js';

// // Fetch all garages
const garagesData = await fetchGarages();
console.log(garagesData);
adminData.garages = garagesData;

// Fetch spots for each garage
// for (const garage of adminData.garages) {
//     const spots = await fetchSpots(garage.garage_id);
//     const groupedSpots = groupParkingSpotsByFloor(spots);
//     adminData.garageSpots[garage.garage_id] = groupedSpots;
// }

// // Set the first garage as the current garage
adminData.currentGarage = garagesData[0];

const displayInitialGarage = () => {
    //     // displayGarageInfo(adminData.currentGarage);
    //     // const currenSpots = adminData.garageSpots[adminData.currentGarage.garage_id][adminData.currentFloor];
    //     // displayParkingSpots(adminData.currentGarage.num_rows, adminData.currentGarage.num_cols, currenSpots);
    displayGarageList(adminData.garages);
}

// console.log(adminData.garageSpots[adminData.currentGarage.garage_id]);
// console.log(adminData.currentGarage);

displayInitialGarage();
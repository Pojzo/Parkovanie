import { fetchGarages } from "../api/fetchGarages";
import { displayGarageInfo } from "../dynamic/displayGarageInfo";
import { displayGarageList } from "../dynamic/displayGarageList";

console.log("reservation page");

const garagesData = await fetchGarages();

displayGarageList(garagesData);
console.log("displayed");

const displayInitialGarage = () => {
    // displayGarageInfo();
}
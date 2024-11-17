import './events.js';
import { displayGarageList } from './dynamic/displayGarageList.js'
import { fetchGarages } from './api/fetchGarages.js'
import { displayParkingLot } from "./dynamic/displayParkingLot.js";
import { displayGarageInfo } from './dynamic/displayGarageInfo.js';

// Wait for garages to be fetched and then display them
const garagesData = await fetchGarages();
displayGarageList(garagesData);

// TODO:: For now display the first, note globalStage in config.js
displayGarageInfo(garagesData[0]);

const numRows = 5;
const numCols = 10;

const colMargin = 5;
const rowMargin = 5

displayParkingLot(numRows, numCols, colMargin, rowMargin);
import { editorConfig } from "../globalConfig";
import { clientData } from "../client/data";

const cells = []

// Current spots are spots for the current floor in the current garage :)
export const displayParkingSpots = (numRows, numCols, currentSpots, mySpots, clickCallback) => {
    console.log(mySpots);
    console.log(numRows, numCols, currentSpots);
    if (cells.length > 0) {
        for (const cell of cells) {
            cell.remove();
        }
    }
    const mask = Array(numRows).fill(0).map(() => Array(numCols).fill(0));
    const spotIds = {};

    const isSpotMySpot = (spotId) => {
        for (const spot of mySpots) {
            if (spot.garage_id === clientData.currentGarage.garage_id && spot.spot_id === spotId) {
                return true;
            }
        }
        return false;
    }

    for (const spot of currentSpots) {
        const row = spot.spot_row;
        const col = spot.spot_col;

        const leaseTillDate = new Date(spot.lease_till);
        const isOccupied = leaseTillDate > new Date();

        if (isOccupied) {
            mask[row][col] = 2;
            if (isSpotMySpot(spot.spot_id)) {
                mask[row][col] = 4;
            }
        }
        else {
            mask[row][col] = 1;
        }
        spotIds[`${row}-${col}`] = spot.spot_id;
        if (clientData.currentSpotId === spot.spot_id) {
            mask[row][col] = 3;
        }
    }

    const colMargin = editorConfig.colMargin;
    const rowMargin = editorConfig.rowMargin;

    const editorContent = document.getElementById('garage-editor');

    const mainContentWidth = editorContent.offsetWidth;
    const mainContentHeight = editorContent.offsetHeight;

    const initialOffset = colMargin / 2;
    const initialOffsetY = rowMargin / 2;

    const cellWidth = (mainContentWidth - (numCols - 1) * colMargin) / numCols;
    const cellHeight = (mainContentHeight - (numRows - 1) * rowMargin) / numRows;

    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            if (mask[j][i] === 0) {
                continue;
            }

            const spotId = spotIds[`${j}-${i}`];
            let color = mask[j][i] === 1 ? 'green' : mask[j][i] === 2 ? 'red' : 'blue';
            if (mask[j][i] === 4) {
                color = 'yellow';
            }
            const cell = document.createElement('div');
            cell.style.width = cellWidth + 'px';
            cell.style.height = cellHeight + 'px';
            cell.style.left = i * (cellWidth + colMargin) + initialOffset + 'px';
            cell.style.top = j * (cellHeight + rowMargin) + initialOffsetY + 'px';
            cell.style.position = 'absolute';
            cell.style.backgroundColor = color;
            // cell.style.border = `3px solid ${color}`;
            cell.style.borderRadius = '10px';

            editorContent.appendChild(cell);
            cell.onclick = () => {
                if (mask[j][i] === 1 || mask[j][i] === 3) {
                    clickCallback(spotId);
                }
                console.log('clicked', j, i);
            }
            cells.push(cell);
        }
    }
}

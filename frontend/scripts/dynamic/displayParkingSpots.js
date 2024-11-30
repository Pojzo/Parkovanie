import { editorConfig } from "../globalConfig";
import { clientData } from "../client/data";

const cells = []

// Current spots are spots for the current floor in the current garage :)
export const displayParkingSpots = (numRows, numCols, currentSpots, clickCallback) => {
    console.log(numRows, numCols, currentSpots);
    if (cells.length > 0) {
        for (const cell of cells) {
            cell.remove();
        }
    }
    const mask = Array(numRows).fill(0).map(() => Array(numCols).fill(0));
    const spotIds = {};

    for (const spot of currentSpots) {
        const row = spot.spot_row;
        const col = spot.spot_col;

        const leaseTillDate = new Date(spot.lease_till);
        const isOccupied = leaseTillDate > new Date();
        if (isOccupied) {
            mask[row][col] = 2;
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

    const cellWidth = (mainContentWidth - (numCols - 1) * colMargin) / numCols;
    const cellHeight = (mainContentHeight - (numRows - 1) * rowMargin) / numRows;

    console.log(mainContentWidth, cellWidth);
    console.log(mainContentHeight, cellHeight);

    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            if (mask[j][i] === 0) {
                continue;
            }

            const spotId = spotIds[`${j}-${i}`];
            const color = mask[j][i] === 1 ? 'green' : mask[j][i] === 2 ? 'red' : 'blue';
            const cell = document.createElement('div');
            cell.style.width = cellWidth + 'px';
            cell.style.height = cellHeight + 'px';
            cell.style.left = i * (cellWidth + colMargin) + 'px';
            cell.style.top = j * (cellHeight + rowMargin) + 'px';
            cell.style.position = 'absolute';
            cell.style.backgroundColor = color;
            editorContent.appendChild(cell);
            cell.onclick = () => {
                if (mask[j][i] === 1) {
                    clickCallback(spotId);
                }
                console.log('clicked', j, i);
            }
            cells.push(cell);
        }
    }
}

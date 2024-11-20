import { editorConfig, globalState } from "../config";

const cells = []


export const displayParkingSpots = () => {
    if (cells.length > 0) {
        for (const cell of cells) {
            cell.remove();
        }
    }
    const numRows = globalState.currentGarage.num_rows;
    const numCols = globalState.currentGarage.num_cols;

    const mask = Array(numRows).fill(0).map(() => Array(numCols).fill(0));

    const currentFloor = globalState.currentFloor;
    const currentSpots = globalState.garageSpots[globalState.currentGarage.garage_id][currentFloor];


    for (const spot of currentSpots) {
        const row = spot.spot_row;
        const col = spot.spot_col;

        mask[row][col] = 1;
    }

    const colMargin = editorConfig.colMargin;
    const rowMargin = editorConfig.rowMargin;

    const editorContent = document.getElementById('garage-editor');
    const mainContentWidth = editorContent.offsetWidth;
    const mainContentHeight = editorContent.offsetHeight;

    const cellWidth = (mainContentWidth - (numCols - 1) * colMargin) / numCols;
    const cellHeight = (mainContentHeight - (numRows - 1) * rowMargin) / numRows;

    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            if (mask[j][i] === 0) {
                continue;
            }

            const cell = document.createElement('div');
            cell.style.width = cellWidth + 'px';
            cell.style.height = cellHeight + 'px';
            cell.style.left = i * (cellWidth + colMargin) + 'px';
            cell.style.top = j * (cellHeight + rowMargin) + 'px';;
            cell.style.position = 'absolute';
            cell.style.backgroundColor = 'gray';
            editorContent.appendChild(cell);
            cells.push(cell);
        }
    }
}

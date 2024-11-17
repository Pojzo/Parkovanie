import { API_URL } from './config.js';

console.log(API_URL);

// const mainContent = document.getElementById('main-content');

// const mainContentWidth = mainContent.offsetWidth;
// const mainContentHeight = mainContent.offsetHeight;

// const mask = [
//     [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [0, 1, 1, 1, 1, 1, 1, 1, 1, 0]
// ];


// function generateParkingLot(numRows, numCols, colMargin, rowMargin) {
//     const cellWidth = (mainContentWidth - (numCols - 1) * colMargin) / numCols;
//     const cellHeight = (mainContentHeight - (numRows - 1) * rowMargin) / numRows;

//     const contentOffset = mainContent.getBoundingClientRect();
//     const contentTop = contentOffset.top;
//     const contentLeft = contentOffset.left;

//     for (let i = 0; i < numCols; i++) {
//         for (let j = 0; j < numRows; j++) {
//             if (mask[j][i] === 0) {
//                 continue;
//             }

//             const cell = document.createElement('div');
//             cell.style.width = cellWidth + 'px';
//             cell.style.height = cellHeight + 'px';
//             cell.style.left = i * (cellWidth + colMargin) + contentLeft + 'px';
//             cell.style.top = j * (cellHeight + rowMargin) + contentTop + 'px';
//             cell.style.position = 'absolute';
//             cell.style.backgroundColor = 'gray';
//             mainContent.appendChild(cell);
//         }
//     }
// }

// const numRows = 5;
// const numCols = 10;

// const colMargin = 5;
// const rowMargin = 5

// generateParkingLot(numRows, numCols, colMargin, rowMargin);
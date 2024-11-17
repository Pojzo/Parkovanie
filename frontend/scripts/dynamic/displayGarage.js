const mask = [
    [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0]
];

export function generateParkingLot(numRows, numCols, colMargin, rowMargin) {
    const editorContent = document.getElementById('garage-editor');
    const mainContentWidth = editorContent.offsetWidth;
    const mainContentHeight = editorContent.offsetHeight;

    const cellWidth = (mainContentWidth - (numCols - 1) * colMargin) / numCols;
    const cellHeight = (mainContentHeight - (numRows - 1) * rowMargin) / numRows;

    const contentOffset = editorContent.getBoundingClientRect();
    const contentTop = contentOffset.top;
    const contentLeft = contentOffset.left;

    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            if (mask[j][i] === 0) {
                continue;
            }

            const cell = document.createElement('div');
            cell.style.width = cellWidth + 'px';
            cell.style.height = cellHeight + 'px';
            cell.style.left = i * (cellWidth + colMargin) + contentLeft + 'px';
            cell.style.top = j * (cellHeight + rowMargin) + contentTop + 'px';
            cell.style.position = 'absolute';
            cell.style.backgroundColor = 'gray';
            editorContent.appendChild(cell);
        }
    }
}

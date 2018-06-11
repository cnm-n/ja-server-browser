'use strict';

function serversSort(arr, row) {
	if (row === 'clients') {
		arr.sort((a, b) => {
			return parseInt(b[row], 10) - parseInt(a[row], 10);
		});
	}
	else {
		arr.sort((a, b) => {
			return a[row].localeCompare(b[row]);
		});
	}
}

module.exports = serversSort;
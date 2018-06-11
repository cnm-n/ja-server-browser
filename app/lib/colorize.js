'use strict';

let colors = {
	'^0': '<font color="#000000">',
	'^1': '<font color="#ff0000">',
	'^2': '<font color="#00ff00">',
	'^3': '<font color="#ffff00">',
	'^4': '<font color="#0000ff">',
	'^5': '<font color="#00ffff">',
	'^6': '<font color="#ff00ff">',
	'^7': '<font color="#ffffff">',
	'^8': '<font color="#000000">',
	'^9': '<font color="#ff0000">',
};

function colorize(str, replace) {
	if (!str) return '';

	let first = true;
	let r = str.replace(/\^[0-9]/g, match => {
		if (replace) return '';
		if (!first) {
			return '</font>' + colors[match];
		}
		else {
			first = false;
			return colors[match];
		}
	});
	if (replace) return r;
	return r  + '</font>';
}

module.exports = colorize;
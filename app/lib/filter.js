'use strict';

class Filter {
	constructor(filters, func) {
		this.counter  = 0;
		this.filters  = filters;
		this.length   = filters.length - 1;
		this.filtrate = func;
	}

	get filter() {
		return this.filters[this.counter];
	}
	next() {
		this.counter = this.counter >= this.length ? 0 : this.counter + 1;
		return this.filters[this.counter];
	}
	prev() {
		this.counter = this.counter <= 0 ? this.length : this.counter - 1;
		return this.filters[this.counter];
	}
}

function mode(data) {
	let filter = this.filter;
	if (filter === 'All') return true;
	return data === filter;
}

function full(data) {
	if (this.filter === 'Yes') return true;
	return !data;
}

function empty(data) {
	if (this.filter === 'Yes') return true;
	return data !== '0';
}

let games =  ['All', 'base', 'japlus', 'MBII', 'Lugormod'];
let types =  ['All', 'FFA', 'DUEL', 'power duel', 'TDM', 'SIEDGE', 'CTF'];
let toggle = ['Yes', 'No'];

let filters = {
	game:  new Filter(games, mode),
	type:  new Filter(types, mode),
	full:  new Filter(toggle, full),
	empty: new Filter(toggle, empty)
};

function next(target) {
	return filters[target].next();
}

function prev(target) {
	return filters[target].prev();
}

function filtrate(data) {
	return filters.game.filtrate(data.game) &&
		   filters.type.filtrate(data.gameType) &&
		   filters.empty.filtrate(data.clients) &&
		   filters.full.filtrate(Number(data.clients) === Number(data.maxclients));
}

module.exports.next = next;
module.exports.prev = prev;
module.exports.filtrate = filtrate;
'use strict';

const parser = require('./lib/parser');

const colorize = require('./lib/colorize');
const filter   = require('./lib/filter');
const sort     = require('./lib/sort');

const filters = document.querySelector('.filters');
const modal   = document.querySelector('.modal');
const tbody   = document.querySelector('.tbody');

const modalStatus  = document.querySelector('.modal .status');
const modalRefresh = document.querySelector('.modal .refresh');

const getList = document.querySelector('.get-list');

let servers = [];

let prevSort = null;
let revers   = null;

parser.on('servers', (servers, address) => {
	parser.getInfo(servers);
});

parser.on('info', (info, address) => {
	let obj = {
		address:     address,
		hostnameClr: colorize(info.hostname),
		hostname:    colorize(info.hostname, true).trim(),
		mapname:     info.mapname,
		clients:     info.clients,
		maxclients:  info.sv_maxclients,
		gameType:    parser.gameType(info.gametype),
		game:        info.game,
		fdisable:    info.fdisable !== '0',
		wdisable:    info.wdisable !== '0',
		pass:        info.needpass === '1'
	};

	displayRow(obj, servers.push(obj) - 1);
});

getList.addEventListener('click', () => { // get new servers list
	setTimeout(() => {
		getList.style.pointerEvents = 'auto';
		getList.style.color = '#ffad00';
		getList.classList.add('hover');
	}, 1000);

	getList.style.pointerEvents = 'none';
	getList.style.color = 'grey';
	getList.classList.remove('hover');

	tbody.innerHTML = '';

	servers  = [];
	prevSort = null;
	revers   = false;

	parser.getServers(parser.master.official);
});

tbody.addEventListener('click', e => { // get server status
	let target = e.target.closest('.tr');
	if (!target) return;

	let cell = target.dataset.cell;

	modalRefresh.setAttribute('data-cell', cell);

	modalStatus.innerHTML = '';
	modal.style.display   = 'flex';

	refreshStatus(cell);
});

document.querySelector('.servers .thead').addEventListener('click', e => { // sort table
	let target = e.target.closest('.td');
	if (!target) return;

	let column = target.dataset.head;

	if (column === prevSort){
		revers = !revers;
		displayServers(servers, revers);
	}
	else {
		sort(servers, column);
		displayServers(servers, revers);
	}
	prevSort = column;
});

filters.addEventListener('click', e => { // next filter
	let target = e.target.closest('.filter');
	if (!target) return;

	target.lastElementChild.textContent = filter.next(target.dataset.filter);
	displayServers(servers, revers);
});

filters.addEventListener('contextmenu', e => { // prev filter
	let target = e.target.closest('.filter');
	if (!target) return;

	target.lastElementChild.textContent = filter.prev(target.dataset.filter);
	displayServers(servers, revers);
});

document.querySelector('.exit').addEventListener('click', () => { // exit
	window.close();
});

modal.addEventListener('mousedown', e => { // hide status
	if (e.target.className === 'modal') modal.style.display = 'none';
});

document.querySelector('.hide-status').addEventListener('click', () => { // hide status
	modal.style.display = 'none';
});

modalRefresh.addEventListener('click', () => { // refresh status
	refreshStatus();
});

function refreshStatus(cell = modalRefresh.dataset.cell) {
	let server = servers[Number(cell)];
	parser.getStatus(server.address);

	parser.once('status', (status, address) => {
		modalStatus.innerHTML = `
			<div class="tr"><div class="td key">Name</div><div class="td val">${colorize(status.sv_hostname)}</div></div>
			<div class="tr"><div class="td key">Address</div><div class="td val">${address.address + ':' + address.port}</div></div>
		`;

		delete status.sv_hostname;
		if (status.site) status.site = colorize(status.site);

		for (let key in status) {
			if (!status.hasOwnProperty(key)) return;
			let row = document.createElement('div');
			row.className = 'tr';
			row.innerHTML = `<div class="td key">${key}</div><div class="td val">${status[key]}</div>`;

			modalStatus.appendChild(row);
		}

		if (status.players.length === 0) return;

		let headRow = document.createElement('div');
		headRow.className = 'tr head';
		headRow.innerHTML = `<div class="td num">num</div><div class="td score">score</div><div class="td ping">ping</div><div class="td name">name</div>`;
		modalStatus.appendChild(headRow);

		status.players.forEach((el, i) => {
			let row = document.createElement('div');
			row.className = 'tr';
			row.innerHTML = `<div class="td num">${i}</div><div class="td score">${el.score}</div><div class="td ping">${el.ping}</div><div class="td name">${colorize(el.name)}</div>`;
			modalStatus.appendChild(row);
		});
	});
}

function displayRow(data, counter) {
	if (!filter.filtrate(data)) return;

	let elem = document.createElement('div');
	elem.className = 'tr';
	elem.dataset.cell = counter;
	elem.innerHTML =
		`<div class="td name">
			<div>${data.hostnameClr}</div>
			<div class="images">
				<div> ${pastImg(data.pass, 'needpass')} </div>
				<div> ${pastImg(data.wdisable, 'saberonly')} </div>
				<div> ${pastImg(data.fdisable, 'noforce')} </div>
			</div>
		</div>
		<div class="td map">${data.mapname}</div>
		<div class="td players">${data.clients}(${data.maxclients})</div>
		<div class="td type">${data.gameType}</div>`;

	tbody.appendChild(elem);
}

function displayServers(data, revers = false) {
	tbody.innerHTML = '';

	if (!revers) {
		for (let i = 0; i < data.length; i++) {
			displayRow(data[i], i);
		}
	}
	else {
		for (let i = data.length - 1; i >= 0; i--){
			displayRow(data[i], i);
		}
	}
}

function pastImg(bool, img) {
	return bool ? `<img title="${img}" src="./images/${img}.png">` : '';
}
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
const {ipcMain, getCurrentWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');

const _obs_switchNetworks = new BehaviorSubject(0);

export class IpcService {
	static networkSwitched() {
		return _obs_switchNetworks.asObservable();
	};
}

ipcRenderer.on('testNet', (e, arg) => {
	_obs_switchNetworks.next(arg);
	// ipcRenderer.send('networkSelected', false);
})

// ipcRenderer.on('mainNet', (e, arg) => {
// 	_obs_switchNetworks.next(arg);
// 	ipcRenderer.send('networkSelected', true);
// })
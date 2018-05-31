import { BehaviorSubject } from 'rxjs/BehaviorSubject';
const {ipcRenderer} = window.require('electron');

const _obs_switchNetworks = new BehaviorSubject(0);

export default class IpcService {
	static networkSwitched() {
		return _obs_switchNetworks.asObservable();
	};
}

ipcRenderer.on('testNet', function(e, arg) {
	_obs_switchNetworks.next(arg);
	ipcRenderer.send('networkSelected', arg);
})
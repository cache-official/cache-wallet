import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Actions} from '../services/actions';
const {ipcRenderer} = window.require('electron');

const _obs_switchNetworks = new BehaviorSubject(0);
const _obs_addressCopied = new BehaviorSubject('');
const _obs_userLoggedIn = new BehaviorSubject(false);

export default class IpcService {
	static networkSwitched() {
		return _obs_switchNetworks.asObservable();
	};
	static addressCopied() {
		return _obs_addressCopied.asObservable();
	}
	static userLoggedIn() {
	    return _obs_userLoggedIn.asObservable();
    }
}

Actions.obs_userLoggedIn().subscribe(function(status) {
	if (undefined === status) { return }
	ipcRenderer.send('loggedIn', status);
});

Actions.obs_userAddress().subscribe(function(address) {
	if (undefined === address) { return }
	ipcRenderer.send('currentAddress', address)
});

ipcRenderer.on('copyAddress', function(e, arg) {
    let dummy = document.createElement('input');
    document.body.appendChild(dummy);
    let addressInput = document.getElementById("copyAddress");
    let address = addressInput.innerText;
    let formattedAddress = address.replace(/-/g, "").toUpperCase();
    dummy.setAttribute('value', formattedAddress);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
})

ipcRenderer.on('testNet', function(e, arg) {
	_obs_switchNetworks.next(arg);
	ipcRenderer.send('networkSelected', arg);
})
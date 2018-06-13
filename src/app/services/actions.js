import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const loginUser = new BehaviorSubject(undefined);
const currentAddress = new BehaviorSubject(undefined);

export class Actions {

    static obs_userLoggedIn() {
        return loginUser.asObservable();
    }

    static setLoginStatus(loggedInStatus) {
        loginUser.next(loggedInStatus);
    }

    static obs_userAddress() {
        return currentAddress.asObservable();
    }

    static setCurrentAddress(address) {
        return currentAddress.next(address);
    }
}
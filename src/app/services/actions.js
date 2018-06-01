import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const loginUser = new BehaviorSubject(undefined);

export class Actions {

    static obs_userLoggedIn() {
        return loginUser.asObservable();
    }

    static setLoginStatus(loggedInStatus) {
        loginUser.next(loggedInStatus);
    }
}
import {IpcService} from '../services/ipc-service';

let defaultNet = 104

IpcService.networkSwitched().subscribe((net) => {
    if (!net) { return }
    defaultNet = net
});

const AppConstants = {
    //Application name
    appName: 'CacheWallet',

    version: '1.0.0',

    //Network
    defaultNetwork: defaultNet,

    // Ports
    defaultNisPort: 7890,
    defaultMijinPort: 7895,
    defaultWebsocketPort: 7778,

    // Activate/Deactivate mainnet
    mainnetDisabled: false,

    // Activate/Deactivate mijin
    mijinDisabled: true
};

export default AppConstants;

function AccountsExplorerConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.accountsExplorer', {
            url: '/explorer/accounts',
            controller: 'AccountsExplorerCtrl',
            controllerAs: '$ctrl',
            templateUrl: 'modules/explorer/accounts/accountsExplorer.html',
            title: 'Explorer - Accounts',
            params: {
			    address: ""
			 }
        });

};

export default AccountsExplorerConfig;
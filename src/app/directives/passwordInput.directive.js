import nem from "nem-sdk";

function PasswordInput(Wallet) {
    'ngInject';

    return {
        restrict:'E',
        scope: {
        	common: '='
        },
        template: '<ng-include src="templatePasswordInput"/>',
        link: (scope) => {
            scope.Wallet = Wallet;
        	scope.templatePasswordInput = 'layout/partials/passwordInput.html';
        }

    };
}

export default PasswordInput;
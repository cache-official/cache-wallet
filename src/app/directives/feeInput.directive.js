import nem from "nem-sdk";

function FeeInput() {
    'ngInject';

    return {
        restrict:'E',
        scope: {
        	tx: '=',
            isMultisig: '='
        },
        template: '<ng-include src="templateFeeInput"/>',
        link: (scope) => {
        	scope.templateFeeInput = 'layout/partials/feeInput.html';
        }

    };
}

export default FeeInput;
class ShapeshiftCtrl {

	/**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor(Wallet) {
        'ngInject';

        //// Module dependencies region ////

        this._Wallet = Wallet;

        //// End dependencies region ////

        // Open the ShapeShift widget in a new window
        let child = window.open("https://shapeshift.io/shifty.html?destination=" + this._Wallet.currentAccount.address + "&output=XEM&apiKey=cba4b2911aea0b94af00270748d38fc0dc045773970d1a2239521f2d952ecc109679d89fa1edbe6e1440395e7e41cf02c7647886df830d25bfd26b9c97dc884f&amount=",'1418115287605','width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=0,left=0,top=0,noopener=1');
    	child.opener = null;
    }

}

export default ShapeshiftCtrl;
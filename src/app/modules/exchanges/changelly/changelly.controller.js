class ChangellyCtrl {

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

        // Open the Changelly widget in a new window
        let child = window.open("https://changelly.com/widget/v1?auth=merchant&from=BTC&to=XEM&merchant_id=9bad2685d41a&address="+ this._Wallet.currentAccount.address +"&amount=1&ref_id=9bad2685d41a&color=454545",'1418115287605','width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=0,left=0,top=0,noopener=1'); 
        child.opener = null;
    }

}

export default ChangellyCtrl;

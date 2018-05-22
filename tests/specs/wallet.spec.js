import WalletFixture from '../data/wallet';
import nem from 'nem-sdk';


describe('Wallet service tests', function() {
    let Wallet, AppConstants, $localStorage;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject(function(_Wallet_, _AppConstants_, _$localStorage_) {
        Wallet = _Wallet_;
        AppConstants = _AppConstants_;
        $localStorage = _$localStorage_;
        $localStorage.$reset();
    }));

    it("Default properties initialized", function() {
        // Assert
        expect(Wallet.current).toBeUndefined();
        expect(Wallet.currentAccount).toBeUndefined();
        expect(Wallet.algo).toBeUndefined();
        expect(Wallet.node).toBeUndefined();
        expect(Wallet.nodes).toBeUndefined();
        expect(Wallet.searchNode).toBeUndefined();
        expect(Wallet.chainLink).toBeUndefined();
        expect(Wallet.harvestingNode).toBeUndefined();
        expect(Wallet.ntyData).toBeUndefined();
        expect(Wallet.contacts).toBeUndefined();
    });

    it("Can set a wallet", function() {
        // Arrange
        let wallet = WalletFixture.mainnetWallet;

        // Act
        Wallet.use(wallet);

        // Assert
        expect(Wallet.current).toEqual(wallet);
        expect(Wallet.currentAccount).toEqual(wallet.accounts[0]);
        expect(Wallet.algo).toEqual(wallet.accounts[0].algo);
        expect(Wallet.network).toEqual(wallet.accounts[0].network);
        expect(Wallet.contacts).toEqual([]);
    });

    describe('Set a wallet edge-cases', function() {

        it("Can't set a wallet if no wallet", function() {
            // Arrange
            let wallet = "";

            // Act
            Wallet.use(wallet);

            // Assert
            expect(Wallet.current).toBe(undefined);
            expect(Wallet.currentAccount).toBe(undefined);
            expect(Wallet.algo).toBe(undefined);
            expect(Wallet.network).toBe(AppConstants.defaultNetwork);
        });

    });

    it("Can set a wallet at index", function() {
        // Arrange
        let wallet = WalletFixture.mainnetWalletDoubleAccounts;
        Wallet.use(wallet);
        let index = 1;

        // Act
        Wallet.useAccount(wallet, index);

        // Assert
        expect(Wallet.currentAccount).toEqual(wallet.accounts[index]);
        expect(Wallet.algo).toEqual(wallet.accounts[0].algo);
        expect(Wallet.network).toEqual(wallet.accounts[0].network);
    });

    describe('Set a wallet account edge-cases', function() {

        it("Can't set a wallet account if no current wallet", function() {
            // Arrange
            let wallet = WalletFixture.mainnetWalletDoubleAccounts;
            let index = 1;

            // Act
            Wallet.useAccount(wallet, index);

            // Assert
            expect(Wallet.current).toBe(undefined);
            expect(Wallet.currentAccount).toBe(undefined);
            expect(Wallet.algo).toBe(undefined);
            expect(Wallet.network).toBe(AppConstants.defaultNetwork);
        });

        it("Can't set a wallet account if no selected wallet", function() {
            // Arrange
            let wallet = WalletFixture.mainnetWalletDoubleAccounts;
            Wallet.use(wallet);
            let index = 1;
            let selectedWallet = "";

            // Act
            Wallet.useAccount(selectedWallet, index);

            // Assert
            expect(Wallet.current).toEqual(wallet);
            expect(Wallet.currentAccount).toEqual(wallet.accounts[0]);
            expect(Wallet.algo).toEqual(wallet.accounts[0].algo);
            expect(Wallet.network).toBe(wallet.accounts[0].network);
        });

        it("Can't set a wallet account if index is out of bounds", function() {
            // Arrange
            let wallet = WalletFixture.mainnetWalletDoubleAccounts;
            Wallet.use(wallet);
            let index = 2;

            // Act
            Wallet.useAccount(wallet, index);

            // Assert
            expect(Wallet.current).toEqual(wallet);
            expect(Wallet.currentAccount).toEqual(wallet.accounts[0]);
            expect(Wallet.algo).toEqual(wallet.accounts[0].algo);
            expect(Wallet.network).toBe(wallet.accounts[0].network);
        });

    });
});
import WalletFixture from '../data/wallet';
import AccountDataFixture from '../data/accountData';
import nem from 'nem-sdk';

describe('Mosaic supply change transaction module tests', function() {
    let $controller, $rootScope, Wallet, DataStore, Nodes;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject(function(_$controller_, _$rootScope_, _Wallet_, _DataStore_, _Nodes_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        Wallet = _Wallet_;
        DataStore = _DataStore_;
        Nodes = _Nodes_;
    }));

    function createDummyWalletContextTestnet(Wallet) {
        Wallet.use(WalletFixture.testnetWallet);
        Nodes.setDefault();

        DataStore.account.metaData = AccountDataFixture.testnetAccountData;
        DataStore.namespace.ownedBy = AccountDataFixture.testnetNamespaceOwned;
        DataStore.mosaic.ownedBy =  AccountDataFixture.testnetMosaicOwned;
        DataStore.mosaic.metaData = AccountDataFixture.testnetMosaicDefinitionMetaDataPair;
        DataStore.chain.height = 999999999;
    }

    function createDummyWalletContextMainnet(Wallet) {
        Wallet.use(WalletFixture.mainnetWallet);
        Nodes.setDefault();

        DataStore.account.metaData = AccountDataFixture.mainnetAccountData;
        DataStore.namespace.ownedBy = AccountDataFixture.mainnetNamespaceOwned;
        DataStore.mosaic.ownedBy = AccountDataFixture.mainnetMosaicOwned;
        DataStore.mosaic.metaData = AccountDataFixture.mainnetMosaicDefinitionMetaDataPair;
        DataStore.chain.height = 999999999;
    }

    it("Can update current account mosaics", function() {
        // Arrange
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('EditMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.updateCurrentAccountMosaics();

        // Assert
        expect(ctrl.mosaicOwned).toEqual(ctrl._DataStore.mosaic.ownedBy[ctrl._Wallet.currentAccount.address]);
        expect(ctrl.currentAccountMosaicNames).toEqual(['nano:points', 'nem:xem']);
        expect(ctrl.selectedMosaic).toEqual('nem:xem');
    });

    it("Default properties initialized (after updateCurrentAccountMosaics)", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('EditMosaicCtrl', {
            $scope: scope
        });

        // Assert
        expect(ctrl.formData).toEqual({
            mosaic: '',
            supplyType: 1,
            delta: 0,
            isMultisig: false,
            multisigAccount: {
                "address": "TBUSUKWVVPS7LZO4AF6VABQHY2FI4IIMCJGIVX3X",
                "harvestedBlocks": 0,
                "balance": 16000000,
                "importance": 0,
                "vestedBalance": 0,
                "publicKey": "671ca866718ed174a21e593fc1e250837c03935bc79e2daad3bd018c444d78a7",
                "label": null,
                "multisigInfo": {
                    "cosignatoriesCount": 1,
                    "minCosignatories": 1
                }
            }
        });
        expect(ctrl.mosaicOwned).toEqual(ctrl._DataStore.mosaic.ownedBy[ctrl._Wallet.currentAccount.address]);
        expect(ctrl.currentAccountMosaicNames).toEqual(['nano:points', 'nem:xem']);
        expect(ctrl.selectedMosaic).toEqual('nem:xem');
        expect(ctrl.okPressed).toBe(false);
        expect(ctrl.common).toEqual(nem.model.objects.get("common"));
    });

    it("Has right fee on testnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('EditMosaicCtrl', {
            $scope: scope
        });

        // Act
        scope.$digest();

        // Assert
        expect(ctrl.preparedTransaction.fee).toBe(nem.model.fees.namespaceAndMosaicCommon);
    });

    it("Has right fee on mainnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextMainnet(Wallet);
        let ctrl = $controller('EditMosaicCtrl', {
            $scope: scope
        });

        // Act
        scope.$digest();

        // Assert
        expect(ctrl.preparedTransaction.fee).toBe(nem.model.fees.namespaceAndMosaicCommon);
    });

    it("Can update transaction fee if multisig", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('EditMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.isMultisig = true;
        ctrl.prepareTransaction();
        scope.$digest();

        // Assert
        expect(ctrl.preparedTransaction.fee).toBe(nem.model.fees.multisigTransaction);
        expect(ctrl.preparedTransaction.otherTrans.fee).toBe(nem.model.fees.namespaceAndMosaicCommon);
    });

    it("Can set right mosaics owned if multisig enabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('EditMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.isMultisig = true;
        ctrl.updateCurrentAccountMosaics();
        scope.$digest();

        // Assert
        expect(ctrl.mosaicOwned).toEqual(ctrl._DataStore.mosaic.ownedBy[ctrl.formData.multisigAccount.address]);
    });

    it("Can set mosaics owned if multisig enabled then disabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('EditMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.isMultisig = true;
        ctrl.updateCurrentAccountMosaics();
        scope.$digest();
        expect(ctrl.mosaicOwned).toEqual(ctrl._DataStore.mosaic.ownedBy[ctrl.formData.multisigAccount.address]);
        ctrl.formData.isMultisig = false;
        ctrl.updateCurrentAccountMosaics();
        scope.$digest();

        // Assert
        expect(ctrl.mosaicOwned).toEqual(ctrl._DataStore.mosaic.ownedBy[ctrl._Wallet.currentAccount.address]);
    });

    it("Can update multisig account mosaics if multisig enabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('EditMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.isMultisig = true;
        ctrl.updateCurrentAccountMosaics();
        scope.$digest();

        // Assert
        expect(ctrl.currentAccountMosaicNames).toEqual(['nem:xem']);
        expect(ctrl.selectedMosaic).toEqual('nem:xem');
    });

    it("Can update account mosaics if multisig enabled then disabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('EditMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.isMultisig = true;
        ctrl.updateCurrentAccountMosaics();
        scope.$digest();
        ctrl.formData.isMultisig = false;
        ctrl.updateCurrentAccountMosaics();
        scope.$digest();

        // Assert
        expect(ctrl.currentAccountMosaicNames).toEqual(['nano:points', 'nem:xem']);
        expect(ctrl.selectedMosaic).toEqual('nem:xem');
    });

    it("Can set selected mosaic as mosaic to change", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('EditMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.selectedMosaic = 'nano:points';
        ctrl.updateMosaic();
        scope.$digest();

        // Assert
        expect(ctrl.formData.mosaic).toEqual({
            "namespaceId": "nano",
            "name": "points"
        });
    });

    it("Can change supply type to delete", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('EditMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.supplyType = 2;
        scope.$digest();

        // Assert
        expect(ctrl.formData).toEqual({
            mosaic: '',
            supplyType: 2,
            delta: 0,
            isMultisig: false,
            multisigAccount: {
                "address": "TBUSUKWVVPS7LZO4AF6VABQHY2FI4IIMCJGIVX3X",
                "harvestedBlocks": 0,
                "balance": 16000000,
                "importance": 0,
                "vestedBalance": 0,
                "publicKey": "671ca866718ed174a21e593fc1e250837c03935bc79e2daad3bd018c444d78a7",
                "label": null,
                "multisigInfo": {
                    "cosignatoriesCount": 1,
                    "minCosignatories": 1
                }
            }
        });
    });

    it("Can change supply type to create after delete", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('EditMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.supplyType = 2;
        scope.$digest();
        ctrl.formData.supplyType = 1;
        scope.$digest();

        // Assert
        expect(ctrl.formData).toEqual({
            mosaic: '',
            supplyType: 1,
            delta: 0,
            isMultisig: false,
            multisigAccount: {
                "address": "TBUSUKWVVPS7LZO4AF6VABQHY2FI4IIMCJGIVX3X",
                "harvestedBlocks": 0,
                "balance": 16000000,
                "importance": 0,
                "vestedBalance": 0,
                "publicKey": "671ca866718ed174a21e593fc1e250837c03935bc79e2daad3bd018c444d78a7",
                "label": null,
                "multisigInfo": {
                    "cosignatoriesCount": 1,
                    "minCosignatories": 1
                }
            }
        });
    });

});
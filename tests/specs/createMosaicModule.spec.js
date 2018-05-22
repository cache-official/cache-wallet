import WalletFixture from '../data/wallet';
import AccountDataFixture from '../data/accountData';
import nem from 'nem-sdk';

describe('Mosaic definition transaction module tests', function() {
    let $controller, $rootScope, Wallet, DataStore, $filter, Nodes;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject(function(_$filter_, _$controller_, _$rootScope_, _Wallet_, _DataStore_, _Nodes_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        Wallet = _Wallet_;
        DataStore = _DataStore_;
        $filter = _$filter_;
        Nodes = _Nodes_;
    }));

    function createDummyWalletContextTestnet(Wallet) {
        Wallet.use(WalletFixture.testnetWallet);
        Nodes.setDefault();

        DataStore.account.metaData = AccountDataFixture.testnetAccountData;
        DataStore.namespace.ownedBy = AccountDataFixture.testnetNamespaceOwned;
        DataStore.mosaic.ownedBy = AccountDataFixture.testnetMosaicOwned;
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

    it("Can update current account mosaics and namespaces", function() {
        // Arrange
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.updateCurrentAccountNSM();

        // Assert
        expect(ctrl.currentAccountMosaicNames).toEqual(['nano:points', 'nem:xem']);
        expect(ctrl.mosaicOwned).toEqual(ctrl._DataStore.mosaic.ownedBy[ctrl._Wallet.currentAccount.address]);
        expect(ctrl.selectedMosaic).toEqual('nem:xem');
        expect(ctrl.formData.namespaceParent).toEqual({
            owner: 'TAF7BPDV22HCFNRJEWOGLRKBYQF65GBOLQPI5GGO',
            fqn: 'nano',
            height: 547741
        });
    });

    it("Default properties initialized (after updateCurrentAccountNSM)", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Assert
        expect(ctrl.formData).toEqual({
            mosaicFeeSink: nem.model.sinks.mosaic[Wallet.network],
            mosaicName: '',
            namespaceParent: {
                owner: 'TAF7BPDV22HCFNRJEWOGLRKBYQF65GBOLQPI5GGO',
                fqn: 'nano',
                height: 547741
            },
            mosaicDescription: '',
            properties: {
                'initialSupply': 0,
                'divisibility': 0,
                'transferable': true,
                'supplyMutable': true
            },
            levy: {
                'mosaic': null,
                'address': Wallet.currentAccount.address,
                'feeType': 1,
                'fee': 5
            },
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
        expect(ctrl.currentAccountMosaicNames).toEqual(['nano:points', 'nem:xem']);
        expect(ctrl.mosaicOwned).toEqual(ctrl._DataStore.mosaic.ownedBy[ctrl._Wallet.currentAccount.address]);
        expect(ctrl.selectedMosaic).toEqual('nem:xem');
        expect(ctrl.hasLevy).toBe(false);
        expect(ctrl.okPressed).toBe(false);
        expect(ctrl.common).toEqual(nem.model.objects.get("common"));
    });

    it("Has right sink on testnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        scope.$digest();

        // Assert
        expect(ctrl.formData.mosaicFeeSink).toEqual("TBMOSA-ICOD4F-54EE5C-DMR23C-CBGOAM-2XSJBR-5OLC");
    });

    it("Has right sink on mainnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextMainnet(Wallet)
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        scope.$digest();

        // Assert
        expect(ctrl.formData.mosaicFeeSink).toEqual("NBMOSA-ICOD4F-54EE5C-DMR23C-CBGOAM-2XSIUX-6TRS");
    });

    it("Has right rentalFee on testnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        scope.$digest();

        // Assert
        expect(ctrl.preparedTransaction.creationFee).toBe(nem.model.fees.mosaicDefinitionTransaction);
    });

    it("Has right rentalFee on mainnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextMainnet(Wallet);
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        scope.$digest();

        // Assert
        expect(ctrl.preparedTransaction.creationFee).toBe(nem.model.fees.mosaicDefinitionTransaction);
    });

    it("Has right fee on testnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('CreateMosaicCtrl', {
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
        let ctrl = $controller('CreateMosaicCtrl', {
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
        let ctrl = $controller('CreateMosaicCtrl', {
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

    it("Can update transaction fee if multisig enabled then disabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.isMultisig = true;
        ctrl.prepareTransaction();
        scope.$digest();
        ctrl.formData.isMultisig = false;
        ctrl.prepareTransaction();
        scope.$digest();

        // Assert
        expect(ctrl.preparedTransaction.fee).toBe(nem.model.fees.namespaceAndMosaicCommon);
    });

    it("Can lowercase mosaic name", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });
        ctrl.formData.mosaicName = "AwEsOmE";
        ctrl.processMosaicName();

        // Act
        scope.$digest();

        // Assert
        expect(ctrl.formData.mosaicName).toEqual('awesome');
    });

    it("Can set default mosaic levy if levy enabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.updateLevyMosaic(true);
        scope.$digest();

        // Assert
        expect(ctrl.formData.levy.mosaic).toEqual({
            "namespaceId": "nem",
            "name": "xem"
        });
    });

    it("Can set mosaic levy to null if levy enabled then disabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.updateLevyMosaic(true);
        ctrl.updateLevyMosaic(false);
        scope.$digest();

        // Assert
        expect(ctrl.formData.levy.mosaic).toBe(null);
    });

    it("Can set selected mosaic as levy mosaic", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.selectedMosaic = 'nano:points';
        ctrl.updateLevyMosaic(true);
        scope.$digest();

        // Assert
        expect(ctrl.formData.levy.mosaic).toEqual({
            "namespaceId": "nano",
            "name": "points"
        });
    });

    it("Can change levy fee type to percentile", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.selectedMosaic = 'nano:points';
        ctrl.updateLevyMosaic(true);
        ctrl.formData.levy.feeType = 2;
        scope.$digest();

        // Assert
        expect(ctrl.formData.levy.feeType).toBe(2);
    });

    it("Can change levy fee type to percentile then absolute", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.selectedMosaic = 'nano:points';
        ctrl.updateLevyMosaic(true);
        ctrl.formData.levy.feeType = 2;
        scope.$digest();
        ctrl.formData.levy.feeType = 1;

        // Assert
        expect(ctrl.formData.levy.feeType).toBe(1);
    });

    it("Set right mosaics owned if multisig enabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.isMultisig = true;
        ctrl.updateCurrentAccountNSM();
        scope.$digest();

        // Assert
        expect(ctrl.mosaicOwned).toEqual(ctrl._DataStore.mosaic.ownedBy[ctrl.formData.multisigAccount.address]);
    });

    it("Set right mosaics owned if multisig enabled then disabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.isMultisig = true;
        ctrl.updateCurrentAccountNSM();
        scope.$digest();
        expect(ctrl.mosaicOwned).toEqual(ctrl._DataStore.mosaic.ownedBy[ctrl.formData.multisigAccount.address]);
        ctrl.formData.isMultisig = false;
        ctrl.updateCurrentAccountNSM();
        scope.$digest();

        // Assert
        expect(ctrl.mosaicOwned).toEqual(ctrl._DataStore.mosaic.ownedBy[ctrl._Wallet.currentAccount.address]);
    });

    it("Set right current account mosaic names and selected mosaic if multisig enabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.isMultisig = true;
        scope.$digest();
        ctrl.updateCurrentAccountNSM();

        // Assert
        expect(ctrl.currentAccountMosaicNames).toEqual(['nem:xem']);
        expect(ctrl.selectedMosaic).toEqual('nem:xem');
    });

    it("Set right current account mosaic names and selected mosaic if multisig enabled then disabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.isMultisig = true;
        scope.$digest();
        ctrl.updateCurrentAccountNSM();
        ctrl.formData.isMultisig = false;
        scope.$digest();
        ctrl.updateCurrentAccountNSM();

        // Assert
        expect(ctrl.currentAccountMosaicNames).toEqual(['nano:points', 'nem:xem']);
        expect(ctrl.selectedMosaic).toEqual('nem:xem');
    });

    it("Can disable transferable mode", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.properties.transferable = false;
        scope.$digest();

        // Assert
        expect(ctrl.formData.properties.transferable).toBe(false);
    });

    it("Can disable mutable supply", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('CreateMosaicCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.properties.supplyMutable = false;
        scope.$digest();

        // Assert
        expect(ctrl.formData.properties.supplyMutable).toBe(false);
    });

});
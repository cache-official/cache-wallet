import WalletFixture from '../data/wallet';
import AccountDataFixture from '../data/accountData';
import nem from 'nem-sdk';

describe('Provision namespace transaction module tests', function() {
    let $controller, $rootScope, Wallet, DataStore, $filter, Nodes;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject(function(_$controller_, _$rootScope_, _Wallet_, _DataStore_, _$filter_, _Nodes_) {
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
        DataStore.chain.height = 999999999;
    }

    function createDummyWalletContextMainnet(Wallet) {
        Wallet.use(WalletFixture.mainnetWallet);
        Nodes.setDefault();

        DataStore.account.metaData = AccountDataFixture.mainnetAccountData;
        DataStore.namespace.ownedBy = AccountDataFixture.mainnetNamespaceOwned;
        DataStore.chain.height = 999999999;
    }

    it("Default properties initialized", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });
        scope.$digest();
        // Assert
        expect(ctrl.formData).toEqual({
            rentalFeeSink: nem.model.sinks.namespace[Wallet.network],
            namespaceName: '',
            namespaceParent: { owner: 'TAF7BPDV22HCFNRJEWOGLRKBYQF65GBOLQPI5GGO', fqn: 'nano', height: 547741 },
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
        expect(ctrl.okPressed).toBe(false);
        expect(ctrl.common).toEqual(nem.model.objects.get("common"));
    });

    it("Has right transaction fee on testnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });

        // Act
        ctrl.prepareTransaction();
        scope.$digest();

        // Assert
        expect(ctrl.preparedTransaction.fee).toBe(nem.model.fees.namespaceAndMosaicCommon);
    });

    it("Has right transaction fee on mainnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextMainnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });

        // Act
        ctrl.prepareTransaction();
        scope.$digest();

        // Assert
        expect(ctrl.preparedTransaction.fee).toBe(nem.model.fees.namespaceAndMosaicCommon);
    });

    it("Has right transaction fee if multisig on testnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
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

    it("Has right rental fee for root namespaces on testnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.namespaceParent = null;
        ctrl.prepareTransaction();
        scope.$digest();

        // Assert
        expect(ctrl.preparedTransaction.rentalFee).toBe(nem.model.fees.rootProvisionNamespaceTransaction);
    });

    it("Has right rental fee for root namespaces on mainnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextMainnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.namespaceParent = null;
        ctrl.prepareTransaction();
        scope.$digest();

        // Assert
        expect(ctrl.preparedTransaction.rentalFee).toBe(nem.model.fees.rootProvisionNamespaceTransaction);
    });

    it("Has right rental fee for sub namespaces on testnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.namespaceParent = 'nano';
        ctrl.prepareTransaction();
        scope.$digest();

        // Assert
        expect(ctrl.preparedTransaction.rentalFee).toBe(nem.model.fees.subProvisionNamespaceTransaction);
    });

    it("Has right rental fee for sub namespaces on mainnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextMainnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.namespaceParent = 'nano';
        ctrl.prepareTransaction();
        scope.$digest();

        // Assert
        expect(ctrl.preparedTransaction.rentalFee).toBe(nem.model.fees.subProvisionNamespaceTransaction);
    });

    it("Has right sink on testnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });

        // Act
        scope.$digest();

        // Assert
        expect(ctrl.formData.rentalFeeSink).toEqual("TAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTDJE-YP35");
    });

    it("Has right sink on mainnet", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextMainnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });

        // Act
        scope.$digest();

        // Assert
        expect(ctrl.formData.rentalFeeSink).toEqual("NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA");
    });

    it("Can detect < level 3 namespaces", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet);
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });
        ctrl.namespaceOwned["nano.test.third"] = {
            "owner": "TAF7BPDV22HCFNRJEWOGLRKBYQF65GBOLQPI5GGO",
            "fqn": "nano.test.third",
            "height": 547741
        }
        let NSarray = $filter('objValues')(ctrl.namespaceOwned);

        // Act & Assert
        expect(ctrl.isNotLevel3(NSarray[0])).toBe(true);
        expect(ctrl.isNotLevel3(NSarray[1])).toBe(false);
        delete ctrl.namespaceOwned["nano.test.third"];
    });

    it("Set right namespaces if multisig enabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.isMultisig = true;
        ctrl.updateCurrentAccountNS();
        scope.$digest();

        // Assert
        expect(ctrl.namespaceOwned).toEqual({});
    });

    it("Set right namespaces if multisig enabled then disabled", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });

        // Act
        ctrl.formData.isMultisig = true;
        ctrl.updateCurrentAccountNS();
        scope.$digest();
        expect(ctrl.namespaceOwned).toEqual({});
        ctrl.formData.isMultisig = false;
        ctrl.updateCurrentAccountNS();
        scope.$digest();

        // Assert
        expect(ctrl.namespaceOwned).toEqual({
            "nano": {
                "owner": "TAF7BPDV22HCFNRJEWOGLRKBYQF65GBOLQPI5GGO",
                "fqn": "nano",
                "height": 547741
            }
        });
    });

    it("Can build correct root provision namespace transaction", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });
        scope.$digest();

        // Act
        ctrl.formData.namespaceParent = '';
        ctrl.formData.namespaceName = 'nano';
        let entity = ctrl.prepareTransaction();
        scope.$digest();

        // Assert
        expect(entity).toEqual({
            "type": 8193,
            "version": -1744830463,
            "signer": "462ee976890916e54fa825d26bdd0235f5eb5b6a143c199ab0ae5ee9328e08ce",
            "timeStamp": entity.timeStamp,
            "deadline": entity.deadline,
            "rentalFeeSink": "TAMESPACEWH4MKFMBCVFERDPOOP4FK7MTDJEYP35",
            "rentalFee": nem.model.fees.rootProvisionNamespaceTransaction,
            "parent": null,
            "newPart": "nano",
            "fee": nem.model.fees.namespaceAndMosaicCommon
        });
    });

    it("Can build correct multisig root provision namespace transaction", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });
        scope.$digest();

        // Act
        ctrl.formData.isMultisig = true;
        ctrl.updateCurrentAccountNS();
        scope.$digest();
        ctrl.formData.namespaceParent = '';
        ctrl.formData.namespaceName = 'nano';
        let entity = ctrl.prepareTransaction();
        scope.$digest();

        // Assert
        expect(entity).toEqual({
            "type": 4100,
            "version": -1744830463,
            "signer": "462ee976890916e54fa825d26bdd0235f5eb5b6a143c199ab0ae5ee9328e08ce",
            "timeStamp": entity.timeStamp,
            "deadline": entity.deadline,
            "fee": nem.model.fees.multisigTransaction,
            "otherTrans": {
                "type": 8193,
                "version": -1744830463,
                "signer": "671ca866718ed174a21e593fc1e250837c03935bc79e2daad3bd018c444d78a7",
                "timeStamp": entity.otherTrans.timeStamp,
                "deadline": entity.otherTrans.deadline,
                "rentalFeeSink": "TAMESPACEWH4MKFMBCVFERDPOOP4FK7MTDJEYP35",
                "rentalFee": nem.model.fees.rootProvisionNamespaceTransaction,
                "parent": null,
                "newPart": "nano",
                "fee": nem.model.fees.namespaceAndMosaicCommon
            }
        });
    });

    it("Can build correct sub provision namespace transaction", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });
        scope.$digest();

        // Act
        ctrl.formData.namespaceParent = { "fqn": "nano", "height": 547741 };
        ctrl.formData.namespaceName = 'fiat';
        let entity = ctrl.prepareTransaction();
        scope.$digest();

        // Assert
        expect(entity).toEqual({
            "type": 8193,
            "version": -1744830463,
            "signer": "462ee976890916e54fa825d26bdd0235f5eb5b6a143c199ab0ae5ee9328e08ce",
            "timeStamp": entity.timeStamp,
            "deadline": entity.deadline,
            "rentalFeeSink": "TAMESPACEWH4MKFMBCVFERDPOOP4FK7MTDJEYP35",
            "rentalFee": nem.model.fees.subProvisionNamespaceTransaction,
            "parent": "nano",
            "newPart": "fiat",
            "fee": nem.model.fees.namespaceAndMosaicCommon
        });
    });

    it("Can build correct multisig sub provision namespace transaction", function() {
        // Arrange:
        let scope = $rootScope.$new();
        createDummyWalletContextTestnet(Wallet)
        let ctrl = $controller('NamespacesCtrl', {
            $scope: scope
        });
        scope.$digest();

        // Act
        ctrl.formData.isMultisig = true;
        ctrl.updateCurrentAccountNS();
        scope.$digest();
        ctrl.formData.namespaceParent = { "fqn": "nano", "height": 547741 };
        ctrl.formData.namespaceName = 'fiat';
        let entity = ctrl.prepareTransaction();
        scope.$digest();

        // Assert
        expect(entity).toEqual({
            "type": 4100,
            "version": -1744830463,
            "signer": "462ee976890916e54fa825d26bdd0235f5eb5b6a143c199ab0ae5ee9328e08ce",
            "timeStamp": entity.timeStamp,
            "deadline": entity.deadline,
            "fee": nem.model.fees.multisigTransaction,
            "otherTrans": {
                "type": 8193,
                "version": -1744830463,
                "signer": "671ca866718ed174a21e593fc1e250837c03935bc79e2daad3bd018c444d78a7",
                "timeStamp": entity.otherTrans.timeStamp,
                "deadline": entity.otherTrans.deadline,
                "rentalFeeSink": "TAMESPACEWH4MKFMBCVFERDPOOP4FK7MTDJEYP35",
                "rentalFee": nem.model.fees.subProvisionNamespaceTransaction,
                "parent": "nano",
                "newPart": "fiat",
                "fee": nem.model.fees.namespaceAndMosaicCommon
            }
        });
    });
});
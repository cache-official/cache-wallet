let testnetWallet = {
    "privateKey": "",
    "name": "TestnetSpec",
    "accounts": {
        "0": {
            "brain": true,
            "algo": "pass:bip32",
            "encrypted": "c6dcbc8a538c9e2ec9e9be115aa6a1349d1a8a27e574136b4e603f0549474053e026e0771bf8d86a392fccce5b543d0b",
            "iv": "4c637775236d5a3698c973b9ba67459e",
            "address": "TAF7BPDV22HCFNRJEWOGLRKBYQF65GBOLQPI5GGO",
            "network": -104,
            "child": "e6683b4b03722d0a049a9a21861d90c48e843f421d6ccb587f809d41a4af14c5"
        }
    }
}

let mainnetWallet = {
    "privateKey": "",
    "name": "QM",
    "accounts": {
        "0": {
            "brain": true,
            "algo": "pass:6k",
            "encrypted": "",
            "iv": "",
            "address": "NCTIKLMIWKRZC3TRKD5JYZUQHV76LGS3TTSUIXM6",
            "network": 104,
            "child": "NCC7KUVPQYBTPBABABR5D724CJAOMIA2RJERW3N7"
        }
    }
}

let mainnetWalletDoubleAccounts = {
    "privateKey": "",
    "name": "Quantum_Mechanics",
    "accounts": {
        "0": {
            "brain": true,
            "algo": "pass:6k",
            "encrypted": "",
            "iv": "",
            "address": "NCTIKLMIWKRZC3TRKD5JYZUQHV76LGS3TTSUIXM6",
            "network": 104,
            "child": "NCC7KUVPQYBTPBABABR5D724CJAOMIA2RJERW3N7"
        },
        "1": {
            "encrypted": "",
            "iv": "",
            "address": "NCTIKLMIWKRZC3TRKD5JYZUQHV76LGS3TTSUIWRE",
            "child": "NCC7KUVPQYBTPBABABR5D724CJAOMIA2RJERFRTO"
                    }
                }
            }

module.exports = {
    testnetWallet,
    mainnetWallet,
    mainnetWalletDoubleAccounts
}
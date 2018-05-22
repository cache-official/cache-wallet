import nem from 'nem-sdk';

/**
* Convert a public key to NEM address
*
* @param input: The account public key
* @param networkId: The current network id
*
* @return a clean NEM address
*/
let fmtPubToAddress = function() {
    return function fmtPubToAddress(input, networkId) {
        return nem.utils.format.pubToAddress(input, networkId);
    };
}

/**
* Add hyphens to a clean address
*
* @param input: A NEM address
*
* @return a formatted NEM address
*/
let fmtAddress = function() {
    return function fmtAddress(input) {
        return nem.utils.format.address(input);
    };
}

/**
* Format a timestamp to NEM date
*
* @param data: A timestamp
*
* @return a date string
*/
let fmtNemDate = function() {
    return function fmtNemDate(data) {
        return nem.utils.format.nemDate(data);
    };
}

let fmtSupply = function() {
    return function fmtSupply(data, mosaicId, mosaics) {
        return nem.utils.format.supply(data, mosaicId, mosaics);
    };
}

let fmtSupplyRaw = function() {
    return function fmtSupplyRaw(data, _divisibility) {
        return nem.utils.format.supplyRaw(data, _divisibility);
    };
}

let fmtLevyFee = ['fmtSupplyFilter', function(fmtSupplyFilter) {
    return function fmtLevyFee(mosaic, multiplier, levy, mosaics) {
        return nem.utils.format.levyFee(mosaic, multiplier, levy, mosaics)
    }
}];

/**
* Format a NEM importance score
*
* @param data: The importance score
*
* @return a formatted importance score at 10^-4
*/
let fmtNemImportanceScore = function() {
    return function fmtNemImportanceScore(data) {
        return nem.utils.format.nemImportanceScore(data);
    };
}

/**
* Format a value to NEM value
*
* @return array with values before and after decimal point
*/
let fmtNemValue = function() {
    return function fmtNemValue(data) {
        return nem.utils.format.nemValue(data);
    };
}

/**
* Give name of an importance transfer mode
*
* @return an importance transfer mode name
*/
let fmtImportanceTransferMode = function() {
    return function fmtImportanceTransferMode(data) {
        return nem.utils.format.importanceTransferMode(data);
    };
}

/**
* Convert hex to utf8
*
* @param data: Hex data
*
* @return result: utf8 string
*/
let fmtHexToUtf8 = function() {
    return function fmtHexToUtf8(data) {
        return nem.utils.format.hexToUtf8(data);
    };
}

let fmtHexMessage = ['fmtHexToUtf8Filter', function(fmtHexToUtf8Filter) {
    return function fmtHexMessage(data) {
        return nem.utils.format.hexMessage(data);
    };
}];

/**
* Split hex string into 64 characters segments
*
* @param data: An hex string
*
* @return a segmented hex string
*/
let fmtSplitHex = function() {
    return function fmtSplitHex(data) {
        return nem.utils.format.splitHex(data);
    };
}

/**
* Build array of objects from object of objects
*
* @param data: An object of objects
*
* @return an array of objects
*/
let objValues = function() {
    return function objValues(data) {
        if (data === undefined) return data;
        return Object.keys(data).map(function(key) {
            return data[key];
        });
    };
}

/**
* Parse url to get only ip or domain
*
* @param uri: The uri to parse
*
* @return uri hostname
*/
let toHostname = function() {
    return function(uri) {
        let _uriParser = document.createElement('a');
        _uriParser.href = uri;
        return _uriParser.hostname;
    }
}

/**
* Helper for pagination
*
* @param input: An array
* @param start: Index where to start showing the array
*
* @return the part of the array
*/
let startFrom = function() {
    return function(input, start) {
        if (!input || !input.length) {
            return;
        }
        start = +start; //parse to int
        return input.slice(start);
    }
}

/**
* Reverse order of an array
*
* @param items: An array
*
* @return the reversed array
*/
let reverse = function() {
    return function(items) {
        if (items === undefined) {
            return ;
        } else {
            return items.slice().reverse();
        }
    };
}

let htmlSafe = function($sce) {
    console.log($sce);
    return function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
}

/**
* Get network name from id
*
* @param id: The network id
*
* @return the network name
*/
let toNetworkName = function() {
    return function(id) {
        if (id === nem.model.network.data.testnet.id) {
            return 'Testnet';
        } else if (id === nem.model.network.data.mainnet.id) {
            return 'Mainnet';
        } else {
            return 'Mijin';
        }
    }
}

/**
* Set a value to common currency format
*
* @param number: The number to format
*
* @return number with following format: 0.00
*/
let currencyFormat = function() {
    return function(number) {
        if(undefined === number) {
            number = 0;
            return number.toFixed(2);
        }
        return parseFloat(number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
}

/**
* Set a value to btc format
*
* @param number: The number to format
*
* @return number with following format: 0.00000000 
*/
let btcFormat = function() {
    return function(number) {
        if(undefined === number) {
            number = 0;
            return number.toFixed(8);
        }
        return number.toFixed(8);
    }
}


/**
* Get a contact label by address
*
* @param {string} address - An address
* @param {object} wallet - A wallet object
*
* @return {string} - The contact label or address if not found
*/
let fmtContact = ["AddressBook", function(AddressBook) {
    return function(address, wallet) {
        if(undefined !== wallet && undefined !== address) {
            let contact = AddressBook.getContact(wallet, address);
            if(!contact) {
                return address;
            } else {
                return contact;
            }
        } else {
            return address;
        }
    }
}];


/**
* Convert nodes array into an array of endpoints
*
* @param {array} data - An array of nodes
*
* @return {array} - An array of endpoints
*/
let toEndpoint = function() {
    return function toEndpoint(data, network) {
        if (data === undefined) return data;
        let array = [];
        for (let i = 0; i < data.length; i++) {
            let host;
            let port;
            if (undefined !== data[i].uri) {
                host = data[i].uri;
                port = network === nem.model.network.data.mijin.id ? nem.model.nodes.mijinPort : nem.model.nodes.defaultPort;
            } else if (undefined !== data[i].ip) {
                host = "http://" + data[i].ip;
                port = data[i].nisPort;
            } else if (undefined !== data[i].host) {
                host = data[i].host;
                port = data[i].port;
            }

            array.push(nem.model.objects.create("endpoint")(host, port));
        }
        return array;
    }
}

module.exports = {
    toNetworkName,
    htmlSafe,
    reverse,
    startFrom,
    objValues,
    toHostname,
    fmtSplitHex,
    fmtHexMessage,
    fmtHexToUtf8,
    fmtImportanceTransferMode,
    fmtNemValue,
    fmtNemImportanceScore,
    fmtLevyFee,
    fmtSupplyRaw,
    fmtSupply,
    fmtNemDate,
    fmtPubToAddress,
    fmtAddress,
    currencyFormat,
    btcFormat,
    fmtContact,
    toEndpoint
}
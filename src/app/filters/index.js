import angular from 'angular';

let filtersModule = angular.module('app.filters', []);

import Filters from './filters';

filtersModule.filter('fmtAddress', Filters.fmtAddress);
filtersModule.filter('fmtPubToAddress', Filters.fmtPubToAddress);
filtersModule.filter('fmtNemDate', Filters.fmtNemDate);
filtersModule.filter('fmtSupply', Filters.fmtSupply);
filtersModule.filter('fmtSupplyRaw', Filters.fmtSupplyRaw);
filtersModule.filter('fmtLevyFee', Filters.fmtLevyFee);
filtersModule.filter('fmtNemImportanceScore', Filters.fmtNemImportanceScore);
filtersModule.filter('fmtNemValue', Filters.fmtNemValue);
filtersModule.filter('fmtImportanceTransferMode', Filters.fmtImportanceTransferMode);
filtersModule.filter('fmtHexToUtf8', Filters.fmtHexToUtf8);
filtersModule.filter('fmtHexMessage', Filters.fmtHexMessage);
filtersModule.filter('fmtSplitHex', Filters.fmtSplitHex);
filtersModule.filter('objValues', Filters.objValues);
filtersModule.filter('startFrom', Filters.startFrom);
filtersModule.filter('startFromUnc', Filters.startFromUnc);
filtersModule.filter('reverse', Filters.reverse);
filtersModule.filter('htmlSafe', Filters.htmlSafe);
filtersModule.filter('toNetworkName', Filters.toNetworkName);
filtersModule.filter('toHostname', Filters.toHostname);
filtersModule.filter('currencyFormat', Filters.currencyFormat);
filtersModule.filter('btcFormat', Filters.btcFormat);
filtersModule.filter('fmtContact', Filters.fmtContact);
filtersModule.filter('toEndpoint', Filters.toEndpoint);

export default filtersModule;

import angular from 'angular';

// Create the module where our functionality can attach to
let directivesModule = angular.module('app.directives', []);

// Set read-wallet-files directive
import ReadWalletFiles from './readWalletFiles.directive';
directivesModule.directive('readWalletFiles', ReadWalletFiles);

// Set show-authed directive
import ShowAuthed from './show-authed.directive';
directivesModule.directive('showAuthed', ShowAuthed);

// Set tag-transaction directive
import TagTransaction from './tagTransaction.directive';
directivesModule.directive('tagTransaction', TagTransaction);

// Set tag-levy directive
import TagLevy from './tagLevy.directive';
directivesModule.directive('tagLevy', TagLevy);

// Set read-wallet-files directive
import ImportApostilleFiles from './importApostilleFiles.directive';
directivesModule.directive('importApostilleFiles', ImportApostilleFiles);

// Set import-nty-file directive
import ImportNtyFile from './importNtyFile.directive';
directivesModule.directive('importNtyFile', ImportNtyFile);

// Set import-address-book-file directive
import ImportAddressBookFile from './importAddressBookFile.directive';
directivesModule.directive('importAddressBookFile', ImportAddressBookFile);

// Set paginate directive
import Paginate from './paginate.directive';
directivesModule.directive('paginate', Paginate);

// Set fee-input directive
import FeeInput from './feeInput.directive';
directivesModule.directive('feeInput', FeeInput);

// Set password-input directive
import PasswordInput from './passwordInput.directive';
directivesModule.directive('passwordInput', PasswordInput);

// Set decode-message directive
import DecodeMessage from './decodeMessage.directive';
directivesModule.directive('decodeMessage', DecodeMessage);

// Set sign-transaction directive
import SignTransaction from './signTransaction.directive';
directivesModule.directive('signTransaction', SignTransaction);

export default directivesModule;
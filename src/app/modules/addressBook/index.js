import angular from 'angular';

// Create the module where our functionality can attach to
let addressBookModule = angular.module('app.addressBook', []);

// Include our UI-Router config settings
import AddressBookConfig from './addressBook.config';
addressBookModule.config(AddressBookConfig);

// Controllers
import AddressBookCtrl from './addressBook.controller';
addressBookModule.controller('AddressBookCtrl', AddressBookCtrl);

export default addressBookModule;

import angular from 'angular';

// Create the module where our functionality can attach to
let faqModule = angular.module('app.faq', []);

// Include our UI-Router config settings
import FAQConfig from './faq.config';
faqModule.config(FAQConfig);

// Controllers
import FAQCtrl from './faq.controller';
faqModule.controller('FAQCtrl', FAQCtrl);

export default faqModule;

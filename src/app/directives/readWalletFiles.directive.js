import helpers from '../utils/helpers';

function ReadWalletFiles($parse, Alert) {
    'ngInject'
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            let fn = $parse(attrs.readWalletFiles);
            let isNCC = false;

            element.on('change', function(onChangeEvent) {

                for (let i = 0; i < (onChangeEvent.srcElement || onChangeEvent.target).files.length; i++) {
                    let reader = new FileReader();
                    reader.onload = (function(file) {
                        return function(onLoadEvent) {
                            scope.$apply(function() {
                                fn(scope, {
                                    $fileContent: onLoadEvent.target.result,
                                    $isNCC: isNCC
                                });
                            });
                        };
                    })((onChangeEvent.srcElement || onChangeEvent.target).files[i]);

                    if (helpers.getExtension((onChangeEvent.srcElement || onChangeEvent.target).files[i].name) == "wlt") {
                        console.log("Loading wallet");
                        isNCC = false;
                        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[i]);
                    } else if(helpers.getExtension((onChangeEvent.srcElement || onChangeEvent.target).files[i].name) == "json") {
                        console.log("Loading NCC wallet");
                        isNCC = true;
                        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[i]);
                    } else {
                        console.log("Invalid wallet format");
                        scope.$apply(function() {
                            Alert.invalidWalletFile();
                        });
                    }
                }
            });
        }
    }
}

export default ReadWalletFiles;
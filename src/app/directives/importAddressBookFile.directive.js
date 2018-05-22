import helpers from '../utils/helpers';

function importAddressBookFile($parse, Alert) {
    'ngInject'
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.importAddressBookFile);

            element.on('change', function(onChangeEvent) {

                for (var i = 0; i < (onChangeEvent.srcElement || onChangeEvent.target).files.length; i++) {
                    var reader = new FileReader();
                    reader.onload = (function(file) {
                        return function(onLoadEvent) {
                            scope.$apply(function() {
                                fn(scope, {
                                    $fileContent: onLoadEvent.target.result
                                });
                            });
                        };
                    })((onChangeEvent.srcElement || onChangeEvent.target).files[i]);

                    if (helpers.getExtension((onChangeEvent.srcElement || onChangeEvent.target).files[i].name) == "adb") {
                        console.log("Loading file");
                        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[i]);
                    } else {
                        console.log("Invalid file format");
                        scope.$apply(function() {
                            Alert.invalidAddressBookFile();
                        });
                    }
                }
            });
        }
    }
}

export default importAddressBookFile;
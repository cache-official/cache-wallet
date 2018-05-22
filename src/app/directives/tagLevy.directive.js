import nem from 'nem-sdk';

function TagLevy(AppConstants) {
    'ngInject';
    return {
        restrict: 'E',
        scope: {
            mos: '=',
            tx: '=',
            mosaics: '='
        },
        template: '',
        transclude: true,
        compile: function(tElement, tAttrs, transclude) {
            return function postLink(scope, element, attrs) {

                function getLevy(d) {
                    if (!scope.mosaics) return undefined;
                    let mosaicName = nem.utils.format.mosaicIdToName(d.mosaicId);
                    if (!(mosaicName in scope.mosaics)) {
                        return undefined;
                    }
                    let mosaicDefinitionMetaDataPair = scope.mosaics[mosaicName];
                    return mosaicDefinitionMetaDataPair.mosaicDefinition.levy;
                }
                scope.levy = getLevy(scope.mos);

                let foo = scope;
                scope.$watch('mosaics', function(nv, ov) {
                    scope.levy = getLevy(scope.mos);
                }, true);

                transclude(scope, function(clone, scope) {
                    element.append(clone);
                });
            };
        }
    }

}

export default TagLevy;
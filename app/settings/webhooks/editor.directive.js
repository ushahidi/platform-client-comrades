module.exports = [
    '$translate',
    '$location',
    '$routeParams',
    '$route',
    'WebhookEndpoint',
    'Notify',
function (
    $translate,
    $location,
    $routeParams,
    $route,
    WebhookEndpoint,
    Notify
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.whereToNext = 'settings/webhooks';

            WebhookEndpoint.getFresh({id: $routeParams.id}).$promise.then(function (webhook) {
                $scope.webhook = webhook;

                $scope.title = $scope.webhook.id ? 'webhook.edit_webhook' : 'webhook.add_webhook';

                $translate($scope.title).then(function (title) {
                    $scope.title = title;
                    $scope.$emit('setPageTitle', title);
                });
            });

            $scope.cancel = function () {
                $location.path($scope.whereToNext);
            };

            $scope.saveWebhook = function (webhook) {
                $scope.saving = true;
                webhook.name = webhook.name ? webhook.name : webhook.display_name;

                WebhookEndpoint.saveCache(webhook).$promise.then(function (result) {
                    Notify.notify('notify.webhook.save_success', {webhook: webhook.display_name});
                    $location.path($scope.whereToNext);
                }, function (errorResponse) { // error
                    Notify.apiErrors(errorResponse);
                });
                $scope.saving = false;
            };

            var handleResponseErrors = function (errorResponse) {
                Notify.apiErrors(errorResponse);
            };

            $scope.deleteWebhook = function (webhook) {

                Notify.confirmDelete('notify.webhook.delete_question', {
                    webhook: webhook.display_name
                }).then(function () {
                    WebhookEndpoint.delete({ id: webhook.id }).$promise.then(function () {
                        Notify.notify('notify.webhook.destroy_success', {
                            webhook: webhook.display_name
                        });
                        $location.path($scope.whereToNext);
                    }, handleResponseErrors);
                });
            };
        }
    };
}];

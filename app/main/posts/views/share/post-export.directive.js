module.exports = PostExportDirective;

PostExportDirective.$inject = [];
function PostExportDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        controller: PostExportController,
        template: require('./post-export.html')
    };
}

PostExportController.$inject = [
    '$scope',
    '$translate',
    'PostEndpoint',
    'ConfigEndpoint',
    'Notify',
    '$q',
    'PostFilters',
    '_',
    '$window',
    '$location',
    '$timeout'
];
function PostExportController(
    $scope,
    $translate,
    PostEndpoint,
    ConfigEndpoint,
    Notify,
    $q,
    PostFilters,
    _,
    $window,
    $location,
    $timeout
) {
    $scope.loading = false;
    $scope.getQuery = getQuery;
    $scope.prepareExport = prepareExport;
    $scope.showCSVResults = showCSVResults;
    $scope.requestExport = requestExport;
    $scope.loadingStatus = loadingStatus;

    $scope.exportPostsConfirmation = function () {
        /**
         * Trigger confirm notification for user.
         * When the user accepts, get the CSV
         */
        Notify.confirm('notify.post.export').then(function (message) {
            prepareExport();
        });
    };
    function prepareExport() {
        loadingStatus(true);
        var site = ConfigEndpoint.get({ id: 'site' }).$promise;
        var query = getQuery();
        var exportQuery = PostEndpoint.export(query);
        requestExport(site, query, exportQuery);
    }

    function requestExport(site, query, exportQuery) {
        $q.all([site, exportQuery]).then(function (response) {
            showCSVResults(response, query.format);
        }, function (err) {
            loadingStatus(false, err);
        });
    }

    function loadingStatus(status, err) {
        $scope.loading = status;
        if (err) {
            Notify.apiErrors(err);
        } else {
            if (status === true) {
                Notify.notifyProgress('<p translate="notify.export.in_progress"></p>');
            } else {
                Notify.notify('<h3 translate="notify.export.complete">Your CSV export is complete.</h3><p translate="notify.export.complete_data_found_message">The data from your export can be found in your browser\'s downloads<p>');
            }
        }
    }

    function getQuery() {
        /**
         * If the filters are not available, apply the defaults
         */
        if (!$scope.filters || _.isEmpty($scope.filters)) {
            $scope.filters = PostFilters.getDefaults();
        }
        var format = 'csv';  //@todo handle more formats
        // Prepare filters for export
        var query = angular.extend({}, PostFilters.getQueryParams($scope.filters), {
            format: format
        });
        return query;
    }

    function showCSVResults(response, format) {
        // Save export data to file
        var filename = response[0].name + '-' + (new Date()).toISOString().substring(0, 10) + '.' + format,
            data = response[1].data;

        handleArrayBuffer(filename, data, 'csv');

        $scope.loadingStatus(false);
        return filename;
    }

    function handleArrayBuffer(filename, data, type) {
        /**
         * If we have the HTML5 Api for File available we use that. If not, a Blob
         */
        function createCSVFile() {
            if (_.isFunction(File)) {
                return new File([data], filename, { type: type });
            } else {
                return new Blob([data], { type: type });
            }
        }
        var blob = createCSVFile();
        if (!_.isUndefined($window.navigator.msSaveBlob)) {
            /** IE specific workaround for "HTML7007"
             * https://stackoverflow.com/questions/20310688/blob-download-not-working-in-ie
            **/
            $window.navigator.msSaveBlob(blob, filename);
        } else {
            var URL = $window.URL || $window.webkitURL;
            var downloadUrl = URL.createObjectURL(blob);
            if (filename) {
                // use HTML5 a[download] attribute to specify filename
                // Create anchor link
                var anchor = angular.element('<a/>');
                anchor.attr({
                    href: downloadUrl,
                    download: filename
                });
                angular.element(document.body).append(anchor);
                anchor[0].click();
                anchor[0].remove();
            } else {
                $location.url(downloadUrl);
            }

            $timeout(function () {
                URL.revokeObjectURL(downloadUrl);
            }, 100); // cleanup

        }
    }
}

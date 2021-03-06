(function(){
    angular.module('RDash')
    .factory('apiManager', ApiManager);

    
    var BASE_API = '/api/v1/'; // 'http://captain.captain.x/'; 
    var TOKEN_HEADER = 'x-captain-auth';
    var NAMESPACE = 'x-namespace';
    var CAPTAIN = 'captain';
    
    function ApiManager(captainLogger, $http, $timeout) {

        var authToken = null;

        function createConfig() {
            var headers = {};
            if (authToken)
                headers[TOKEN_HEADER] = authToken;
            headers[NAMESPACE] = CAPTAIN;
    
            var config = {};
            config.headers = headers;

            // check user/appData or apiManager.uploadAppData before changing this signature.
            return config;
        }
    
        return {
            isLoggedIn: function() {
                return !!authToken;
            },
            logout: function() {
                captainLogger.log('Logging out...');
                authToken = null;
            },
            login: function(password, callback) {
                $http
                    .post(BASE_API + 'login', { password: password }, createConfig())
                    .then(
                        function(response) {
                            var data = response.data;
                            if (data.status === 100) {
                                authToken = data.token;
                            }
                            callback(data);
                        },
                        function() {
                            callback(null);
                        });
            },
            getVersionInfo: function(callback) {
                $http
                    .get(BASE_API + 'user/system/versioninfo', createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            changePassword: function (oldPass, newPass, callback) {
                $http
                    .post(BASE_API + 'user/changepassword', {
                        oldPassword: oldPass,
                        newPassword: newPass
                    }, createConfig())
                    .then(
                    function (response) {
                        authToken = null;
                        callback(response.data);
                    },
                    function () {
                        callback(null);
                    });
            },
            performUpdate: function(latestVersion, callback) {
                $http
                    .post(BASE_API + 'user/system/versioninfo', {latestVersion:latestVersion} ,createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            getNetDataInfo: function(callback) {
                $http
                    .get(BASE_API + 'user/system/netdata', createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            updateNetDataInfo: function(netDataInfo, callback) {
                $http
                    .post(BASE_API + 'user/system/netdata', {netDataInfo:netDataInfo} ,createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            getCaptainInfo: function(callback) {
                $http
                    .get(BASE_API + 'user/system/info', createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            getLoadBalancerInfo: function(callback) {
                $http
                    .get(BASE_API + 'user/system/loadbalancerinfo', createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            getAllNodes: function(callback) {
                $http
                    .get(BASE_API + 'user/system/nodes/', createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            addDockerNode: function(nodeType, privateKey, remoteNodeIpAddress,
                 remoteUserName, captainIpAddress, callback) {
                $http
                    .post(BASE_API + 'user/system/nodes/',{
                        nodeType:nodeType,
                        privateKey:privateKey,
                        remoteNodeIpAddress:remoteNodeIpAddress,
                        remoteUserName:remoteUserName,
                        captainIpAddress:captainIpAddress
                    }, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            updateRootDomain: function(rootDomain, callback) {
                $http
                    .post(BASE_API + 'user/system/changerootdomain', { rootDomain: rootDomain }, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            enablessl: function(emailAddress, callback) {
                $http
                    .post(BASE_API + 'user/system/enablessl', { emailAddress: emailAddress }, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            forceSsl: function(isEnabled, callback) {
                $http
                    .post(BASE_API + 'user/system/forcessl', { isEnabled: isEnabled }, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            ensureRegistryHasSsl: function(callback) {
                $http
                    .post(BASE_API + 'user/system/enableregistryssl', {}, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            enableDockerRegistry: function(type, domain, user, password, callback) {
                $http
                    .post(BASE_API + 'user/system/enableregistry', {
                        registryType: type,
                        registryUser: user,
                        registryPassword: password,
                        registryDomain: domain
                    }, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            getAllApps: function(callback) {
                $http
                    .get(BASE_API + 'user/appDefinitions/', createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            enableSslForBaseDomain: function(appName, callback) {
                $http
                    .post(BASE_API + 'user/appDefinitions/enablebasedomainssl', { appName: appName }, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            uploadAppData: function(file, appName, callback) {

                var headers = createConfig().headers;
                headers['Content-Type'] = undefined;

                $http({
                    method: 'POST',
                    url: BASE_API + 'user/appData/' + appName,
                    headers: headers,
                    data: {
                        sourceFile: file
                    },
                    transformRequest: function (data, headersGetter) {
                        var formData = new FormData();
                        angular.forEach(data, function (value, key) {
                            formData.append(key, value);
                        });

                        var headers = headersGetter();
                        //delete headers['Content-Type'];

                        return formData;
                    }
                })
                    .success(function (data) {
                        callback(data);
                    })
                    .error(function (serverResp, status) {
                        callback(null);
                    });
            },
            deleteApp: function(appName, callback) {
                $http
                    .post(BASE_API + 'user/appDefinitions/delete', { 
                        appName: appName
                    }, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            registerNewApp: function(appName, callback) {
                $http
                    .post(BASE_API + 'user/appDefinitions/register', { 
                        appName: appName
                    }, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            attachNewCustomDomainToApp: function(appName, newCustomDomain, callback) {
                $http
                    .post(BASE_API + 'user/appDefinitions/customdomain', { 
                        appName: appName,
                        customDomain: newCustomDomain 
                    }, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            enableSslForCustomDomain: function(appName, publicDomain, callback) {
                $http
                    .post(BASE_API + 'user/appDefinitions/enablecustomdomainssl', { 
                        appName: appName,
                        customDomain: publicDomain 
                    }, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            removeCustomDomain: function(appName, publicDomain, callback) {
                $http
                    .post(BASE_API + 'user/appDefinitions/removecustomdomain', { 
                        appName: appName,
                        customDomain: publicDomain 
                    }, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            },
            updateConfigAndSave: function(appName, instanceCount, envVars, callback) {
                $http
                    .post(BASE_API + 'user/appDefinitions/update', { 
                        appName: appName,
                        instanceCount: instanceCount,
                        envVars:envVars
                    }, createConfig())
                    .then(
                        function(response) {
                            callback(response.data);
                        },
                        function() {
                            callback(null);
                        });
            }
        };
    }

}())
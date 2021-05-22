"use strict";
class Integromat {
    constructor(APIkey) {
        this.APIkey = APIkey;
        var fetch = require('node-fetch');

        // Regular expression that extracts url params
        var urlParamsRe = /\${([^\}]+)}/g;

        // Set API's root endpoint
        var rootEndpoint = 'https://newpath.integromat.cloud/api/v2';

        // Get path, parse the url params (such as ${hookId}), return url params array
        function getUrlParams(path) {
            var urlParams = [];
            var match;

            while ((match = urlParamsRe.exec(path)) !== null) {
                urlParams.push(match[1]);
            }

            return urlParams;
        }

        // Parse the pathPattern, return a new object which includes default path, query params array, and url params array
        function parseUrl(pathPattern) {
            /*Parse pathPattern into two indexed array respect to question mark, as path and query params as below:
            * [ '/hooks/${hookId}', 'teamId|typeName|assigned|viewForScenarioId' ]
            */
            var splitByQuestionMark = pathPattern.split('?');

            return {
                withoutQueryParams: splitByQuestionMark[0],
                queryParams: splitByQuestionMark.length > 1 ? splitByQuestionMark[1].split('|') : [],
                urlParams: getUrlParams(pathPattern),
            };
        }

        /*Correct the '/' char in case of root string ends with '/' and also pathPattern starts with '/' again, example below:
        * root: 'https://newpath.integromat.cloud/api/v2/'
        * pathPattern: '/login'
        * combination: 'https://newpath.integromat.cloud/api/v2//login'
        * function output: 'https://newpath.integromat.cloud/api/v2/login'
        */
        function urlJoin(a, b) {
            if (!a.endsWith('/')) {
                a = a + '/';
            }

            if (b.startsWith('/')) {
                b = b.substr(1);
            }

            return a + b;
        }

        // Build the URL respect to url params & query params
        function buildUrl(root, args, parseResult) {
            var url = urlJoin(root, parseResult.withoutQueryParams);
            var queryParams = [];

            Object.keys(args).forEach(function (key) {
                var value = args[key];
                var urlParamIndex = parseResult.urlParams.indexOf(key);
                var queryParamsIndex;

                if (urlParamIndex !== -1) {
                    // Replaces the '${key}' key pattern with given value while making the call
                    url = url.replace('${' + key + '}', value);
                } else if ((queryParamsIndex = parseResult.queryParams.indexOf(key)) !== -1) {
                    // Adds '=' char after key, adds the value right after '='
                    queryParams.push(key + '=' + value);
                }
            });

            if (queryParams.length) {
                url = url + '?' + queryParams.join('&');
            }

            return url;
        }

        // Create the fetch function with options and body if exists
        function buildWrapperFn(root, parseResult, method, fetchModule, fetchOptions, fetchDefaults) {
            // Configure and create the fetch function and return to call
            return function () {
                // args = the url params and/or query params passed when making the call
                var args = arguments['0'];

                /*Custom options can be entered as 3rd param when making the call
                * This will overwrite the config options, example below:
                * await base.auth.login({}, {}, 
                    {
                        cache: 'no-cache',
                        credentials: 'same-origin',
                        headers: [
                            [ 'content-type', 'application/json' ]
                            [ 'Authorization', "authorization_token" ]
                        ]
                    }
                )
                */

                if (arguments.length === 3) {
                    fetchOptions = arguments['2'];
                }

                // Build the last version of the url with root, url params, and query params
                var url = buildUrl(root, args, parseResult);

                // Use default options if exists, else create new options with method and body
                if (fetchOptions != undefined && fetchOptions && fetchOptions != {}) {
                    var options = fetchOptions;
                } else if (fetchDefaults != undefined && fetchDefaults && fetchDefaults != {}) {
                    var options = fetchDefaults;
                } else {
                    var options = {};
                }

                // Assign method to options
                options.method = method.toUpperCase();

                // The body json passed when making the call, if fetch is patch, post or put request
                if (['patch', 'post', 'put'].includes(method)) {
                    var body = arguments['1'];
                    options.body = JSON.stringify(body);
                }

                // Make the fetch call
                return fetchModule(url, options);
            }
        }

        // Parse the config object respect to methods
        function getMethodIterator(config, callback) {
            var httpMethods = ['delete', 'get', 'head', 'patch', 'post', 'put'];

            httpMethods.forEach(function (method) {
                var methodMap = config[method];

                // Example methodMap: { pathPattern: '/login', fetchOptions: { headers: [ [Array] ] } }
                if (methodMap) {

                    Object.keys(methodMap).forEach(function (key) {
                        var value = methodMap[key];
                        // Example callback: callback( "post", "login", { pathPattern: '/login', fetchOptions: { headers: [ [Array] ] } })
                        callback(method, key, value);
                    });
                }
            });
        }

        // Create the wrapper
        function create(config) {

            // Root path of API endpoint
            var root = config.root;

            // NPM Node-Fetch
            var fetchModule = fetch;

            // Wrapper object to be returned at the end
            var wrapper = {};

            // Example function(method, key, value): function( "post", "login", { pathPattern: '/login', fetchOptions: { headers: [ [Array] ] } })
            getMethodIterator(config, function (method, key, value) {
                var pathPattern;
                var fetchOptions;
                var parseResult;

                /* If statement for basic call definition 
                * Instead of defining calls as object with pathPattern and fetchOptions
                * we can also define them in a single line as below:
                * login: '/login'
                * And this makes the value variable's type string, thus there will be no fetchOptions */
                if (typeof value === 'string') {
                    pathPattern = value;
                    fetchOptions = null;
                }
                else {
                    pathPattern = value.pathPattern;
                    fetchOptions = value.fetchOptions;
                }

                // Parse the pathPattern and create a new object which includes default path, query params array, and url params array, assigns to parseResult
                parseResult = parseUrl(pathPattern);

                /*Create the fetch function to given key inside main wrapper object, for example wrapper["login"] = fetch()
                * Detailed example buildWrapperFn function call:
                
                * buildWrapperFn( "https://newpath.integromat.cloud/api/v2", 
                   { withoutQueryParams:'/hooks/${hookId}', queryParams: [ 'teamId', 'typeName', 'assigned', 'viewForScenarioId' ], urlParams: [ 'hookId' ] },
                   "post",
                   fetch,
                   { headers: [ [ 'content-type', 'application/json' ] ] },
                   { headers: [ [ 'content-type', 'application/json' ], [ 'Authorization', "Token " + this.APIkey ] ] }
                 }) */
                wrapper[key] = buildWrapperFn(root, parseResult, method, fetchModule, fetchOptions, config.fetchDefaults);
            });

            return wrapper;
        }

        // Auth endpoint config
        this.auth = create({
            root: rootEndpoint,
            post: {
                login: {
                    pathPattern: '/login',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ]
                        ]
                    }
                },
                logout: {
                    pathPattern: '/logout',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ]
                        ]
                    }
                },
                oauthLogin: {
                    pathPattern: '/sso/login',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ]
                        ]
                    }
                },
                authorize: {
                    pathPattern: '/sso/authorize',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                "Token " + this.APIkey
                            ]
                        ]
                    }
                }
            }
        });

        // Connections endpoint config
        this.connections = create({
            root: rootEndpoint,
            get: {
                list: '/connections?teamId|type[]',
                detail: '/connections/${connectionId}'
            },
            post: {
                create: '/connections?teamId|inspector',
                test: '/connections/${connectionId}/test',
                scoped: '/connections/${connectionId}/scoped',
                setData: '/connections/${connectionId}/set-data?reauthorize'
            },
            patch: {
                partialUpdate: '/connections/${connectionId}'
            },
            delete: {
                delete: '/connections/${connectionId}?confirmed'
            },
            fetchDefaults: {
                headers: [
                    [
                        'content-type',
                        'application/json'
                    ],
                    [
                        'Authorization',
                        "Token " + this.APIkey
                    ]
                ]
            }
        });

        // Hooks endpoint config
        this.hooks = create({
            root: rootEndpoint,
            get: {
                list: '/hooks?teamId|typeName|assigned|viewForScenarioId',
                detail: '/hooks/${hookId}',
                ping: '/hooks/${hookId}/ping'
            },
            post: {
                create: '/hooks?inspector',
                learnStart: '/hooks/${hookId}/learn-start',
                learnStop: '/hooks/${hookId}/learn-stop',
                enable: '/hooks/${hookId}/enable',
                disable: '/hooks/${hookId}/disable',
                setData: '/hooks/${hookId}/set-data?reauthorize'
            },
            delete: {
                delete: '/hooks/${hookId}?confirmed',
            },
            fetchDefaults: {
                headers: [
                    [
                        'content-type',
                        'application/json'
                    ],
                    [
                        'Authorization',
                        "Token " + this.APIkey
                    ]
                ]
            }
        });

        // Hooks.Incoming endpoint config
        this.hooks.incomings = create({
            root: rootEndpoint,
            get: {
                list: '/hooks/${hookId}/incomings?pg[sortBy]|pg[offset]|pg[sortDir]|pg[limit]',
                detail: '/hooks/${hookId}/incomings/${incomingId}',
                stats: '/hooks/${hookId}/incomings/stats',
            },
            delete: {
                delete: '/hooks/${hookId}/incomings/'
            },
            fetchDefaults: {
                headers: [
                    [
                        'content-type',
                        'application/json'
                    ],
                    [
                        'Authorization',
                        "Token " + this.APIkey
                    ]
                ]
            }
        });

        // OAuth endpoint config
        this.oauth = create({
            root: rootEndpoint,
            get: {
                authorize: '/oauth/auth/${connectionId}',
                reauthorize: '/oauth/reauth/${connectionId}',
                extend: '/oauth/extend/${connectionId}',
                oauthCallback: '/oauth/cb/${connectionType}',
                oauthCallbackId: '/oauth/cb/${connectionType}/${connectionId}'
            }
        });

        // Scenarios endpoint config
        this.scenarios = create({
            root: rootEndpoint,
            get: {
                list: '/scenarios?organizationId|folderId|teamId|id[]|islinked|cols[]|pg[sortBy]|pg[offset]|pg[sortDir]|pg[limit]',
                detail: '/scenarios/${scenarioId}?organizationId|folderId|islinked',
                blueprint: '/scenarios/${scenarioId}/blueprint?blueprintId',
                triggers: '/scenarios/${scenarioId}/triggers?blueprintId'
            },
            post: {
                clone: '/scenarios/${scenarioId}/clone?organizationId',
                create: '/scenarios',
                start: '/scenarios/${scenarioId}/start',
                publish: '/scenarios/${scenarioId}/publish',
                stop: '/scenarios/${scenarioId}/stop'
            },
            patch: {
                partialUpdate: '/scenarios/${scenarioId}'
            },
            put: {
                setData: '/scenarios/${scenarioId}/data'
            },
            delete: {
                delete: 'scenarios/${scenarioId}'
            },
            fetchDefaults: {
                headers: [
                    [
                        'content-type',
                        'application/json'
                    ],
                    [
                        'Authorization',
                        "Token " + this.APIkey
                    ]
                ]
            }
        });

        // Scenarios.Logs endpoint config
        this.scenarios.logs = create({
            root: rootEndpoint,
            get: {
                list: '/scenarios/${scenarioId}/logs?from|to|status|pg[sortBy]|pg[last]|pg[showLast]|pg[sortDir]|pg[limit]|showCheckRuns',
                executionLog: '/scenarios/${scenarioId}/logs/${executionId}'
            },
            fetchDefaults: {
                headers: [
                    [
                        'content-type',
                        'application/json'
                    ],
                    [
                        'Authorization',
                        "Token " + this.APIkey
                    ]
                ]
            }
        });

        // Scenarios.Blueprints endpoint config
        this.scenarios.blueprints = create({
            root: rootEndpoint,
            get: {
                list: '/scenarios/${scenarioId}/blueprints?|cols[]|pg[sortBy]|pg[offset]|pg[sortDir]|pg[limit]'
            },
            fetchDefaults: {
                headers: [
                    [
                        'content-type',
                        'application/json'
                    ],
                    [
                        'Authorization',
                        "Token " + this.APIkey
                    ]
                ]
            }
        });

        // Scenarios.Consumptions endpoint config
        this.scenarios.consumptions = create({
            root: rootEndpoint,
            get: {
                list: '/scenarios/consumptions?teamId|organizationId'
            },
            fetchDefaults: {
                headers: [
                    [
                        'content-type',
                        'application/json'
                    ],
                    [
                        'Authorization',
                        "Token " + this.APIkey
                    ]
                ]
            }
        });

        // Templates endpoint config
        this.templates = create({
            root: rootEndpoint,
            get: {
                list: '/templates?cols[]|usedApps[]|teamId|public|pg[sortBy]|pg[offset]|pg[sortDir]|pg[limit]',
                detail: '/templates/${templateId}?cols[]',
                blueprint: '/templates/1/blueprint?forUse|templatePublicId'
            },
            post: {
                create: '/templates?cols[]',
                publish: '/templates/${templateId}/publish?cols[]',
                requestApproval: '/templates/${templateId}/request-approval?cols[]|templatePublicId'
            },
            patch: {
                partialUpdate: '/templates/${templateId}?cols[]'
            },
            delete: {
                delete: '/templates/${templateId}'
            },
            fetchDefaults: {
                headers: [
                    [
                        'content-type',
                        'application/json'
                    ],
                    [
                        'Authorization',
                        "Token " + this.APIkey
                    ]
                ]
            }
        });

        // Templates.Public endpoint config
        this.templates.public = create({
            root: rootEndpoint,
            get: {
                list: '/templates/public?includeEn|usedApps[]|cols[]|pg[sortBy]|pg[offset]|pg[sortDir]|pg[limit]',
                detail: '/templates/public/${templateUrl}?templatePublicId|cols[]',
                blueprint: '/templates/public/${templateUrl}/blueprint?templatePublicId'
            },
            fetchDefaults: {
                headers: [
                    [
                        'content-type',
                        'application/json'
                    ],
                    [
                        'Authorization',
                        "Token " + this.APIkey
                    ]
                ]
            }
        });

    }
}


if (typeof require !== 'undefined' && require.main === module) {

    (async function () {
        var integromat = new Integromat("ecb80230-6b5a-4795-8d04-bd4e46cf1941")
        integromat.templates.list(
            {
            }, {})
            .then(res => res.json())
            .then(json => console.log(json));
    })();
}
module.exports = Integromat;

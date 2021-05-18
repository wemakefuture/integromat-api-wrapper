"use strict";
var fetch = require('node-fetch');

class Integromat {
    constructor(APIkey) {
        this.APIkey = APIkey;
        var pathVarsRe = /\${([^\}]+)}/g;

        function getPathVars(path) {
            var pathVars = [];
            var match;

            while ((match = pathVarsRe.exec(path)) !== null) {
                pathVars.push(match[1]);
            }

            return pathVars;
        }

        function parse(pathPattern) {
            var splitByQuestionMark = pathPattern.split('?');

            return {
                withoutparamsNew: splitByQuestionMark[0],
                paramsNew: splitByQuestionMark.length > 1 ? splitByQuestionMark[1].split('|') : [],
                pathVars: getPathVars(pathPattern),
            };
        }

        function uriJoin(a, b) {
            if (!a.endsWith('/')) {
                a = a + '/';
            }

            if (b.startsWith('/')) {
                b = b.substr(1);
            }

            return a + b;
        }

        function buildUri(root, args, parseResult) {
            var uri = uriJoin(root, parseResult.withoutparamsNew);
            var paramsNew = [];

            Object.keys(args).forEach(function (key) {
                var value = args[key];
                var pathVarIndex = parseResult.pathVars.indexOf(key);
                var paramsNewIndex;

                if (pathVarIndex !== -1) {
                    uri = uri.replace('${' + key + '}', value);
                } else if ((paramsNewIndex = parseResult.paramsNew.indexOf(key)) !== -1) {
                    paramsNew.push(key + '=' + value);
                }
            });

            if (paramsNew.length) {
                uri = uri + '?' + paramsNew.join('&');
            }

            return uri;
        }

        function buildWrapperFn(root, parseResult, method, fetch, fetchOptions, shouldParseJson) {
            fetchOptions = fetchOptions || {};

            if (['patch', 'post', 'put'].indexOf(method) !== -1) {
                return function () {
                    var args = arguments['0'];
                    var body = arguments['1'];
                    var morefetchOptions = arguments.length === 4 ? arguments['2'] : {};
                    var uri = buildUri(root, args, parseResult);

                    Object.assign(fetchOptions, morefetchOptions);

                    if (fetchOptions) {
                        var options = fetchOptions;
                    }
                    else {
                        var options = {};
                    }
                    options.method = method;
                    options.body = JSON.stringify(body);


                    return fetch(uri, options);


                }
            }
            else {
                return function () {
                    var args = arguments['0'];
                    var morefetchOptions = arguments.length === 3 ? arguments['1'] : {};

                    var uri = buildUri(root, args, parseResult);

                    Object.assign(fetchOptions, morefetchOptions);
                    fetchOptions.uri = uri;
                    fetchOptions.method = method.toUpperCase();

                    if (fetchOptions) {
                        var options = fetchOptions;
                    }
                    else {
                        var options = {};
                    }
                    options.method = method;


                    return fetch(uri, options);

                }
            }
        }

        function getMethodIterator(config, cb) {
            var httpMethods = ['delete', 'get', 'head', 'patch', 'post', 'put'];
            httpMethods.forEach(function (method) {
                if (config[method]) {
                    Object.keys(config[method]).forEach(function (key) {
                        var value = config[method][key];
                        cb(method, key, value);
                    });
                }
            });
        }

        function create(config) {
            var shouldParseJson = true; //config.parseJson;

            var wrapper = {};

            getMethodIterator(config, function (method, key, value) {
                var pathPattern;
                var fetchOptions;
                var parseResult;

                if (typeof value === 'string') {
                    pathPattern = value;
                    fetchOptions = null;
                }
                else {
                    pathPattern = value.pathPattern;
                    fetchOptions = value.fetchOptions;
                }

                parseResult = parse(pathPattern);
                wrapper[key] = buildWrapperFn(config.root, parseResult, method, fetch, fetchOptions, shouldParseJson);
            });

            return wrapper;
        }

        this.auth = create({
            root: 'https://newpath.integromat.cloud/api/v2',
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
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            }
        });

        this.connections = create({
            root: 'https://newpath.integromat.cloud/api/v2',
            get: {
                list: {
                    pathPattern: '/connections?teamId|type[]',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                detail: {
                    pathPattern: '/connections/${connectionId}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            },
            post: {
                create: {
                    pathPattern: '/connections?teamId|inspector',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                test: {
                    pathPattern: '/connections/${connectionId}/test',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                scoped: {
                    pathPattern: '/connections/${connectionId}/scoped',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                setData: {
                    pathPattern: '/connections/${connectionId}/set-data?reauthorize',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            },
            patch: {
                partialUpdate: {
                    pathPattern: '/connections/${connectionId}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            },
            delete: {
                delete: {
                    pathPattern: '/connections/${connectionId}?confirmed',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            }
        });

        this.hooks = create({
            root: 'https://newpath.integromat.cloud/api/v2',
            get: {
                list: {
                    pathPattern: '/hooks?teamId|typeName|assigned|viewForScenarioId',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                detail: {
                    pathPattern: '/hooks/${hookId}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                ping: {
                    pathPattern: '/hooks/${hookId}/ping',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            },
            post: {
                create: {
                    pathPattern: '/hooks?inspector',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                learnStart: {
                    pathPattern: '/hooks/${hookId}/learn-start',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                learnStop: {
                    pathPattern: '/hooks/${hookId}/learn-stop',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                enable: {
                    pathPattern: '/hooks/${hookId}/enable',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                disable: {
                    pathPattern: '/hooks/${hookId}/disable',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                setData: {
                    pathPattern: '/hooks/${hookId}/set-data?reauthorize',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            },
            delete: {
                delete: {
                    pathPattern: '/hooks/${hookId}?confirmed',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
            }
        });

        this.hooks.incomings = create({
            root: 'https://newpath.integromat.cloud/api/v2',
            get: {
                list: {
                    pathPattern: '/hooks/${hookId}/incomings?pg[sortBy]|pg[offset]|pg[sortDir]|pg[limit]',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                detail: {
                    pathPattern: '/hooks/${hookId}/incomings/${incomingId}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                stats: {
                    pathPattern: '/hooks/${hookId}/incomings/stats',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
            },
            delete: {
                delete: {
                    pathPattern: '/hooks/${hookId}/incomings/',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            }
        });

        this.oauth = create({
            root: 'https://newpath.integromat.cloud/api/v2',
            get: {
                authorize: {
                    pathPattern: '/oauth/auth/${connectionId}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                reauthorize: {
                    pathPattern: '/oauth/reauth/${connectionId}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                extend: {
                    pathPattern: '/oauth/extend/${connectionId}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                oauthCallback: {
                    pathPattern: '/oauth/cb/${connectionType}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                oauthCallbackId: {
                    pathPattern: '/oauth/cb/${connectionType}/${connectionId}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            }
        });

        this.scenarios = create({
            root: 'https://newpath.integromat.cloud/api/v2',
            get: {
                list: {
                    pathPattern: '/scenarios?organizationId|folderId|teamId|id[]|islinked|cols[]|pg[sortBy]|pg[offset]|pg[sortDir]|pg[limit]',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                detail: {
                    pathPattern: '/scenarios/${scenarioId}?organizationId|folderId|islinked',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                blueprint: {
                    pathPattern: '/scenarios/${scenarioId}/blueprint?blueprintId',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                triggers: {
                    pathPattern: '/scenarios/${scenarioId}/triggers?blueprintId',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            },
            post: {
                clone: {
                    pathPattern: '/scenarios/${scenarioId}/clone?organizationId',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                create: {
                    pathPattern: '/scenarios',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                start: {
                    pathPattern: '/scenarios/${scenarioId}/start',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                publish: {
                    pathPattern: '/scenarios/${scenarioId}/publish',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                stop: {
                    pathPattern: '/scenarios/${scenarioId}/stop',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            },
            patch: {
                partialUpdate: {
                    pathPattern: '/scenarios/${scenarioId}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            },
            put: {
                setData: {
                    pathPattern: '/scenarios/${scenarioId}/data',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            },
            delete: {
                delete: {
                    pathPattern: 'scenarios/${scenarioId}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            }
        });

        this.scenarios.logs = create({
            root: 'https://newpath.integromat.cloud/api/v2',
            get: {
                list: {
                    pathPattern: '/scenarios/${scenarioId}/logs?from|to|status|pg[sortBy]|pg[last]|pg[showLast]|pg[sortDir]|pg[limit]|showCheckRuns',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                executionLog: {
                    pathPattern: '/scenarios/${scenarioId}/logs/${executionId}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            }
        });

        this.scenarios.blueprints = create({
            root: 'https://newpath.integromat.cloud/api/v2',
            get: {
                list: {
                    pathPattern: '/scenarios/${scenarioId}/blueprints?|cols[]|pg[sortBy]|pg[offset]|pg[sortDir]|pg[limit]',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            }
        });

        this.scenarios.consumptions = create({
            root: 'https://newpath.integromat.cloud/api/v2',
            get: {
                list: {
                    pathPattern: '/scenarios/consumptions?teamId|organizationId',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            }
        });

        this.templates = create({
            root: 'https://newpath.integromat.cloud/api/v2',
            get: {
                list: {
                    pathPattern: '/templates?cols[]|usedApps[]|teamId|public|pg[sortBy]|pg[offset]|pg[sortDir]|pg[limit]',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                detail: {
                    pathPattern: '/templates/${templateId}?cols[]',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                blueprint: {
                    pathPattern: '/templates/1/blueprint?forUse|templatePublicId',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            },
            post: {
                create: {
                    pathPattern: '/templates?cols[]',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                publish: {
                    pathPattern: '/templates/${templateId}/publish?cols[]',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                requestApproval: {
                    pathPattern: '/templates/${templateId}/request-approval?cols[]|templatePublicId',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            },
            patch: {
                partialUpdate: {
                    pathPattern: '/templates/${templateId}?cols[]',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            },
            delete: {
                delete: {
                    pathPattern: '/templates/${templateId}',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            }
        });

        this.templates.public = create({
            root: 'https://newpath.integromat.cloud/api/v2',
            get: {
                list: {
                    pathPattern: '/templates/public?includeEn|usedApps[]|cols[]|pg[sortBy]|pg[offset]|pg[sortDir]|pg[limit]',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                detail: {
                    pathPattern: '/templates/public/${templateUrl}?templatePublicId|cols[]',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                },
                blueprint: {
                    pathPattern: '/templates/public/${templateUrl}/blueprint?templatePublicId',
                    fetchOptions: {
                        headers: [
                            [
                                'content-type',
                                'application/json'
                            ],
                            [
                                'Authorization',
                                'Token ' + this.APIkey
                            ]
                        ]
                    }
                }
            }
        });
    }

}


if (typeof require !== 'undefined' && require.main === module) {

    (async function () {
        var full = new Integromat("ecb80230-6b5a-4795-8d04-bd4e46cf1941")
        full.templates.list(
            {
            }, {})
            //.then(res => res.json())
            .then(json => console.log(json));
    })();
}

module.exports.integromat = Integromat;
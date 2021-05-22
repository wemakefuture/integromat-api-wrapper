const Integromat = require("../integromat-node.js");
const util = require("util");

(async function () {

    var integromat = new Integromat("ecb80230-6b5a-4795-8d04-bd4e46cf1941")
    let scenarioID = 132;


    // ###### Show connections
    // var { connections } = await integromat.connections.list(
    //     {
    //         "teamId": 29
    //     }, {})
    //     .then(res => res.json())

    // for (connection of connections) {
    //     console.log(connection.accountName)
    // }


    // await integromat.connections.create(
    //     {
    //         "teamId": 29,   // can be found in the url when you click on teams
    //         "inspector": 1  // no clue what this is. Just set it to one and it worked
    //     },
    //     {
    //         "accountName": "AirtableAutomatically",
    //         "accountType": "airtable2",
    //         "apiToken": "keyIV8llzoUYaHc1F",
    //     })
    //     .then(res => res.json())
    //     .then(json => console.log(json));

    // await integromat.scenarios.blueprints.list(
    //     {
    //         "scenarioId": 132
    //     }, {})
    //     .then(res => res.json())
    //     .then(json => console.log(json));

    let scenario = await integromat.scenarios.detail(
        {
            "scenarioId": scenarioID
        }, {})
        .then(res => res.json())
        .then(json => json.scenario)
    console.log(JSON.stringify(scenario, null, 4))

    blueprintVersion = await integromat.scenarios.blueprints.list(
        {
            "scenarioId": scenarioID,
            "pg[sortBy]": "version",
            "pg[sortDir]": "desc",
            "pg[limit]": 1

        }, {})
        .then(res => res.json())
        .then(json => json.scenariosBlueprints[0].version)


    // ###### Read out blueprint
    let blueprint = await integromat.scenarios.blueprint(
        {
            "scenarioId": scenarioID,
            "blueprintId": blueprintVersion
        }, {})
        .then(res => res.json())
        .then(json => json.response.blueprint)

    //console.log(JSON.stringify(blueprint, null, 4))

    // ###### List Webhooks
    // await integromat.hooks.list(
    //     {
    //         "teamId": 29
    //     }, {})
    //     .then(res => res.json())
    //     .then(json => console.log(JSON.stringify(json, null, 4)));

    // ###### create webhook
    let newWebhookID = await integromat.hooks.create(
        {
            "inspector": 1
        },
        {
            "name": "gateway-webhook",
            "teamId": scenario.teamId,
            "typeName": "gateway-webhook", // gateway-webhook
            "headers": false, // had to figure out that these were necessary
            "method": false,
            "stringify": false
        })
        .then(res => res.json())
        .then(json => json.formula.success[0])

    console.log("New Webhook ID: " + newWebhookID)
    // ###### adapt blueprint
    // insert new webhook
    blueprint.flow[0].parameters.hook = newWebhookID;

    let newScenarioID = await integromat.scenarios.create({},
        {
            "blueprint": JSON.stringify(blueprint),
            "teamId": 29,
            "scheduling": JSON.stringify(scenario.scheduling) // "{\"type\":\"indefinitely\",\"interval\":900}"
        })
        .then(res => res.json())
        .then(json => json.scenario.id)
    console.log("New Scenario ID: " + newScenarioID)

    // ###### Start scenario
    await integromat.scenarios.start(
        {
            "scenarioId": newScenarioID
        }, {})
        .then(res => res.json())
        .then(json => console.log(json));

})();

const Integromat = require("../integromat-node.js");
const util = require("util");

(async function () {

    var integromat = new Integromat("ecb80230-6b5a-4795-8d04-bd4e46cf1941")


    var { connections } = await integromat.connections.list(
        {
            "teamId": 29
        }, {})
        .then(res => res.json())

    for (connection of connections) {
        console.log(connection.accountName)
    }


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

    // Read out blueprint
    let {response} = await integromat.scenarios.blueprint(
        {
            "scenarioId": 132,
            "blueprintId": 2
        }, {})
        .then(res => res.json())
    let blueprint = response.blueprint;
    //console.log(JSON.stringify(blueprint, null, 4))

    await integromat.hooks.list(
        {
            "teamId": 29
        }, {})
        .then(res => res.json())
        .then(json => console.log(JSON.stringify(json,null,4)));
    
    await integromat.hooks.create(
        {
            "inspector": 1
        },
        {
            "name": "gateway-webhook",
            "teamId": 29,
            "typeName": "gateway-webhook", // gateway-webhook
            "headers" : false, // had to figure out that these were necessary
            "method":false,
            "stringify" : false
        })
        .then(res => res.json())
        .then(json => console.log(json));


    await integromat.scenarios.create({},
        {
            "blueprint": JSON.stringify(blueprint),
            "teamId": 29,
            "scheduling" : "{\"type\":\"indefinitely\",\"interval\":900}" // "{\"type\":\"indefinitely\",\"interval\":900}"
        })
        .then(res => res.json())
        .then(json => console.log(json));

})();

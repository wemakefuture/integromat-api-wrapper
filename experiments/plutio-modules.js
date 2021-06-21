const Integromat = require("../integromat-node.js");

(async function () {

    var integromat = new Integromat("ecb80230-6b5a-4795-8d04-********")

    let scenarioID = 132; 
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
        .then(result => console.log(JSON.stringify(result, null, 4)));


})();

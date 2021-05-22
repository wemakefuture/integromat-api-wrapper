await integromat.scenarios.logs.list(
    {
        "scenarioId": 0,
        "from": 0,
        "to": 0,
        "status": 0,
        "pg[sortBy]": "string",
        "pg[last]": false,
        "pg[showLast]": "string",
        "pg[sortDir]": "string",
        "pg[limit]": 0,
        "showCheckRuns": false
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));


await integromat.scenarios.logs.executionLog(
    {
        "scenarioId": 0,
        "executionId": "string"
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.blueprints.list(
    {
        "scenarioId": 0,
        "cols[]": "Enum('id' | 'name' | 'teamId' | 'concept' | 'createdBySupport' | 'deleted' | 'description' | 'folderId' | 'isinvalid' | 'islinked' | 'islocked' | 'ispaused' | 'lastEdit' | 'usedPackages')",
        "pg[sortBy]": "string",
        "pg[offset]": 0,
        "pg[sortDir]": "string",
        "pg[limit]": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.consumptions.list(
    {
        "teamId": 0,
        "organizationId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.list(
    {
        "organizationId": 0,
        "folderId": 0,
        "teamId": 0,
        "id": "Enum( 1 | 2 )",
        "islinked": false,
        "cols[]": "Enum('id' | 'name' | 'teamId' | 'concept' | 'createdBySupport' | 'deleted' | 'description' | 'folderId' | 'isinvalid' | 'islinked' | 'islocked' | 'ispaused' | 'usedPackages' | 'lastEdit' | 'scheduling' | 'iswatching' | 'hookId')",
        "pg[sortBy]": "string",
        "pg[offset]": 0,
        "pg[sortDir]": "string",
        "pg[limit]": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.detail(
    {
        "scenarioId": 0,
        "organizationId": 0,
        "folderId": 0,
        "islinked": false
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.blueprint(
    {
        "scenarioId": 0,
        "blueprintId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.triggers(
    {
        "scenarioId": 0,
        "blueprintId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.clone(
    {
        "scenarioId": 0,
        "organizationId": 0
    },
    {
        "name": "string",
        "teamId": 0,
        "states": false,
        "account": {
            "109": "string"
        }
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.create({},
    {
        "blueprint": "string",
        "teamId": 0,
        "scheduling": "string",
        "concept": false,
        "folderId": 0,
        "basedon": 0
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.start(
    {
        "scenarioId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.publish(
    {
        "scenarioId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.stop(
    {
        "scenarioId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.partialUpdate(
    {
        "scenarioId": 0
    },
    {
        "folderId": 0,
        "blueprint": "string",
        "name": "string",
        "scheduling": "",
        "concept": false
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.setData(
    {
        "scenarioId": 0
    },
    {
        "1": { "epoch": { "date": "2021-02-02T09:49:00.000Z" } }
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.scenarios.delete(
    {
        "scenarioId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));
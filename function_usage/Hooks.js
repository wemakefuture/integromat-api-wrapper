await integromat.hooks.incomings.list(
    {
        "hookId": 0,
        "pg[sortBy]": "string",
        "pg[offset]": 0,
        "pg[sortDir]": "string",
        "pg[limit]": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.incomings.detail(
    {
        "hookId": 0,
        "incomingId": "string"
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.incomings.stats(
    {
        "hookId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.incomings.delete(
    {
        "hookId": 0,
        "confirmed": false
    },
    {
        "ids": [],
        "exceptIds": [],
        "all": false
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.list(
    {
        "teamId": 0,
        "typeName": "string",
        "assigned": false,
        "viewForScenarioId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.detail(
    {
        "hookId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.ping(
    {
        "hookId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.create(
    {
        "inspector": 0
    },
    {
        "name": "string",
        "teamId": 0,
        "typeName": "string",
        "__IMTCONN__": 0,
        "formId": "91282545501352"
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.learnStart(
    {
        "hookId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.learnStop(
    {
        "hookId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.enable(
    {
        "hookId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.disable(
    {
        "hookId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.setData(
    {
        "hookId": 0,
        "reauthorize": 0
    },
    {
        "ip": "string",
        "udt": "string",
        "headers": false,
        "method": false,
        "stringify": false,
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.hooks.delete(
    {
        "hookId": 0,
        "confirmed": false
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));
await integromat.connections.create(
    {
        "teamId": 0,
        "inspector": 0
    },
    {
        "accountName": "string",
        "accountType": "string",
        "consumerKey": "string",
        "consumerSecret": "string",
        "scopes": ["string"]
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.connections.test(
    {
        "connectionId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.connections.list(
    {
        "teamId": 0,
        "type[]": "Enum('openweathermap')"
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.connections.detail(
    {
        "connectionId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.connections.scoped(
    {
        "connectionId": 0
    },
    {
        "scope": ["string"]
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.connections.setData(
    {
        "connectionId": 0,
        "reauthorize": 0
    },
    {
        "provider": "string",
        "imapHost": "string",
        "imapPort": 0,
        "imapSecureConnection": false,
        "imapUsername": "string",
        "imapPassword": "string",
        "imapRejectUnauthorized": false,
        "imapCa": "string",
        "imapExplicitTLS": false
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.connections.partialUpdate(
    {
        "connectionId": 0
    },
    {
        "name": "string"
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.connections.delete(
    {
        "connectionId": 0,
        "confirmed": false
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));
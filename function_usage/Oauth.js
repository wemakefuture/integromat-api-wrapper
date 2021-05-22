await integromat.oauth.authorize(
    {
        "connectionId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.oauth.reauthorize(
    {
        "connectionId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.oauth.extend(
    {
        "connectionId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.oauth.oauthCallback(
    {
        "connectionType": "string"
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.oauth.oauthCallbackId(
    {
        "connectionType": "string",
        "connectionId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));
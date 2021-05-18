await base.oauth.authorize(
    {
        "connectionId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.oauth.reauthorize(
    {
        "connectionId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.oauth.extend(
    {
        "connectionId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.oauth.oauthCallback(
    {
        "connectionType": "string"
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.oauth.oauthCallbackId(
    {
        "connectionType": "string",
        "connectionId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));
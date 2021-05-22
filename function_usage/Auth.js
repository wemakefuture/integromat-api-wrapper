await integromat.auth.login({},
    {
        "email": "string",
        "password": "string"
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.auth.logout({}, {})
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.auth.oauthLogin({},
    {
        "code": "string",
        "state": "string"
    })
    .then(res => res.json())
    .then(json => console.log(json));

await integromat.auth.authorize({},
    {
        "redirect": "string"
    })
    .then(res => res.json())
    .then(json => console.log(json));

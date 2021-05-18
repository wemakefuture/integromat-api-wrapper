await base.auth.login({},
    {
        "email": "string",
        "password": "string"
    })
    .then(res => res.json())
    .then(json => console.log(json));

await base.auth.logout({}, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.auth.oauthLogin({},
    {
        "code": "string",
        "state": "string"
    })
    .then(res => res.json())
    .then(json => console.log(json));

await base.auth.authorize({},
    {
        "redirect": "string"
    })
    .then(res => res.json())
    .then(json => console.log(json));

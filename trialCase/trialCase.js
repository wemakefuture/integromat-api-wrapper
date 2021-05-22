const Integromat = require("../integromat-node.js");

(async function () {

    var integromat = new Integromat("ecb80230-6b5a-4795-8d04-bd4e46cf1941")


    var {connections} = await integromat.connections.list(
        {
            "teamId": 29
        }, {})
        .then(res => res.json())
    
    for (connection of connections){
        console.log(connection.accountName)
    }
    

    // await integromat.connections.create(
    //     {
    //         "teamId": 29,
    //         "inspector": 1
    //     },
    //     {
    //         "accountName": "AirtableAutomatically",
    //         "accountType": "airtable2",
    //         "apiToken": "keyIV8llzoUYaHc1F",
    //     })
    //     .then(res => res.json())
    //     .then(json => console.log(json));


})();

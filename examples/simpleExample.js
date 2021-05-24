const Integromat = require("../integromat-node.js");

(async function () {

    var integromat = new Integromat("ecb80230-6b5a-4795-8d04-bd4e46cf1941")
    integromat.templates.list({}, {})
        .then(res => res.json())
        .then(json => console.log(json));

})();

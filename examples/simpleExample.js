const Integromat = require("../integromat-node.js").integromat;

(async function () {

    var fullAccess = new Integromat("ecb80230-6b5a-4795-8d04-bd4e46cf1941")
    fullAccess.templates.list({}, {})
        .then(res => res.json())
        .then(json => console.log(json));

})();

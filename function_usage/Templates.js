await base.templates.list(
    {
        "cols[]": "Enum('id' | 'name' | 'teamId' | 'description' | 'usedApps' | 'public' | 'approvedId' | 'publishedId' | 'publicUrl' | 'published' | 'approved' | 'publishedName' | 'approvedName')",
        "usedApps[]": "Enum('postgres' | 'http')",
        "teamId": 0,
        "public": false,
        "pg[sortBy]": "string",
        "pg[offset]": 0,
        "pg[sortDir]": "string",
        "pg[limit]": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.templates.detail(
    {
        "templateId": 0,
        "cols[]": "Enum('id' | 'name' | 'teamId' | 'description' | 'usedApps' | 'published' | 'public' | 'approvedId' | 'publishedId' | 'publicUrl' | 'published' | 'approved' | 'publishedName' | 'approvedName')"
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.templates.blueprint(
    {
        "forUse": false,
        "templatePublicId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.templates.create(
    {
        "cols[]": "Enum('id' | 'name' | 'teamId' | 'description' | 'usedApps' | 'public' | 'approvedId' | 'publishedId' | 'publicUrl' | 'published' | 'approved' | 'publishedName' | 'approvedName')"
    },
    {
        "teamId": 0,
        "language": "string",
        "blueprint": "string",
        "scheduling": "string",
        "controller": "string"
    })
    .then(res => res.json())
    .then(json => console.log(json));

await base.templates.partialUpdate(
    {
        "templateId": 0,
        "cols[]": "Enum('id' | 'name' | 'teamId' | 'description' | 'usedApps' | 'public' | 'approvedId' | 'publishedId' | 'publicUrl' | 'published' | 'approved' | 'publishedName' | 'approvedName')"
    },
    {
        "name": "string"
    })
    .then(res => res.json())
    .then(json => console.log(json));

await base.templates.publish(
    {
        "templateId": 0,
        "cols[]": "Enum('id' | 'name' | 'teamId' | 'description' | 'usedApps' | 'public' | 'approvedId' | 'publishedId' | 'publicUrl' | 'published' | 'approved' | 'publishedName' | 'approvedName')"
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.templates.requestApproval(
    {
        "templateId": 0,
        "cols[]": "Enum('id' | 'name' | 'teamId' | 'description' | 'usedApps' | 'public' | 'approvedId' | 'publishedId' | 'publicUrl' | 'published' | 'approved' | 'publishedName' | 'approvedName')",
        "templatePublicId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.templates.delete(
    {
        "templateId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.templates.public.list(
    {
        "includeEn": false,
        "name": "string",
        "usedApps[]": "Enum('http' | 'xml')",
        "cols[]": "Enum('id' | 'name' | 'description' | 'url' | 'usedApps' | 'usage')",
        "pg[sortBy]": "string",
        "pg[offset]": 0,
        "pg[sortDir]": "string",
        "pg[limit]": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.templates.public.detail(
    {
        "templateUrl": "string",
        "templatePublicId": 0,
        "cols[]": "Enum('id' | 'name' | 'description' | 'url' | 'usedApps' | 'usage')"
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));

await base.templates.public.blueprint(
    {
        "templateUrl": "string",
        "templatePublicId": 0
    }, {})
    .then(res => res.json())
    .then(json => console.log(json));
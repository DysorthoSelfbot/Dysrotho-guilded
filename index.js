const guilded = require('@guildedjs/guilded.js');
const fetch = require('node-fetch');

var client = new guilded.Client()

var config = require('./config.json')

client.login({
    email: config.email,
    password: config.password
});

client.on("messageCreate", async (message) => {

    if (message.authorID !== client.user.raw.id) return

    if (typeof message.content === "string") {

        var res = await fetch("https://orthographe.reverso.net/api/v1/Spelling", {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                "referer": "https://www.reverso.net/",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
            },
            body: JSON.stringify({
                "interfaceLanguage": "fr",
                "language": "fra",
                "text": message.content,
                "autoReplace": true,
                "locale": "Indifferent",
                "generateRecommendations": false, "generateSynonyms": false, "getCorrectionDetails": true,
                "origin": "interactive"
            })
        })
        res = await res.json()

        res.corrections.forEach(async c =>console.log(`[\x1b[33m${c.type}\x1b[0m] \x1b[31m"${c.longDescription}\x1b[0m`) ^ console.table([["Faute", c.mistakeText], ["Correction", c.correctionText], ["Réponse(s) possible(s)", await c.suggestions.map(s => s.text)]]))

        message.edit(res.text)

    }
}).on('ready', () => {
    console.log(client.user.raw.name)
})
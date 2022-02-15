const Discord = require("discord.js");
const bot_methods = require('./bot');
const config = require('dotenv').config().parsed || process.env;
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES"]});


client.login(config.TOKEN);

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});


client.on("ready", async () => {
    /*const guild = await client.guilds.fetch(config.SERVER);
    const role = await guild.roles.fetch(config.VERIFY_ROLE);
    console.log(role);
    console.log(role.members);*/

    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", async msg => {
    console.log(msg.author);
    if (msg.content === "Do you love me?") {
        msg.reply("I love you :heart:");
    }
    if (msg.content === "!verify") {
        if (msg.member.roles.cache.find(e => e.id === config.VERIFY_ROLE)) {
            msg.reply("You has a role!");
        } else {
            await msg.member.roles.add(config.VERIFY_ROLE);
            msg.reply("Verified!");
        }
    }
})
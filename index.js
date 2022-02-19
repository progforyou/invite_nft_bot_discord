const Discord = require("discord.js");
const bot_tools = require('./bot_tools');
const config = require('dotenv').config().parsed || process.env;
const db_tools = require("./db_tools")
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES"]});
const crypto = require("crypto");

const bytes_length = 10
const code_length = 20;

db_tools.openDb().then(db => {
    /*db.on('trace', (data) => {
        console.log(data);
    })*/
    client.login(config.TOKEN);

    client.on("ready", async () => {
        console.log(`Logged in as ${client.user.tag}!`)
    })

    client.on("message", async msg => {
        if (msg.content === "Do you love me?") {
            msg.reply("I love you :heart:");
        }
        if (msg.content === "!verify") {
            await db_tools.insert_user(db, msg.author);
            await bot_tools.take_role(client, msg.member);
            msg.reply("You verify!");
        }
        if (msg.content === "!code") {
            let code = crypto.randomBytes(bytes_length).toString('hex');
            if (await db_tools.check_code(db, code)) code = crypto.randomBytes(bytes_length).toString('hex');
            if (await db_tools.check_user(db, msg.author)) {
                let initiator = await db_tools.get_user(db, msg.author);
                await db_tools.create_invite(db, code, initiator.id);
                msg.reply(code);
            } else {
                let initiator = await db_tools.insert_user(db, msg.author);
                await bot_tools.take_role(client, msg.member);
                msg.reply("You verify!");
                await db_tools.create_invite(db, code, initiator.id);
                msg.reply(code);
            }
        }
        if (msg.content === "!count") {
            if (await db_tools.check_user(db, msg.author)) {
                let initiator = await db_tools.get_user(db, msg.author);
                let count = await db_tools.count_invites(db, initiator.id);
                msg.reply(`You invited ${count} users!`);
            } else {
                msg.reply('You not verufy!');
            }
        }
        if (msg.content.length === code_length && !msg.author.bot) {
            if (await db_tools.check_code(db, msg.content)) {
                //invited is NULL!!
                if (await db_tools.check_already_receive_invite(db, msg.content)) {
                    let code_row = await db_tools.get_code(db, msg.content);
                    if (await db_tools.check_user(db, msg.author)) {
                        let invited = await db_tools.get_user(db, msg.author);
                        // invite yourself
                        if (code_row.initiator === invited.id) {
                            msg.reply("You cannot invite yourself!");
                            return
                        }
                        // already invited
                        if (await db_tools.check_resent_invited(db, invited.id)) {
                            msg.reply("You already invited!");
                            return
                        }
                        await db_tools.receive_invite(db, msg.content, invited.id);
                        await bot_tools.take_role(client, msg.member);
                        msg.reply("You invited!")
                    } else {
                        await db_tools.insert_user(db, msg.author);
                        let invited = await db_tools.get_user(db, msg.author);
                        await db_tools.receive_invite(db, msg.content, invited.id);
                        await bot_tools.take_role(client, msg.member);
                        msg.reply("You invited!")
                    }
                } else {
                    msg.reply("Code useless!");
                }
            } else {
                msg.reply("Invalid code");
            }
        }
    })
})
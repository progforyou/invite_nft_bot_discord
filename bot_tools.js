const config = require('dotenv').config().parsed || process.env;

const take_role = async (client, user) => {
    const guild = await client.guilds.fetch(config.SERVER);
    const role = await guild.roles.fetch(config.VERIFY_ROLE);
    await user.roles.add([role])
    const channel = await client.channels.cache.get(config.MAIN_CHANNEL_ID);
    console.log(user);
    await channel.send(`Welcome user ${user.user.username}!`);
}

module.exports = {
    take_role
};
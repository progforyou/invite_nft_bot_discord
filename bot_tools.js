const config = require('dotenv').config().parsed || process.env;

const check_role = async (client, user_name, discriminator) => {
    const guild = await client.guilds.fetch(config.SERVER);
    const members = await guild.members.fetch();
    let user;
    if (discriminator.length) user = members.find(e => e.user.username === user_name && e.user.discriminator === discriminator.toString());
    else user = members.find(e => e.user.username === user_name);
    return user.roles.cache.some(e => e.id === config.VERIFY_ROLE);
}

const set_role = async (client, user_name, discriminator) => {
    const guild = await client.guilds.fetch(config.SERVER);
    let user = await check_user(user_name, discriminator);
    const role = await guild.roles.fetch(config.VERIFY_ROLE);
    await user.roles.add([role])
    await send_set_role_msg(user_name);
    return null
}

const remove_role = async (client, user_name, discriminator) => {
    let user = await check_user(user_name, discriminator);
    const guild = await client.guilds.fetch(config.SERVER);
    const role = await guild.roles.fetch(config.VERIFY_ROLE);
    await user.roles.remove([role])
    await send_remove_role_msg(user_name);
    return null
}

const check_user = async (client, user_name, discriminator) => {
    const guild = await client.guilds.fetch(config.SERVER);
    const members = await guild.members.fetch();
    if (discriminator.length) return members.find(e => e.user.username === user_name && e.user.discriminator === discriminator.toString());
    else return members.find(e => e.user.username === user_name);
}

const send_set_role_msg = async (client, user_name) => {
    const channel = await client.channels.cache.get(config.MAIN_CHANNEL_ID);
    await channel.send(`Welcome user ${user_name}!`);
}

const send_remove_role_msg = async (client, user_name) => {
    const channel = await client.channels.cache.get(config.MAIN_CHANNEL_ID);
    await channel.send(`Buy user ${user_name}!`);
}

module.exports = {
    check_user,
    remove_role,
    set_role,
    check_role,
    send_set_role_msg,
    send_remove_role_msg
};
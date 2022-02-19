const sqlite3 = require('sqlite3');
const {open} = require('sqlite');

// you would have to import / invoke this in another file
async function openDb() {
    return open({
        filename: './database.db',
        driver: sqlite3.Database
    })
}

const create_invite = async (db, code, userId) => {
    return db.run(`INSERT INTO invitation (body, initiator)
                   VALUES ('${code}', ${userId})`);
}

const get_user = async (db, user) => {
    let name = get_user_name(user);
    return await db.get(`SELECT *
                         FROM users
                         WHERE name = '${name}'`)
}

const check_user = async (db, user) => {
    let name = get_user_name(user);
    let user_row = await db.get(`SELECT *
                                 FROM users
                                 WHERE name = '${name}'`);
    return !!user_row;
}

const insert_user = async (db, user) => {
    let name = get_user_name(user);
    return db.run(`INSERT INTO users (name)
                   VALUES ('${name}')`);
}

const check_code = async (db, code) => {
    let code_row = await db.get(`SELECT *
                                 FROM invitation
                                 WHERE body = '${code}'`);
    return !!code_row;
}

const get_code = async (db, code) => {
    return await db.get(`SELECT *
                         FROM invitation
                         WHERE body = '${code}'`);
}

const check_already_receive_invite = async (db, code) => {
    let row_invite = await db.get(`SELECT *
                                   FROM invitation
                                   WHERE body = '${code}'`);
    return !row_invite.invited;
}

const receive_invite = async (db, code, userId) => {
    return db.run(`UPDATE invitation
                   SET invited = ${userId}
                   WHERE body = '${code}'`);
}

const check_resent_invited = async (db, userId) => {
    let code_row = await db.get(`SELECT *
                                 FROM invitation
                                 WHERE invited = '${userId}'`);
    return !!code_row;
}

const count_invites = async (db, userId) => {
    let count = await db.get(`SELECT COUNT(*) AS 'count'
                              FROM invitation
                              WHERE initiator = '${userId}'`);
    return count.count
}

const get_user_name = (user) => {
    return `${user.username}#${user.discriminator}`
}

module.exports = {
    openDb,
    check_user,
    insert_user,
    get_user,
    create_invite,
    receive_invite,
    check_code,
    get_code,
    check_resent_invited,
    count_invites,
    check_already_receive_invite
}
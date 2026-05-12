const fs = require('fs');

function getData() {
    if (!fs.existsSync('./data/whitelist.json')) return {};
    return JSON.parse(fs.readFileSync('./data/whitelist.json'));
}

function saveData(data) {
    fs.writeFileSync('./data/whitelist.json', JSON.stringify(data, null, 2));
}

function getGuild(guildId) {
    const data = getData();

    if (!data[guildId]) {
        data[guildId] = {
            users: [],
            roles: [],
            modRoles: []
        };
        saveData(data);
    }

    return data[guildId];
}

// ✅ FULL ACCESS
function hasFullAccess(member) {
    const guild = getGuild(member.guild.id);

    if (guild.users.includes(member.id)) return true;
    if (member.roles.cache.some(r => guild.roles.includes(r.id))) return true;

    return false;
}

// ✅ MOD ACCESS
function hasModAccess(member) {
    const guild = getGuild(member.guild.id);

    if (hasFullAccess(member)) return true;

    return member.roles.cache.some(r => guild.modRoles.includes(r.id));
}

function hasLinkBypass(member) {
    const guild = getGuild(member.guild.id);
    return member.roles.cache.some(r => guild.linkBypassRoles.includes(r.id));
}

module.exports = {
    getData,
    saveData,
    getGuild,
    hasFullAccess,
    hasModAccess,
    hasLinkBypass
};
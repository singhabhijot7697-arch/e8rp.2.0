const badwords = require('../data/badwords');
const fs = require('fs');
const { modDM } = require('./embed');
const { hasLinkBypass } = require('./whitelist');

const TIME = 5 * 60 * 60 * 1000; // 5 hours

// ✅ BAD WORD CHECK
function containsBadWord(content) {
    const text = content.toLowerCase();
    return badwords.some(word => text.includes(word));
}

// ✅ ALLOWED LINKS
function isAllowedLink(content) {
    const text = content.toLowerCase();

    if (text.includes("imgur.com")) return true;

    if (/\.(png|jpg|jpeg|gif|webp)$/i.test(text)) return true;

    return false;
}

// ✅ DETECT ANY LINK
function containsBlockedLink(content) {
    return /(https?:\/\/|discord\.gg\/)/i.test(content);
}

// ✅ MASS MENTION
function isMassMention(message) {
    return message.mentions.users.size >= 5 || message.mentions.roles.size >= 3;
}

// ✅ WARN SYSTEM (PER SERVER)
function addWarn(guildId, userId, reason) {
    let data = {};

    if (fs.existsSync('./data/warnings.json')) {
        data = JSON.parse(fs.readFileSync('./data/warnings.json'));
    }

    if (!data[guildId]) data[guildId] = {};
    if (!data[guildId][userId]) data[guildId][userId] = [];

    data[guildId][userId].push(reason);

    fs.writeFileSync('./data/warnings.json', JSON.stringify(data, null, 2));
}

// ✅ PUNISH FUNCTION
async function punish(message, reason) {
    const member = message.member;
    if (!member) return;

    try {
        // delete msg
        await message.delete().catch(()=>{});

        // timeout
        await member.timeout(TIME, reason).catch(()=>{});

        // warn
        addWarn(message.guild.id, member.id, reason);

        // DM
        await member.send({
            embeds: [
                modDM(
                    "Automod Action",
                    `${reason}\n\nTimeout: 5 hours`,
                    message.guild
                )
            ]
        }).catch(()=>{});

    } catch (err) {
        console.error(err);
    }
}

// ✅ MAIN AUTOMOD
async function runAutomod(message) {

    if (!message.guild) return;
    if (message.author.bot) return;

    const content = message.content;

    // ✅ BAD WORD / ABUSE
    if (containsBadWord(content)) {
        return punish(message, "Used abusive language");
    }

    // ✅ LINKS
    if (containsBlockedLink(content)) {

        // bypass role
        if (hasLinkBypass(message.member)) return;

        // allow imgur + images
        if (isAllowedLink(content)) return;

        return punish(message, "Sending links is not allowed");
    }

    // ✅ MASS MENTION
    if (isMassMention(message)) {
        return punish(message, "Mass mentioning is not allowed");
    }
}

module.exports = { runAutomod };
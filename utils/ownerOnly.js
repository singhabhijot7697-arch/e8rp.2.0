require('dotenv').config();

function isOwner(id) {
  return id === process.env.OWNER_ID;
}

module.exports = { isOwner };
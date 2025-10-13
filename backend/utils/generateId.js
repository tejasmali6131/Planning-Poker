//Generates a random 6-character alphanumeric ID for the planning poker sessions
const { customAlphabet } = require('nanoid');

const generateId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 6);

module.exports = generateId;
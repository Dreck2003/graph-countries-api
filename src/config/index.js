require("dotenv").config();
const DB = require("./db/index");
const { SERVER } = require("./server/index");

const NODE_ENV = {
	production: "production",
};

const ENV_VARS = {
	DB: { ...DB },
	IS_PRODUCTION: process.env.NODE_ENV ? process.env.NODE_ENV === NODE_ENV.production : false,
	SERVER: { ...SERVER },
};

module.exports = {
	ENV_VARS,
};

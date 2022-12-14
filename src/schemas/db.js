const { Sequelize } = require("sequelize");
const objectModels = require("./readModels");
const {
	ENV_VARS: { DB, IS_PRODUCTION },
} = require("../config/index");

const getNameModel = (name) => name[0].toUpperCase() + name.slice(1).toLowerCase();

const sequelize = new Sequelize(DB.NAME, DB.USERNAME, DB.PASSWORD, {
	host: DB.HOST,
	port: Number(DB.PORT),
	dialect: "postgres",
	logging: false,
	ssl: true,
	pool: {
		acquire: 60000,
	},
});

// Read all models and defined the tables models with sequelize:
const modelsSequelize = Object.entries(objectModels).reduce((acc, [name, model]) => {
	const modelName = getNameModel(name);
	const modelSeq = sequelize.define(modelName, model);
	return { ...acc, [modelName]: modelSeq };
}, {});

const { Country, Region, Border, Language } = modelsSequelize;

/**** Define the relationship between models: ***/

// Country --> Region
Country.belongsTo(Region);
Region.hasMany(Country);

// Country --> Border
Country.belongsToMany(Border, { through: "Country_Border" });
Border.belongsToMany(Country, { through: "Country_Border" });

// Country --> Language
Country.belongsToMany(Language, { through: "Country_Language" });
Language.belongsToMany(Country, { through: "Country_Language" });

const connection_db = (callback) => {
	// If the force is true, then the databse is retore, if is production, then not restore the database
	const restore = IS_PRODUCTION ? {} : { force: true };
	sequelize
		.sync(restore)
		.then(callback)
		.catch((err) => {
			console.log("error to connect with database: ", err);
		});
};

module.exports = {
	...modelsSequelize,
	connection: connection_db,
};

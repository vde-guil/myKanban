const { Sequelize } = require('sequelize');

//On instancie un objet de la classe sequelize
const sequelize = new Sequelize(process.env.PG_URL || process.env.DATABASE_URL, {
    define: {
        //permet le nom de champs en snake_case
        underscored: true,

    },
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
        ssl: {
            required: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = sequelize;
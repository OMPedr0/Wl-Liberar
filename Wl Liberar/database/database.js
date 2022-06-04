const Sequelize = require("sequelize");
const connection = require("./mysql")


var whitelist = connection.define('vrp_users', {
    whitelisted: {
        type: Sequelize.STRING,
        Allownull: true
    },
    banned: {
        type: Sequelize.STRING,
        Allownull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
})

var usuario = connection.define('vrp_user_identities', {
    user_id: {
        type: Sequelize.STRING,
        Allownull: true,
        primaryKey: true
    },
    registration: {
        type: Sequelize.STRING,
        Allownull: true
    },
    firstname: {
        type: Sequelize.STRING,
        Allownull: true
    },
    name: {
        type: Sequelize.STRING,
        Allownull: true
    },
    age: {
        type: Sequelize.STRING,
        Allownull: true
    },
    phone: {
        type: Sequelize.STRING,
        Allownull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
})


var veiculo = connection.define('vrp_user_vehicles', {
    user_id: {
        type: Sequelize.STRING,
        Allownull: true,
        primaryKey: true
    },
    vehicle: {
        type: Sequelize.STRING,
        Allownull: true
    },
    detido: {
        type: Sequelize.STRING,
        Allownull: true
    },
    time: {
        type: Sequelize.STRING,
        Allownull: true
    },
    engine: {
        type: Sequelize.STRING,
        Allownull: true
    },
    body: {
        type: Sequelize.STRING,
        Allownull: true
    },
    fuel: {
        type: Sequelize.STRING,
        Allownull: true
    },
    ipva: {
        type: Sequelize.STRING,
        Allownull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
})

var money = connection.define('vrp_user_moneys', {
    user_id: {
        type: Sequelize.STRING,
        Allownull: true,
        primaryKey: true
    },
    wallet: {
        type: Sequelize.STRING,
        Allownull: true
    },
    bank: {
        type: Sequelize.STRING,
        Allownull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
})



module.exports = { whitelist, veiculo, usuario, money }
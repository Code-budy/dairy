const env = require("./dbConfig.js");

const { Sequelize, DataTypes } = require("sequelize");

// DB CONNECTION
const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect,
    timezone: "+05:30",
    dialectOptions: {
        timezone: "local"
    },
    pool: {
        min: 0,
        max: 5,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

// TEST CONNECTION
sequelize.authenticate()
    .then(() => console.log("🐄 Dairy App Database Connected"))
    .catch(err => console.log("❌ DB Connection Error:", err.message));


// --------------------------------------------------------
// DB OBJECT
// --------------------------------------------------------
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


// --------------------------------------------------------
// MODELS IMPORT
// --------------------------------------------------------
db.admin = require("../models/admin.model")(sequelize, DataTypes);
db.farmer = require("../models/farmer.model")(sequelize, DataTypes);
db.customer = require("../models/customer.model")(sequelize, DataTypes);

db.milk_collection = require("../models/milk_collection.model")(sequelize, DataTypes);
db.milk_purchase = require("../models/milk_purchase.model")(sequelize, DataTypes);

db.payment = require("../models/payments.model")(sequelize, DataTypes);
db.bill = require("../models/bills.model")(sequelize, DataTypes);


// --------------------------------------------------------
// MODEL RELATIONSHIPS
// --------------------------------------------------------

// ========== ADMIN RELATIONS ==========
db.admin.hasMany(db.farmer, {
    foreignKey: "created_by",
    as: "createdFarmers"
});
db.farmer.belongsTo(db.admin, {
    foreignKey: "created_by",
    as: "createdByAdmin"
});

db.admin.hasMany(db.customer, {
    foreignKey: "created_by",
    as: "createdCustomers"
});
db.customer.belongsTo(db.admin, {
    foreignKey: "created_by",
    as: "createdByAdmin"
});

db.admin.hasMany(db.milk_collection, {
    foreignKey: "created_by",
    as: "milkCollections"
});
db.milk_collection.belongsTo(db.admin, {
    foreignKey: "created_by",
    as: "createdByAdmin"
});

db.admin.hasMany(db.milk_purchase, {
    foreignKey: "created_by",
    as: "milkPurchases"
});
db.milk_purchase.belongsTo(db.admin, {
    foreignKey: "created_by",
    as: "createdByAdmin"
});

db.admin.hasMany(db.payment, {
    foreignKey: "created_by",
    as: "payments"
});
db.payment.belongsTo(db.admin, {
    foreignKey: "created_by",
    as: "createdByAdmin"
});

db.admin.hasMany(db.bill, {
    foreignKey: "created_by",
    as: "bills"
});
db.bill.belongsTo(db.admin, {
    foreignKey: "created_by",
    as: "createdByAdmin"
});


// ========== FARMER RELATIONS ==========
db.farmer.hasMany(db.milk_collection, {
    foreignKey: "farmer_id",
    as: "collections"
});
db.milk_collection.belongsTo(db.farmer, {
    foreignKey: "farmer_id",
    as: "farmer"
});

db.farmer.hasMany(db.payment, {
    foreignKey: "farmer_id",
    as: "payments"
});
db.payment.belongsTo(db.farmer, {
    foreignKey: "farmer_id",
    as: "farmer"
});


// ========== CUSTOMER RELATIONS ==========
db.customer.hasMany(db.milk_purchase, {
    foreignKey: "customer_id",
    as: "purchases"
});
db.milk_purchase.belongsTo(db.customer, {
    foreignKey: "customer_id",
    as: "customer"
});

db.customer.hasMany(db.bill, {
    foreignKey: "customer_id",
    as: "bills"
});
db.bill.belongsTo(db.customer, {
    foreignKey: "customer_id",
    as: "customer"
});


// --------------------------------------------------------
// EXPORT DB
// --------------------------------------------------------
module.exports = db;

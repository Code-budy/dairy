module.exports = (sequelize, DataTypes) => {
    const customer = sequelize.define(
        "customer",
        {
            customer_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            address: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            milk_type: {
                type: DataTypes.ENUM("COW", "BUFFALO"),
                allowNull: false,
            },

            rate_per_litre: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },

            status: {
                type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
                defaultValue: "ACTIVE",
            },

            created_by: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "admins",
                    key: "admin_id",
                },
            },

            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: "customers",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
        }
    );

    return customer;
};

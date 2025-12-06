module.exports = (sequelize, DataTypes) => {
    const milk_purchase = sequelize.define(
        "milk_purchase",
        {
            purchase_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "customers",
                    key: "customer_id",
                },
            },

            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            shift: {
                type: DataTypes.ENUM("MORNING", "EVENING"),
                allowNull: false,
            },

            litres: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },

            total_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
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
            tableName: "milk_purchase",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
        }
    );

    return milk_purchase;
};

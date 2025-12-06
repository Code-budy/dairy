module.exports = (sequelize, DataTypes) => {
    const bill = sequelize.define(
        "bill",
        {
            bill_id: {
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

            month: {
                type: DataTypes.STRING, // e.g. "2025-01"
                allowNull: false,
            },

            total_litres: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },

            total_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },

            status: {
                type: DataTypes.ENUM("PAID", "UNPAID"),
                defaultValue: "UNPAID",
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
            tableName: "bills",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
        }
    );

    return bill;
};

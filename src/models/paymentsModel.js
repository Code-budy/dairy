module.exports = (sequelize, DataTypes) => {
    const payment = sequelize.define(
        "payment",
        {
            payment_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            farmer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "farmers",
                    key: "farmer_id",
                },
            },

            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },

            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            note: {
                type: DataTypes.STRING,
                allowNull: true,
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
            tableName: "payments",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
        }
    );

    return payment;
};

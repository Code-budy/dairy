module.exports = (sequelize, DataTypes) => {
    const milk_collection = sequelize.define(
        "milk_collection",
        {
            collection_id: {
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

            fat: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
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
            tableName: "milk_collection",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
        }
    );

    return milk_collection;
};

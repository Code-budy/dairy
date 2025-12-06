module.exports = (sequelize, DataTypes) => {
    const admin = sequelize.define(
        'admin',
        {
            admin_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false
            },

            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false
            },

            role: {
                type: DataTypes.ENUM(["ADMIN"]),
                defaultValue: "ADMIN"
            },

            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'admins',
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true
        }
    );

    return admin;
};

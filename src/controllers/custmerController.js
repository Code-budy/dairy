const bcrypt = require("bcryptjs");
const { sendError, sendSuccess } = require("../../utils/responseHandler");
const db = require("../../configs/db.config");

const Farmer = db.farmer;
const createJwtToken = require("../../helpers/jwtTokenHelper");

module.exports.loginFarmer = async (req, res) => {
    try {
        const { mobile_number, password } = req.body;

        if (!mobile_number || !password) {
            return sendError(res, "Mobile number and password are required", 400);
        }

        // Find farmer
        const farmer = await Farmer.findOne({
            where: { mobile_number }
        });

        if (!farmer) {
            return sendError(res, "Invalid mobile number or password", 401);
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, farmer.password);
        if (!isPasswordValid) {
            return sendError(res, "Invalid mobile number or password", 401);
        }

        // Generate JWT for Farmer
        const token = await createJwtToken({
            user_id: farmer.farmer_id,
            mobile_number: farmer.mobile_number,
            type: "FARMER"
        });

        const responseData = {
            token,
            id: farmer.farmer_id,
            name: farmer.full_name,
            mobile_number: farmer.mobile_number,
            user_type: "FARMER"
        };

        return sendSuccess(res, responseData, "Farmer login successful");

    } catch (error) {
        console.error("FARMER LOGIN ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

// ==================== GET TODAY'S MILK COLLECTION ====================
exports.getTodayMilkCollection = async (req, res) => {
    try {
        const farmer_id = req.farmer.user_id; // from JWT

        const today = new Date();
        const dateStr = today.toISOString().split("T")[0]; // yyyy-mm-dd

        const collections = await MilkCollection.findAll({
            where: {
                farmer_id,
                date: dateStr,
                is_deleted: false
            }
        });

        return sendSuccess(res, collections, "Today's milk collection fetched");
    } catch (error) {
        console.error("GET TODAY COLLECTION ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

// ==================== GET MONTHLY MILK COLLECTION ====================
exports.getMonthlyMilkCollection = async (req, res) => {
    try {
        const farmer_id = req.farmer.user_id;
        const { month, year } = req.query;

        if (!month || !year) return sendError(res, "Month and year are required", 400);

        const collections = await MilkCollection.findAll({
            where: {
                farmer_id,
                is_deleted: false,
                [db.Sequelize.Op.and]: [
                    db.Sequelize.where(db.Sequelize.fn('MONTH', db.Sequelize.col('date')), month),
                    db.Sequelize.where(db.Sequelize.fn('YEAR', db.Sequelize.col('date')), year)
                ]
            }
        });

        return sendSuccess(res, collections, "Monthly milk collection fetched");
    } catch (error) {
        console.error("GET MONTHLY COLLECTION ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

// ==================== GET PAYMENTS / LEDGER ====================
exports.getPayments = async (req, res) => {
    try {
        const farmer_id = req.farmer.user_id;

        const payments = await Payment.findAll({
            where: { farmer_id },
        });

        const collections = await MilkCollection.findAll({
            where: { farmer_id, is_deleted: false },
        });

        return sendSuccess(res, { payments, collections }, "Farmer ledger fetched");
    } catch (error) {
        console.error("GET PAYMENTS ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};
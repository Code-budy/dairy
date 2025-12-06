const bcrypt = require("bcryptjs");
const { sendError, sendSuccess } = require("../../utils/responseHandler");
const db = require("../../configs/db.config");

const Admin = db.admin;
const Role = db.roles;
const RolePermissions = db.role_permissions;
const Permissions = db.permissions;
const createJwtToken = require("../../helpers/jwtTokenHelper");

module.exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, "Email and password are required", 400);
        }

        // Find admin
        const admin = await Admin.findOne({
            where: { email },
            include: [
                {
                    model: Role,
                    as: "roles",
                }
            ]
        });

        if (!admin) {
            return sendError(res, "Invalid email or password", 401);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return sendError(res, "Invalid email or password", 401);
        }

        // Generate JWT
        const token = await createJwtToken({
            user_id: admin.admin_id,
            email: admin.email,
            role_id: admin.role_id,
            type: "ADMIN"
        });

        // Fetch permissions
        const userPermissions = await RolePermissions.findAll({
            where: { role_id: admin.role_id },
            include: [
                {
                    model: Permissions,
                    as: "permission",
                    attributes: ["permission_name"]
                }
            ]
        });

        const permissionsArray = userPermissions.map(p => p.permission?.permission_name);

        const responseData = {
            token,
            id: admin.admin_id,
            name: admin.full_name,
            email: admin.email,
            user_type: "ADMIN",
            role_id: admin.role_id,
            permissions: permissionsArray
        };

        return sendSuccess(res, responseData, "Admin login successful");

    } catch (error) {
        console.error("ADMIN LOGIN ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};


// curd of Farmer
exports.createFarmer = async (req, res) => {
    try {
        const { full_name, mobile_number, password, address, created_by } = req.body;

        if (!full_name || !mobile_number || !password) {
            return sendError(res, "Full name, mobile number and password are required", 400);
        }

        // Check if farmer already exists
        const existingFarmer = await Farmer.findOne({ where: { mobile_number, is_deleted: false } });
        if (existingFarmer) return sendError(res, "Farmer with this mobile already exists", 400);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newFarmer = await Farmer.create({
            full_name,
            mobile_number,
            password: hashedPassword,
            address,
            created_by
        });

        return sendSuccess(res, newFarmer, "Farmer created successfully");

    } catch (error) {
        console.error("CREATE FARMER ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

// ================= GET ALL FARMERS =================
exports.getAllFarmers = async (req, res) => {
    try {
        const farmers = await Farmer.findAll({ where: { is_deleted: false } });
        return sendSuccess(res, farmers, "Farmers fetched successfully");
    } catch (error) {
        console.error("GET FARMERS ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

// ================= GET SINGLE FARMER =================
exports.getFarmerById = async (req, res) => {
    try {
        const { id } = req.params;
        const farmer = await Farmer.findOne({ where: { farmer_id: id, is_deleted: false } });
        if (!farmer) return sendError(res, "Farmer not found", 404);
        return sendSuccess(res, farmer, "Farmer fetched successfully");
    } catch (error) {
        console.error("GET FARMER ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

// ================= UPDATE FARMER =================
exports.updateFarmer = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, mobile_number, password, address } = req.body;

        const farmer = await Farmer.findOne({ where: { farmer_id: id, is_deleted: false } });
        if (!farmer) return sendError(res, "Farmer not found", 404);

        if (password) {
            farmer.password = await bcrypt.hash(password, 10);
        }

        farmer.full_name = full_name || farmer.full_name;
        farmer.mobile_number = mobile_number || farmer.mobile_number;
        farmer.address = address || farmer.address;

        await farmer.save();
        return sendSuccess(res, farmer, "Farmer updated successfully");

    } catch (error) {
        console.error("UPDATE FARMER ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

// ================= SOFT DELETE FARMER =================
exports.deleteFarmer = async (req, res) => {
    try {
        const { id } = req.params;
        const farmer = await Farmer.findOne({ where: { farmer_id: id, is_deleted: false } });
        if (!farmer) return sendError(res, "Farmer not found", 404);

        farmer.is_deleted = true;
        await farmer.save();

        return sendSuccess(res, null, "Farmer deleted successfully");

    } catch (error) {
        console.error("DELETE FARMER ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
}


//

// ==================== MILK COLLECTION ====================
exports.addMilkCollection = async (req, res) => {
    try {
        const { farmer_id, date, shift, liters, fat, rate } = req.body;
        if (!farmer_id || !date || !shift || !liters) {
            return sendError(res, "Farmer, date, shift and liters are required", 400);
        }

        const amount = rate ? liters * rate : null;

        const collection = await MilkCollection.create({
            farmer_id,
            date,
            shift,
            liters,
            fat,
            rate,
            amount,
            created_by: req.admin.user_id
        });

        return sendSuccess(res, collection, "Milk collection added successfully");
    } catch (error) {
        console.error("ADD COLLECTION ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

exports.getDailyCollection = async (req, res) => {
    try {
        const { date } = req.query;
        const where = { is_deleted: false };
        if (date) where.date = date;

        const collections = await MilkCollection.findAll({
            where,
            include: [{ model: Farmer, as: "farmer", attributes: ["full_name", "mobile_number"] }]
        });

        return sendSuccess(res, collections, "Daily milk collections fetched");
    } catch (error) {
        console.error("GET DAILY COLLECTION ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

// ==================== MILK PURCHASE ====================
exports.addMilkPurchase = async (req, res) => {
    try {
        const { farmer_id, date, liters, rate } = req.body;
        if (!farmer_id || !date || !liters) return sendError(res, "Required fields missing", 400);

        const amount = rate ? liters * rate : null;

        const purchase = await MilkPurchase.create({
            farmer_id,
            date,
            liters,
            rate,
            amount,
            created_by: req.admin.user_id
        });

        return sendSuccess(res, purchase, "Milk purchase added successfully");
    } catch (error) {
        console.error("ADD PURCHASE ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

exports.getMonthlyPurchase = async (req, res) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) return sendError(res, "Month and year are required", 400);

        const purchases = await MilkPurchase.findAll({
            where: db.Sequelize.where(
                db.Sequelize.fn('MONTH', db.Sequelize.col('date')),
                month
            ),
            include: [{ model: Farmer, as: "farmer", attributes: ["full_name"] }]
        });

        return sendSuccess(res, purchases, "Monthly purchases fetched");
    } catch (error) {
        console.error("GET MONTHLY PURCHASE ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

// ==================== PAYMENTS ====================
exports.addPayment = async (req, res) => {
    try {
        const { farmer_id, amount, payment_date, mode, note } = req.body;
        if (!farmer_id || !amount || !mode) return sendError(res, "Required fields missing", 400);

        const payment = await Payment.create({
            farmer_id,
            amount,
            payment_date,
            mode,
            note,
            created_by: req.admin.user_id
        });

        return sendSuccess(res, payment, "Payment added successfully");
    } catch (error) {
        console.error("ADD PAYMENT ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

exports.getFarmerLedger = async (req, res) => {
    try {
        const { farmer_id } = req.params;
        if (!farmer_id) return sendError(res, "Farmer ID is required", 400);

        const collections = await MilkCollection.findAll({
            where: { farmer_id },
        });

        const payments = await Payment.findAll({
            where: { farmer_id },
        });

        return sendSuccess(res, { collections, payments }, "Farmer ledger fetched");
    } catch (error) {
        console.error("GET FARMER LEDGER ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

// ==================== BILLS ====================
exports.generateMonthlyBill = async (req, res) => {
    try {
        const { farmer_id, month, year } = req.body;
        if (!farmer_id || !month || !year) return sendError(res, "Farmer ID, month, year required", 400);

        const collections = await MilkCollection.findAll({
            where: {
                farmer_id,
                date: db.Sequelize.where(
                    db.Sequelize.fn('MONTH', db.Sequelize.col('date')),
                    month
                )
            }
        });

        const total_liters = collections.reduce((sum, c) => sum + c.liters, 0);
        const total_amount = collections.reduce((sum, c) => sum + (c.amount || 0), 0);

        const bill = await Bill.create({
            farmer_id,
            month,
            year,
            total_liters,
            total_amount,
            total_paid: 0,
            pending_amount: total_amount,
            created_by: req.admin.user_id
        });

        return sendSuccess(res, bill, "Monthly bill generated");
    } catch (error) {
        console.error("GENERATE BILL ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

exports.getAllBills = async (req, res) => {
    try {
        const bills = await Bill.findAll({
            include: [{ model: Farmer, as: "farmer", attributes: ["full_name"] }]
        });
        return sendSuccess(res, bills, "All bills fetched successfully");
    } catch (error) {
        console.error("GET BILLS ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};

exports.getBillByFarmer = async (req, res) => {
    try {
        const { farmer_id } = req.params;
        const bills = await Bill.findAll({
            where: { farmer_id },
            include: [{ model: Farmer, as: "farmer", attributes: ["full_name"] }]
        });
        return sendSuccess(res, bills, "Farmer bills fetched");
    } catch (error) {
        console.error("GET BILL BY FARMER ERROR:", error);
        return sendError(res, "Internal server error", 500, error);
    }
};
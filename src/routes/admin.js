const express = require("express");
const router = express.Router();
const { adminLogin, getDashboardData } = require("../controllers/admin.controller");

// Admin Login
router.post("/login", adminLogin);

// Admin Dashboard Summary
router.get("/dashboard", getDashboardData);



// Only admin can access these routes
router.post("/", verifyAdminToken, farmerController.createFarmer);
router.get("/", verifyAdminToken, farmerController.getAllFarmers);
router.get("/:id", verifyAdminToken, farmerController.getFarmerById);
router.put("/:id", verifyAdminToken, farmerController.updateFarmer);
router.delete("/:id", verifyAdminToken, farmerController.deleteFarmer);

// ===== Milk Collection =====
router.post("/milk-collection", verifyAdminToken, adminController.addMilkCollection);
router.get("/milk-collection", verifyAdminToken, adminController.getDailyCollection);

// ===== Milk Purchase =====
router.post("/milk-purchase", verifyAdminToken, adminController.addMilkPurchase);
router.get("/milk-purchase", verifyAdminToken, adminController.getMonthlyPurchase);

// ===== Payments =====
router.post("/payments", verifyAdminToken, adminController.addPayment);
router.get("/payments/ledger/:farmer_id", verifyAdminToken, adminController.getFarmerLedger);

// ===== Bills =====
router.post("/bills/generate", verifyAdminToken, adminController.generateMonthlyBill);
router.get("/bills", verifyAdminToken, adminController.getAllBills);
router.get("/bills/:farmer_id", verifyAdminToken, adminController.getBillByFarmer);

module.exports = router;

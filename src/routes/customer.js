
const express = require("express");
const router = express.Router();


// Add customer
router.post("/add", addCustomer);

// Get all customers
router.get("/", getCustomers);

module.exports = router;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./src/configs/db.js"); // MySQL connection
const session = require("express-session");
// ***************************** ROUTERS ************************************ //
const farmerRouter = require("./src/routes/farmer.routes");
const milkCollectionRouter = require("./src/routes/milkCollection.routes");
const milkSaleRouter = require("./src/routes/milkSale.routes");
const paymentRouter = require("./src/routes/payment.routes");
const billRouter = require("./src/routes/bill.routes");


// ***************************** ENVIRONMENT VARIABLES *********************************** //
const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL;

// ***************************** EXPRESS APP ******************************** //
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Session Setup
app.use(
    session({
        secret: process.env.JWT_SECRET_KEY || "secret123",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);

// ***************************** ROUTER MOUNT ******************************** //

// app.use("/api/admin", admin);
// app.use("/api/customer", customer);

// ***************************** DEFAULT ROUTE ******************************** //
app.get("/", (req, res) => {
    res.send("Dairy Backend Server is running");
});

// ***************************** SERVER START ******************************** //
app.listen(PORT, () => {
    console.log(
        `Dairy Backend Running on ${BACKEND_URL || `http://localhost:${PORT}`}`
    );
});

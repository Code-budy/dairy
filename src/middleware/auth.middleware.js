exports.verifyFarmerToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return sendError(res, "Access denied, no token provided", 401);

        const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET_KEY);
        if (decoded.type !== "FARMER") return sendError(res, "Unauthorized", 403);

        req.farmer = decoded; // attach farmer info
        next();
    } catch (error) {
        return sendError(res, "Invalid token", 401, error);
    }
};

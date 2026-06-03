// Middleware to protect API routes
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is authenticated
        next();
    } else {
        // User is not authenticated, return 401 Unauthorized
        res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
};

const checkLoggedIn = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is already logged in
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
};

module.exports = { requireAuth, checkLoggedIn };

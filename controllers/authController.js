// Hardcoded credentials for assessment
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'test123';

const handleLogin = (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Successful login
        req.session.userId = 'admin_user'; // Create session
        res.json({ success: true, message: 'Logged in successfully' });
    } else {
        // Failed login
        res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
};

const handleLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ success: false, error: 'Failed to logout' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
};

const checkStatus = (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
};

module.exports = {
    handleLogin,
    handleLogout,
    checkStatus
};

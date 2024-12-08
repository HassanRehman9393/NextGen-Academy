const validateResponse = (req, res, next) => {
    const { response } = req.body;
    
    if (!response || response.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Response content is required'
        });
    }

    if (response.length > 1000) {
        return res.status(400).json({
            success: false,
            message: 'Response cannot exceed 1000 characters'
        });
    }

    next();
};

module.exports = {
    validateResponse
}; 
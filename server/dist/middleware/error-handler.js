export const errorHandler = (err, req, res) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error',
    });
};
//# sourceMappingURL=error-handler.js.map
const authRoutes = require('./modules/auth/routes/authRoutes');

// Mount auth routes
app.use('/api/auth', authRoutes); 
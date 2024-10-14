const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const promotionsRoutes = require('./routes/promotionsRoutes');
const promotionMappingRoutes = require('./routes/promotionMappingRoutes');
const billingRoutes = require('./routes/billingRoutes');
const billingListRoutes = require('./routes/billingListRoutes');
const addressRoutes = require('./routes/addressRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:4000', // Allow access from frontend address
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // If cookies need to be sent
}));

app.use(bodyParser.json()); // Use body-parser to parse JSON

// Routes
app.use('/api/users', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/promotionMapping', promotionMappingRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/billingList', billingListRoutes);
app.use('/api/address', addressRoutes);

// Set static middleware to access files in uploads
app.use('/uploads', express.static('uploads'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

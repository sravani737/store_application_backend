const express = require('express');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes')
const cartRoutes = require('./src/routes/CartRoutes');
const orderRoutes = require('./src/routes/OrderRoutes')
const ReviewRoutes = require('./src/routes/ReviewRoutes')


const app = express();

// Middleware
app.use(express.json());
const cors = require('cors');
app.use(cors());


// Connect to the Database
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/roles',roleRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api',cartRoutes);
app.use('/api',orderRoutes)
app.use('/api',ReviewRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log(`Server running on port ${PORT}`));

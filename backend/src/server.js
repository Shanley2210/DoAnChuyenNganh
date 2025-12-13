const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/connectdb');
const initWebRoutes = require('./routes/web');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

initWebRoutes(app);

const startServer = async () => {
    try {
        await connectDB();

        const port = process.env.PORT || 3001;

        app.listen(port, () => {
            console.log(`Backend Node.js is running on port: ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

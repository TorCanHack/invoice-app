const express = require('express');
const cors = require('cors');
const invoiceRoutes = require('./routes/invoice_records');
const dotenv = require('dotenv');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

app.use('/api', invoiceRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));



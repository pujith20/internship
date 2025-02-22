const express = require('express');
const cors = require('cors');
const transactionsRoutes = require('./apis/transactions'); // Import transaction APIs

const app = express();
const PORT = 5000;

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/transactions', transactionsRoutes); // Use the transactions routes for all transaction-related APIs

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

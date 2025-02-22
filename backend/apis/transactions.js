const express = require('express');
const axios = require('axios');
const router = express.Router();

const THIRD_PARTY_API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

// Helper function to filter data by month
function filterDataByMonth(data, month) {
    return data.filter(item => {
        const date = new Date(item.dateOfSale);
        const itemMonth = date.toLocaleString('default', { month: 'long' }); // Get full month name
        return itemMonth === month;
    });
}

function filterDataBySearch(data, search) {
    if (!search) return data; // Return all data if search is empty
    const searchTerm = search.toLowerCase();
    return data.filter(item => {
        return (
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.price.toString().includes(searchTerm)
        );
    });
}

// GET: List all transactions (filtered by month)
router.get('/', async (req, res) => {
    const { month = 'March', search = '' } = req.query;
    try {
        const { data } = await axios.get(THIRD_PARTY_API_URL);
        let filteredData = filterDataByMonth(data, month);
        filteredData = filterDataBySearch(filteredData, search);
        res.json({ transactions: filteredData });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

// GET: Statistics (Total sale amount, sold items, not sold items)
router.get('/statistics', async (req, res) => {
    const { month = 'March' } = req.query;
    try {
        const { data } = await axios.get(THIRD_PARTY_API_URL);
        const filteredData = filterDataByMonth(data, month);

        const totalSalesAmount = filteredData.reduce((total, item) => item.sold ? total + item.price : total, 0);
        const totalSoldItems = filteredData.filter(item => item.sold).length;
        const totalNotSoldItems = filteredData.filter(item => !item.sold).length;

        res.json({
            totalSalesAmount,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

// GET: Bar Chart Data (Price range and number of items in that range)
router.get('/bar-chart', async (req, res) => {
    const { month = 'March' } = req.query;
    try {
        const { data } = await axios.get(THIRD_PARTY_API_URL);
        const filteredData = filterDataByMonth(data, month);

        const priceRanges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0
        };

        filteredData.forEach(item => {
            const price = item.price;
            if (price <= 100) priceRanges['0-100']++;
            else if (price <= 200) priceRanges['101-200']++;
            else if (price <= 300) priceRanges['201-300']++;
            else if (price <= 400) priceRanges['301-400']++;
            else if (price <= 500) priceRanges['401-500']++;
            else if (price <= 600) priceRanges['501-600']++;
            else if (price <= 700) priceRanges['601-700']++;
            else if (price <= 800) priceRanges['701-800']++;
            else if (price <= 900) priceRanges['801-900']++;
            else priceRanges['901-above']++;
        });

        res.json(priceRanges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

// GET: Pie Chart Data (Unique categories and number of items)
router.get('/pie-chart', async (req, res) => {
    const { month = 'March' } = req.query;
    try {
        const { data } = await axios.get(THIRD_PARTY_API_URL);
        const filteredData = filterDataByMonth(data, month);

        const categoryCount = {};

        filteredData.forEach(item => {
            const category = item.category;
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        res.json(categoryCount);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});


module.exports = router;
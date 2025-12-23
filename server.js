require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.static('public'));

app.get('/get-user-data', async (req, res) => {
    try {
        // 1. Get random user
        const userRes = await axios.get('https://randomuser.me/api/');
        const user = userRes.data.results[0];
        let countryName = user.location.country;

        // Handle special cases for country names
        if (countryName === 'United States') countryName = 'USA';
        if (countryName === 'United Kingdom') countryName = 'GB';

        // 2. Get country data with 404 protection
        let countryData;
        try {
            const countryRes = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
            countryData = countryRes.data[0];
        } catch (e) {

            const fallback = await axios.get(`https://restcountries.com/v3.1/name/Kazakhstan`);
            countryData = fallback.data[0];
        }

        const currencyCode = Object.keys(countryData.currencies)[0];

        // 3. Get exchange rates (check that EXCHANGE_API_KEY is in .env!)
        let exchangeData = { USD: 1, KZT: 450 };
        try {
            const exRes = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${currencyCode}`);
            exchangeData = exRes.data.conversion_rates;
        } catch (e) { console.log("Exchange API Error - using fallback"); }

        // 4. Gет News articles
        let newsData = [];
        try {
            const newsRes = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(countryName)}&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`);
            newsData = newsRes.data.articles;
        } catch (e) { console.log("News API Error"); }

        res.json({
            user: {
                name: `${user.name.first} ${user.name.last}`,
                gender: user.gender,
                photo: user.picture.large,
                age: user.dob.age,
                dob: user.dob.date,
                address: `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.country}`
            },
            country: {
                name: countryData.name.common,
                capital: countryData.capital ? countryData.capital[0] : 'N/A',
                languages: countryData.languages ? Object.values(countryData.languages).join(', ') : 'N/A',
                currency: countryData.currencies[currencyCode].name,
                flag: countryData.flags.svg
            },
            exchange: {
                usd: exchangeData.USD || 0,
                kzt: exchangeData.KZT || 0,
                base: currencyCode
            },
            news: newsData
        });

    } catch (error) {
        console.error("Critical Error:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
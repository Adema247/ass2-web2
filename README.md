# ass2-web2
# Assignment 2: Global User Explorer API

## Description
This application generates a random user and integrates three additional APIs to provide context about their country, current exchange rates, and local news.

## APIs Used
1. **Random User API**: Provides personal details.
2. **REST Countries API**: Fetches capital, flag, and official languages.
3. **ExchangeRate-API**: Compares local currency with USD and KZT.
4. **News API**: Retrieves 5 latest headlines from the user's country.

## Setup Instructions
1. Install dependencies: `npm install`
2. Create a `.env` file and add your keys:
   - `NEWS_API_KEY=your_key`
   - `EXCHANGE_API_KEY=your_key`
3. Run the server: `node server.js`
4. Open: `http://localhost:3000`

## Design Decisions
- **Server-Side Fetching**: All API calls are made in `server.js` to protect API keys and avoid CORS issues.
- **Clean UI**: Used a responsive grid system and modern CSS variables for a clean user experience.
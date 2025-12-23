const btn = document.getElementById('fetchBtn');
const content = document.getElementById('content');
const loader = document.getElementById('loader');
const userCard = document.getElementById('userCard');
const countryCard = document.getElementById('countryCard');
const newsGrid = document.getElementById('newsGrid');

btn.addEventListener('click', async () => {
    // Show loader
    loader.classList.remove('hidden');
    content.classList.add('hidden');
    
    try {
        const res = await fetch('/get-user-data');
        if (!res.ok) throw new Error('Ошибка сервера');
        const data = await res.json();

        // 1. Write user data
        userCard.innerHTML = `
            <img src="${data.user.photo}" alt="Profile" class="profile-img">
            <h2>${data.user.name}</h2>
            <p><strong>Gender:</strong> ${data.user.gender}</p>
            <p><strong>Age:</strong> ${data.user.age} (${new Date(data.user.dob).toLocaleDateString()})</p>
            <p><strong>Address:</strong> ${data.user.address}</p>
        `;

        // 2. Write country data
        countryCard.innerHTML = `
            <img src="${data.country.flag}" alt="Flag" class="flag-img">
            <h2>${data.country.name}</h2>
            <p><strong>Capital:</strong> ${data.country.capital}</p>
            <p><strong>Languages:</strong> ${data.country.languages}</p>
            <p><strong>Currency:</strong> ${data.country.currency} (${data.exchange.base})</p>
            <hr>
            <h4>Exchange Rates:</h4>
            <p>1 ${data.exchange.base} = <strong>${data.exchange.usd.toFixed(2)} USD</strong></p>
            <p>1 ${data.exchange.base} = <strong>${data.exchange.kzt.toFixed(2)} KZT</strong></p>
        `;

        // 3. Write news articles
        newsGrid.innerHTML = ''; // Clear previous news
        data.news.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
                <img src="${article.urlToImage || 'https://via.placeholder.com/300x180?text=No+Image'}" alt="News">
                <h4>${article.title}</h4>
                <p>${article.description ? article.description.substring(0, 100) + '...' : 'No description available.'}</p>
                <a href="${article.url}" target="_blank">Read Full Article</a>
            `;
            newsGrid.appendChild(newsItem);
        });

        // Hide loader and show content
        loader.classList.add('hidden');
        content.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        loader.innerHTML = `<p style="color:red">Error: ${error.message}. Make sure your server is running.</p>`;
    }
});
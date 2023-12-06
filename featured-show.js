// featured-albums.js

document.addEventListener('DOMContentLoaded', async function () {
    const featuredAlbumsContainer = document.getElementById('albums-container');

    // Replace these with your actual client ID and client secret
    const clientId = 'da7a73500577472fa4ca42bed4cb1f3e';
    const clientSecret = 'dd71958f547f492fb6db0e57596ecc9c';   

    // Function to retrieve access token
    const getToken = async () => {
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + btoa(clientId + ":" + clientSecret),
            },
            body: "grant_type=client_credentials",
        });

        const data = await result.json();
        return data.access_token;
    };

    // Fetch featured albums using the access token
    const token = await getToken();
    const apiUrl = 'https://api.spotify.com/v1/shows?ids=5CfCWKI5pZ28U0uOzXkDHe%2C5as3aKmN2k11yfDDDSrvaZ%2C7H4xqBcvVafN7hs3BJMeHE%2C5aAR1VPIQ6rarijDBYPDtw';
    
    fetch(apiUrl, {
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
    .then(response => response.json())
    .then(data => {
        const albums = data.shows;
        albums.forEach(album => {
            const card = createCard(album);
            featuredAlbumsContainer.appendChild(card);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    
    function createCard(album) {
        const card = document.createElement('div');
        card.classList.add('card');
    
        // Display album images
        const firstImage = album.images[0];
        if (firstImage) {
            const img = document.createElement('img');
            img.src = firstImage.url;
            img.alt = 'Album Cover';
            card.appendChild(img);
        }
    
        // Display other album details
        const title = document.createElement('h4');
        title.textContent = album.name;
        card.appendChild(title);
    
        const artist = document.createElement('p');
        artist.textContent = 'Artist: ' + album.name;
        card.appendChild(artist);


        const ep = document.createElement('p');
        ep.textContent = 'Total episodes: ' + album.total_episodes;
        card.appendChild(ep);

        const show = document.createElement('p');
        show.textContent = 'Show Type: ' + album.media_type;
        card.appendChild(show);
    
        // Add more details as needed
    
        return card;
    }
    
});

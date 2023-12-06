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
    const apiUrl = 'https://api.spotify.com/v1/albums?ids=382ObEPsp2rxGrnsizN5TX%2C1A2GTWGtFfWp7KSQTwWOyo%2C2noRn2Aes5aoNVsU6iWThc%2C4aawyAB9vmqN3uQ7FjRGTy';
    
    fetch(apiUrl, {
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
    .then(response => response.json())
    .then(data => {
        const albums = data.albums;
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
        artist.textContent = 'Artist: ' + album.artists[0].name;
        card.appendChild(artist);
    
        // Add more details as needed
    
        return card;
    }
    
});

// featured-artists.js

document.addEventListener('DOMContentLoaded', async function () {

    const artistsContainer = document.getElementById('albums-container');

    const clientId = '4660eaac02f64d879d0db421b0c5893f';
    const clientSecret = '194eeeb78702486e996c7b8b4582eab5';

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

    // Fetch artist information using the access token
    const token = await getToken();
    const artistIds = '28DlNBW2UlEVVgTuCcYtTe%2C2CIMQHirSU0MQqyYHq0eOx%2C53XhwfbYqKCa1cC15pYq2q%2C06HL4z0CvFAxyc27GXpf02%2C4YRxDV8wJFPHPTeXepOstw%2C6eUKZXaKkcviH0Ku9w2n3V%2C7qjJw7ZM2ekDSahLXPjIlN%2C66CXWjxzNUsdJxJ2JdwvnR%2C7uDdl5V5AETSFY7K3muu22%2C7nwUJBm0HE4ZxD3f5cy5ok%2C0PCCGZ0wGLizHt2KZ7hhA2%2C64DvMieEUCdrYKmEIhDt8G';
    const apiUrl = `https://api.spotify.com/v1/artists?ids=${artistIds}`;

    fetch(apiUrl, {
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
        .then(response => response.json())
        .then(data => {
            data.artists.forEach(artist => {
                const artistCard = createArtistCard(artist);
                artistsContainer.appendChild(artistCard);
            });
        })
        .catch(error => console.error('Error fetching artist data:', error));

    function createArtistCard(artist) {
        const card = document.createElement('div');
        card.classList.add('card');

        // Display artist image
        const artistImage = artist.images[0];
        if (artistImage) {
            const img = document.createElement('img');
            img.src = artistImage.url;
            img.alt = 'Artist Image';
            card.appendChild(img);
        }

        // Display other artist details
        const name = document.createElement('h4');
        name.textContent = artist.name;
        card.appendChild(name);

        // Additional artist details
        const popularity = document.createElement('p');
        popularity.textContent = 'Popularity: ' + artist.popularity;
        card.appendChild(popularity);

        const followers = document.createElement('p');
        followers.textContent = 'Followers: ' + artist.followers.total;
        card.appendChild(followers);


        return card;
    }

});


// Add New Playlists
document.getElementById('authorizeBtn').addEventListener('click', () => {
    const clientId = 'da7a73500577472fa4ca42bed4cb1f3e';
    const redirectUri = 'http://127.0.0.1:5500/index.html';
    const scopes = 'playlist-modify-public playlist-modify-private';

    const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;

    window.location.href = authorizeUrl;
});

// Extract the authorization code from the URL for creating playlists
const urlParamsCreatePlaylist = new URLSearchParams(window.location.search);
const authorizationCodeCreatePlaylist = urlParamsCreatePlaylist.get('code');

if (authorizationCodeCreatePlaylist) {
    const clientId = 'da7a73500577472fa4ca42bed4cb1f3e';
    const clientSecret = 'dd71958f547f492fb6db0e57596ecc9c';
    const redirectUri = 'http://127.0.0.1:5500/index.html';

    // Exchange authorization code for access token
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        },
        body: `grant_type=authorization_code&code=${authorizationCodeCreatePlaylist}&redirect_uri=${redirectUri}`,
    })
        .then(response => response.json())
        .then(data => {
            const accessTokenCreatePlaylist = data.access_token;
            // Use the access token to make requests on behalf of the user
            createPlaylist(accessTokenCreatePlaylist);
        })
        .catch(error => console.error('Error fetching access token:', error));
}

function createPlaylist(accessToken) {
    const apiUrl = 'https://api.spotify.com/v1/me/playlists';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        },
        body: JSON.stringify({
            name: 'Test',
            description: 'test-xml',
            public: true,
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Playlist created:', data);
            fetchPlaylistDetails(accessToken, data.id);

        })
        .catch(error => console.error('Error creating playlist:', error));
}


function fetchPlaylistDetails(accessToken, playlistId) {
    const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;

    fetch(apiUrl, {
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        },
    })
        .then(response => response.json())
        .then(data => {
            addSongsToPlaylist(accessToken, playlistId);

            fetchgetplayDetails(accessToken, playlistId);
        })
        .catch(error => console.error('Error fetching playlist details:', error));
}

function addSongsToPlaylist(accessToken, playlistId) {
    const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        },
        body: JSON.stringify({
            uris: [
                'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
                'spotify:track:1301WleyT98MSxVHPZCA6M',
                'spotify:track:2KHtjCyCzsbkKh6Nmsnbz2',
            ],
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Songs added to the playlist:', data);
        })
        .catch(error => console.error('Error adding songs to playlist:', error));
}

function sleep(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) { }
}

function fetchgetplayDetails(accessToken, playlistId) {
    sleep(500);
    const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;

    fetch(apiUrl, {
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        },
    })
        .then(response => response.json())
        .then(data => {
            // Update the HTML to display the playlist details
            displaygetplayDetails(data);
        })
        .catch(error => console.error('Error fetching playlist details:', error));
}

function displaygetplayDetails(playlist) {
    const playlistContainer = document.getElementById('playlist-container');

    // Create elements to display playlist details
    const playlistName = document.createElement('p');
    playlistName.textContent = `Playlist Name: ${playlist.name}`;

    const playlistDescription = document.createElement('p');
    playlistDescription.textContent = `Link: ${playlist.href || 'No description'}`;

    const playlistTracks = document.createElement('p');
    playlistTracks.textContent = `Total Tracks: ${playlist.tracks.total}`;

    const name = document.createElement('p');
    name.textContent = `Display Name: ${playlist.owner.display_name}`;

    const user = document.createElement('p');
    user.textContent = `Type: ${playlist.owner.type}`;

    const public = document.createElement('p');
    public.textContent = `IS_PUBLIC: ${playlist.public}`;

    const date = document.createElement('p');
    date.textContent = `Added At: ${playlist.tracks.items[0].added_at}`;


    // Append elements to the playlist container
    playlistContainer.appendChild(playlistName);
    playlistContainer.appendChild(playlistDescription);
    playlistContainer.appendChild(playlistTracks);
    playlistContainer.appendChild(name);
    playlistContainer.appendChild(user);
    playlistContainer.appendChild(public);
    playlistContainer.appendChild(date);
}


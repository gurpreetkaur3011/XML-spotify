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
    const apiUrl = 'https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA';
    
    fetch(apiUrl, {
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
    .then(response => response.json())
    .then(data => {
        const albums = data.tracks;
        albums.forEach(album => {
            const card = createCard(album);
            featuredAlbumsContainer.appendChild(card);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
    
    function createCard(album) {
       // alert(album.album.artists[0].album_type)
        const card = document.createElement('div');
        card.classList.add('card');
    
        //Display album images
        const firstImage = album.album.images[0];
        //alert(firstImage)
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
    while (Date.now() - start < ms) {}
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


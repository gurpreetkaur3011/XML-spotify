document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('albums-container');

    searchBtn.addEventListener('click', function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            searchSpotify(searchTerm);
        }
    });

    function searchSpotify(query) {
        getToken().then(token => {
            const clientId = 'da7a73500577472fa4ca42bed4cb1f3e';
            const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album,artist,track`;

            fetch(apiUrl, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            })
            .then(response => response.json())
            .then(data => {
                displayResults(data);
            })
            .catch(error => console.error('Error searching Spotify:', error));
        });
    }

    const clientId = 'da7a73500577472fa4ca42bed4cb1f3e';
    const clientSecret = 'dd71958f547f492fb6db0e57596ecc9c';   


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

    function displayResults(response) {
        // Log the entire response to see its structure
        console.log(response);

        if (!response || !response.albums || !response.albums.items) {
            console.error('Invalid response structure. Unable to display results.');
            return;
        }

        resultsContainer.innerHTML = '';

        const albums = response.albums.items;
        albums.forEach(album => {
            const albumCard = createAlbumCard(album);
            resultsContainer.appendChild(albumCard);
        });
    }

    function createAlbumCard(album) {
        const albumCard = document.createElement('div');
        albumCard.className = 'card';

        const albumImage = document.createElement('img');
        albumImage.src = album.images[0].url;
        albumImage.alt = album.name;

        const albumTitle = document.createElement('h4');
        albumTitle.textContent = `Album Name: ${album.name}`;

        const artistName = document.createElement('p');
        artistName.textContent = `Artist: ${album.artists[0].name}`;

        const releaseDate = document.createElement('p');
        releaseDate.textContent = `Release Date: ${album.release_date}`;

        const totalTracks = document.createElement('p');
        totalTracks.textContent = `Total Tracks: ${album.total_tracks}`;

        albumCard.appendChild(albumImage);
        albumCard.appendChild(albumTitle);
        albumCard.appendChild(artistName);
        albumCard.appendChild(releaseDate);
        albumCard.appendChild(totalTracks);

        return albumCard;
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
            // Update the HTML to display the playlist details
            displayPlaylistDetails(data);
            
        })
        .catch(error => console.error('Error fetching playlist details:', error));
}

function displayPlaylistDetails(playlist) {
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

   
    // Append elements to the playlist container
    playlistContainer.appendChild(playlistName);
    playlistContainer.appendChild(playlistDescription);
    playlistContainer.appendChild(playlistTracks);
    playlistContainer.appendChild(name);
    playlistContainer.appendChild(user);

}
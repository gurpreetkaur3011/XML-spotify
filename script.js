document.addEventListener('DOMContentLoaded', async function () {
    const albumsContainer = document.getElementById('albums-container');

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

    // Fetch albums using the access token
    const token = await getToken();
    const apiUrl = 'https://api.spotify.com/v1/browse/new-releases?country=US&offset=0&limit=8';



    fetch(apiUrl, {
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
        .then(response => response.json())
        .then(data => {
            const albums = data.albums.items;
            albums.forEach(album => {
                const card = createCard(album);
                albumsContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching new releases:', error));

    function createCard(album) {
        const card = document.createElement('div');
        card.className = 'card';

        const image = document.createElement('img');
        image.src = album.images[0].url;
        image.alt = album.name;

        const title = document.createElement('h4');
        title.textContent = "Album Name :" + album.name;

        const date = document.createElement('p');
        date.textContent = "Release Date :" + album.release_date;

        const ntracks = document.createElement('p');
        ntracks.textContent = "Total Tracks :" + album.total_tracks;

        const artist = document.createElement('p');
        artist.textContent = album.artists[0].name;

        const type = document.createElement('p');
        type.textContent = "Type :" + album.type;

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(artist);
        card.appendChild(ntracks);
        card.appendChild(type);
        card.appendChild(date);

        return card;
    }

    document.getElementById('getProfileBtn').addEventListener('click', () => {
        const clientId = 'da7a73500577472fa4ca42bed4cb1f3e';
        const redirectUri = 'http://127.0.0.1:5500/index.html';
        const scopes = 'user-read-private user-read-email';

        const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}`;
        window.location.href = authorizeUrl;
    });

    // Extract the authorization code from the URL
    const urlParams = new URLSearchParams(window.location.hash.substr(1));
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
        // Fetch user details using the access token
        fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
        })
            .then(response => response.json())
            .then(data => {
                albumsContainer.innerHTML = '';

                const profileCard = createProfileCard(data);
                albumsContainer.innerHTML = '';

                albumsContainer.appendChild(profileCard);
            })
            .catch(error => console.error('Error fetching user details:', error));
    }

    // Get Profile function
    function createProfileCard(profile) {
        const card = document.createElement('div');
        card.className = 'card';

        const image = document.createElement('img');
        image.src = profile.images[0].url
        image.alt = profile.display_name;

        const title = document.createElement('h4');
        title.textContent = profile.display_name;

        const email = document.createElement('p');
        email.textContent = profile.email;

        const country = document.createElement('p');
        country.textContent = profile.country;

        const followers = document.createElement('p');
        followers.textContent = `Followers: ${profile.followers.total}`;

        const spotifyUri = document.createElement('p');
        spotifyUri.textContent = `Spotify URI: ${profile.uri}`;

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(email);
        card.appendChild(country);
        card.appendChild(followers);
        card.appendChild(spotifyUri);

        return card;
    }
});

function handleAuthorization() {
    const clientId = 'da7a73500577472fa4ca42bed4cb1f3e';
    const redirectUri = 'http://127.0.0.1:5500/index.html';
    const scopes = 'playlist-modify-public playlist-modify-private';

    const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;

    window.location.href = authorizeUrl;
}

// Event listener for 'Authorize' button
document.getElementById('authorizeBtn').addEventListener('click', handleAuthorization);


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


function sleep(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) { }
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
    playlistContainer.appendChild(date)
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

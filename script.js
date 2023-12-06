document.addEventListener('DOMContentLoaded', async function () {
    const albumsContainer = document.getElementById('albums-container');

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
    .catch(error => console.error('Error fetching data:', error));

    function createCard(album) {
        const card = document.createElement('div');
        card.className = 'card';

        const image = document.createElement('img');
        image.src = album.images[0].url;
        image.alt = album.name;

        const title = document.createElement('h4');
        title.textContent = album.name;

        const artist = document.createElement('p');
        artist.textContent = album.artists[0].name;

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(artist);

        return card;
    }

   










//      // Function to create a playlist
// // const clientId = 'da7a73500577472fa4ca42bed4cb1f3e';
// // const clientSecret = 'dd71958f547f492fb6db0e57596ecc9c';
// const redirectUri = 'http://127.0.0.1:5500/index.html';
// const userId = '315hb76w42zzsxuas5tevbaovvga'; // Replace with the target user's Spotify user ID
// const scope = 'playlist-modify-private playlist-modify-public';

// // Function to authorize and get the access token using Authorization Code Flow
// async function authorize() {
//     const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;

//     // Redirect the user to the Spotify authorization page
//     window.location.href = authorizeUrl;
// }

// // Function to create a playlist

// // Function to create a playlist
// async function createPlaylist(accessToken) {
//     //alert(accessToken);

//     const url = 'https://api.spotify.com/v1/315hb76w42zzsxuas5tevbaovvga/playlists'; // 'me' refers to the authenticated user

//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Authorization': 'Bearer ' + accessToken,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 name: 'Final_Playlist_XML_512',
//                 description: 'Final_Playlist_XML_512',
//                 public: false,
//             }),
//         });

//         if (response.ok) {
//             const playlistData = await response.json();
//             console.log('Playlist created:', playlistData);
//         } else {
//             console.error('Error creating playlist:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error creating playlist:', error.message);
//     }
// }


// // Extract the authorization code from the URL after the user grants access
// function handleAuthorizationResponse() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get('code');
//     alert("code is :"+ code)

//     if (code) {
//         // Exchange the authorization code for an access token
//         exchangeCodeForToken(code);
//     } else {
//         console.error('Authorization code not found in the URL');
//     }
// }

// // Function to exchange authorization code for access token
// async function exchangeCodeForToken(code) {
//     alert("exchangeCodeForToken   ", code)
//     const response = await fetch('https://accounts.spotify.com/api/token', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
//         },
//         body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${clientId}&client_secret=${clientSecret}`
//     });

//     const data = await response.json();
//     alert("Response from token endpoint:", data);

//     const accessToken = data.access_token;

//     alert("Access Token:", accessToken);

//     // Use the accessToken to make Spotify API requests
//     createPlaylist(accessToken);
// }

// // Check if the current page URL contains the Spotify authorization code
// if (window.location.href.includes('?code=')) {
//     alert("coming here")
//     handleAuthorizationResponse();
// } else {
//     // If no authorization code is present, initiate the Spotify authorization process
//     authorize();
// }

//     // Attach the createPlaylist function to the button click event
//     const createPlaylistBtn = document.getElementById('createPlaylistBtn');
//     createPlaylistBtn.addEventListener('click', authorize);

});


document.getElementById('authorizeBtn').addEventListener('click', () => {
    const clientId = 'da7a73500577472fa4ca42bed4cb1f3e';
    const redirectUri = 'http://127.0.0.1:5500/index.html';
    const scopes = 'playlist-modify-public playlist-modify-private';

    const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;

    window.location.href = authorizeUrl;
});
 // Extract the authorization code from the URL
 const urlParams = new URLSearchParams(window.location.search);
 const authorizationCode = urlParams.get('code');

 if (authorizationCode) {
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
         body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${redirectUri}`,
     })
     .then(response => response.json())
     .then(data => {
         const accessToken = data.access_token;
         // Use the access token to make requests on behalf of the user
         createPlaylist(accessToken);
     })
     .catch(error => console.error('Error fetching access token:', error));
 }

 function createPlaylist(accessToken) {
     const apiUrl = 'https://api.spotify.com/v1/me/playlists';
     alert(accessToken)

     fetch(apiUrl, {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
             'Authorization': 'Bearer ' + accessToken,
         },
         body: JSON.stringify({
             name: 'XML-PROJECT_FINAL',
             description: 'Your Playlist Description',
             public: true,
         }),
     })
     .then(response => response.json())
     .then(data => {
         console.log('Playlist created:', data);
     })
     .catch(error => console.error('Error creating playlist:', error));
 }
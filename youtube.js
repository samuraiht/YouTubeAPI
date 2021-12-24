const OAUTH2_CLIENT_ID = '<CLIENT_ID>';
const CHANNEL_ID = 'UCxT_1qcezF0OBzliMxan-8A';
const OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube'];

function search(pageToken) {
  const query = {
    part: 'snippet',
    channelId: CHANNEL_ID,
    maxResults: 50,
    type: 'video'
  };
  if(pageToken) query.pageToken = pageToken;
  gapi.client.youtube.search.list(query).execute(function(response) {
    const json = response.result;
    for(let i in json.items) {
      const li = document.createElement('li');
      // <a href="https://www.youtube.com/watch?v=videoId">title</a>
      // ↓
      // <ifreme ??????></iframe>
      li.innerHTML = '<a href="https://www.youtube.com/watch?v=' + json.items[i].id.videoId + '">' + json.items[i].snippet.title + '</a>';
      console.log(json.items[i]);
      document.getElementById('search-container').appendChild(li);
    }
    const nextPageToken = json.nextPageToken;
    if(nextPageToken) search(nextPageToken);
  });
}

function handleAuthResult(authResult) {
    if(authResult && !authResult.error) {
        gapi.client.load('youtube', 'v3', function() { search(null); });
    } else {
        gapi.auth.authorize({
            client_id: OAUTH2_CLIENT_ID,
            scope: OAUTH2_SCOPES,
            immediate: false
        }, handleAuthResult);
    }
}

window.onload = function() {
    gapi.auth.init(function() {
        window.setTimeout(function() {
            gapi.auth.authorize({
                client_id: OAUTH2_CLIENT_ID,
                scope: OAUTH2_SCOPES,
                immediate: true
            }, handleAuthResult);
        }, 1);
    });
};
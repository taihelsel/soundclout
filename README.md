- [Setup](https://github.com/taihelsel/soundclout#user-content-to-run-application)
- [Routes](https://github.com/taihelsel/soundclout#user-content-routes)
- [Examples](https://github.com/taihelsel/soundclout#user-content-examples)
- [How it works](https://github.com/taihelsel/soundclout#user-content-how-it-works)
- [Tech Used](https://github.com/taihelsel/soundclout#user-content-tech-used)
- [Todo](https://github.com/taihelsel/soundclout#user-content-todo)
# TO RUN APPLICATION 
- clone to local machine
- cd server
- run "npm install"
- create a dot env file with the following environment variables:
  - SESSION_SECRET=
  - PORT=
  - DB_NAME=
  - MONGODB_URI=
- assign values to the variables
- cd .././client
- run "npm install"
- cd .././server
- run "npm run-script buildrun"

# Routes
| Path|Method|Expects|Response|
| --- | --- | --- | --- |
| /songdata | POST | "soundcloud song URL" | {songId,url,title,data,lastUpdated,offsetTimer} |

# Examples
#### example request
```javascript
const exampleURL = "https://soundcloud.com/joewalshmusic/lifes-been-good";
fetch("/songdata", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: exampleURL
})
    .then((res) => res.json())
    .then((res) => {
            console.log(res);
        });
```
#### response to the request
```javascript
{ 
    songId:"255996177",
    url:"https://soundcloud.com/joewalshmusic/lifes-been-good",
    title:"Life's Been Good",
    data:[{likes:1501,plays:88860,comments:6,timeStamp:1552902941553}], //<-will contain all the data collected on a song
    lastUpdated:1552902941553,
    offsetTimer:1800000
}
```
#### song overview
![alt text](https://i.imgur.com/hh6ISe9.png)

# How it works
1. Get the data from user
* Inside the SongSearch Component the user will input a URL that points to a SoundCloud song.
* The URL is dissected for the required information (song title & username), and then the client redirects to the SongOverview Component.
2. Requesting the song data from back-end 
* Inside the SongOverview Component the song title & username are pulled from the URL parameters.
* The song title and username get passed into the fetchSongData() function. Inside that function a POST request will be made to an express route on the backend.
3. Handling the song data request on the back-end
* First it checks if the song is in the DB.
* If the song exists in the database, then it checks if it should be updated.
  * If the song should be updated it will:
    * use the reqSong() function to request the latest information for the song.
    * Once the original song has been updated it will request the related songs from SoundCloud (reqRelatedSongs() function) and add (addNewSongToDB() function) or update (updateSongInDB() function) those items in the database 
    * After all related songs have been added or updated it will send the originally requested song data to the front-end.
  * If the song does not need to be updated, it will send the song data that is currently stored in the DB to the front-end.
* If the song does not exist in the database:
  * It will use the initialSongReq() function to make a request to the target SoundCloud song url.
  * Use cheerio to parse the response and target specific meta tags for the song data
  * Save the song data in db using the addNewSongToDB() function
  * Send song data to front-end
4. Handling song data on the front-end
* Inside the SongOverview component all the song data from the back-end gets prepared to be stored in the component state.
* The song data gets formatted a Chart.js line graph.
* The song's title and username gets added to a "song search history" inside localStorage. This then used in the Home component to display the recent searches.
* Using the time of the last song update & the offset time (time to wait inbetween song updates) a timer is generated that will automatically request new song data from the backend upon expiration.
* Finally, the Component state is updated and it renders the song information.

# Tech Used
- npm
- HTML
- CSS
- JavaScript
- ReactJS
- React Router
- Chart.js
- React Chart.js 2
- Node.js
- Mongoose
- MongoDB
- Express
- xmlhttprequest lib
- cheerio

# TODO 
- Error handling on songdata req to soundcloud
- Error handling on songdata db query
- Error messages being sent to front-end
- Implement redux
- Create a react-native version that requests data from this version 


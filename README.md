# TO RUN APPLICATION 
- clone to local machine
- cd server
- run "npm install"
- create a dot env file with the following environment variables:
SESSION_SECRET=
PORT=
DB_NAME=
MONGODB_URI=
- assign values to the variables
- cd .././client
- run "npm install"
- cd .././server
- run "npm run-script buildrun"

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

# Routes
| Path|Method|Expects|Response|
| --- | --- | --- | --- |
| /songdata | POST | soundcloud song URL | {songId,url,title,data,lastUpdated,offsetTimer} |
example request
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
example response
```JSON
{ 
    songId:"255996177",
    url:"https://soundcloud.com/joewalshmusic/lifes-been-good",
    title:"Life's Been Good",
    data:[{likes:1501,plays:88860,comments:6,timeStamp:1552902941553}], //<-will contain all the data collected on a song
    lastUpdated:1552902941553,
    offsetTimer:1800000
}
```
# TODO 
- Error handling on songdata req to soundcloud
- Error handling on songdata db query
- Error messages being sent to front-end
- Implement redux
- Create a react-native version that requests data from this version 


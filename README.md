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


# TODO 
- Error handling on songdata req to soundcloud
- Error handling on songdata db query
- Error messages being sent to front-end
- Graph displaying song data over time
- Timer on front-end showing when songdata will be updated next
- iframe containing acutal sondcloud song in the songoverview component.
- Allow users to bookmark songs (store in localstore or cookies)
- Display bookmarked songs on homepage
- Display recently updated songs on homepage
- Display songs with the largest change by the hour on the homepage.
- Set server req timer back to original state.
- format timeStamp date on back-end to be easily readable on front-end
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
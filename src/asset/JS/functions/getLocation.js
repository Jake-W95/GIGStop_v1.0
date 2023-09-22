const successCallback = (position) => {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude
  let call = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=d7d17ff04f8715fd79b80f173e2710a1`

  
  return fetch(call)
  .then((res) => res.json())
  .then((data) => {
    const location = data[0].name;
    const locationObject = {
      city: location,
      latitude: data[0].lat,
      longitude: data[0].lon
    }
    localStorage.setItem('userLocation', JSON.stringify(locationObject))

      return locationObject
    })
    .catch((err) => {
      console.log(err)
    })
};
const errorCallback = (error) => {
  console.log(error);
};

function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        successCallback(position).then(resolve).catch(reject)
      },
      (error) => {
        errorCallback(error);
        reject(error)
      }
    )
  })
}
function locationInquiry() {
  $(document.body).append(`
  <div id="locationInquiryDiv"
  style="
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  margin:auto;
  width:20%;
  height:20%;
  padding:2em; 
  background: green;
  "
  >
    <h3>Filter suggested events by your location?</h3>
    <button id="confirmLocationBtn">Yes please!</button>
      <button id="denyConfirmLocationBtn">No, thanks!</button>
      </div>
      `)
}
function locationConfirmedOrDenied(confirmation) {
  $('#locationInquiryDiv').remove();
  

}
function deniedLocationHtml() {
  $(document.body).append(`
  <div id="deniedLocationHtml"
  style="
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  margin:auto;
  width:16%;
  height:16%;
  padding:2em; 
  background: green;>
    <h2>No problem!</h2>
    <h3>Default location set to London</h3> 
  </div>
  `)

}
function failedLocationHtml() {
  return `
  <div id="failedLocation"
  style="
  position:absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  margin:auto;
  background-color:black;
  color:white;
  width:30%;
  height:30%;
  padding:7px;
  ">
    <h1>Couldn't find any locations based on the location we have for you</h1>
    <h3>It's not perfect, and we're sorry</h3>
    </br>
    <h4>Find events near you using the search parameters</h4>
  </div>
  `
}
export {
  getLocation,
  locationInquiry,
  locationConfirmedOrDenied,
  deniedLocationHtml,
  failedLocationHtml
}




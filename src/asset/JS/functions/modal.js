const eventModal = (e, allEvents) => {
  let div = e.target.closest('DIV')

  let TMID = div.children[3].innerHTML
  for (let event of allEvents) {
    if (TMID === event.id) {
      let selectedEvent = event;
      let eventLocation = event._embedded.venues[0].location

      $(document.body).append(
        eventModalHTML(selectedEvent, eventLocation)
      )
    }
  }
}
function eventModalHTML(event, eventLocation) {
  // If pulled event data has no lat/lon data
  let map
  if (eventLocation != undefined) {
    let Lat = eventLocation.latitude
    let Lon = eventLocation.longitude
    map = `<iframe class="modalMap" src="http://maps.google.com/maps?q=${Lat},${Lon}&z=10&output=embed"></iframe>`
  } else {
    map = `<div class="modalMap">No map available</div>`
  }
  // If pulled event data has no image(s)
  let image
  if (event._embedded.venues[0].images) {
    image = `
    <p class="venueImgUrl hide">${event._embedded.venues[0].images[0].url}</p>
    `
  } else {
    image = `<p class="venueImgUrl hide"></p>`
  }

  // If pulled event data has no attraction key
  let artistId
  if ('attractions' in event._embedded) {
    artistId = event._embedded.attractions[0].id
  } else {
    artistId = 'no artist ID'
  }

  return `
    <div class="modal">
        <div class="row" style="height:99%">
          <div class="modalDetails col justify-content-between">
            <div class="modalText">
              <h3 class="modalEventName">${event.name}</h3>
              <h4 class="modalEventVenue">${event._embedded.venues[0].name}</h4>
              <p class="modalEventDate">${moment(event.dates.start.localDate).format("dddd MMMM Do YYYY")} ${event.dates.start.localTime}</p>
              <p class="modalEventCountdown"> ${moment(event.dates.start.localDate).fromNow()}</p>
              <p class="modalEventAddress">${event._embedded.venues[0].address.line1}, ${event._embedded.venues[0].postalCode}</p>
              <p class="modalEventCity">${event._embedded.venues[0].city.name}</p>
              <p class="modalEventCounry">${event._embedded.venues[0].country.name}</p>
            </div>

            <div class="modalBtnSection">
                <button onClick="window.location='${event.url}';">Official Website</button>
                <button onClick="window.location='${event._embedded.venues[0].url}';">Book Tickets</button>
                <button class="viewArtistDetails">View Artist</button>
                <button class="viewVenueDetails">View Venue</button>
                <button class="closeModalBtn">Close</button>
            </div>
            <p class="TMID hide">${event.id}</p>
            <p class="artistId hide">${artistId}</p>
            <p class="venueId hide">${event._embedded.venues[0].id}</p>
            ${image}

            </div>
            ${map}

        </div>

      </div>`

}
function modalImageSelector(imgArray) {
  let wideImages = []
  let selectedImage
  for (let image of imgArray) {
    if (image.ratio === '16_9') {
      wideImages.push(image)
    }
  }
  for (let image of wideImages) {
    let maxWidth = 0
    if (image.width > maxWidth) {
      maxWidth = image.width
      selectedImage = image
    }
  }
  return selectedImage
}

function venueDetailModal(detailObject, favouriteBoolean) {
  let favouriteButton
  if (favouriteBoolean) {
    favouriteButton = `
    <button class="removeFavouriteBtn">Remove from favourites</button>
    `
  }
  if (!favouriteBoolean) {
    favouriteButton = `
    <button class="addFavouriteBtn">Add to favourites</button>
    `
  }
  return `
  <div class="modalBackdrop">
    <div class="modal favModal">
    <div class="favModalImage" style="
      background-image: url(${detailObject.image});
      background-repeat: no-repeat;
      background-size:contain;
      background-position: center;
      ">
    </div>
      <div class="modalText favModalText">
        <h3 class="modalVenueName">${detailObject.name}</h3>
        <p class="modalVenueAddress">${detailObject.address.line}</p>
        <p class="modalVenueAddress">${detailObject.address.postcode}</p>
        <p class="modalVenueCity">${detailObject.address.city}</p>
        <p class="modalVenueCountry">${detailObject.address.country}</p>
      </div>
      <div class="favModalBtnSection">
        <div class="modalBtnStock">
          <button onClick="window.location='${detailObject.website}';">Website</button>
          ${favouriteButton}
          <button class="closeModalBtn">Close</button>
        </div>
      </div>
    </div>
  </div>`

}
function artistDetailModal(detailObject, favouriteBoolean) {
  let favouriteButton
  if (favouriteBoolean) {
    favouriteButton = `
    <button class="removeFavouriteBtn">Remove from favourites</button>
    `
  }
  if (!favouriteBoolean) {
    favouriteButton = `
    <button class="addFavouriteBtn">Add to favourites</button>
    `
  }
  return `
  <div class="modalBackdrop">
    <div class="modal favModal">
    <div class="favModalImage" style="
      background-image: url(${detailObject.image});
      background-repeat: no-repeat;
      background-size:contain
      ">
    </div>


      <div class="modalText favModalText">
        <h3 class="modalArtistName">${detailObject.name}</h3>
      </div>


      <div class="favModalBtnSection">
       <div class="modalBtnStock">
       ${favouriteButton}
          <button class="closeModalBtn">Close</button>
          </div>
          <div class="socialLinks"></div> 
      </div>
    </div>
  </div>`
}
function detailModalLinks(detailObject) {
  for (let link in detailObject.externalLinks) {
    const firstLetter = link.charAt(0)
    const cappedFirst = firstLetter.toUpperCase()
    const remainingLeters = link.slice(1)
    const cappedLink = cappedFirst + remainingLeters
    $('.socialLinks').append(`
    <button onClick="window.location='${detailObject.externalLinks[link]}';">${cappedLink}</button>
    `)
  }
}

export { eventModal, venueDetailModal, artistDetailModal, detailModalLinks, modalImageSelector }
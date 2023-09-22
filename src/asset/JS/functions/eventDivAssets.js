function nameLength(type, event) {
  let name = '';
  if (type === 'suggested') {
    if (event.name.length <= 25) {
      return name = event.name
    }
    // else {
    for (let letter of event.name) {
      if (name.length <= 25) {
        name = name.concat(letter)
      }
    }
    return name += '...'
  }
  if (type === 'searched') {
    // let name = '';

    // console.log(event, 'name')
    name = event.name
    return name
  }
}

function getEventImage(event) {
  let eventImage = ''
  for (let image of event.images) {
    if (image.ratio === '3_2') {
      eventImage = image;
      break
    }
  }
  eventImage = eventImage.url

  return eventImage
}

const eventHTML = (type, name, event, eventImage) => {
  if (type === 'suggested') {
    return `
    <article class="event col" data-eventName="${name}" style="background-image: url(${eventImage})">
        <div class="suggestedEventOverlay col">
          <h3 class="eventName" data-tooltip="${event.name}">${name}</h3>
          <h4 class="eventVenue">${event._embedded.venues[0].name}</h4>
          <div class="row justify-content-between eventCityDate">
            <h5>${event._embedded.venues[0].city.name}</h5> 
            <h5>${event.dates.start.localDate}</h5>
          </div>
          <p class="TMID hide">${event.id}</p>
        </div>
      </article>
      `}

  if (type === 'searched') {
    return `
      <article class="searchResultItem" style="background-image: url(${eventImage})">
        <div class="col searchItemOverlay">
          <h2 class="searchResultTitle">${name}</h2>
          <h3>${event._embedded.venues[0].name}</h3>
          <div class="row justify-content-between searchedEventCityDate">
            <h4>${event._embedded.venues[0].city.name}</h4>
            <h5> ${event.dates.start.localDate} </h5>
          </div>
          <p class="TMID hide">${event.id}</p>
        </div>
      </article>
        `
  }
}

const artistHTML = (artistName, artist, artistImage) => {
  return `
    <article class="artist col" data-eventName="${artistName}" style="background-image: url(${artistImage})">
        <div class="searchItemOverlay col">
          <h3 class="eventName" data-tooltip="${artist.name}">${artistName}</h3>
          <p class="TMID hide">${artist.id}</p>
        </div>
      </article>
      `}


// id="${events.indexOf(event)} -- Searched Article ID

function fullRenderEvent(type, array, area, htmlType) {
  for (let arrayEvent of array) {
    let eventName = nameLength(type, arrayEvent)
    let eventImage = getEventImage(arrayEvent)
    area.append(
      htmlType === 'events' ? eventHTML(type, eventName, arrayEvent, eventImage) : artistHTML(eventName, arrayEvent, eventImage)
    )
  }
}


export { nameLength, getEventImage, eventHTML, fullRenderEvent }
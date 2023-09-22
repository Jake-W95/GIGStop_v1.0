import { fullRenderEvent } from "./functions/eventDivAssets.js";
import {
  writeAPIPath,
  checkGenre,
  appendResContainer,
  getFormResponse,
  setEventsMax
} from "./functions/mainSearchFunctions.js";
import { eventModal, appendArtistModal, artistDetailModal, detailModalLinks } from "./functions/modal.js";
import { getArtistDetails, createArtistObject } from "./functions/getDetails.js";
import { addOrRemoveFavourite, addFavourite, removeFavourite } from "./functions/favourites.js";
// Form Elements
const mainSearchIn = document.querySelector('#mainSearchIn');
const locationSearchIn = document.querySelector('#locationSearchIn')
const startDateInput = $("#start-date");
const artistsOnlyCheckbox = document.querySelector('#artistsOnlyCheckBox')

// API Variables
// Maximum number of events per page
let eventsTotal = 20
// Total number of pages from API call
// Global variable to be assigned genre ID string (if genre is selected)
let selectedGenre
// global variable to track page up or down
async function handleSearch(radios, page, array) {
  let artistsOnly = $(artistsOnlyCheckbox).prop('checked')
  // Init array to hold filtered events for rendering
  let finalEventsArray = []
  ////////////////////////////////// Form data
  // If date specified in form, use; otherwise default to today.
  const rawDate = startDateInput.value ? new Date(startDateInput.value) : new Date();
  // Check for genre selection
  selectedGenre = checkGenre(radios)
  // Create object containing form data 
  const formResponse = getFormResponse(mainSearchIn, locationSearchIn, rawDate, selectedGenre, artistsOnly)
    $('#searchResultContainer').remove()
    let baseAPICall = `https://app.ticketmaster.com/discovery/v2/events.json?page=${page}&countryCode=GB&segmentName=music&startDateTime=${formResponse.startDate}&apikey=${process.env.TMAPI}`
    let baseArtistAPICall = `https://app.ticketmaster.com/discovery/v2/attractions.json?page=${page}&countryCode=GB&segmentName=music&apikey=${process.env.TMAPI}`
    let APICall
    let events
    let artists
    let data

try {
  if (formResponse.artistsOnly){throw new Error('artists only')}
    APICall = writeAPIPath(formResponse, baseAPICall) 
    data = await fetch(APICall).then((response) =>  response.json());
    // MAKE API CALL 
      events = data._embedded.events;
    // Total pages from fetched JSON data
    let totalPages = data.page.totalPages
    // RESULTS
    // Container for all rendered events
    $('body').append(appendResContainer())
    // Push events to finalEventsArray until number of events matches specified number (eventsTotal)
    setEventsMax(events, eventsTotal, finalEventsArray)
    // Render events using 'searched' html frame, from finalEventsArray, appended to #searchResults div
    fullRenderEvent('searched', finalEventsArray, $('#searchResults'), 'events')
    $(document.body).on('click', '.searchResultItem', (e) => {
      eventModal(e, events, finalEventsArray)
    })
  
    return totalPages
  }

    catch {
      APICall = writeAPIPath(formResponse, baseArtistAPICall) 
    data = await fetch(APICall).then((response) =>  response.json());
    // MAKE API CALL 
      artists = data._embedded.attractions;

    // Total pages from fetched JSON data
    let totalPages = data.page.totalPages
    // RESULTS
    // Container for all rendered events
    $('body').append(appendResContainer())
    // Push events to finalEventsArray until number of events matches specified number (eventsTotal)
    setEventsMax(artists, eventsTotal, finalEventsArray)
    // Render events using 'searched' html frame, from finalEventsArray, appended to #searchResults div
    fullRenderEvent('searched', finalEventsArray, $('#searchResults'), 'artists')
    $(document.body).on('click', '.artist', (e) => {

      let artistId = e.target.querySelector('.TMID').innerHTML
      getArtistDetails(artistId)
          .then((artistData) => createArtistObject(artistData))
          .then((artistDataObject) => {
              array.then((favouritedArtists) => {

                  let addOrRemove = addOrRemoveFavourite(favouritedArtists, artistDataObject, 'artists')

                  $(document.body).append(
                      artistDetailModal(artistDataObject, addOrRemove)
                  )
                  detailModalLinks(artistDataObject)
                  $(document.body).on('click', '.addFavouriteBtn', (e) => {
                      e.preventDefault()
                      addFavourite(db, uid, 'artists', artistDataObject)
                  })
                  $(document.body).on('click', '.removeFavouriteBtn', (e) => {
                      e.preventDefault()
                      removeFavourite(db, uid, 'artists', artistDataObject)
                      $('.modal').remove()
                      $('.modalBackdrop').remove()
                  })
              })
          })
    }
    )
    return totalPages
    }

  }

export { handleSearch }



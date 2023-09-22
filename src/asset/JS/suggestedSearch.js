import { fullRenderEvent } from "./functions/eventDivAssets.js";
import { eventModal } from "./functions/modal.js";
import { failedLocationHtml } from "./functions/getLocation.js";

const today = `${moment().format("YYYY-MM-DDTHH:mm:ss")}Z`
var suggested_area = $(".suggestedEvents");

async function suggestedEvents(city) {
  let suggested = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=GB&city=${city}&startDateTime=${today}&segmentName=music&apikey=NVZ5rDf8pofIV9z9yn3XNFkxCUm5tdut`;
  let events = await fetch(suggested)
    .then((data) => { return data.json() })
    .then((data) => { return data._embedded.events })
    .catch((err) => {
      console.error(err)
    })

    // If user's location has no events
    if (!events) {
    if(city){
      $(document.body).append(failedLocationHtml())
      console.log('No events for this location found')
    }
    suggested = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=GB&city=London&startDateTime=${today}&segmentName=music&apikey=${process.env.TMAPI}`;
    events = await fetch(suggested)
      .then((data) => { return data.json() })
      .then((data) => {
        return data._embedded.events
      })
      .catch((err) => {
        console.log('No events found for given location, default location for suggested events is London', err)

      })
  }
  let eventSuggestionArray = []
  // Loops through pulled events to fill array with 4 UNIQUELY NAMED EVENTS 
  for (var f = 0; eventSuggestionArray.length < 8; f++) {
    if (eventSuggestionArray.length === 0 || events[f].name !== eventSuggestionArray[eventSuggestionArray.length - 1].name) {
      eventSuggestionArray.push(events[f])
    }
  }
  // Renders html for pulled events
  fullRenderEvent('suggested', eventSuggestionArray, suggested_area, 'events')
  // MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL MODAL
  $('.event').on('click', (e) => {
    console.log('click')
    eventModal(e, events, eventSuggestionArray)})
}
export default suggestedEvents
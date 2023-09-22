function writeAPIPath(res, call) {
    if (res.mainSearch) {
        call = call.concat('&keyword=', res.mainSearch)
    }
    // Concatenates location information to base API string
    if (res.location) {
        call = call.concat('&city=', res.location)
    }
    if (res.genre) {
        call = call.concat('&genreId=', res.genre)
    }

    return call
}

function checkGenre(radioList) {
    let result
    for (let radio of radioList) {
        if (radio.checked) {
            result = radio.value;
        }
    }
    return result
}

function appendResContainer() {
    return `
    <div id="searchResultContainer">
        <p id="previousAPIPage">&#10094;</p> 
        <section id="searchResults">
        </section>
        <p id="nextAPIPage">&#10095;<p/>
    </div>
    `
}
function getFormResponse(search, location, date, genre, artistsOnly){
    const  formResponse = {
        mainSearch: search.value,
        location: location.value,
        startDate: `${moment(date).format("YYYY-MM-DDTHH:mm:ss")}Z`,
        genre: genre,
        artistsOnly: artistsOnly

      }
      return formResponse
}

function setEventsMax(allEventsArray, totalEvents, finalEventsArray){
    if (allEventsArray.length < 20) {
        totalEvents = allEventsArray.length
      }
      let i = 0
      while (finalEventsArray.length < totalEvents) {
        finalEventsArray.push(allEventsArray[i])
        i++
      }
}


export { writeAPIPath, checkGenre, appendResContainer, getFormResponse,  setEventsMax }
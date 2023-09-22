import { modalImageSelector } from "./modal";

async function getArtistDetails(artistId) {
    const APICall = `https://app.ticketmaster.com/discovery/v2/attractions/${artistId}.json?&apikey=NVZ5rDf8pofIV9z9yn3XNFkxCUm5tdut`
    return fetch(APICall)
        .then((response) => response.json())
        .catch((err) => {
            alert('Sorry, can\'t seem to find any information on that artist!');
        })
}
function createArtistObject(artistData) {
    const links = artistData.externalLinks
    const image = modalImageSelector(artistData.images).url
    const artistDataObject = {
        name: artistData.name,
        image: image,
        website: artistData.url,
        artistTMID: artistData.id,
        externalLinks: {
        }
    }
    for (let link in links) {

        if (link === 'facebook') {
            artistDataObject.externalLinks.facebook = links[link][0].url
        }
        if (link === 'instagram') {
            artistDataObject.externalLinks.instagram = links[link][0].url
        }
        if (link === 'twitter') {
            artistDataObject.externalLinks.twitter = links[link][0].url
        }
        if (link === 'youtube') {
            artistDataObject.externalLinks.youtube = links[link][0].url
        }
    }

    return artistDataObject

}
async function getVenueDetails(venueId) {
    const APICall = `https://app.ticketmaster.com/discovery/v2/venues/${venueId}.json?&apikey=NVZ5rDf8pofIV9z9yn3XNFkxCUm5tdut`
    return fetch(APICall)
        .then((response) => response.json())
        .catch((err) => {
            console.error(err);
            throw err
        })
}
function createVenueObject(venueData, venueId) {

    const venueDataObject = {
        name: venueData.name,
        address: {
            line: venueData.address.line1,
            city: venueData.city.name,
            country: venueData.country.name,
            postcode: venueData.postalCode,
            // coordinates: {
            //     longitude: venueData.location.longitude,
            //     latitude: venueData.location.latitude
            // }
        },
        website: venueData.url,
        // image: venueData.images[0].url,
        venueTMID: venueId,
    }
    if (Object.hasOwn(venueData, 'images')) {
        venueDataObject.image = venueData.images[0].url
    }
    return venueDataObject
}




export { getArtistDetails, createArtistObject, getVenueDetails, createVenueObject }
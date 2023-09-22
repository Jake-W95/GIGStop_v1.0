import { initializeApp } from 'firebase/app'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from 'firebase/auth'
import {
    getFirestore,
    onSnapshot
} from 'firebase/firestore'
import {
    showForm,
    submitSignUp,
    submitLogIn
} from './asset/JS/functions/authenticationFunctions';
import {
    getLocation,
    confirmLocation,
    locationInquiry
} from './asset/JS/functions/getLocation.js';
import suggestedEvents from './asset/JS/suggestedSearch';
import { handleSearch } from './asset/JS/mainSearch';
import renderGenres from './asset/JS/functions/renderGenres';
import {
    getDocuments,
    selectFavouriteCategory,
    fillFavouritesGrid,
    checkFavourites,
    addFavourite,
    removeFavourite,
    addOrRemoveFavourite
} from './asset/JS/functions/favourites';
import {
    artistDetailModal,
    detailModalLinks,
    modalImageSelector,
    venueDetailModal,
} from './asset/JS/functions/modal'

import {
    getArtistDetails,
    createArtistObject,
    getVenueDetails,
    createVenueObject
} from './asset/JS/functions/getDetails'
import newsSection from './asset/JS/newsSection';
// FIREBASE VARIABLES
const firebaseConfig = {
    apiKey: process.env.FBAPI,
    authDomain: "dulcet-adviser-377609.firebaseapp.com",
    projectId: "dulcet-adviser-377609",
    storageBucket: "dulcet-adviser-377609.appspot.com",
    messagingSenderId: "930008939181",
    appId: "1:930008939181:web:ca91142f39b075319a6424",
    measurementId: "G-V435JVY6KK"
};
const authBtnSection = $('#authButtons')
initializeApp(firebaseConfig)
// CUSTOM VARIABLES
renderGenres()
const radioList = $(':radio')
let artistArray = []
let venueArray = []

let currentPage;
let totalPages

const db = getFirestore()
const auth = getAuth()

function appendVenueModal(venue, venueArray) {
    {
        let addOrRemove = addOrRemoveFavourite(venueArray, venue, 'venues')
        // Display Venue modal
        $(document.body).append(
            venueDetailModal(venue, addOrRemove)
        )
    }
}

function appendArtistModal(artist, artistArray) {
    {
        let addOrRemove = addOrRemoveFavourite(artistArray, artist, 'artists')
        // Display Venue modal
        $(document.body).append(
            artistDetailModal(artist, addOrRemove)
        )
    }
}
// Logged in functionality
onAuthStateChanged(auth, (user) => {
    $(authBtnSection).empty()
    $('.favouriteGrid').empty()

    //  IF USER IS SIGNED IN
    if (user) {
        let uid = user.uid
        $(authBtnSection).append(`
        <button type="button" id="signOut">Sign Out</button>
        `);
        //// Load favourites here
        // Document references
        artistArray = getDocuments(db, uid, 'artists')
        venueArray = getDocuments(db, uid, 'venues')
        // Initial load of favourite artists
        artistArray.then((items) => { fillFavouritesGrid(items) })

        // Choose favourites category
        $('.favSelectorBtn').on('click', (e) => {
            e.preventDefault()
            $('.favouriteGrid').empty()
            selectFavouriteCategory(e.target, artistArray, venueArray)
        })

        // Add favourite venue
        $(document.body).on('click', '.viewVenueDetails',

            (e) => {
                e.preventDefault()
                const venueId = $('.venueId')[0].innerHTML
                getVenueDetails(venueId)
                    .then(
                        (venueData) =>
                            createVenueObject(venueData, venueId)
                    )

                    .then((venueDataObject) => {
                        venueArray.then((favouriteVenues) => {
                            let addOrRemove = addOrRemoveFavourite(favouriteVenues, venueDataObject, 'venues')
                            // Display Venue modal
                            $(document.body).append(
                                venueDetailModal(venueDataObject, addOrRemove)
                            )
                            // Save Venue to Favourites
                            $(document.body).on('click', '.addFavouriteBtn', (e) => {
                                e.preventDefault()
                                addFavourite(db, uid, 'venues', venueDataObject)
                            })
                        })
                    })
            })
        // Add favourite Artist
        $(document.body).on('click', '.viewArtistDetails', (e) => {
            e.preventDefault()
            const artistId = $('.artistId')[0].innerHTML
            getArtistDetails(artistId)
                .then((artistData) => createArtistObject(artistData))
                .then((artistDataObject) => {
                    artistArray.then((favouritedArtists) => {

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
        })

        //// FAVOURITES INTERACTION
        $(document.body).on('click', '.favouriteCard', (e) => {
            let target = e.target.tagName === 'H2' ? e.target.parentElement : e.target
            let artistOrVenue = target.children[2].innerHTML === 'venue' ? true : false
            let TMID = target.children[3].innerHTML

            let dataObject

            if (artistOrVenue) {
                venueArray.then((array) => {
                    for (let venue of array) {
                        if (venue.venueTMID === TMID) {
                            dataObject = venue
                            appendVenueModal(venue, array)
                        }
                    }
                    return dataObject
                })
                    .then(
                        $(document.body).on('click', '.removeFavouriteBtn', (e) => {
                            e.preventDefault()
                            removeFavourite(db, uid, 'venues', dataObject)
                            $('.modal').remove()
                            $('.modalBackdrop').remove()
                        })
                    )
                    .catch((err) => { alert(err) })


            }
            if (!artistOrVenue) {
                artistArray.then((array) => {
                    for (let artist of array) {
                        if (artist.artistTMID === TMID) {
                            dataObject = artist
                            appendArtistModal(artist, array)
                            detailModalLinks(artist)
                        }
                    }
                    return dataObject
                })
                .then(
                    $(document.body).on('click', '.removeFavouriteBtn', (e) => {
                        removeFavourite(db, uid, 'artists', dataObject)
                        $('.modal').remove()
                        $('.modalBackdrop').remove()
                    })
                )
                    .catch((err) => { alert(err) })
            }
        })


    } else {
        // IF NO USER IS SIGNED IN
        $(authBtnSection).append(`
        <button type="button" class="authButton" id="showLogin">Log In</button>
        <button type="button" class="authButton" id="showSignUp">Sign Up</button>
        `)
    }
    
})

//SUGGESTED EVENTS
// Get user Location
if(localStorage.getItem('userLocation') === null){
locationInquiry()} 
else {
    let ul = JSON.parse(localStorage.getItem('userLocation')).city
    suggestedEvents(ul)
}
// User confirmation
$(document.body).on('click', '#confirmLocationBtn', () => {
    $('#locationInquiryDiv').remove()
    getLocation()
        .then((data) => { 
            let userLocation = data.city;
            return userLocation })
    .then((ul) => suggestedEvents(ul))                                               //SUGGESTED EVENTS WITH USER LOCATION
})
// User denial
$(document.body).on('click', '#denyConfirmLocationBtn', () => {
    $('#locationInquiryDiv').remove()
    suggestedEvents()                                                                //SUGGESTED EVENTS WITHOUT USER LOCATION
})
//// SEARCHED EVENTS
// Handle search 
$(document.body).on('submit', '#searchForm', (e) => {
    e.preventDefault()
    totalPages = 0
    currentPage = 0
    async function search() {
        totalPages = await handleSearch(radioList, currentPage, artistArray)
    }
    search()

})
// Close Searched Results
$(document.body).on('click', '#searchResultContainer', (e) => {
    e.preventDefault()
    if (!e.target.className) {
        $('#searchResultContainer').remove()
    }
})
// Next page
$(document.body).on('click', '#nextAPIPage', function (e) {
    $('#searchResults').empty();
    // console.log(totalPages, 'next')
    currentPage++
    handleSearch(radioList, currentPage);
    e.stopPropagation();
})
// Previous Page
$(document.body).on('click', '#previousAPIPage', function (e) {
    $('#searchResults').empty();
    if (currentPage > 0) {
        currentPage--
    }
    if (currentPage === 0 && totalPages < 50) {
        currentPage = --totalPages
    }
    if (currentPage === 0 && totalPages >= 50) {
        currentPage = 49
    }
    handleSearch(radioList, currentPage);
    e.stopPropagation();
})

//// MODAL INTERACTION
// Close Modal
$(document.body).on('click', '.closeModalBtn', (e) => {
    e.preventDefault()
    if ($('.modalBackdrop').length > 0) {
        e.target.closest('.modalBackdrop').remove()
    }
    e.target.closest('.modal').remove()
})
// AUTHENTICATION FUNCTIONS 
//load sign in / log in form
$(document.body).on('click', '.authButton', (e) => {
    e.preventDefault()
    showForm(e.target.id)
})
// Sign / Log user in using above form
$(document.body).on('submit', '.authForm', (e) => {
    e.preventDefault()
    const form = e.target.id
    form === 'signUpForm' ? submitSignUp(auth, createUserWithEmailAndPassword) : submitLogIn(auth, signInWithEmailAndPassword);
    $('#authFormDiv').remove()
})
// Sign user out
$(document.body).on('click', '#signOut', (e) => {
    e.preventDefault()
    auth.signOut()
    venueArray = []
    artistArray = []
})
// Remove message from failed location suggestion
$(document.body).on('click', '#failedLocation', (e) => {
    e.preventDefault()
    $('#failedLocation').remove()
})



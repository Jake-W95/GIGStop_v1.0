import {
    collection,
    getDocs,
    addDoc,
    doc,
    deleteDoc,
} from 'firebase/firestore'


async function getDocuments(
    db,
    uid,
    docSet
) {
    let userColRef = collection(db, 'users', uid, docSet)
    const favouritesArray = []
    try {
        const snapshot = await getDocs(userColRef)
        snapshot.docs.forEach((doc) => {
            favouritesArray.push(doc.data())
        })
        return favouritesArray
    }
    catch (err) {
        console.log(err)
    }
}
function favHtml(item) {
    let artistOrVenue = item.hasOwnProperty('venueTMID') ? 'venue' : 'artist'
    let TMID = artistOrVenue === 'venue' ? item.venueTMID : item.artistTMID 
    if (item.image) {
        return `
        <div class="favouriteCard" style="
        background: url(${item.image});
        background-size: cover;
        ">
            <h2>${item.name}</h2>
            <div class="favCardGradient"></div>
            <p class="hide artistOrVenue">${artistOrVenue}</p>
            <p class="hide TMID">${TMID}</p>
        </div>

        `
    }
    return `
    <div class="favouriteCard">
        <h2>${item.name}</h2>
        <div class="favCardGradient"></div>
        <p class="hide artistOrVenue">${artistOrVenue}</p>
        <p class="hide TMID">${TMID}</p>

    </div>
    `

}

function fillFavouritesGrid(array) {
    if(array.length === 0){
        $('.favouriteGrid').append(
            '<h3 style="background-color: black">Nothing favourited!</h3>')
    }
    for (let item of array) {
        $('.favouriteGrid').append(favHtml(item))
    }
}

function selectFavouriteCategory(button, artistArr, venueArr) {
    if (button.id === 'favArtistBtn') {
        artistArr.then((array) => {
            fillFavouritesGrid(array)
        }
        )
    }
    if (button.id === 'favVenueBtn') {
        venueArr.then((array) => {
            fillFavouritesGrid(array)
        })
    }

}

// Add favourite artist or venue to corresponding collection
async function addFavourite(db, uid, docSet, item) {
    try {
        if (!uid) {
            alert('must be logged in to access favourites');
            return
        }
        let colRef = collection(db, 'users', uid, docSet)
        // const refArray = []
        let favourites = await getDocs(colRef)
        let faved = checkFavourites(favourites, item)
        faved ? alert('Already favourited!')
            : addDoc(colRef, item)
    }
    catch (err) {
        console.error(err)
    }
}

async function removeFavourite(db, uid, docSet, item) {
    const colRef = collection(db, 'users', uid, docSet)
    console.log(item)
    getDocs(colRef)
        .then((documents) => {
            let mainId
            documents.forEach((document) => {

            if(docSet === 'artists'){
                if (document.data().artistTMID === item.artistTMID) {
                    mainId = document.id;
                    deleteDoc(doc(db, 'users', uid, docSet, mainId))
                    alert('deleted')
                    return
                }}

            if(docSet === 'venues'){
                    if (document.data().venueTMID === item.venueTMID) {
                        mainId = document.id;
                        deleteDoc(doc(db, 'users', uid, docSet, mainId))
                        alert('deleted')
                        return
                    }}
                })
            })
        }
function checkFavourites(favourites, item) {
    let refArray = []
    favourites.docs.forEach((document) => {
        refArray.push(document.data().name)
    })
    if (refArray.includes(item.name)) {
        return true
    } else {
        return false
    }
}
function addOrRemoveFavourite(favouriteArray, dataObject, docSet) {
    let addOrRemoveFavourite
    if (docSet === 'venues') {
        let TMIDArray = []
        for (let item of favouriteArray) {
            TMIDArray.push(item.venueTMID)
        }

        if (TMIDArray.includes(dataObject.venueTMID)) {
            addOrRemoveFavourite = true
        } else {
            addOrRemoveFavourite = false
        }
    }
    if (docSet === 'artists') {

        let TMIDArray = []
        for (let item of favouriteArray) {
            TMIDArray.push(item.artistTMID)
        }

        if (TMIDArray.includes(dataObject.artistTMID)) {
            addOrRemoveFavourite = true
        } else {
            addOrRemoveFavourite = false
        }
    }
    return addOrRemoveFavourite
}


export { getDocuments, selectFavouriteCategory, fillFavouritesGrid, checkFavourites, addFavourite, removeFavourite, addOrRemoveFavourite }
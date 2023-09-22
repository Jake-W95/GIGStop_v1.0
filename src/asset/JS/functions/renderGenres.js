function renderGenres(){
    const genreFilterHTML = `
    <div class="genreItem">
              <label for="Pop">Pop</label>
              <input type="radio" id="Pop" name="genre" value="KnvZfZ7vAev">
            </div>

            <div class="genreItem">
              <label for="Rock">Rock</label>
              <input type="radio" id="Rock" name="genre" value="KnvZfZ7vAeA">
            </div>

            <div class="genreItem">
              <label for="Metal">Metal</label>
              <input type="radio" id="Metal" name="genre" value="KnvZfZ7vAvt">
            </div>

            <div class="genreItem">
              <label for="Electronic">Electronic</label>
              <input type="radio" id="Electronic" name="genre" value="KnvZfZ7vAvF">
            </div>

            <div class="genreItem">
              <label for="Folk">Folk</label>
              <input type="radio" id="Folk" name="genre" value="KnvZfZ7vAva">
            </div>

            <div class="genreItem">
              <label for="Reggae">Reggae</label>
              <input type="radio" id="Reggae" name="genre" value="KnvZfZ7vAed">
            </div>

            <div class="genreItem">
              <label for="RnB">R&B</label>
              <input type="radio" id="RnB" name="genre" value="KnvZfZ7vAee">
            </div>

            <div class="genreItem">
              <label for="Hip-Hop">Hip-Hop</label>
              <input type="radio" id="Hip-Hop" name="genre" value="KnvZfZ7vAv1">
            </div>

            <div class="genreItem">
              <label for="Classical">Classical</label>
              <input type="radio" id="Classical" name="genre" value="KnvZfZ7vAeJ">
            </div>

            <div class="genreItem">
              <label for="Jazz">Jazz </label>
              <input type="radio" id="Jazz" name="genre" value="KnvZfZ7vAvE">
            </div>
            <div class="genreItem">

              <label for="Country">Country</label>
              <input type="radio" id="Country" name="genre" value="KnvZfZ7vAv6">
            </div>
    `
    $('#genreFilter').append(genreFilterHTML)
}

export default renderGenres
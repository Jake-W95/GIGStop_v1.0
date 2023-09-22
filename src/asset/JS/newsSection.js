
async function newsSection() {
    const newsSectionContainer = $('#newsSection');
    
    const newsAPI = await fetch('https://newsdata.io/api/1/news?apikey=pub_199791e5bd4eb4e889b018e48d1a0a6477d81&q=music&country=gb&language=en&category=entertainment')
    const response = await newsAPI.json()

    let articles = [];
    for (let i = 0; i < 6; i++) {
        articles.push(response.results[i])
    }
    for (let article of articles){
    let articleTitle = article.title;
    let articleDescription = article.articleDescription
    let articleContent = article.content
    let articleLink = article.link
    let articleImage = ''

    article.image_url !== null ? articleImage = article.image_url : articleImage = 'asset/IMAGES/GIGstop_logo.png'
    newsSectionContainer.append(`
 
    <a href="${articleLink}">
        <article class="newsArticle" style="background-image: url(${articleImage})">
            <div class="articleOverlay col">
            <h5>${articleTitle}</h5>
            </div>
        </article>
    </a>
    `)
}
}

export default newsSection()
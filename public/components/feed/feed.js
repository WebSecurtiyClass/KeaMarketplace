let pageTitle = window.location.pathname.split('/') //get the path from the url

let endPoint
switch (
    pageTitle[1] //check the url to know which list of post need to be requested from the db
) {
    case 'search':
        endPoint = '/api/posts' + window.location.search
        break
    case 'provided':
        endPoint = '/api/posts?type=offer'
        break
    case 'requested':
        endPoint = '/api/posts?type=find'
        break
    case 'myoffers':
        endPoint = '/api/posts?user=user'
        break
    default:
        endPoint = '/api/posts'
        break
}

//fetch posts info from api (db)
fetch(endPoint)
    .then((res) => res.json())
    .then((feed) => {
        const findDiv = document.getElementById('finds')
        const offerDiv = document.getElementById('offers')
        feed = feed.posts
        //for every post we create the html structure
        if (feed.length === 0) {
            alert(
                "Sorry, but we couldn't find what you have been looking for Pupsi :-("
            )
        }
        //load the posts from the fetch request
        feed.forEach((post) => {
            post.type === 'find'
                ? findDiv.appendChild(createPostCard(post))
                : offerDiv.appendChild(createPostCard(post))
        })
    })

//this general method will be used on createPostCard, takes tag name("div/h1/...") a the call we would like to give to the content itself
function createDivTag(tag, className, content) {
    const divTag = document.createElement(tag)
    divTag.classList.add(className)
    divTag.innerText = content
    return divTag
}

//create html with the fetched title and description of the post
function createPostCard(post) {
    const cardDiv = createDivTag('a', 'post', '')
    cardDiv.appendChild(createDivTag('div', 'sticker-type', post.type))
    cardDiv.appendChild(createDivTag('h2', 'post-title', post.title))
		if(post.fileName){
			const img = new Image(100,100); // width, height
			img.src = "../assets/post-images/"+post.fileName;
			cardDiv.appendChild(
				img
			)
		}
    cardDiv.appendChild(createDivTag('p', 'post-description', post.description))
    cardDiv.appendChild(
        createDivTag('div', 'post-price', 'price: ' + post.price + ' kr.')
    )
    cardDiv.href = '/posts/' + post.id
    return cardDiv
}

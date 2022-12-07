const postId = window.location.pathname.split('/posts/')[1] //get the post id from the url
const postViewElement = document.getElementById('view-post')

fetch('/api/post/' + postId)
    .then((res) => res.json())
    .then((post) => {
        post = post.post
        let user = post.user
        fetch('/api/users/profile')
            .then((res) => res.json())
            .then((currentUser) => {
                currentUser = currentUser.user
                if (
                    post.user === currentUser?.id ||
                    currentUser.role === 'ADMIN'
                ) {
                    const chatLink = createDivTag(
                        'div',
                        'post-user',
                        'This is your own post'
                    )
                    postViewElement.appendChild(chatLink)
                    const deleteButton = createDivTag(
                        'button',
                        'delete-post',
                        'Delete Post',
                        'delete-post'
                    )
                    deleteButton.addEventListener('click', deletePost)
                    postViewElement.appendChild(deleteButton)
                    if (post.user === currentUser.id) {
                        const updateButton = createDivTag(
                            'button',
                            'update-post',
                            'Update Post',
                            'update-post'
                        )
                        updateButton.addEventListener('click', updatePost)
                        postViewElement.appendChild(updateButton)
                    }
                } else {
                    fetch('/api/users/' + post.user)
                        .then((res) => res.json())
                        .then((userInfo) => {
                            userInfo = userInfo.user
                            user = userInfo.firstName + ' ' + userInfo.lastName
                            const chatLink = createDivTag(
                                'a',
                                'post-user',
                                'Send a message to: ' + user
                            )
                            chatLink.href = '/chats/' + post.user
                            postViewElement.appendChild(chatLink)
                        })
                }
            })
        if (post) {
            postViewElement.appendChild(
                createDivTag('h1', 'post-title', post.title)
            )
            postViewElement.appendChild(
                createDivTag('div', 'post-description', post.description)
            )
            postViewElement.appendChild(
                createDivTag('div', 'post-ad-type', post.type)
            )
            postViewElement.appendChild(
                createDivTag('div', 'post-price', post.price)
            )
        }
    })

function createDivTag(tag, className, content, id) {
    const divTag = document.createElement(tag)
    divTag.classList.add(className)
    divTag.innerText = content
    if (id) divTag.setAttribute('id', id)
    return divTag
}

function deletePost() {
    fetch('/api/post/' + postId, {
        method: 'DELETE',
    })
}

function updatePost() {
    window.location.href = window.location.origin + '/updatePost/' + postId
}

const postId = window.location.pathname.split('/updatePost/')[1] //get the post id from the url

fetch('/api/csrf-token')
    .then((res) => res.json())
    .then((userInfo) => {
        document.getElementById('csrfToken').value = userInfo.csrfToken
    })

document
    .getElementById('form-post-submit')
    .addEventListener('click', submitForm)
fetch(`/api/post/me/${postId}`)
    .then((response) => response.json())
    .then((res) => {
        document.getElementById('title').value = res.title
        document.getElementById('description').value = res.description
        document.getElementById('location').value = res.location
        document.getElementById('price').value = res.price
        document.getElementById('type').value = res.type
    })
    .catch((err) => {
        console.log('Error: ', err)
        window.location.href = window.location.origin
    })

function submitForm(e) {
    e.preventDefault()
    const body = JSON.stringify({
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        location: document.getElementById('location').value,
        price: document.getElementById('price').value,
        type: document.getElementById('type').value,
    })
    fetch(`/api/post/${postId}`, {
        method: 'PATCH',
        body: body,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((result) => {
            result.message === 'Success'
                ? window.location.replace('/')
                : window.location.replace('/error')
        })
}

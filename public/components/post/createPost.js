fetch('/api/csrf-token')
    .then((res) => res.json())
    .then((userInfo) => {
        document.getElementById('csrfToken').value = userInfo.csrfToken
    })

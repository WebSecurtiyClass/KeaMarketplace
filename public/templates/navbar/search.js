document.getElementById('search-btn').addEventListener('click', search)

function search() {
    const searchInput = document.getElementById('search-input').value
    window.location.href = '/search?post=' + searchInput
}

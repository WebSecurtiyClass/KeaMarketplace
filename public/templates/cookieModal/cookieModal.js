const modal = document.getElementById('cookie-modal')
const cookieButton = document.getElementById("close-cookie-model-btn")
cookieButton.addEventListener('click', closeModal)
function closeModal() {
    modal.style.display = 'none'
}

// const socket = io();

triggerNotifications()

function openSidenav() {
    const nav = document.getElementById('profileNavbar')
    nav.style.width = nav.style.width === '225px' ? '0' : '225px'
}
document.getElementById('profile-btn').addEventListener('click', openSidenav)

function triggerNotifications() {
    fetch('/api/users/profile')
        .then((result) => result.json())
        .then((user) => {
            user = user.user
            // socket.emit('joinRoom', user)
            if (user.notifications.length > 0) {
                document
                    .getElementById('profile-btn')
                    .classList.add('has-notification')
                user.notifications.forEach((notification) => {
                    document
                        .getElementById(notification.type)
                        .classList.add('has-notification')
                })
                window.history.pushState(user.notifications, 'notification')
            }
        })
}

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

            // socket.emit('triggerNotifications', user);
        })
}

// socket.on("newNotification", roomId => {
//     //When you get a new notification
//     //The chat href in the UI should light up
//     document.getElementById("chats").classList.add("has-notification");
//     document.getElementById("profile").classList.add("has-notification");
//     //Potentially, it should show you which room the notification is for
// });

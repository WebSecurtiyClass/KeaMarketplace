const firstName = document.getElementById('first-name')
const lastName = document.getElementById('last-name')
const email = document.getElementById('email')
const password = document.getElementById('password')
const rePassword = document.getElementById('re-password')
const button = document.getElementById('signup-button')
const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const passwordRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$'
)

firstName.addEventListener('keyup', checkingInput)
lastName.addEventListener('keyup', checkingInput)
email.addEventListener('keyup', checkingInput)
password.addEventListener('keyup', checkingInput)
rePassword.addEventListener('keyup', checkingInput)

function checkingInput() {
    //valid user input
    let checks = [
        passwordRegex.test(password.value),
        firstName.value.length > 1,
        lastName.value.length > 1,
        emailRegex.test(email.value),
        password.value === rePassword.value,
        password.value.length > 7,
    ]
    !checks.includes(false)
        ? (button.disabled = false)
        : (button.disabled = true)
}

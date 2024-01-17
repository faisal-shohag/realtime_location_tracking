const form = document.querySelector('#form')
const locState = document.querySelector('#loc-state')

const username = localStorage.getItem('username')



geoAllowed ? locState.innerHTML = 'Allowed':'Waiting...'
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(form.check.checked) {
        localStorage.setItem('username', form.username.value)
    } 

    // splash.classList.removeClass('hide')
    splash.classList.add('hide')
})


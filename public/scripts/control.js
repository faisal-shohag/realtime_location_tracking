const form = document.querySelector('#form')
const locState = document.querySelector('#loc-state')
const splash = document.querySelector('.splash')
const username = localStorage.getItem('username')

navigator.geolocation.getCurrentPosition((position) => {
        locState.innerHTML = 'Allowed';
        let username = localStorage.getItem('username')
        if(username) {
            splash.classList.remove('show')
            splash.classList.add('hide')
            main(username)
        } else {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if(form.check.checked) {
                    localStorage.setItem('username', form.username.value)
                } 
                main(form.username.value)
                splash.classList.add('hide')
            })
        }
    })





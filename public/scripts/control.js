const form = document.querySelector('#form')
const locState = document.querySelector('#loc-state')
const splash = document.querySelector('.splash')
const username = localStorage.getItem('username')
const reset = document.querySelector('#reset-username')

navigator.geolocation.getCurrentPosition((position) => {
        locState.innerHTML = 'Allowed';
        let username = localStorage.getItem('username')

        if(username) {
            splash.classList.remove('show')
            splash.classList.add('hide')
            main(username)
        } else {
            form.classList.remove('hide')
            form.classList.add('show')
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if(form.check.checked) {
                    localStorage.setItem('username', form.username.value)
                } 
                main(form.username.value)
                splash.classList.add('hide')
            })
        }

        reset.addEventListener('click', ()=>{
            localStorage.removeItem('username')
            window.location.reload()
        })
    })


    document.addEventListener('DOMContentLoaded', function() {
        if (!Notification) {
          alert('Desktop notifications not available in your browser. Try Chromium.');
          return;
        }
      
        if (Notification.permission !== "granted")
          Notification.requestPermission();
      });
      
      function notifyMe(title, msg, logo="https://github.com/faisal-shohag/realtime_location_tracking/blob/master/public/images/3d-navigation.png?raw=true") {
        if (Notification.permission !== "granted")
          Notification.requestPermission();
        else {
          var notification = new Notification(title, {
            icon: logo,
            body: msg,
          });
        }
      }
      
     




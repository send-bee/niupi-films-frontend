let signInEmail = document.getElementById("sign-in-email");
let signInPassword = document.getElementById("sign-in-password");
let signUpName = document.getElementById("sign-up-name");
let signUpEmail = document.getElementById("sign-up-email");
let signUpPassword = document.getElementById("sign-up-password");
let signUpSubmitButton = document.getElementById("sign-up-submit-button");
let signInSubmitButton = document.getElementById("sign-in-submit-button");
let heroMain = document.getElementById("hero-main");
let heroSection = document.getElementById("hero-section");
let heroUser = document.getElementById("hero-user");
let heroUserName = document.getElementById("hero-user-name");
let favoritesFilmSection = document.getElementById("favorite-movies-section");
let noColection = document.getElementById("no-colection");
let signUpSection = document.getElementById("sign-up");
let signInSection = document.getElementById("sign-in");
let signInButton = document.getElementById("iniciar-sesion-button");
let signOutButton = document.getElementById("cerrar-sesion-button");
let signUpButton = document.getElementById("registrarse-button");
let signUpSecondButton = document.getElementById("registrarse-secondbutton");
let signInClose = document.getElementById("sign-in-close");
let signUpClose = document.getElementById("sign-up-close");
let firstSpinner = document.getElementById("first-spinner");
let secondSpinner = document.getElementById("second-spinner");

document.addEventListener("DOMContentLoaded", ()=>{
    let initialNiupiUserLS = window.localStorage.getItem("niupi_films_user");
    if (initialNiupiUserLS) {
        const user = JSON.parse(initialNiupiUserLS);
        heroUserName.innerText = `¡¡¡Hola ${user.name}!!!`;
        signUpSubmitButton.classList.remove("disabled");
        secondSpinner.classList.add("disabled");
        heroMain.classList.remove("disabled");
        signInSection.classList.add("disabled");
        signInButton.classList.add("disabled");
        signOutButton.classList.remove("disabled");
        heroSection.classList.add("disabled");
        heroUser.classList.remove("disabled");
        favoritesFilmSection.classList.remove("disabled");
        if (user.favoritesFilms.length < 1) {
            noColection.classList.remove("disabled")
        }
    }
})

signInButton.addEventListener("click", ()=>{
    heroMain.classList.add("disabled");
    signInSection.classList.remove("disabled");
    signUpSection.classList.add("disabled");
});

signUpButton.addEventListener("click", ()=>{
    heroMain.classList.add("disabled");
    signInSection.classList.add("disabled");
    signUpSection.classList.remove("disabled");
});

signUpSecondButton.addEventListener("click", ()=>{
    heroMain.classList.add("disabled");
    signInSection.classList.add("disabled");
    signUpSection.classList.remove("disabled");
});

signInClose.addEventListener("click", ()=>{
    heroMain.classList.remove("disabled");
    signInSection.classList.add("disabled");
    signUpSection.classList.add("disabled");
});

signUpClose.addEventListener("click", ()=>{
    heroMain.classList.remove("disabled");
    signInSection.classList.add("disabled");
    signUpSection.classList.add("disabled");
});

signOutButton.addEventListener("click", ()=>{
    window.localStorage.removeItem("niupi_films_user");
    signInButton.classList.remove("disabled");
    signOutButton.classList.add("disabled");
    favoritesFilmSection.classList.add("disabled");
    heroSection.classList.remove("disabled");
    heroUser.classList.add("disabled");
});

async function signUp (e) {
    e.preventDefault();
    signUpSubmitButton.classList.add("disabled");
    secondSpinner.classList.remove("disabled");
    const res = await fetch('https://niupi-films-backend.onrender.com/portal-users/create-account', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: signUpName.value,
            email: signUpEmail.value,
            password: signUpPassword.value
        })        
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.localStorage.setItem("niupi_films_user", JSON.stringify(data.data));
            Swal.fire({
                title: `${data.message}`,
                icon: "success",
                confirmButtonText: 'Aceptar',
                customClass: {
                    title: 'custom-title',
                    confirmButton: 'custom-confirm',
                    popup: 'custom-popup'}
                });
            heroUserName.innerText = `¡¡¡Hola ${data.data.name}!!!`;
            signUpSubmitButton.classList.remove("disabled");
            secondSpinner.classList.add("disabled");
            heroMain.classList.remove("disabled");
            signUpSection.classList.add("disabled");
            signInButton.classList.add("disabled");
            signOutButton.classList.remove("disabled");
            heroSection.classList.add("disabled");
            heroUser.classList.remove("disabled");
            favoritesFilmSection.classList.remove("disabled");
            if (data.data.favoritesFilms.length < 1) {
            noColection.classList.remove("disabled")}
            signUpName.value = "";
            signUpEmail.value = "";
            signUpPassword.value = "";
        } else {
          Swal.fire({
            title: `${data.message}`,
            icon: "error",
            confirmButtonText: 'Aceptar',
            customClass: {
                title: 'custom-title',
                confirmButton: 'custom-confirm',
                popup: 'custom-popup'}
            });
            signUpSubmitButton.classList.remove("disabled");
            secondSpinner.classList.add("disabled");
            signUpName.value = "";
            signUpEmail.value = "";
            signUpPassword.value = "";
        }
    })
    .catch(error => {
        console.log(":C")
    })
}

async function signIn (e) {
    e.preventDefault();
    signInSubmitButton.classList.add("disabled");
    firstSpinner.classList.remove("disabled");
    const res = await fetch('https://niupi-films-backend.onrender.com/portal-users/create-session', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: signInEmail.value,
            password: signInPassword.value
        })        
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.localStorage.setItem("niupi_films_user", JSON.stringify(data.data));
            Swal.fire({
                title: `${data.message}`,
                icon: "success",
                confirmButtonText: 'Aceptar',
                customClass: {
                    title: 'custom-title',
                    confirmButton: 'custom-confirm',
                    popup: 'custom-popup'}
                });
            heroUserName.innerText = `¡¡¡Hola ${data.data.name}!!!`;
            signInSubmitButton.classList.remove("disabled");
            firstSpinner.classList.add("disabled");
            heroMain.classList.remove("disabled");
            signInSection.classList.add("disabled");
            signInButton.classList.add("disabled");
            signOutButton.classList.remove("disabled");
            heroSection.classList.add("disabled");
            heroUser.classList.remove("disabled");
            favoritesFilmSection.classList.remove("disabled");
            if (data.data.favoritesFilms.length < 1) {
            noColection.classList.remove("disabled")}
            signInEmail.value = "";
            signInPassword.value = "";
        } else {
          Swal.fire({
            title: `${data.message}`,
            icon: "error",
            confirmButtonText: 'Aceptar',
            customClass: {
                title: 'custom-title',
                confirmButton: 'custom-confirm',
                popup: 'custom-popup'}
            });
            signInSubmitButton.classList.remove("disabled");
            firstSpinner.classList.add("disabled");
            signInEmail.value = "";
            signInPassword.value = "";
        }
    })
    .catch(error => {
        console.log(":C")
    })
}

signInSubmitButton.addEventListener("click", signIn);
signUpSubmitButton.addEventListener("click", signUp);
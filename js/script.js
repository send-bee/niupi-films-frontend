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
        getFavoritesFilmsFromDb();
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
    const endpoint = `${link}/portal-users/create-account`;
    const body = {
        name: signUpName.value,
        email: signUpEmail.value,
        password: signUpPassword.value
    }
    const res = await request(endpoint, body)
    if (res.success) {
        window.localStorage.setItem("niupi_films_user", JSON.stringify(res.data));
        makeSwal(res.message, "success")
        heroUserName.innerText = `¡¡¡Hola ${res.data.name}!!!`;
        signUpSubmitButton.classList.remove("disabled");
        secondSpinner.classList.add("disabled");
        heroMain.classList.remove("disabled");
        signUpSection.classList.add("disabled");
        signInButton.classList.add("disabled");
        signOutButton.classList.remove("disabled");
        heroSection.classList.add("disabled");
        heroUser.classList.remove("disabled");
        favoritesFilmSection.classList.remove("disabled");
        getFavoritesFilmsFromDb();
        signUpName.value = "";
        signUpEmail.value = "";
        signUpPassword.value = "";
    } else {
        makeSwal(res.message, "error")
        signUpSubmitButton.classList.remove("disabled");
        secondSpinner.classList.add("disabled");
        signUpName.value = "";
        signUpEmail.value = "";
        signUpPassword.value = "";
    }
}

async function signIn (e) {
    e.preventDefault();
    signInSubmitButton.classList.add("disabled");
    firstSpinner.classList.remove("disabled");
    const endpoint = `${link}/portal-users/create-session`;
    const body = {
        email: signInEmail.value,
        password: signInPassword.value
    }
    const res = await request(endpoint, body);
    if (res.success) {
        window.localStorage.setItem("niupi_films_user", JSON.stringify(res.data));
        makeSwal(res.message, "success")
        heroUserName.innerText = `¡¡¡Hola ${res.data.name}!!!`;
        signInSubmitButton.classList.remove("disabled");
        firstSpinner.classList.add("disabled");
        heroMain.classList.remove("disabled");
        signInSection.classList.add("disabled");
        signInButton.classList.add("disabled");
        signOutButton.classList.remove("disabled");
        heroSection.classList.add("disabled");
        heroUser.classList.remove("disabled");
        favoritesFilmSection.classList.remove("disabled");
        getFavoritesFilmsFromDb();
        signInEmail.value = "";
        signInPassword.value = "";
    } else {
        makeSwal(res.message, "error")
        signInSubmitButton.classList.remove("disabled");
        firstSpinner.classList.add("disabled");
        signInEmail.value = "";
        signInPassword.value = "";
    }
}

signInSubmitButton.addEventListener("click", signIn);
signUpSubmitButton.addEventListener("click", signUp);
const movies = [
  { id: "1", title: "Inception", description: "Un ladrón roba secretos entrando en los sueños.", image: "assets/movie1.jpg" },
  { id: "2", title: "Interstellar", description: "Un viaje a través del espacio y el tiempo para salvar a la humanidad.", image: "assets/movie2.jpg" },
  { id: "3", title: "Matrix", description: "La realidad es una simulación controlada por máquinas.", image: "assets/movie3.jpg" },
  { id: "4", title: "El Padrino", description: "La historia de una familia mafiosa en EE.UU.", image: "assets/movie4.jpg" },
  { id: "5", title: "Spirited Away", description: "Una niña entra a un mundo mágico para salvar a sus padres.", image: "assets/movie5.jpg" },
  { id: "6", title: "Avatar", description: "Un exmarine se une a un mundo alienígena en conflicto.", image: "assets/movie6.jpg" },
  { id: "7", title: "La La Land", description: "Un pianista y una actriz persiguen sus sueños en Los Ángeles.", image: "assets/movie7.jpg" },
  { id: "8", title: "John Wick", description: "Un exasesino a sueldo sale de su retiro para vengarse.", image: "assets/movie8.jpg" },
  { id: "9", title: "Mad Max: Fury Road", description: "Un luchador por la libertad atraviesa un desierto postapocalíptico.", image: "assets/movie9.jpg" },
  { id: "10", title: "Fight Club", description: "Un hombre desilusionado forma un club subterráneo de pelea.", image: "assets/movie10.jpg" },
];

function updateAddButtons() {
  addButtons = document.querySelectorAll(".btn-secundary-add");
  addButtons.forEach(button => {
    button.addEventListener("click", addFavorite);
  });
}

function updateRemoveButtons() {
  removeButtons = document.querySelectorAll(".btn-secundary-remove");
  removeButtons.forEach(button => {
    button.addEventListener("click", removeFavorite);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  function renderMovies() {
    const grid = document.getElementById("moviesGrid");
    grid.innerHTML = "";
    movies.forEach(movie => {
      const card = document.createElement("div");
      card.classList.add("movie");
      card.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}" />
        <button class="btn-secundary-add" id="${movie.id}">❤️</button>
        <button class="btn-secundary-remove disabled" id="${movie.id}">❌</button>
        <div class="movie-title">${movie.title}</div>
        <p>${movie.id}</p>
      `;
      grid.appendChild(card);
    });
  }
  renderMovies();
  updateAddButtons();
  updateRemoveButtons();
});

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-menu");
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
});

async function removeFavorite (e) {
  let userInLS = window.localStorage.getItem("niupi_films_user");
  userToUse = JSON.parse(userInLS);
  let idMovieToRemove = e.currentTarget.id;
  const index = userToUse.favoritesFilms.indexOf(idMovieToRemove);
  userToUse.favoritesFilms.splice(index, 1);
  try {
    const r = await fetch("https://niupi-films-backend.onrender.com/portal-movies/update-favorites", {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userToUse.email,
          favoritesFilms: userToUse.favoritesFilms
        })        
      })
      .then(res => res.json())
      .then(data => {
        window.localStorage.setItem("niupi_films_user", JSON.stringify({
          name: userToUse.name,
          email: userToUse.email,
          favoritesFilms: userToUse.favoritesFilms
        }))
        Swal.fire({
          title: `${data.message}`,
          icon: "success",
          confirmButtonText: 'Aceptar',
          customClass: {
              title: 'custom-title',
              confirmButton: 'custom-confirm',
              popup: 'custom-popup'}
          });
      })
      .catch(error => console.log(error)) 
  } catch (error) {console.log(error)} 
  
}
  
async function addFavorite(e) {
  let userInLS = window.localStorage.getItem("niupi_films_user");
  const userLS = () => {
    if(userInLS) {
      const user = JSON.parse(userInLS);
      return user
    } else {
      return false
    }
  }
  let userToUse = userLS()
  if (!userToUse) {
    Swal.fire({
      title: "Please sign in",
      icon: "error",
      confirmButtonText: 'Aceptar',
      customClass: {
        title: 'custom-title',
        confirmButton: 'custom-confirm',
        popup: 'custom-popup'}
      });
    } else if (userToUse) {
      let idMovieToAdd = e.currentTarget.id;
      let movieIn =  userToUse.favoritesFilms.includes(idMovieToAdd)
      if (movieIn) {
        Swal.fire({
          title: "This movie is already in your favorites movies",
          icon: "error",
          confirmButtonText: 'Aceptar',
          customClass: {
            title: 'custom-title',
            confirmButton: 'custom-confirm',
            popup: 'custom-popup'}
          });
      } else {
        try {
          userToUse.favoritesFilms.push(idMovieToAdd);
          const r = await fetch("http://localhost:5000/portal-movies/update-favorites", {
            method: 'POST',
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: userToUse.email,
                favoritesFilms: userToUse.favoritesFilms
              })        
            })
            .then(res => res.json())
            .then(data => {
              window.localStorage.setItem("niupi_films_user", JSON.stringify({
                name: userToUse.name,
                email: userToUse.email,
                favoritesFilms: userToUse.favoritesFilms
              }))
              Swal.fire({
                title: `${data.message}`,
                icon: "success",
                confirmButtonText: 'Aceptar',
                customClass: {
                    title: 'custom-title',
                    confirmButton: 'custom-confirm',
                    popup: 'custom-popup'}
                });
            }).catch(error => {console.log(error)}) 
        } catch (error) {console.log(error)}        
      }
    }
}

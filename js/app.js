const link = "http://localhost:5000"
const blink = "https://niupi-films-backend.onrender.com"
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("moviesGrid");
  const searchInput = document.getElementById("searchInput");
  const genreSelect = document.getElementById("genreSelect");
  const yearSelect = document.getElementById("yearSelect");
  const ratingSelect = document.getElementById("ratingSelect");
  const directorSelect = document.getElementById("directorSelect");

  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-menu");
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  cargarPeliculas();
  
  function mostrarCargando() {
    grid.innerHTML = "<p>Cargando...</p>";
  }

  async function cargarPeliculas() {
    mostrarCargando();
    try {
      const res = await fetch(`${link}/api/peliculas`);
      const peliculas = await res.json();
      renderPeliculas(peliculas);
    } catch (err) {
      grid.innerHTML = "<p>Error al cargar las películas.</p>";
      console.error("Error:", err);
    }
  }

  function renderPeliculas(peliculas) {
    grid.innerHTML = "";

    if (!peliculas.length) {
      grid.innerHTML = "<p>No se encontraron películas.</p>";
      return;
    }
    peliculas.forEach((pelicula) => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.style.backgroundImage = `url('${pelicula.imagen || 'ruta_default_imagen.jpg'}')`;

      card.innerHTML = `
        <div class="movie-card-content">
          <button class="btn-secundary-add" id="${pelicula._id}">❤️</button>
          <h3>${pelicula.titulo}</h3>
          <p><strong>Año:</strong> ${pelicula.anio}</p>
          <p><strong>Género:</strong> ${pelicula.genero}</p>
          <p><strong>Rating:</strong> ${pelicula.rating || "N/A"}</p>
          <p><strong>Director:</strong> ${pelicula.director || "Desconocido"}</p>
        </div>
      `;

      grid.appendChild(card);
    });
    updateAddButtons();
  }

  searchInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = searchInput.value.trim();

      if (!query) {
        cargarPeliculas();
        return;
      }

      try {
        const res = await fetch(`${link}/api/peliculas/buscar?titulo=${encodeURIComponent(query)}`);
        const peliculas = await res.json();
        renderPeliculas(peliculas);
      } catch (err) {
        console.error("Error al buscar:", err);
        grid.innerHTML = "<p>Error al buscar películas.</p>";
      }
    }
  });

  document.getElementById("filterForm").addEventListener("change", async () => {
    const genero = genreSelect.value;
    const anio = yearSelect.value;
    const rating = ratingSelect.value;
    const director = directorSelect.value;

    const queryParams = new URLSearchParams();
    if (genero) queryParams.append('genero', genero);
    if (anio) queryParams.append('anio', anio);
    if (rating) queryParams.append('rating', rating);
    if (director) queryParams.append('director', director);

    try {
      const res = await fetch(`${link}/api/peliculas/buscar?${queryParams.toString()}`);
      const peliculas = await res.json();
      renderPeliculas(peliculas);
    } catch (err) {
      console.error("Error al aplicar los filtros:", err);
      grid.innerHTML = "<p>Error al aplicar los filtros.</p>";
    }
  });

  // Evento específico para filtrar por género (opcional, ya cubierto por filterForm)
  genreSelect.addEventListener('change', async (e) => {
    const selectedGenre = e.target.value;

    if (!selectedGenre) {
      cargarPeliculas(); // Si se deselecciona género, carga todo
      return;
    }

    try {
      const res = await fetch(`${link}/api/peliculas/genero/${encodeURIComponent(selectedGenre)}`);
      const peliculas = await res.json();
      renderPeliculas(peliculas);
    } catch (error) {
      console.error('Error al obtener películas por género:', error);
      grid.innerHTML = "<p>Error al filtrar por género.</p>";
    }
  });

});


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

async function request (endpoint, body) {
  const r = await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)        
    })
    .then(res => res.json())
    .then(data => {return data})
    .catch(error => {return error})
  return r
}

function makeSwal ( message, icon) {
  Swal.fire({
    title: message,
    icon: icon,
    confirmButtonText: 'Aceptar',
    customClass: {
      title: 'custom-title',
      confirmButton: 'custom-confirm',
      popup: 'custom-popup'}
    });
}

async function getFavoritesFilmsFromDb () {
  let userInLS = window.localStorage.getItem("niupi_films_user");
  if (userInLS) {
    const favoritesGrid = document.getElementById("favoriteMoviesGrid");
    favoritesGrid.innerHTML = "";
    userToUse = JSON.parse(userInLS);
    const endpoint = `${link}/api/peliculas/ids`;
    const body = { favoritesFilms: userToUse.favoritesFilms }
    const response = await request(endpoint, body);
    response.forEach((pelicula) => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.style.backgroundImage = `url('${pelicula.imagen || 'ruta_default_imagen.jpg'}')`;
      card.innerHTML = `
        <div class="movie-card-content">
          <button class="btn-secundary-remove" id="${pelicula._id}">❌</button>
          <h3>${pelicula.titulo}</h3>
          <p><strong>Año:</strong> ${pelicula.anio}</p>
          <p><strong>Género:</strong> ${pelicula.genero}</p>
          <p><strong>Rating:</strong> ${pelicula.rating || "N/A"}</p>
          <p><strong>Director:</strong> ${pelicula.director || "Desconocido"}</p>
        </div>
      `;
      favoritesGrid.appendChild(card);
    });
    updateRemoveButtons();
  }
}

async function removeFavorite (e) {
  let userInLS = window.localStorage.getItem("niupi_films_user");
  userToUse = JSON.parse(userInLS);
  let idMovieToRemove = e.currentTarget.id;
  const index = userToUse.favoritesFilms.findIndex(id => {return id === idMovieToRemove});
  userToUse.favoritesFilms.splice(index, 1);
  try {
    const endpoint = `${link}/portal-movies/update-favorites`;
    const body = { email: userToUse.email, favoritesFilms: userToUse.favoritesFilms }
    const result = await request(endpoint, body);
      window.localStorage.setItem("niupi_films_user", JSON.stringify({
          name: userToUse.name,
          email: userToUse.email,
          favoritesFilms: userToUse.favoritesFilms
        }))
        makeSwal(result.message, "success");
        getFavoritesFilmsFromDb(); 
  } catch (error) {console.log(error)}  
}
  
async function addFavorite(e) {
  let userInLS = window.localStorage.getItem("niupi_films_user");
  const userLS = () => {
    if(userInLS) {
      const user = JSON.parse(userInLS);
      return user
    } else { return false }
  }
  let userToUse = userLS()
  if (!userToUse) {
    makeSwal("Please sign in", "error")
    };
    if (userToUse) {
      let idMovieToAdd = e.currentTarget.id;
      let movieIn =  userToUse.favoritesFilms.includes(idMovieToAdd)
      if (movieIn) {
        makeSwal("This movie is already in your favorites movies", "error")
      };
      if (!movieIn) {
        try {
          userToUse.favoritesFilms.push(idMovieToAdd);
          const endpoint = `${link}/portal-movies/update-favorites`;
          const body = { email: userToUse.email, favoritesFilms: userToUse.favoritesFilms }
          const result = await request(endpoint, body);
            window.localStorage.setItem("niupi_films_user", JSON.stringify({
              name: userToUse.name,
              email: userToUse.email,
              favoritesFilms: userToUse.favoritesFilms
            }))
            makeSwal(result.message, "success")
            getFavoritesFilmsFromDb(); 
        } catch (error) {console.log(error)}        
      }
    }
}

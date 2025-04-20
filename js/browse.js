import { initBasketUI, redirectToCheckout } from "./basket.js";

/* Toast message pop up - added to cart */ 
function showToastMessage(message) {
    const toast = document.getElementById("toast");
    if(!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    initBasketUI();
    const checkoutBtn = document.getElementById("checkout-btn");

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", redirectToCheckout);
    }

    const apiUrl = "https://v2.api.noroff.dev/square-eyes";
    const apiMovieContainer = document.getElementById("api-movie-container");

    let allMovies = [];

    function displayMovies(movies) {
        apiMovieContainer.innerHTML = "";

        movies.forEach(movie => {
            const movieElement = document.createElement("div");
            movieElement.classList.add("movie");

            movieElement.innerHTML = `
                <div class="movie-wrapper">
                     <img src="${movie.image.url}" alt="${movie.image.alt}" class="movie-image">
                     <div class="movie-overlay">
                         <a href="movie-details/index.html?id=${movie.id}" class="info-btn" aria-label="More info about ${movie.title}">Info</a>
                         <button class="add-btn" 
                         aria-label="Add ${movie.title} to cart" 
                         data-id="${movie.id}"
                         data-title="${movie.title}"
                         data-image="${movie.image.url}"
                         data-price="${movie.price}">
                         Add to Cart
                         </button>
                     </div>
                </div>
                <h3>${movie.title}</h3>
            `;
            apiMovieContainer.appendChild(movieElement);

            const addButton = movieElement.querySelector(".add-btn");
            addButton.addEventListener("click", () => {
                const { id, title, image, price } = addButton.dataset;
                window.addToBasket(id, title, image, price);
                showToastMessage(`${title} was added to your basket.`);
            });
        });
    }

    /* Genre Filter buttons */ 
    const genreButtons = document.querySelectorAll(".genre-btn");
    genreButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedGenre = button.dataset.genre;

            genreButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            if (selectedGenre === "all") {
                displayMovies(allMovies);
            } else {
                const filtered = allMovies.filter(movie =>
                    movie.genre && movie.genre.toLowerCase() === selectedGenre.toLowerCase()
                );
                displayMovies(filtered);
            }
        });
    });

    // Fetch Api- Movies //
    async function fetchMovies() {
        apiMovieContainer.innerHTML = `<div class="loading-spinner"></div>`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            allMovies = data.data || data;
            displayMovies(allMovies);

        } catch (error) {
            apiMovieContainer.innerHTML = "<p> failed to load movies</p>";
            alert("Something went wrong while fetching movies");
        }
    }

    fetchMovies();

});


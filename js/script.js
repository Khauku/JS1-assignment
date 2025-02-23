
document.addEventListener("DOMContentLoaded", () => {
    const basketToggle = document.getElementById("basket-toggle");
    const basketDropdown = document.getElementById("basket-dropdown");
    const basketList = document.getElementById("basket-list");
    const checkoutBtn = document.getElementById("checkout-btn");
    const basketCount = document.getElementById("basket-count");
    const apiMovieContainer = document.getElementById("api-movie-container");

    let basket = JSON.parse(localStorage.getItem("basket")) || [] ;

    // Toggle basket dropdown when clicking icon //
    basketToggle.addEventListener("click", () => {
        const isExpanded = basketToggle.getAttribute ("aria-expanded") === "true";
        basketToggle.setAttribute("aria-expanded", !isExpanded);
        basketDropdown.classList.toggle("show");

        if (basket.length ===0) {
            basketList.innerHTML = "<p>Your basket is empty</p>";
        }
    });

    // Keyboard accessibility to basket toggle  //
    basketToggle.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            basketDropdown.classList.toggle ("show");
            basketToggle.setAttribute("aria-expanded", basketDropdown.classList.contains("show"));
        }
    });

    //Update basket count & display //
    function updateBasket () {
        basketList.innerHTML = "";

        if(basket.length ===0) {
            basketList.innerHTML = "<p style='text-align:center; color #333;'>Your basket is empty</p>";
        } else {
            basket.forEach((movie, index) => {
                const li = document.createElement ("li");
                li.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}">
                <span>${movie.title}</span>
                <button class="remove-btn" onclick="removeFromBasket(${index})">X</button>
                `;
                basketList.appendChild(li);
            });
        }

        localStorage.setItem("basket", JSON.stringify(basket));
    }

    //Add movie to basket //
    window.addToBasket =(id, title, image, price) => {
        try {
            basket.push({ id, title, image, price });
            localStorage.setItem("basket", JSON.stringify(basket));

            updateBasket ();

            const basketDropdown = document.getElementById("basket-dropdown");
            const basketToggle = document.getElementById("basket-toggle");

            basketDropdown.classList.add("show");
            basketToggle.setAttribute("aria-expanded", "true");
            } catch (error) {
                alert("Something went wrong while adding to the basket.");
        }
    };

    //Remove movie from basket //
    window.removeFromBasket = (index) => {
        try {
            basket.splice(index, 1);
            updateBasket();
            } catch (error) {
                alert("Something went wrong while removing the item.");
        }
    };


//Redirecting to Checkout//

async function redirectToCheckout() {
    try {
        showLoadingIndicator(true);

        const basket = JSON.parse(localStorage.getItem("basket")) || [];

        if (basket.length === 0) {
            alert("Your basket is empty. Please add a movie before checkout.")
            showLoadingIndicator(false);
            return;
        }

        const selectedMovie = basket[0];

        if (!selectedMovie || !selectedMovie.id) {
            alert("Something went wrong, Please try again.");
            showLoadingIndicator(false);
            return;
        }

        localStorage.setItem("selectedCheckoutMovie", JSON.stringify(selectedMovie));

        window.location.href = "checkout.html";
    } catch(error) {
        alert("An unexpected error occurred. Please try again.");
    } finally {
        showLoadingIndicator(false);
    }
}

async function loadCheckoutMovie() {
    try {
        showLoadingIndicator(true);

        const selectedMovie = JSON.parse(localStorage.getItem("selectedCheckoutMovie"));

        if(!selectedMovie) {
            alert("No movie selected for checkout");
            window.location.href = "movies.html";
            return;
        }

        document.getElementById("movie-title").textContent = selectedMovie.title;
        document.getElementById("movie-poster").src = selectedMovie.image;
        document.getElementById("movie-poster").alt = `${selectedMovie.title} Cover`;
        document.getElementById("movie-price").textContent = `Price: $${selectedMovie.price}`;
    } catch (error) {
        alert("failed to load movie details. Please refresh the page");
    } finally {
        showLoadingIndicator(false);
    }
}

// Display Api- Movies //

function displayMovies(movies) {
    const apiMovieContainer = document.getElementById("api-movie-container");
    apiMovieContainer.innerHTML = "";

    movies.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");

        movieElement.innerHTML = `
          <div class="movie-wrapper">
             <img src="${movie.image.url}" alt="${movie.image.alt}" class="movie-image">
             <div class="movie-overlay">
                  <button class="info-btn" aria-label="More info about ${movie.title}" onclick="showMovieInfo('${movie.id}')">Info</button>
                  <button class="add-btn" aria-label="Add ${movie.title} to cart" onclick="addToBasket('${movie.id}', '${movie.title}', '${movie.image.url}', '${movie.price}')">Add to Cart</button>
            </div>
          </div>
             <h3>${movie.title}</h3>
        `;
        apiMovieContainer.appendChild(movieElement);
    });
}


const accessToken = "INSERT_YOUR_API_KEY_HERE";
const apiKey = "INSERT_TOKEN_HERE";

const apiUrl = "https://v2.api.noroff.dev/square-eyes";

const options = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": "INSERT_API_KEY_HERE"
    }
};


// Fetch Api- Movies //

async function fetchMovies() {
    const apiMovieContainer = document.getElementById("api-movie-container");
    apiMovieContainer.innerHTML = `<div class="loading-spinner"></div>`;

    try {
        const response = await fetch(apiUrl, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayMovies(data.data || data);
    } catch (error) {
        apiMovieContainer.innerHTML = "<p> failed to load movies</p>";
        alert("Something went wrong while fetching movies");
    }
}

fetchMovies();

});
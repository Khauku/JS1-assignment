import { showLoadingIndicator } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    const cover = document.getElementById("checkout-cover");
    const title = document.getElementById("checkout-title");
    const price = document.getElementById("checkout-price");

    showLoadingIndicator(true);

    try {
        const movie = JSON.parse(localStorage.getItem("selectedCheckoutMovie"));

        if (!movie || !movie.id) {
            alert("No movie selected for checkout.");
            window.location.href = "../browse.html";
            return;
        }

        /* checkout details*/ 
        cover.src = movie.image;
        cover.alt = movie.title;
        title.textContent = movie.title;
        price.textContent= `${movie.price} kr`;

    } catch (error) {
        alert("Something went wrong loading the checkout data.");
        console.error(error);
    } finally {
        showLoadingIndicator(false);
    }
});
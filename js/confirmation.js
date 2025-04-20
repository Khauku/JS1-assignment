import { showLoadingIndicator } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    const cover = document.getElementById("confirmation-cover");
    const title = document.getElementById("confirmation-title");

    showLoadingIndicator(true);

    try {
        const movie = JSON.parse(localStorage.getItem("selectedCheckoutMovie"));

        if (!movie || !movie.id) {
            alert("No movie selected.");
            window.location.href= "../../index.html";
            return;
        }

        cover.src = movie.image;
        cover.alt = movie.title;
        title.textContent = movie.title;

        localStorage.removeItem("selectedCheckoutMovie");
        localStorage.removeItem("basket");

    } catch (error) {
        alert("Something went wrong showing your confirmation.");
        console.error(error);
    } finally {
        showLoadingIndicator(false);
    }
});
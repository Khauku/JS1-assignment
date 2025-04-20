
import { getQueryParam } from "../js/utils.js";

const productId = getQueryParam("id");
const apiUrl = `https://v2.api.noroff.dev/square-eyes/${productId}`;

async function loadProduct() {

    try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const movie = data.data || data;

    document.getElementById("product-title").textContent = movie.title;
    document.getElementById("product-description").textContent = movie.description;
    document.getElementById("product-price").textContent = `${movie.price} kr`;

    document.getElementById("product-meta").textContent = movie.genre ? `${movie.genre} - ${movie.released}` : '';
    document.getElementById("product-rating").textContent = `IMDB rating: ${movie.rating}`;

    const imageBanner = document.getElementById("product-image-banner");
    if (movie.image?.url) {
        imageBanner.style.backgroundImage = `url(${movie.image.url})`;
        imageBanner.style.backgroundSize = "cover";
        imageBanner.style.backgroundPosition = "center";
    }

    const addBtn = document.getElementById("add-to-cart-btn");
    addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.addToBasket(movie.id, movie.title, movie.image.url, movie.price);
        showToast(`${movie.title} was added to your basket`); 
    });

 } catch (err) {
    console.error ("Failed to load product:", err)
    const main =document.querySelector("main");
    main.innerHTML = "<p class='error-message'>Could not load product info.</p>";
 }

}

loadProduct();

/* Toast message pop up - added to cart */ 
function showToast(message) {
    const toast = document.getElementById("toast");
    if(!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
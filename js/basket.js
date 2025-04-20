    
    import { showLoadingIndicator } from "./utils.js";
    
    let basket = JSON.parse(localStorage.getItem("basket")) || [];

    let basketToggle, basketDropdown, basketList;

    // Toggle basket dropdown when clicking icon //
    export function initBasketUI() {
        basketToggle = document.getElementById("basket-toggle");
        basketDropdown = document.getElementById("basket-dropdown");
        basketList = document.getElementById("basket-list");

        if (!basketToggle || !basketDropdown || !basketList) return;

        basketToggle.addEventListener("click", () => {
            const isExpanded = basketToggle.getAttribute ("aria-expanded") === "true";
            basketToggle.setAttribute("aria-expanded", !isExpanded);
            basketDropdown.classList.toggle("show");
        });

        // Keyboard accessibility to basket toggle  //
        basketToggle.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                basketDropdown.classList.toggle ("show");
                basketToggle.setAttribute("aria-expanded", basketDropdown.classList.contains("show"));
            }
        });
        
        updateBasket();

    }
        //Update basket count & display //
        function updateBasket () {

            if(!basketList) return;

            basketList.innerHTML = "";

            const basketCount = document.getElementById("basket-count");
            basketCount.textContent = basket.length;

            if(basket.length ===0) {
                basketList.innerHTML = "<p style='text-align:center; color: #333;'>Your basket is empty</p>";
            } else {
                basket.forEach((movie, index) => {
                    const li = document.createElement ("li");
                    li.classList.add("basket-item");

                    li.innerHTML = `
                        <img src="${movie.image}" alt="${movie.title}">
                        <div class="basket-text">
                            <span class="basket-title">${movie.title}</span>
                            <span class="basket-price">${movie.price} kr</span>
                        </div>
                        <button class="remove-btn" data-index="${index}">X</button>
                    `;

                    basketList.appendChild(li);
                });

                basketList.querySelectorAll(".remove-btn").forEach(button => {
                    button.addEventListener("click", (e) => {
                        const index = e.target.getAttribute("data-index");
                        basket.splice(index, 1);
                        localStorage.setItem("basket", JSON.stringify(basket));
                        updateBasket();
                    });
                });

    }

    }

    //Add movie to basket //
    window.addToBasket =(id, title, image, price) => {
        try {
            basket.push({ id, title, image, price });
            localStorage.setItem("basket", JSON.stringify(basket));
            updateBasket();

            const basketDropdown = document.getElementById("basket-dropdown");
            const basketToggle = document.getElementById("basket-toggle");

            basketDropdown.classList.add("show");
            basketToggle.setAttribute("aria-expanded", "true");
            } catch (error) {
                alert("Something went wrong while adding to the basket.");
        }
    };


//Redirecting to Checkout//
export async function redirectToCheckout() {
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

        window.location.href = "/checkout/index.html";
    } catch(error) {
        alert("An unexpected error occurred. Please try again.");
    } finally {
        showLoadingIndicator(false);
    }
}



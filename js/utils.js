export function showLoadingIndicator(isLoading) {
    const spinner = document.querySelector(".loading-spinner");
    if (spinner) {
        spinner.style.display = isLoading ? "block" : "none";
    }
}

export function showError(message) {
    alert(message);
}

export function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

//Price Display Helper //

export function formatPrice(price) {
    return `$${Number(price).toFixed(2)}`;
}
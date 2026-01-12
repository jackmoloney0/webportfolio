// Click-to-zoom modal for images
document.querySelectorAll(".interactive-img").forEach(img => {
    img.addEventListener("click", () => {
        const overlay = document.createElement("div");
        overlay.className = "img-overlay";
        overlay.innerHTML = `
            <div class="img-wrapper">
                <img src="${img.src}">
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.addEventListener("click", () => overlay.remove());
    });
});

// Add styles for image zoom overlay
const style = document.createElement("style");
style.textContent = `
.img-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
.img-wrapper img {
    width: 80%;
    max-width: 900px;
    border-radius: 10px;
    box-shadow: 0 0 25px rgba(102, 252, 241, 0.5);
}
`;
document.head.appendChild(style);

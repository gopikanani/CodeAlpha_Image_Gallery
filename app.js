
import {images} from './images.js';
// const images = [
//     {
//         title: "Mountain Escape",
//         category: "nature",
//         src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"
//     },
//     {
//         title: "Forest Adventure",
//         category: "nature",
//         src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80"
//     },
//     {
//         title: "City Lights",
//         category: "city",
//         src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80"
//     },
//     {
//         title: "Urban Architecture",
//         category: "city",
//         src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80"
//     },
//     {
//         title: "Wild Fox",
//         category: "animals",
//         src: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=80"
//     },
//     {
//         title: "Curious Cat",
//         category: "animals",
//         src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80"
//     },
//     {
//         title: "Ocean Waves",
//         category: "nature",
//         src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80"
//     },
//     {
//         title: "City Streets",
//         category: "city",
//         src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80"
//     },
//     {
//         title: "Beautiful Deer",
//         category: "animals",
//         src: "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=900&q=80"
//     },
//     {
//         title: "Green Mountains",
//         category: "nature",
//         src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80"
//     },
//     {
//         title: "Modern City",
//         category: "city",
//         src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80"
//     },
//     {
//         title: "Beautiful Bird",
//         category: "animals",
//         src: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=900&q=80"
//     }
// ];

// =====================================
// 2. DOM elements
// =====================================

const galleryGrid = document.getElementById("galleryGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyMessage = document.getElementById("emptyMessage");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const imageCaption = document.getElementById("imageCaption");
const imageCounter = document.getElementById("imageCounter");

const closeBtn = document.getElementById("closeLightbox");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// =====================================
// 3. Gallery state
// =====================================

let currentFilter = "all";
let visibleImages = [...images];
let currentIndex = 0;
let lastFocusedElement = null;

// =====================================
// 4. Generate image gallery
// =====================================

function renderGallery() {
    galleryGrid.replaceChildren();

    visibleImages = images.filter(image =>
        currentFilter === "all" ||
        image.category === currentFilter
    );

    emptyMessage.hidden = visibleImages.length !== 0;

    visibleImages.forEach((image, index) => {
        const card = document.createElement("div");
        card.className = "gallery-item";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute(
            "aria-label",
            `View ${image.title}`
        );

        const img = document.createElement("img");
        img.src = image.src;
        img.alt = image.title;
        img.loading = "lazy";
        img.decoding = "async";

        img.addEventListener("error", () => {
            img.alt = `${image.title} image unavailable`;
            img.style.visibility = "hidden";
        });

        const overlay = document.createElement("div");
        overlay.className = "image-overlay";

        const title = document.createElement("h3");
        title.textContent = image.title;

        const category = document.createElement("p");
        category.textContent = image.category;

        overlay.append(title, category);
        card.append(img, overlay);

        card.addEventListener("click", () => {
            openLightbox(index);
        });

        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(index);
            }
        });

        galleryGrid.appendChild(card);
    });
}

// =====================================
// 5. Category filters
// =====================================

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(filterButton => {
            const isActive =
                filterButton === button;

            filterButton.classList.toggle(
                "active",
                isActive
            );

            filterButton.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        renderGallery();
    });
});

// =====================================
// 6. Open lightbox
// =====================================

function openLightbox(index) {
    if (!visibleImages.length) return;

    currentIndex = index;
    lastFocusedElement = document.activeElement;

    updateLightbox();

    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    closeBtn.focus();
}

// =====================================
// 7. Update displayed image
// =====================================

function updateLightbox() {
    const image = visibleImages[currentIndex];

    if (!image) return;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.title;

    imageCaption.textContent = image.title;

    imageCounter.textContent =
        `${currentIndex + 1} / ${visibleImages.length}`;
}

// =====================================
// 8. Next / Previous navigation
// =====================================

function showNextImage() {
    if (!visibleImages.length) return;

    currentIndex =
        (currentIndex + 1) % visibleImages.length;

    updateLightbox();
}

function showPreviousImage() {
    if (!visibleImages.length) return;

    currentIndex =
        (currentIndex - 1 + visibleImages.length) %
        visibleImages.length;

    updateLightbox();
}

nextBtn.addEventListener("click", showNextImage);
prevBtn.addEventListener("click", showPreviousImage);

// =====================================
// 9. Close lightbox
// =====================================

function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    lightboxImage.src = "";

    if (lastFocusedElement?.isConnected) {
        lastFocusedElement.focus();
    }
}

closeBtn.addEventListener("click", closeLightbox);

// Close when clicking the dark backdrop
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// =====================================
// 10. Keyboard navigation
// =====================================

document.addEventListener("keydown", event => {
    if (lightbox.hidden) return;

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        showNextImage();
    }

    if (event.key === "ArrowLeft") {
        showPreviousImage();
    }
});

// =====================================
// 11. Initialize gallery
// =====================================

filterButtons.forEach(button => {
    button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === "all")
    );
});

renderGallery();
const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel-item');
let currentIndex = 0;

function showImage(index) {
    currentIndex = index;
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;
}

function showNextImage() {
    currentIndex = (currentIndex + 1) % items.length;
    showImage(currentIndex);
}

function showPrevImage() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showImage(currentIndex);
}

const intervalId = setInterval(showNextImage, 3000);

document.querySelector('.prev').addEventListener('click', () => clearInterval(intervalId));
document.querySelector('.next').addEventListener('click', () => clearInterval(intervalId));


const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});



const track = document.querySelector('.carousel__track');
const indicators = document.querySelectorAll('.carousel__indicator');
const slideWidth = track.querySelector('.carousel__slide').offsetWidth;
let currentIndex = 0;
const slideCount = indicators.length;
const intervalTime = 8000; // Reducimos el tiempo del intervalo a 8s

function moveToSlide(index) {
    currentIndex = (index + slideCount) % slideCount;
    updateCarousel();
}

function moveLeft() {
    moveToSlide(currentIndex - 1);
}

function moveRight() {
    moveToSlide(currentIndex + 1);
}

function updateCarousel() {
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentIndex);
    });
}

// Auto-avanza el carrusel
setInterval(moveRight, intervalTime);

// Eventos en los indicadores
indicators.forEach((indicator, i) => {
    indicator.addEventListener('click', () => moveToSlide(i));
});

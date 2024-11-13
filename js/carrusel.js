const track = document.querySelector('.carousel__track');
const indicators = document.querySelectorAll('.carousel__indicator');
let currentIndex = 0;
const slideCount = 5;
const intervalTime = 10000;

function moveToSlide(index) {
    currentIndex = index;
    updateCarousel();
    updateIndicators();
}

function moveLeft() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateCarousel();
    updateIndicators();
}

function moveRight() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateCarousel();
    updateIndicators();
}

function updateCarousel() {
    const slideWidth = track.querySelector('.carousel__slide').getBoundingClientRect().width;
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
}

function updateIndicators() {
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
}

setInterval(moveRight, intervalTime);

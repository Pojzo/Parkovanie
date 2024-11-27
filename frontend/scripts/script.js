function showWeek(weekId) {
    var week = document.getElementById(weekId);
    if (week && week.classList.contains('schedule-week')) {
        var weeks = document.querySelectorAll('.schedule-week');
        weeks.forEach(function(week) {
            week.classList.remove('active');
        });
        week.classList.add('active');
    }
}

const images = [
    './res/images/parking1.jpg',
    './res/images/parking2.jpg',
    './res/images/parking3.jpg',
];

const bgImageDiv = document.querySelector('.bg-image');
let currentImageIndex = 0;

function changeBackgroundImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    bgImageDiv.style.backgroundImage = `url('${images[currentImageIndex]}')`;
}

setInterval(changeBackgroundImage, 5000);

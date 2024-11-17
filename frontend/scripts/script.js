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

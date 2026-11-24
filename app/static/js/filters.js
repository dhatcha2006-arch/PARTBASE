// Seeker Job Filters and Tag Toggles
document.addEventListener("DOMContentLoaded", function () {
  const filterForm = document.getElementById("job-filters-form");
  const quickDayBtns = document.querySelectorAll(".btn-quick-day");
  const hiddenDayInput = document.getElementById("filter-day-input");

  if (quickDayBtns.length && hiddenDayInput && filterForm) {
    quickDayBtns.forEach(btn => {
      btn.addEventListener("click", function () {
        const dayVal = this.getAttribute("data-day");
        if (hiddenDayInput.value === dayVal) {
          hiddenDayInput.value = "";
          this.classList.remove("active", "btn-primary");
          this.classList.add("btn-outline-secondary");
        } else {
          hiddenDayInput.value = dayVal;
          quickDayBtns.forEach(b => {
            b.classList.remove("active", "btn-primary");
            b.classList.add("btn-outline-secondary");
          });
          this.classList.add("active", "btn-primary");
          this.classList.remove("btn-outline-secondary");
        }
        filterForm.submit();
      });
    });
  }

  // Interactive Star Rating Form
  const starContainer = document.querySelector(".star-rating");
  const starInput = document.getElementById("rating-stars-input");
  if (starContainer && starInput) {
    const stars = starContainer.querySelectorAll(".star");
    stars.forEach(star => {
      star.addEventListener("click", function () {
        const val = parseInt(this.getAttribute("data-value"));
        starInput.value = val;
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute("data-value"));
          if (sVal <= val) {
            s.classList.add("active");
          } else {
            s.classList.remove("active");
          }
        });
      });
    });
  }

  // Tag button toggle handlers
  const tagBtns = document.querySelectorAll(".tag-btn");
  tagBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const checkbox = this.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
          this.classList.add("active");
        } else {
          this.classList.remove("active");
        }
      }
    });
  });
});

// Quick filter tag selector for shifts
document.addEventListener("DOMContentLoaded", function () {
  const quickShiftPills = document.querySelectorAll(".badge-shift-quick");
  quickShiftPills.forEach(pill => {
    pill.style.cursor = "pointer";
    pill.title = "Click to filter quick shifts";
  });
});

// Search history suggestion helper
function getRecentJobSearches() {
  try {
    return JSON.parse(localStorage.getItem('partbase_recent_queries') || '[]');
  } catch (e) {
    return [];
  }
}

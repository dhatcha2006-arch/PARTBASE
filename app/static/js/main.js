// PARTBASE Main Utilities
document.addEventListener("DOMContentLoaded", function () {
  // Auto-dismiss alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert-dismissible");
  alerts.forEach(function (alert) {
    setTimeout(function () {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      if (bsAlert) bsAlert.close();
    }, 5000);
  });

  // Browser Geolocation Helper
  const geoBtn = document.getElementById("btn-use-location");
  if (geoBtn) {
    geoBtn.addEventListener("click", function () {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser. Please select an area from the list.");
        return;
      }
      geoBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Locating...';
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const latInput = document.getElementById("input-lat");
          const lngInput = document.getElementById("input-lng");
          if (latInput) latInput.value = lat;
          if (lngInput) lngInput.value = lng;
          geoBtn.innerHTML = '✓ Location set';
          geoBtn.classList.remove("btn-outline-primary");
          geoBtn.classList.add("btn-success");
        },
        function (err) {
          geoBtn.innerHTML = 'Use my location';
          alert("Location access denied or unavailable. Please pick an area from the dropdown.");
        },
        { timeout: 8000 }
      );
    });
  }

  // Prevent double form submissions on payment & publish
  const lockForms = document.querySelectorAll("form.prevent-double-submit");
  lockForms.forEach(function (form) {
    form.addEventListener("submit", function () {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Processing...';
      }
    });
  });

  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/static/sw.js').catch(function () {
        // Silently handle if offline or unsupported
      });
    });
  }

  // Keyboard shortcut: Press '/' to focus search input if available
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      const searchInput = document.querySelector('input[type="search"], input[name="q"], #job-search');
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    }
  });
});

// Saved Jobs Client-Side Bookmark Helper
function toggleSaveJob(jobId) {
  try {
    let saved = JSON.parse(localStorage.getItem('partbase_saved_jobs') || '[]');
    const idx = saved.indexOf(jobId);
    if (idx > -1) {
      saved.splice(idx, 1);
    } else {
      saved.push(jobId);
    }
    localStorage.setItem('partbase_saved_jobs', JSON.stringify(saved));
    return saved.includes(jobId);
  } catch (e) {
    return false;
  }
}

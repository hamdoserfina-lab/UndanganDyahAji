// =================================== //
// Premium Wedding JavaScript - Optimized & Fixed
// =================================== //

// Main Initialization Function
document.addEventListener("DOMContentLoaded", initializePremiumFeatures);

// Premium Features Initialization
function initializePremiumFeatures() {
  // Register GSAP Plugins jika tersedia
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Core Initializations
  initializeGuestName();
  initializeCoverAnimations();
  initializeEventListeners();
  initializeCountdown();
  
  // MODIFIKASI: Urutan pemanggilan diubah
  // Lightbox HARUS inisialisasi lebih dulu sebelum carousel cloning
  initializeGalleryLightbox();
  initializeGalleryCarousel(); 

  initializeEnhancedMusicPlayer();
  initializeSmoothScrollAnimations();
  initializeMicroInteractions();

  // Firebase Initialization
  initializeFirebaseFeatures();
}

// =================================== //
// CORE FUNCTIONALITIES
// =================================== //

// Guest Name from URL Parameters
function initializeGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get("to");
  const guestNameElement = document.querySelector(".guest-name");
  const rsvpNameInput = document.querySelector(
    '.rsvp-form input[name="name"]'
  );

  if (guestName) {
    if (guestNameElement) guestNameElement.textContent = guestName;
    if (rsvpNameInput) rsvpNameInput.value = guestName;
  }
}

// Premium Cover Animations
function initializeCoverAnimations() {
  const coverElements = [
    { selector: ".cover-subtitle", delay: 0 },
    { selector: ".cover-title", delay: 0 },
    { selector: ".cover-date", delay: 0 },
    { selector: ".cover-invitation", delay: 0 },
    { selector: ".open-invitation-btn", delay: 0 },
  ];

  coverElements.forEach((item) => {
    const element = document.querySelector(item.selector);
    if (element) {
      safeAnimation(element, {
        duration: 1,
        opacity: 1,
        y: 0,
        delay: item.delay,
        ease: "power2.out",
      });
    }
  });
}

// Event Listeners Initialization
function initializeEventListeners() {
  const openBtn = document.getElementById("openBtn");
  const musicToggle = document.getElementById("musicToggle");
  const weddingMusic = document.getElementById("weddingMusic");

  if (openBtn) openBtn.addEventListener("click", handleOpenInvitation);
  if (musicToggle && weddingMusic) {
    musicToggle.addEventListener("click", () =>
      toggleMusic(weddingMusic, musicToggle)
    );
  }

  initializeCopyButtons();

  // Logika untuk auto-hide navigation bar
  let lastScrollTop = 0;
  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const floatingNav = document.getElementById("floatingNav");

      if (!floatingNav || !floatingNav.classList.contains("active")) {
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        return;
      }

      if (scrollTop > lastScrollTop) {
        floatingNav.classList.add("nav-hidden");
      } else {
        floatingNav.classList.remove("nav-hidden");
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    },
    { passive: true }
  );
}

// =================================== //
// PREMIUM ANIMATIONS & INTERACTIONS
// =================================== //

// Enhanced Open Invitation Handler
function handleOpenInvitation() {
  const openBtn = document.getElementById("openBtn");
  const cover = document.getElementById("cover");
  const mainContent = document.getElementById("mainContent");

  if (!openBtn || !cover || !mainContent) return;

  safeAnimation(openBtn, {
    scale: 0.9,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      const coverContent = document.querySelector(".cover-content");
      if (coverContent) coverContent.classList.add("cover-content-exit");
      cover.classList.add("parallax-exit", "cover-exit");

      setTimeout(() => {
        cover.style.display = "none";
        mainContent.style.display = "block";

        safeAnimation(mainContent, {
          duration: 1.2,
          opacity: 1,
          ease: "power2.out",
        });

        initializeFloatingNavigation();
        animateHeroSectionPremium();
        initializeScrollAnimationsPremium();
        playMusicAuto();

        window.scrollTo(0, 0);
      }, 1500);
    },
  });
}

// Premium Hero Section Animation
function animateHeroSectionPremium() {
  const tl = gsap.timeline({
    delay: 0.5,
    defaults: { ease: "power3.out" },
  });

  const elements = {
    subtitle: document.querySelector(".hero-subtitle-elegant"),
    name1: document.querySelector("#heroName1"),
    name2: document.querySelector("#heroName2"),
    ampersand: document.querySelector(".hero-ampersand-new"),
    date: document.querySelector(".hero-date-elegant"),
    countdown: document.querySelector(".countdown-new"),
  };

  if (elements.subtitle) {
    tl.to(elements.subtitle, { opacity: 1, y: 0, duration: 1.2 });
  }

  if (elements.name1) {
    tl.to(
      elements.name1,
      { opacity: 1, x: 0, duration: 1.4, ease: "back.out(1.7)" },
      "-=0.8"
    );
  }

  if (elements.name2) {
    tl.to(
      elements.name2,
      { opacity: 1, x: 0, duration: 1.4, ease: "back.out(1.7)" },
      "<"
    );
  }

  if (elements.ampersand) {
    tl.to(
      elements.ampersand,
      { opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.7)" },
      "-=0.6"
    );
  }

  if (elements.date) {
    tl.to(elements.date, { opacity: 1, y: 0, duration: 1.2 }, "-=0.8");
  }

  if (elements.countdown) {
    tl.to(
      elements.countdown,
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        onComplete: animateCountdownPulse,
      },
      "-=0.8"
    );
  }
}

// Enhanced Scroll Animations
function initializeScrollAnimationsPremium() {
  if (typeof ScrollTrigger === "undefined") {
    initializeFallbackAnimations();
    return;
  }

  const fadeUpElements = document.querySelectorAll('[data-anim="fade-up"]');
  fadeUpElements.forEach((elem) => {
    if (elem) {
      gsap.fromTo(
        elem,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            end: "bottom 60%",
            toggleActions: "play none none reverse",
            markers: false,
          },
        }
      );
    }
  });

  const staggerContainers = document.querySelectorAll("[data-anim-stagger]");
  staggerContainers.forEach((container) => {
    const items = container.querySelectorAll(".event-card, .bank-card");
    if (items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: { each: 0.2, from: "center" },
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  });

  const coupleCards = document.querySelectorAll(".couple-card");
  if (coupleCards.length > 0) {
    gsap.fromTo(
      coupleCards,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".couple-inner-container",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }
}

// Fallback animations jika ScrollTrigger tidak tersedia
function initializeFallbackAnimations() {
  const animatedElements = document.querySelectorAll(
    '[data-anim="fade-up"], [data-anim-stagger]'
  );
  animatedElements.forEach((element, index) => {
    if (element) {
      safeAnimation(element, {
        opacity: 1,
        y: 0,
        duration: 0.1,
        delay: index * 0.1,
        ease: "power2.out",
      });
    }
  });
}

// =================================== //
// SMOOTH SCROLL ANIMATIONS
// =================================== //

function initializeSmoothScrollAnimations() {
  const internalLinks = document.querySelectorAll(
    'a[href^="#"]:not(.nav-link)'
  );

  internalLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#") {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          if (
            typeof gsap !== "undefined" &&
            gsap.utils.checkPrefix("scrollTo")
          ) {
            gsap.to(window, {
              duration: 1.2,
              scrollTo: { y: targetElement, offsetY: 100 },
              ease: "power2.inOut",
            });
          } else {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      }
    });
  });
}

// =================================== //
// PREMIUM COMPONENTS
// =================================== //

// Floating Navigation dengan Smooth Behavior
function initializeFloatingNavigation() {
  const floatingNav = document.getElementById("floatingNav");
  const triggerSection = document.getElementById("hero");

  if (!floatingNav || !triggerSection) return;

  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.create({
      trigger: triggerSection,
      start: "bottom top",
      onEnter: () => floatingNav.classList.add("active"),
      onLeaveBack: () => floatingNav.classList.remove("active"),
    });
  } else {
    window.addEventListener("scroll", () => {
      const heroBottom = triggerSection.offsetTop + triggerSection.offsetHeight;
      floatingNav.classList.toggle(
        "active",
        window.pageYOffset > heroBottom - 100
      );
    });
  }

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        if (
          typeof gsap !== "undefined" &&
          gsap.utils.checkPrefix("scrollTo")
        ) {
          gsap.to(window, {
            duration: 1.2,
            scrollTo: { y: targetSection, offsetY: 80 },
            ease: "power2.inOut",
          });
        } else {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
}

// =================================== //
// MODIFIKASI: FUNGSI GALLERY CAROUSEL (CONTINUOUS SCROLL V2)
// =================================== //
function initializeGalleryCarousel() {
  const track = document.getElementById("galleryTrack");
  if (!track || typeof gsap === "undefined") return;

  const items = Array.from(track.querySelectorAll(".gallery-item"));
  if (items.length === 0) return;

  // 1. Duplikasi item untuk loop yang seamless (ini sudah benar)
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  // 2. Kalkulasi durasi berdasarkan jumlah item
  // (Misal: 8 detik per item. 3 item = 24 detik untuk satu putaran)
  const scrollDuration = items.length * 8; 

  // 3. Buat timeline GSAP
  const tl = gsap.timeline({ repeat: -1 });

  // 4. PERBAIKAN: Gunakan xPercent: -50
  // Ini akan menggerakkan track ke kiri sebesar 50% dari total lebarnya.
  // Karena track kita 200% (item asli + clone), ini akan
  // menggeser tepat selebar item aslinya, menciptakan loop yang sempurna.
  tl.to(track, {
    xPercent: -50,
    duration: scrollDuration,
    ease: "none",
  });

  // 5. Jeda saat di-hover (ini sudah benar)
  const container = track.closest(".gallery-carousel-container");
  if (container) {
    container.addEventListener("mouseenter", () => tl.pause());
    container.addEventListener("mouseleave", () => tl.play());
  }
}

// =================================== //
// MODIFIKASI: FUNGSI LIGHTBOX (EVENT DELEGATION)
// =================================== //
function initializeGalleryLightbox() {
  // Ambil item ORIGINAL (sebelum di-clone)
  const originalItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");
  const track = document.getElementById("galleryTrack"); // Target listener

  if (!originalItems.length || !lightbox || !lightboxImage || !track) return;

  let currentImageIndex = 0;
  
  // 1. Buat array HANYA dari gambar original
  const images = Array.from(originalItems)
    .map((item) => {
      const img = item.querySelector(".gallery-image");
      return img && img.src ? img.src : null;
    })
    .filter((src) => src !== null);

  if (images.length === 0) return;

  // 2. Gunakan Event Delegation pada 'track'
  // Ini akan berfungsi untuk item original DAN item yang di-clone
  track.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (!item) return;

    const img = item.querySelector(".gallery-image");
    if (img && img.src) {
      // Cari index gambar di array original
      currentImageIndex = images.indexOf(img.src);
      
      // Jika tidak ketemu (seharusnya tidak terjadi, tapi just in case)
      // fallback ke src gambar yg di-clone
      if (currentImageIndex === -1) {
          const originalSrc = img.src;
          // Coba cari di DOM original (walaupun indexOf harusnya cukup)
          for(let i=0; i < images.length; i++) {
              if (originalSrc.includes(images[i])) {
                  currentImageIndex = i;
                  break;
              }
          }
          // Jika masih -1, buka saja gambar itu
          if (currentImageIndex === -1) {
              openLightbox(img.src);
              return;
          }
      }

      openLightbox(images[currentImageIndex]);
    }
  });

  // 3. Sisanya (logika lightbox) tetap sama
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", showPrevImage);
  if (lightboxNext) lightboxNext.addEventListener("click", showNextImage);

  document.addEventListener("keydown", handleKeyboardNavigation);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  function openLightbox(imageSrc) {
    lightboxImage.src = imageSrc;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";

    const lightboxContent = lightbox.querySelector(".lightbox-content");
    if (lightboxContent) {
      safeAnimation(lightboxContent, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.2)",
      });
    }
  }

  function closeLightbox() {
    const lightboxContent = lightbox.querySelector(".lightbox-content");
    if (lightboxContent) {
      safeAnimation(lightboxContent, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          lightbox.classList.remove("active");
          document.body.style.overflow = "";
        },
      });
    } else {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  function showPrevImage() {
    currentImageIndex =
      (currentImageIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightboxImage();
  }

  function updateLightboxImage() {
    safeAnimation(lightboxImage, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        lightboxImage.src = images[currentImageIndex];
        safeAnimation(lightboxImage, { opacity: 1, duration: 0.3 });
      },
    });
  }

  function handleKeyboardNavigation(e) {
    if (!lightbox.classList.contains("active")) return;
    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        showPrevImage();
        break;
      case "ArrowRight":
        showNextImage();
        break;
    }
  }
}

// Enhanced Music Player
function initializeEnhancedMusicPlayer() {
  const weddingMusic = document.getElementById("weddingMusic");
  const musicToggle = document.getElementById("musicToggle");
  const progressBar = document.querySelector(".progress-bar");

  if (!weddingMusic || !musicToggle) return;

  let isMusicPlaying = false;
  let progressAnimation;

  if (progressBar && typeof gsap !== "undefined") {
    progressAnimation = gsap.to(progressBar, {
      width: "100%",
      duration: 30,
      repeat: -1,
      ease: "none",
      paused: true,
    });
  }

  musicToggle.addEventListener("click", () => {
    if (isMusicPlaying) {
      weddingMusic.pause();
      isMusicPlaying = false;
      musicToggle.innerHTML = '<i class="fas fa-music"></i>';
      if (progressAnimation) progressAnimation.pause();
    } else {
      weddingMusic
        .play()
        .then(() => {
          isMusicPlaying = true;
          musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
          if (progressAnimation) progressAnimation.play();
        })
        .catch(() => {
          musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        });
    }

    safeAnimation(musicToggle, {
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });
  });

  weddingMusic.addEventListener("timeupdate", () => {
    if (progressBar && weddingMusic.duration) {
      const progress =
        (weddingMusic.currentTime / weddingMusic.duration) * 100;
      progressBar.style.width = progress + "%";
    }
  });

  weddingMusic.addEventListener("ended", () => {
    if (progressBar) progressBar.style.width = "0%";
    if (progressAnimation) {
      progressAnimation.restart();
      progressAnimation.pause();
    }
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    isMusicPlaying = false;
  });
}

// Auto-play music setelah invitation dibuka
function playMusicAuto() {
  const weddingMusic = document.getElementById("weddingMusic");
  const musicToggle = document.getElementById("musicToggle");

  if (weddingMusic && musicToggle) {
    setTimeout(() => {
      weddingMusic.volume = 0.3;
      weddingMusic
        .play()
        .then(() => {
          musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
          const progressBar = document.querySelector(".progress-bar");
          if (progressBar) {
            safeAnimation(progressBar, {
              width: "100%",
              duration: weddingMusic.duration || 30,
              ease: "none",
            });
          }
        })
        .catch(() => {
          // Autoplay dicegah, biarkan ikon play
        });
    }, 1000);
  }
}

// =================================== //
// ENHANCED COUNTDOWN FEATURES
// =================================== //

// Premium Countdown dengan Animations
function initializeCountdown() {
  const weddingDate = new Date("December 15, 2025 08:00:00").getTime();
  let countdownTimer;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      handleCountdownComplete();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    updateCountdownDisplay(days, hours, minutes, seconds);
  }

  function updateCountdownDisplay(days, hours, minutes, seconds) {
    const elements = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
    };

    const values = [days, hours, minutes, seconds];

    Object.keys(elements).forEach((key, index) => {
      const element = elements[key];
      if (element) {
        const currentValue = element.textContent;
        const newValue = values[index].toString().padStart(2, "0");

        if (currentValue !== newValue) {
          safeAnimation(element, {
            scale: 1.2,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
            onStart: () => (element.textContent = newValue),
          });
        }
      }
    });
  }

  function handleCountdownComplete() {
    clearInterval(countdownTimer);

    const countdownItems = document.querySelectorAll(".countdown-item-new");
    if (countdownItems.length > 0) {
      safeAnimation(countdownItems, {
        scale: 1.5,
        rotation: 360,
        duration: 1,
        stagger: 0.1,
        ease: "back.out(1.7)",
        onComplete: () => {
          safeAnimation(countdownItems, {
            scale: 1,
            rotation: 0,
            duration: 0.5,
          });
        },
      });
    }

    const elements = ["days", "hours", "minutes", "seconds"];
    elements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.textContent = "00";
    });
  }

  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
}

// Countdown Pulse Animation
function animateCountdownPulse() {
  const countdownNumbers = document.querySelectorAll(".countdown-number-new");
  if (countdownNumbers.length > 0) {
    safeAnimation(countdownNumbers, {
      scale: 1.05,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: { each: 0.2, from: "center" },
    });
  }
}

// =================================== //
// MICRO-INTERACTIONS & ENHANCEMENTS
// =================================== //

function initializeMicroInteractions() {
  initializeButtonInteractions();
  initializeCardInteractions();
}

// Premium Button Interactions
function initializeButtonInteractions() {
  const buttons = document.querySelectorAll(
    "button, .social-btn, .map-action-btn"
  );

  buttons.forEach((button) => {
    if (!button) return;

    button.addEventListener("mouseenter", function () {
      safeAnimation(this, { y: -2, duration: 0.3, ease: "power2.out" });
    });

    button.addEventListener("mouseleave", function () {
      safeAnimation(this, { y: 0, duration: 0.3, ease: "power2.out" });
    });

    button.addEventListener("mousedown", function () {
      safeAnimation(this, { scale: 0.95, duration: 0.1 });
    });

    button.addEventListener("mouseup", function () {
      safeAnimation(this, { scale: 1, duration: 0.1 });
    });
  });
}

// Enhanced Card Interactions
function initializeCardInteractions() {
  const cards = document.querySelectorAll(
    ".content-box, .bank-card, .event-card"
  );

  cards.forEach((card) => {
    if (!card) return;

    card.addEventListener("mouseenter", function () {
      safeAnimation(this, {
        y: -5,
        rotationY: 2,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", function () {
      safeAnimation(this, {
        y: 0,
        rotationY: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  });
}

// =================================== //
// ENHANCED COPY FUNCTIONALITY
// =================================== //

function initializeCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach((button) => {
    if (button) {
      button.addEventListener("click", function () {
        const accountNumber = this.getAttribute("data-account");
        copyToClipboard(accountNumber, this);
      });
    }
  });

  const copyAddressBtn = document.getElementById("copyAddress");
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener("click", () => {
      const address =
        "Bulu, Pondoksari, Nguntoronadi, Wonogiri, Jawa Tengah 55683";
      copyToClipboard(address, copyAddressBtn);
    });
  }

  document.querySelectorAll(".copy-icon").forEach((icon) => {
    if (icon) {
      icon.addEventListener("click", function () {
        const card = this.closest(".bank-card");
        if (card) {
          const accountNumberElement =
            card.querySelector(".card-number");
          if (accountNumberElement) {
            const accountNumber =
              accountNumberElement.textContent.replace(/\s/g, "");
            copyToClipboard(accountNumber, this);
          }
        }
      });
    }
  });
}

// Enhanced Copy to Clipboard dengan Animation
function copyToClipboard(text, element) {
  if (!navigator.clipboard) {
    fallbackCopyToClipboard(text, element);
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => showCopySuccess(element))
    .catch(() => {
      showCopyError(element);
    });
}

function fallbackCopyToClipboard(text, element) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand("copy");
    showCopySuccess(element);
  } catch (err) {
    showCopyError(element);
  }

  document.body.removeChild(textArea);
}

// =================================== //
// PERBAIKAN: FUNGSI showCopySuccess
// =================================== //
function showCopySuccess(element) {
  const originalHTML = element.innerHTML;
  const originalBackground = element.style.background;
  const originalColor = element.style.color;

  safeAnimation(element, {
    scale: 1.1,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
    onStart: () => {
      // PERBAIKAN LOGIKA:
      // Sekarang, ia akan menangani .copy-btn DAN #copyAddress
      if (element.classList.contains("copy-btn") || element.id === "copyAddress") {
        element.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
        element.style.background = "var(--gradient)";
        element.style.color = "var(--white)";
      } else {
        // Logika untuk icon (copy-icon)
        element.className = "fas fa-check";
        element.style.color = "#4CAF50";
      }
    },
    onComplete: () => {
      setTimeout(() => {
        // PERBAIKAN LOGIKA:
        // Memastikan reset-nya juga berlaku untuk #copyAddress
        if (element.classList.contains("copy-btn") || element.id === "copyAddress") {
          element.innerHTML = originalHTML;
          element.style.background = originalBackground;
          element.style.color = originalColor;
        } else {
          // Reset icon
          element.className = "fas fa-copy copy-icon";
          element.style.color = "";
        }
      }, 2000);
    },
  });
}

// =================================== //
// PERBAIKAN: FUNGSI showCopyError
// =================================== //
function showCopyError(element) {
  const originalHTML = element.innerHTML;
  const originalBackground = element.style.background;

  safeAnimation(element, {
    scale: 1.1,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
    onStart: () => {
      // PERBAIKAN LOGIKA:
      // Menerapkan perbaikan yang sama di sini
      if (element.classList.contains("copy-btn") || element.id === "copyAddress") {
        element.innerHTML = '<i class="fas fa-times"></i> Gagal!';
        element.style.background = "#ff4444";
      }
    },
    onComplete: () => {
      setTimeout(() => {
        // PERBAIKAN LOGIKA:
        // Menerapkan reset yang sama di sini
        if (element.classList.contains("copy-btn") || element.id === "copyAddress") {
          element.innerHTML = originalHTML;
          element.style.background = originalBackground;
        }
      }, 2000);
    },
  });
}

// =================================== //
// FIREBASE & RSVP ENHANCEMENTS
// =================================== //

function initializeFirebaseFeatures() {
  loadCommentsPremium();
  initializeRsvpFormPremium();
}

function initializeRsvpFormPremium() {
  const rsvpForm = document.querySelector(".rsvp-form");
  if (!rsvpForm) return;

  rsvpForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      name: this.querySelector('input[name="name"]').value,
      attendance: this.querySelector('select[name="attendance"]').value,
      message: this.querySelector('textarea[name="message"]').value,
    };

    submitRsvpForm(formData, this);
  });

  const formInputs = rsvpForm.querySelectorAll("input, select, textarea");
  formInputs.forEach((input) => {
    input.addEventListener("focus", function () {
      const parent = this.parentElement;
      if (parent)
        safeAnimation(parent, {
          y: -5,
          duration: 0.3,
          ease: "power2.out",
        });
    });

    input.addEventListener("blur", function () {
      const parent = this.parentElement;
      if (parent)
        safeAnimation(parent, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
    });
  });
}

// Enhanced RSVP Submission
function submitRsvpForm(formData, rsvpForm) {
  const submitBtn = rsvpForm.querySelector(".submit-btn");
  if (!submitBtn) return;

  const originalBtnText = submitBtn.innerHTML;

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  submitBtn.disabled = true;

  safeAnimation(submitBtn, { scale: 0.95, duration: 0.2 });

  if (typeof db !== "undefined") {
    db.collection("ucapan")
      .add({
        nama: formData.name,
        kehadiran: formData.attendance,
        ucapan: formData.message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        safeAnimation(submitBtn, {
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
          onStart: () => {
            submitBtn.innerHTML =
              '<i class="fas fa-check"></i> Terkirim!';
            submitBtn.style.background =
              "linear-gradient(135deg, #4CAF50, #45a049)";
          },
        });

        setTimeout(() => {
          rsvpForm.reset();

          const urlParams = new URLSearchParams(
            window.location.search
          );
          const guestName = urlParams.get("to");
          const rsvpNameInput =
            rsvpForm.querySelector('input[name="name"]');
          if (guestName && rsvpNameInput)
            rsvpNameInput.value = guestName;

          setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.background = "";
            submitBtn.disabled = false;
          }, 1000);
        }, 2000);
      })
      .catch((error) => {
        safeAnimation(submitBtn, {
          scale: 1,
          duration: 0.3,
          onStart: () => {
            submitBtn.innerHTML =
              '<i class="fas fa-times"></i> Gagal!';
            submitBtn.style.background = "#ff4444";
          },
        });

        setTimeout(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 2000);

        alert("Gagal mengirim ucapan, silakan coba lagi.");
      });
  } else {
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
    alert("Firebase not initialized. Please check your configuration.");
  }
}

// Premium Comments Loading dengan Animation
function loadCommentsPremium() {
  const commentList = document.getElementById("commentList");
  if (!commentList) return;

  if (typeof db === "undefined") {
    commentList.innerHTML =
      "<p>Gagal memuat ucapan. Konfigurasi Firebase salah.</p>";
    return;
  }

  commentList.innerHTML = `
    <div class="comment-loading" style="text-align: center; opacity: 0.7;">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Memuat ucapan...</p>
    </div>
  `;

  db.collection("ucapan")
    .orderBy("timestamp", "desc")
    .onSnapshot(
      (querySnapshot) => {
        if (querySnapshot.empty) {
          commentList.innerHTML = `
            <div class="no-comments" style="text-align: center; opacity: 0.7;">
              <i class="fas fa-comments"></i>
              <p>Jadilah yang pertama memberi ucapan!</p>
            </div>
          `;
          return;
        }

        safeAnimation(commentList, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            commentList.innerHTML = "";
            querySnapshot.forEach((doc, index) => {
              const data = doc.data();
              commentList.innerHTML += createCommentHTML(
                data,
                index
              );
            });

            const commentChildren = commentList.children;
            if (commentChildren.length > 0) {
              gsap.fromTo(
                commentChildren,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: "power2.out",
                }
              );
            }

            safeAnimation(commentList, {
              opacity: 1,
              duration: 0.3,
            });
          },
        });
      },
      () => {
        commentList.innerHTML =
          "<p style='text-align: center; opacity: 0.7;'>Gagal memuat ucapan. Silakan refresh halaman.</p>";
      }
    );
}

// Create Comment HTML (dengan timestamp di-comment)
function createCommentHTML(data, index) {
  let attendanceLabel = "";
  let attendanceClass = "";

  if (data.kehadiran === "present") {
    attendanceLabel = "Hadir";
    attendanceClass = "present";
  } else if (data.kehadan === "notpresent") {
    attendanceLabel = "Tidak Hadir";
    attendanceClass = "not-present";
  } else {
    attendanceLabel = "Masih Ragu";
    attendanceClass = "not-sure";
  }

  // timestampStr tidak lagi digunakan
  /*
  let timestampStr = "Baru saja";
  if (data.timestamp && typeof data.timestamp.toDate === "function") {
    ...
  }
  */

  return `
    <div class="comment-item" data-delay="${index * 100}">
      <div class="comment-header">
        <h4>${data.nama}</h4>
        <span class="attendance-badge ${attendanceClass}">${attendanceLabel}</span>
      </div>
      <p>${data.ucapan}</p>
    </div>
  `;
}

// =================================== //
// UTILITY FUNCTIONS
// =================================== //

// Simple music toggle function
function toggleMusic(weddingMusic, musicToggle) {
  if (weddingMusic.paused) {
    weddingMusic.play();
    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    weddingMusic.pause();
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
  }
}

// Safe animation function dengan error handling
function safeAnimation(target, vars) {
  if (typeof gsap === "undefined") {
    return;
  }

  try {
    if (!target) {
      return;
    }
    if (target instanceof NodeList || Array.isArray(target)) {
      if (target.length === 0) {
        return;
      }
    }
    gsap.to(target, vars);
  } catch (error) {
    // console.warn("Animation error:", error, target, vars);
  }
}

// Initialize dengan error handling
try {
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializePremiumFeatures
    );
  } else {
    initializePremiumFeatures();
  }
} catch (error) {
  const cover = document.getElementById("cover");
  const mainContent = document.getElementById("mainContent");
  if (cover) cover.style.display = "none";
  if (mainContent) mainContent.style.display = "block";
}

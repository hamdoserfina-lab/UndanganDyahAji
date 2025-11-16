// Script untuk animasi dan interaksi - VERSI PERBAIKAN (Animasi Asli Dikembalikan)
document.addEventListener("DOMContentLoaded", function () {
    // Mendaftarkan plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Mengambil nama tamu dari parameter URL (?to=...)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get("to");
    const guestNameElement = document.querySelector(".guest-name");
    const rsvpNameInput = document.querySelector(
        '.rsvp-form input[name="name"]'
    );

    if (guestName && guestNameElement) {
        guestNameElement.textContent = guestName;
    }
    if (guestName && rsvpNameInput) {
        rsvpNameInput.value = guestName;
    }

    // Elemen utama
    const cover = document.getElementById("cover");
    const mainContent = document.getElementById("mainContent");
    const openBtn = document.getElementById("openBtn");
    const musicToggle = document.getElementById("musicToggle");
    const weddingMusic = document.getElementById("weddingMusic");

    let isMusicPlaying = false;

    // Inisialisasi
    initializeCountdown();
    initializeCoverCarousel();
    initializeHeroCarousel();
    loadComments();

    // Animasi masuk untuk elemen cover
    gsap.to(".cover-subtitle", {
        duration: 1,
        opacity: 1,
        y: 0,
        delay: 0.5,
        ease: "power2.out",
    });
    gsap.to(".cover-title", {
        duration: 1,
        opacity: 1,
        y: 0,
        delay: 0.8,
        ease: "power2.out",
    });
    gsap.to(".cover-date", {
        duration: 1,
        opacity: 1,
        y: 0,
        delay: 1.1,
        ease: "power2.out",
    });
    gsap.to(".cover-invitation", {
        duration: 1,
        opacity: 1,
        y: 0,
        delay: 1.4,
        ease: "power2.out",
    });
    gsap.to(".open-invitation-btn", {
        duration: 1,
        opacity: 1,
        y: 0,
        delay: 1.7,
        ease: "power2.out",
    });

    // Event listener untuk tombol buka undangan
    openBtn.addEventListener("click", function () {
        gsap.to(this, {
            scale: 0.9,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            onComplete: function () {
                // Animasi keluar cover
                const coverContent = document.querySelector(".cover-content");
                coverContent.classList.add("cover-content-exit");
                cover.classList.add("parallax-exit");
                cover.classList.add("cover-exit");

                setTimeout(function () {
                    cover.style.display = "none";
                    mainContent.style.display = "block";

                    // Animasi masuk main content
                    gsap.to(mainContent, {
                        duration: 1,
                        opacity: 1,
                        ease: "power2.out",
                    });

                    // Memulai animasi Hero & Scroll
                    animateHeroSection(); // Animasi "Wow" untuk Hero
                    
                    // MODIFIKASI: Mengembalikan fungsi animasi asli
                    initializeScrollAnimations(); // Animasi "fade-up" untuk sisa section

                    window.scrollTo(0, 0);
                    playMusic();
                }, 1500);
            },
        });
    });

    // --- Animasi Hero "WOW" (Berurutan) ---
    // (Fungsi ini tetap sama)
    function animateHeroSection() {
        const tl = gsap.timeline({ delay: 0.5 });
        tl.to(".hero-subtitle-elegant", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
        })
            .to(
                "#heroName1",
                { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" },
                "-=0.7"
            )
            .to(
                "#heroName2",
                { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" },
                "<"
            )
            .to(
                ".hero-ampersand-new",
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "elastic.out(1, 0.7)",
                },
                "-=0.5"
            )
            .to(
                ".hero-date-elegant",
                { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
                "-=0.7"
            )
            .to(
                ".countdown-new",
                { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
                "-=0.7"
            );
    }


    // --- MODIFIKASI: FUNGSI ANIMASI ASLI DIKEMBALIKAN ---
    // Ini adalah fungsi dari file script.js pertama Anda
    function initializeScrollAnimations() {
        gsap.utils.toArray('[data-anim="fade-up"]').forEach((elem) => {
            gsap.fromTo(
                elem,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });

        gsap.fromTo(
            ".couple-card",
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.3,
                scrollTrigger: {
                    trigger: ".couple-inner-container",
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        gsap.utils.toArray("[data-anim-stagger]").forEach((elem) => {
            gsap.fromTo(
                elem,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.3,
                    scrollTrigger: {
                        trigger: elem.parentElement, // Perhatikan trigger-nya
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });
    }
    // --- AKHIR FUNGSI ANIMASI ASLI ---


    // --- FUNGSI CAROUSEL COVER (Manual) ---
    function initializeCoverCarousel() {
        const coverCarousel = document.getElementById("coverCarousel");
        if (!coverCarousel) return;
        const bgSlides = coverCarousel.querySelectorAll(".bg-slide");
        const prevBtn = document.getElementById("coverPrevBtn");
        const nextBtn = document.getElementById("coverNextBtn");
        if (bgSlides.length === 0) return;
        let currentBgSlide = 0;
        function setActiveBgSlide(index) {
            bgSlides.forEach((slide) => slide.classList.remove("active"));
            bgSlides[index].classList.add("active");
            currentBgSlide = index;
        }
        function nextBgSlide() {
            let nextIndex = currentBgSlide + 1;
            if (nextIndex >= bgSlides.length) {
                nextIndex = 0;
            }
            setActiveBgSlide(nextIndex);
        }
        function prevBgSlide() {
            let prevIndex = currentBgSlide - 1;
            if (prevIndex < 0) {
                prevIndex = bgSlides.length - 1;
            }
            setActiveBgSlide(prevIndex);
        }
        nextBtn.addEventListener("click", nextBgSlide);
        prevBtn.addEventListener("click", prevBgSlide);
        setActiveBgSlide(0);
    }

    // --- FUNGSI CAROUSEL HERO (Autoplay, tanpa tombol) ---
    function initializeHeroCarousel() {
        const heroCarousel = document.querySelector(
            ".hero-background .hero-bg-carousel"
        );
        if (!heroCarousel) return;
        const bgSlides = heroCarousel.querySelectorAll(".bg-slide");
        if (bgSlides.length === 0) return;
        let currentBgSlide = 0;
        let bgAutoplayInterval;
        function setActiveBgSlide(index) {
            bgSlides.forEach((slide) => slide.classList.remove("active"));
            bgSlides[index].classList.add("active");
            currentBgSlide = index;
        }
        function nextBgSlide() {
            let nextIndex = currentBgSlide + 1;
            if (nextIndex >= bgSlides.length) {
                nextIndex = 0;
            }
            setActiveBgSlide(nextIndex);
        }
        function startAutoplay() {
            bgAutoplayInterval = setInterval(nextBgSlide, 8000);
        }
        setActiveBgSlide(0);
        startAutoplay();
    }

    // --- FUNGSI COUNTDOWN (Tidak Berubah) ---
    function initializeCountdown() {
        const weddingDate = new Date("December 15, 2025 08:00:00").getTime();
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = weddingDate - now;
            if (distance < 0) {
                clearInterval(countdownTimer);
                document.getElementById("days").textContent = "00";
                document.getElementById("hours").textContent = "00";
                document.getElementById("minutes").textContent = "00";
                document.getElementById("seconds").textContent = "00";
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById("days").textContent = days
                .toString()
                .padStart(2, "0");
            document.getElementById("hours").textContent = hours
                .toString()
                .padStart(2, "0");
            document.getElementById("minutes").textContent = minutes
                .toString()
                .padStart(2, "0");
            document.getElementById("seconds").textContent = seconds
                .toString()
                .padStart(2, "0");
        }
        updateCountdown();
        const countdownTimer = setInterval(updateCountdown, 1000);
    }

    // --- FUNGSI MUSIK (Tidak Berubah) ---
    function playMusic() {
        weddingMusic.volume = 0.3;
        weddingMusic
            .play()
            .then(() => {
                isMusicPlaying = true;
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            })
            .catch((error) => {
                console.log("Autoplay dicegah:", error);
                isMusicPlaying = false;
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            });
    }
    musicToggle.addEventListener("click", function () {
        if (isMusicPlaying) {
            weddingMusic.pause();
            isMusicPlaying = false;
            this.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            weddingMusic.play();
            isMusicPlaying = true;
            this.innerHTML = '<i class="fas fa-pause"></i>';
        }
    });

    // --- FUNGSI COPY (Tidak Berubah) ---
    document.querySelectorAll(".copy-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const accountNumber = this.getAttribute("data-account");
            navigator.clipboard.writeText(accountNumber).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
                this.style.background = "var(--gradient)";
                this.style.color = "var(--white)";
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = "";
                    this.style.color = "";
                }, 2000);
            });
        });
    });

    document
        .getElementById("copyAddress")
        ?.addEventListener("click", function () {
            const address =
                "Bulu, Pondoksari, Nguntoronadi, Wonogiri, Jawa Tengah 55683";
            navigator.clipboard.writeText(address).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Alamat Disalin!';
                this.style.background = "var(--gradient)";
                this.style.color = "var(--white)";
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = "";
                    this.style.color = "";
                }, 2000);
            });
        });

    // --- FUNGSI Submit RSVP (Tidak Berubah) ---
    const rsvpForm = document.querySelector(".rsvp-form");
    if (rsvpForm) {
        rsvpForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = rsvpForm.querySelector('input[name="name"]').value;
            const attendance = rsvpForm.querySelector(
                'select[name="attendance"]'
            ).value;
            const message = rsvpForm.querySelector(
                'textarea[name="message"]'
            ).value;
            const submitBtn = rsvpForm.querySelector(".submit-btn");

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML =
                '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;

            db.collection("ucapan")
                .add({
                    nama: name,
                    kehadiran: attendance,
                    ucapan: message,
                    timestamp:
                        firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then((docRef) => {
                    submitBtn.innerHTML =
                        '<i class="fas fa-check"></i> Terkirim!';
                    rsvpForm.reset();
                    if (guestName && rsvpNameInput) {
                        rsvpNameInput.value = guestName;
                    }
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    }, 3000);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    alert("Gagal mengirim ucapan, silakan coba lagi.");
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    console.log(
        "🎉 Wedding Website (Versi Animasi Asli Dikembalikan) Initialized!"
    );
});

// --- Fungsi Memuat Komentar (Tidak Berubah) ---
function loadComments() {
    const commentList = document.getElementById("commentList");
    if (!commentList) return;

    if (typeof db === "undefined") {
        console.error("Firebase Firestore 'db' not initialized.");
        commentList.innerHTML =
            "<p>Gagal memuat ucapan. Konfigurasi Firebase salah.</p>";
        return;
    }

    db.collection("ucapan")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
            if (querySnapshot.empty) {
                commentList.innerHTML =
                    "<p style='text-align: center; opacity: 0.7;'>Jadilah yang pertama memberi ucapan!</p>";
                return;
            }

            commentList.innerHTML = "";

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                let attendanceLabel = "";
                if (data.kehadiran === "present") {
                    attendanceLabel = "Hadir";
                } else if (data.kehadiran === "notpresent") {
                    attendanceLabel = "Tidak Hadir";
                } else {
                    attendanceLabel = "Masih Ragu";
                }

                const commentHTML = `
                <div class="comment-item">
                    <h4>${data.nama}</h4>
                    <span>Mengkonfirmasi: ${attendanceLabel}</span>
                    <p>${data.ucapan}</p>
                </div>
            `;
                commentList.innerHTML += commentHTML;
            });
        });
}

// Script untuk animasi dan interaksi - VERSI FINAL (Luminous Gold - Perbaikan)
document.addEventListener("DOMContentLoaded", function () {
    // Mendaftarkan plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Mengambil nama tamu dari parameter URL (?to=...)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get("to");
    const guestNameElement = document.querySelector(".guest-name");
    const rsvpNameInput = document.querySelector('.rsvp-form input[name="name"]');

    if (guestName && guestNameElement) {
        guestNameElement.textContent = guestName;
    }
    // MODIFIKASI: Otomatis isi nama tamu di form RSVP
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

    // Inisialisasi countdown & carousel
    initializeCountdown();
    initializeHeroCarousel();
    
    // ==============================================
    // MODIFIKASI: Memuat komentar saat halaman dibuka
    // ==============================================
    loadComments();
    // ==============================================

    // Animasi masuk untuk elemen cover
    gsap.to(".cover-subtitle", { duration: 1, opacity: 1, y: 0, delay: 0.5, ease: "power2.out" });
    gsap.to(".cover-title", { duration: 1, opacity: 1, y: 0, delay: 0.8, ease: "power2.out" });
    gsap.to(".cover-date", { duration: 1, opacity: 1, y: 0, delay: 1.1, ease: "power2.out" });
    gsap.to(".cover-invitation", { duration: 1, opacity: 1, y: 0, delay: 1.4, ease: "power2.out" });
    gsap.to(".open-invitation-btn", { duration: 1, opacity: 1, y: 0, delay: 1.7, ease: "power2.out" });


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
                        ease: "power2.out"
                    });

                    // Memulai animasi Hero & Scroll
                    animateHeroSection();
                    initializeScrollAnimations();
                    
                    // Memulai parallax mouse
                    initializeMouseParallax();

                    window.scrollTo(0, 0);
                    playMusic();
                }, 1500);
            }
        });
    });

    // --- Animasi Hero (Berurutan) ---
    function animateHeroSection() {
        const tl = gsap.timeline({ delay: 0.5 }); 

        tl.fromTo(".hero-subtitle-elegant", 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
        )
        .fromTo(".hero-names-new", 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, 
            "-=0.5"
        )
        .fromTo(".hero-date-elegant", 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 
            "-=0.7"
        )
        .fromTo(".countdown-item-new",
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }, 
            "-=0.5"
        );
    }
    
    // --- Parallax Mouse 3D ---
    function initializeMouseParallax() {
        const heroContent = document.querySelector(".hero-text-elegant");
        const heroSection = document.getElementById("hero");

        heroSection.addEventListener("mousemove", function (e) {
            const { clientX, clientY } = e;
            const { offsetWidth, offsetHeight } = heroSection;
            
            const xMove = (clientX / offsetWidth - 0.5) * 30; // Rentang 30px
            const yMove = (clientY / offsetHeight - 0.5) * 30;
            
            gsap.to(heroContent, {
                x: -xMove, 
                y: -yMove,
                rotationY: xMove / 10, 
                rotationX: -yMove / 10,
                duration: 1,
                ease: "power2.out"
            });
        });
    }

    // --- Animasi Scroll (Diperbarui) ---
    function initializeScrollAnimations() {
        
        gsap.utils.toArray('[data-anim="fade-up"]').forEach(elem => {
            gsap.fromTo(elem, 
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
                    }
                }
            );
        });

        gsap.fromTo(".couple-card", 
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
                }
            }
        );

        gsap.utils.toArray('[data-anim-stagger]').forEach(elem => {
             gsap.fromTo(elem, 
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.3,
                    scrollTrigger: {
                        trigger: elem.parentElement, 
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    }
                }
            );
        });
    }

    // --- FUNGSI CAROUSEL HERO ---
    function initializeHeroCarousel() {
        const bgSlides = document.querySelectorAll(".bg-slide");
        const bgDots = document.querySelectorAll(".bg-dot");
        const prevBtn = document.querySelector(".bg-carousel-prev");
        const nextBtn = document.querySelector(".bg-carousel-next");
        if (bgSlides.length === 0) return;
        let currentBgSlide = 0;
        let bgAutoplayInterval;
        function setActiveBgSlide(index) {
            bgSlides.forEach(slide => slide.classList.remove("active"));
            bgDots.forEach(dot => dot.classList.remove("active"));
            bgSlides[index].classList.add("active");
            bgDots[index].classList.add("active");
            currentBgSlide = index;
        }
        function nextBgSlide() {
            let nextIndex = currentBgSlide + 1;
            if (nextIndex >= bgSlides.length) { nextIndex = 0; }
            setActiveBgSlide(nextIndex);
        }
        function prevBgSlide() {
            let prevIndex = currentBgSlide - 1;
            if (prevIndex < 0) { prevIndex = bgSlides.length - 1; }
            setActiveBgSlide(prevIndex);
        }
        nextBtn.addEventListener("click", () => { nextBgSlide(); resetAutoplay(); });
        prevBtn.addEventListener("click", () => { prevBgSlide(); resetAutoplay(); });
        bgDots.forEach(dot => {
            dot.addEventListener("click", function () {
                const slideIndex = parseInt(this.getAttribute("data-slide"));
                setActiveBgSlide(slideIndex);
                resetAutoplay();
            });
        });
        function startAutoplay() { bgAutoplayInterval = setInterval(nextBgSlide, 8000); }
        function resetAutoplay() { clearInterval(bgAutoplayInterval); startAutoplay(); }
        
        const heroSection = document.getElementById("hero");
        heroSection.addEventListener("mouseenter", () => clearInterval(bgAutoplayInterval));
        heroSection.addEventListener("mouseleave", () => startAutoplay());
        
        setActiveBgSlide(0);
        startAutoplay();
    }

    // --- FUNGSI COUNTDOWN ---
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
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById("days").textContent = days.toString().padStart(2, "0");
            document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
            document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
            document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
        }
        updateCountdown();
        const countdownTimer = setInterval(updateCountdown, 1000);
    }

    // --- FUNGSI MUSIK ---
    function playMusic() {
        weddingMusic.volume = 0.3;
        weddingMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(error => {
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

    // --- FUNGSI COPY ---
    document.querySelectorAll(".copy-btn").forEach(button => {
        button.addEventListener("click", function () {
            const accountNumber = this.getAttribute("data-account");
            navigator.clipboard.writeText(accountNumber).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
                this.style.background = "var(--gradient)"; // Diubah ke gradient
                this.style.color = "var(--white)";
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = "";
                    this.style.color = "";
                }, 2000);
            });
        });
    });

    document.getElementById("copyAddress")?.addEventListener("click", function () {
        const address = "Bulu, Pondoksari, Nguntoronadi, Wonogiri, Jawa Tengah 55683";
        navigator.clipboard.writeText(address).then(() => {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Alamat Disalin!';
            this.style.background = "var(--gradient)"; // Diubah ke gradient
            this.style.color = "var(--white)";
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = "";
                this.style.color = "";
            }, 2000);
        });
    });

    // ==========================================================
    // MODIFIKASI: Fungsi Submit RSVP Diganti dengan Firebase
    // ==========================================================
    const rsvpForm = document.querySelector(".rsvp-form");
    if (rsvpForm) {
        rsvpForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            // Ambil data dari form
            const name = rsvpForm.querySelector('input[name="name"]').value;
            const attendance = rsvpForm.querySelector('select[name="attendance"]').value;
            const message = rsvpForm.querySelector('textarea[name="message"]').value;
            const submitBtn = rsvpForm.querySelector('.submit-btn');
            
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;

            // Kirim data ke collection 'ucapan' di Firestore
            db.collection("ucapan").add({
                nama: name,
                kehadiran: attendance,
                ucapan: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp() // Menambah stempel waktu
            })
            .then((docRef) => {
                // Berhasil!
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
                rsvpForm.reset();
                // Kembalikan nama tamu jika tadi terisi otomatis
                if (guestName && rsvpNameInput) {
                    rsvpNameInput.value = guestName;
                }
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 3000);
            })
            .catch((error) => {
                // Gagal
                console.error("Error adding document: ", error);
                alert("Gagal mengirim ucapan, silakan coba lagi.");
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    console.log("🎉 Wedding Website (Versi Tema Glassmorphism + GSAP) Initialized!");
});


// ==============================================
// MODIFIKASI: Fungsi Baru untuk Memuat Komentar
// ==============================================
function loadComments() {
    const commentList = document.getElementById("commentList");
    if (!commentList) return;

    // Pastikan 'db' sudah terdefinisi (dari index.html)
    if (typeof db === 'undefined') {
        console.error("Firebase Firestore 'db' not initialized.");
        commentList.innerHTML = "<p>Gagal memuat ucapan. Konfigurasi Firebase salah.</p>";
        return;
    }

    // Ambil data dari collection 'ucapan', urutkan berdasarkan yang terbaru
    db.collection("ucapan").orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
        if (querySnapshot.empty) {
            commentList.innerHTML = "<p style='text-align: center; opacity: 0.7;'>Jadilah yang pertama memberi ucapan!</p>";
            return;
        }
        
        commentList.innerHTML = ""; // Kosongkan daftar
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Tentukan label kehadiran
            let attendanceLabel = "";
            if (data.kehadiran === 'present') {
                attendanceLabel = "Hadir";
            } else if (data.kehadiran === 'notpresent') {
                attendanceLabel = "Tidak Hadir";
            } else {
                attendanceLabel = "Masih Ragu";
            }

            // Buat elemen HTML untuk setiap komentar
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
// ==============================================
// AKHIR MODIFIKASI
// ==============================================

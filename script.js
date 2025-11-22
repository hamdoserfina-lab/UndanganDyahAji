// 1. Inisialisasi AOS
AOS.init({ duration: 1000, once: true });

// 2. Variabel Global UI
const cover = document.getElementById("cover");
const mainContent = document.getElementById("main-content");
const navbar = document.getElementById("navbar");
const musicControl = document.getElementById("music-control");
const audio = document.getElementById("bg-music");
const musicIcon = document.getElementById("music-icon");
let isPlaying = false;

// 3. Logika URL Parameter
function getGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get("to");
    const displayGuest = document.getElementById("guest-name-cover");
    const inputNama = document.getElementById("nama");
    if (guestName) {
        displayGuest.innerText = guestName;
        inputNama.value = guestName;
    }
}
getGuestName();

// 4. Fungsi Buka Undangan
function bukaUndangan() {
    const btn = document.querySelector('.btn-open');
    const cover = document.getElementById('cover');
    const canvasExplosion = document.getElementById('explosion-canvas');
    
    // Setup Confetti (Ledakan Awal Tetap Solid biar Kelihatan Jelas)
    const myConfetti = confetti.create(canvasExplosion, { resize: true });
    const rect = btn.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    // Warna Ledakan (Solid)
    const blastColors = ['#d4af37', '#f3e5ab', '#ffffff'];

    myConfetti({
        particleCount: 200, // Jumlah ledakan
        spread: 100,
        origin: { x: x, y: y },
        colors: blastColors,
        shapes: ['circle'],
        scalar: 0.8,
        gravity: 0.8,
        ticks: 400,
        disableForReducedMotion: true,
        zIndex: 20001 
    });

    // Musik
    musicControl.style.opacity = "1";
    playMusic();

    // Transisi Cover
    setTimeout(() => {
        cover.classList.add("hidden");
        document.body.style.overflow = "auto";
        mainContent.style.display = "block";
        navbar.style.display = "flex";
        
        setTimeout(() => { 
            AOS.refresh(); 
            // Initialize GSAP animations after cover is hidden
            initPremiumAnimations();
        }, 500);
        
        // MULAI HUJAN (Versi Halus)
        loadUcapan();
        initParticles(); 
        
        // TIMER 15 DETIK: Stop Hujan
        setTimeout(() => { stopRain(); }, 15000);

        setTimeout(() => { myConfetti.reset(); }, 4000);
    }, 800); 
}

// 5. Musik Logic
function playMusic() {
    audio.play().catch(e => console.log("Autoplay blocked"));
    isPlaying = true;
    musicControl.classList.add("spin");
}
function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        musicControl.classList.remove("spin");
        musicIcon.classList.replace("bi-music-note-beamed", "bi-pause-fill");
    } else {
        audio.play();
        musicControl.classList.add("spin");
        musicIcon.classList.replace("bi-pause-fill", "bi-music-note-beamed");
    }
    isPlaying = !isPlaying;
}

// 6. Tab Mempelai
function switchMempelai(name) {
    const tabs = document.querySelectorAll('.avatar-btn'); 
    const contents = document.querySelectorAll('.mempelai-content');
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    if (name === 'dyah') {
        tabs[0].classList.add('active');
        document.getElementById('content-dyah').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('content-aji').classList.add('active');
    }
}

// 7. Countdown
const weddingDate = new Date("Dec 15, 2025 08:00:00").getTime();
const countdownInterval = setInterval(function () {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
    if (distance < 0) {
        clearInterval(countdownInterval);
        document.querySelector(".countdown-box").innerHTML = "<p style='color:#d4af37;'>Acara Telah Selesai</p>";
    }
}, 1000);

// 8. Copy Text
function copyText(text) {
    navigator.clipboard.writeText(text).then(
        () => { showToast("Berhasil Disalin!"); },
        () => { alert("Gagal salin: " + text); }
    );
}
function showToast(msg) {
    const toast = document.getElementById("copy-toast");
    toast.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${msg}`;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ============================================
   GLOBAL RAIN PARTICLE SYSTEM (VERSI SOFT / GHOST)
   ============================================ */
const canvas = document.getElementById("gold-particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let isRainingActive = true;

// [UPDATE] PALET WARNA TRANSPARAN (RGBA)
// Angka terakhir (0.4) adalah tingkat transparansi. Semakin kecil = semakin pudar.
const dustPalette = [
    'rgba(212, 175, 55, 0.5)',   // Emas Tua (50% Transparan)
    'rgba(243, 229, 171, 0.4)',  // Emas Muda (40% Transparan)
    'rgba(255, 255, 255, 0.2)'   // Putih (20% Transparan - Sangat Tipis)
];

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function stopRain() {
    isRainingActive = false; 
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height; 
        
        // [UPDATE] UKURAN DIPERKECIL (0.5px sampai 2.5px)
        this.size = Math.random() * 2 + 0.5; 
        
        this.color = dustPalette[Math.floor(Math.random() * dustPalette.length)];
        this.speedY = Math.random() * 1.5 + 0.5; 
        this.speedX = Math.random() * 0.5 - 0.25; 
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        if (this.y > canvas.height) {
            if (isRainingActive) {
                this.y = 0 - this.size; 
                this.x = Math.random() * canvas.width;
                this.speedY = Math.random() * 1.5 + 0.5;
            }
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    isRainingActive = true;
    particlesArray = [];
    // [UPDATE] JUMLAH DIKURANGI SEDIKIT AGAR TIDAK SUMPEK
    for (let i = 0; i < 100; i++) { 
        particlesArray.push(new Particle());
    }
    animateParticles();
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

/* ============================================
   3D TILT (HERO ONLY)
   ============================================ */
const tiltBox = document.querySelector('.tilt-box');
const tiltCard = document.getElementById('tilt-card');
const tiltGlare = document.getElementById('tilt-glare');

if (window.matchMedia("(min-width: 768px)").matches && tiltBox) {
    tiltBox.addEventListener('mousemove', (e) => {
        const rect = tiltBox.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15; 
        const rotateY = ((x - centerX) / centerX) * 15;

        tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        const glareX = ((x / rect.width) * 100);
        const glareY = ((y / rect.height) * 100);
        tiltGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3), rgba(255,255,255,0))`;
        tiltGlare.style.opacity = '1';
    });
    tiltBox.addEventListener('mouseleave', () => {
        tiltCard.style.transform = `rotateX(0) rotateY(0)`;
        tiltGlare.style.opacity = '0';
    });
}

/* ============================================
   FIREBASE UCAPAN LOGIC
   ============================================ */
function kirimUcapan(e) {
    e.preventDefault();
    const nama = document.getElementById("nama").value;
    const kehadiran = document.getElementById("kehadiran").value;
    const pesan = document.getElementById("pesan").value;
    const btn = document.querySelector(".btn-kirim");
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Mengirim...';

    db.collection("ucapan").add({
        nama: nama, kehadiran: kehadiran, pesan: pesan,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        showToast("Terima Kasih, Ucapan Terkirim!");
        document.getElementById("rsvpForm").reset();
        getGuestName();
    }).catch(error => { console.error("Error:", error); alert("Gagal mengirim ucapan."); })
    .finally(() => { btn.disabled = false; btn.innerHTML = originalText; });
}

function loadUcapan() {
    const list = document.getElementById("comments-list");
    if(!list) return;
    db.collection("ucapan").orderBy("timestamp", "desc").limit(20).onSnapshot(snapshot => {
        let html = "";
        if (snapshot.empty) { html = '<div class="loading-text">Belum ada ucapan. Jadilah yang pertama!</div>'; } 
        else {
            snapshot.forEach(doc => {
                const data = doc.data();
                let timeString = "";
                if (data.timestamp) {
                    const date = data.timestamp.toDate();
                    timeString = date.toLocaleDateString("id-ID") + " " + date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                }
                let statusClass = data.kehadiran.includes("Tidak") ? "Tidak" : "Hadir";
                html += `<div class="comment-item">
                    <div class="comment-header"><span class="c-name">${escapeHtml(data.nama)}</span><span class="c-status ${statusClass}">${data.kehadiran}</span></div>
                    <p class="c-message">${escapeHtml(data.pesan)}</p><span class="c-time">${timeString}</span>
                </div>`;
            });
        }
        list.innerHTML = html;
    });
}
function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/* ============================================
   GSAP SCROLL ANIMATIONS (Verse to Footer)
   ============================================ */

function initPremiumAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Reduce motion for accessibility
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;
    
    // SECTION VERSE ANIMATIONS
    const verseAnim = gsap.timeline({
        scrollTrigger: {
            trigger: '.section-verse',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    verseAnim.fromTo('.glass-box-verse', 
        { scale: 0.8, opacity: 0, rotationY: 10 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 1.2, ease: 'back.out(1.4)' }
    );
    
    verseAnim.fromTo('.verse-decoration', 
        { rotation: -180, opacity: 0, scale: 0.5 },
        { rotation: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
        '-=0.8'
    );
    
    verseAnim.fromTo('.verse-text', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
        '-=0.6'
    );
    
    verseAnim.fromTo('.verse-source', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
    );
    
    // Continuous star rotation
    gsap.to('.verse-decoration', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
    });

    // SECTION MEMPELAI ANIMATIONS
    const mempelaiAnim = gsap.timeline({
        scrollTrigger: {
            trigger: '.section-mempelai-tabs',
            start: 'top 75%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    mempelaiAnim.fromTo('.section-title-gold', 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'bounce.out' }
    );
    
    mempelaiAnim.fromTo('.avatar-btn:nth-child(1)', 
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
    );
    
    mempelaiAnim.fromTo('.avatar-btn:nth-child(3)', 
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
    );
    
    mempelaiAnim.fromTo('.avatar-connector', 
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
    );
    
    mempelaiAnim.fromTo('.glass-card-mempelai', 
        { scale: 0.9, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'back.out(1.2)' },
        '-=0.3'
    );
    
    // Photo frame animation
    mempelaiAnim.fromTo('.photo-frame-gold', 
        { rotationY: -45, opacity: 0, scale: 0.8 },
        { rotationY: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
        '-=0.5'
    );
    
    // Info text stagger
    mempelaiAnim.fromTo('.info-text > *', 
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
        '-=0.3'
    );
    
    // Instagram button
    mempelaiAnim.fromTo('.btn-ig', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' },
        '-=0.2'
    );

    // SECTION EVENTS ANIMATIONS
    const eventsAnim = gsap.timeline({
        scrollTrigger: {
            trigger: '.section-events',
            start: 'top 70%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    eventsAnim.fromTo('.event-card:nth-child(1)', 
        { rotationY: -90, opacity: 0 },
        { rotationY: 0, opacity: 1, duration: 1, ease: 'power2.out' }
    );
    
    eventsAnim.fromTo('.event-card:nth-child(2)', 
        { rotationY: 90, opacity: 0 },
        { rotationY: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        '-=0.7'
    );
    
    // Icons bounce
    eventsAnim.fromTo('.card-ornament-top', 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.3, duration: 0.8, ease: 'bounce.out', stagger: 0.2 },
        '-=0.5'
    );
    
    // Title animation
    eventsAnim.fromTo('.event-title', 
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.1 },
        '-=0.4'
    );
    
    // Content stagger
    eventsAnim.fromTo('.event-date, .event-time, .event-divider, .event-location', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.3'
    );

    // SECTION LOCATION ANIMATIONS
    const locationAnim = gsap.timeline({
        scrollTrigger: {
            trigger: '.section-location',
            start: 'top 70%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    locationAnim.fromTo('.glass-map-card', 
        { y: 100, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' }
    );
    
    locationAnim.fromTo('.map-frame', 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
    );
    
    locationAnim.fromTo('.btn-action-gold', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.5)' },
        '-=0.4'
    );

    // SECTION GIFT ANIMATIONS
    const giftAnim = gsap.timeline({
        scrollTrigger: {
            trigger: '.section-gift',
            start: 'top 70%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    giftAnim.fromTo('.atm-card:nth-child(1)', 
        { rotationY: -15, rotationX: 10, opacity: 0, y: 50 },
        { rotationY: 0, rotationX: 0, opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );
    
    giftAnim.fromTo('.atm-card:nth-child(2)', 
        { rotationY: 15, rotationX: 10, opacity: 0, y: 50 },
        { rotationY: 0, rotationX: 0, opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.7'
    );
    
    // Card shine effect on hover
    document.querySelectorAll('.atm-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card.querySelector('.card-shine'), {
                x: '100%',
                duration: 0.6,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.card-shine'), {
                x: '-100%',
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });
    
    // Card numbers typewriter effect
    giftAnim.fromTo('.card-number', 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out' },
        '-=0.5'
    );
    
    // Copy buttons pulse
    giftAnim.fromTo('.btn-copy-text', 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' },
        '-=0.3'
    );

    // SECTION RSVP ANIMATIONS
    const rsvpAnim = gsap.timeline({
        scrollTrigger: {
            trigger: '.section-rsvp',
            start: 'top 65%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    rsvpAnim.fromTo('.glass-form-card', 
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }
    );
    
    rsvpAnim.fromTo('.glass-comments-card', 
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        '-=0.8'
    );
    
    // Form inputs stagger
    rsvpAnim.fromTo('.form-group', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
        '-=0.6'
    );
    
    // Magnetic button effect
    const kirimBtn = document.querySelector('.btn-kirim');
    if (kirimBtn) {
        kirimBtn.addEventListener('mousemove', (e) => {
            const rect = kirimBtn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            gsap.to(kirimBtn, {
                x: (x - rect.width / 2) * 0.1,
                y: (y - rect.height / 2) * 0.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        kirimBtn.addEventListener('mouseleave', () => {
            gsap.to(kirimBtn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    }
    
    // Comment items animation
    const commentsList = document.getElementById('comments-list');
    if (commentsList) {
        // Observe new comment additions
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('comment-item')) {
                        gsap.fromTo(node, 
                            { y: 30, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
                        );
                    }
                });
            });
        });
        
        observer.observe(commentsList, { childList: true });
    }

    // SECTION FOOTER ANIMATIONS
    const footerAnim = gsap.timeline({
        scrollTrigger: {
            trigger: '.footer-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    footerAnim.fromTo('.glass-footer-content', 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.4)' }
    );
    
    footerAnim.fromTo('.closing-text', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.8'
    );
    
    footerAnim.fromTo('.closing-signature', 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'bounce.out' },
        '-=0.5'
    );
    
    footerAnim.fromTo('.copyright', 
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
    );

    // Enhanced scroll smoothing with navbar offset
    gsap.utils.toArray('section').forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 70%',
            end: 'bottom 30%',
            onEnter: () => {
                // Update navbar active state
                const id = section.getAttribute('id');
                const navItem = document.querySelector(`.nav-item[href="#${id}"]`);
                if (navItem) {
                    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
                    navItem.classList.add('active');
                }
            },
            onEnterBack: () => {
                const id = section.getAttribute('id');
                const navItem = document.querySelector(`.nav-item[href="#${id}"]`);
                if (navItem) {
                    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
                    navItem.classList.add('active');
                }
            }
        });
    });
}

// Mobile optimization - simpler animations
function optimizeForMobile() {
    if (window.innerWidth < 768) {
        // Reduce complexity for mobile
        gsap.defaults({ duration: 0.8 });
    }
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait for AOS to initialize first
    setTimeout(() => {
        optimizeForMobile();
        // Don't initialize GSAP here - wait for bukaUndangan()
    }, 1000);
});

// Re-initialize on window resize (with debounce)
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        initPremiumAnimations();
    }, 250);
});
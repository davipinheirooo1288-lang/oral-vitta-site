const WA = "https://wa.me/5585999493145";

const SERVICE_LABELS = {
    implantes: "Implantes",
    clareamento: "Clareamento",
    facetas: "Facetas / lentes",
    botox: "Botox",
    ortodontia: "Ortodontia",
    odontopediatria: "Odontopediatria",
    urgencia: "Canal / urgência",
    protese: "Prótese / dentaduras",
};

function openWhatsApp(serviceKey) {
    const label = SERVICE_LABELS[serviceKey] || serviceKey;
    const text = encodeURIComponent(`Olá! Gostaria de agendar: ${label}.`);
    window.open(`${WA}?text=${text}`, "_blank", "noopener");
}

function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

function initNav() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;

    const close = () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
    };

    toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        nav.classList.toggle("is-open", !open);
        document.body.classList.toggle("nav-open", !open);
    });

    nav.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", close);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const id = this.getAttribute("href");
            if (!id || id === "#") return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}

function initFadeIn() {
    const elements = document.querySelectorAll(".fade-in");
    if (!elements.length) return;

    const reveal = () => {
        elements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 40) el.classList.add("visible");
        });
    };

    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("resize", reveal);
    reveal();
}

function initServiceFilters() {
    const buttons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".service-card");
    if (!buttons.length || !cards.length) return;

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const filter = btn.getAttribute("data-filter") || "todos";
            buttons.forEach((b) => b.classList.toggle("is-active", b === btn));

            cards.forEach((card) => {
                const cat = card.getAttribute("data-category");
                const show = filter === "todos" || cat === filter;
                card.classList.toggle("is-hidden", !show);
            });
        });
    });
}

function initTestimonialScroll() {
    const track = document.getElementById("testimonialTrack");
    const prev = document.getElementById("tPrev");
    const next = document.getElementById("tNext");
    if (!track || !prev || !next) return;

    const step = () => Math.min(track.clientWidth * 0.85, 360);

    prev.addEventListener("click", () => {
        track.scrollBy({ left: -step(), behavior: "smooth" });
    });
    next.addEventListener("click", () => {
        track.scrollBy({ left: step(), behavior: "smooth" });
    });
}

function initForms() {
    const bind = (form) => {
        if (!form) return;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const sel = form.querySelector("select");
            if (!sel || !sel.value) {
                window.alert("Selecione um serviço para continuar.");
                return;
            }
            openWhatsApp(sel.value);
            const modal = document.getElementById("bookingModal");
            if (modal && modal.classList.contains("is-open")) closeModal();
        });
    };

    bind(document.getElementById("formAgenda"));
    bind(document.getElementById("formModal"));
}

/* —— Modal —— */
let lastFocus = null;

function openModal() {
    const modal = document.getElementById("bookingModal");
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
}

function closeModal() {
    const modal = document.getElementById("bookingModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

function initModal() {
    const modal = document.getElementById("bookingModal");
    if (!modal) return;

    document.querySelectorAll("[data-open-modal]").forEach((el) => {
        el.addEventListener("click", openModal);
    });

    modal.querySelectorAll("[data-close-modal]").forEach((el) => {
        el.addEventListener("click", closeModal);
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initNav();
    initSmoothScroll();
    initFadeIn();
    initServiceFilters();
    initTestimonialScroll();
    initForms();
    initModal();
});

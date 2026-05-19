const WHATSAPP_NUMBER = "5585988852046";
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

function buildWhatsAppMessage({ name, service, email }) {
    const parts = [
        "Olá, vim pelo site da Oral Vitta Fortaleza.",
        name ? `Meu nome é ${name}.` : "",
        service ? `Gostaria de agendar atendimento para ${service}.` : "Gostaria de agendar uma consulta.",
        email ? `Meu email é ${email}.` : "",
        "Pode me informar os horários disponíveis?"
    ].filter(Boolean);

    return parts.join("\n");
}

function openWhatsApp(message) {
    window.open(`${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

function initHeader() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector("#menuToggle");
    const navRow = document.querySelector(".nav-row");
    let lastScrollY = window.scrollY;

    const onScroll = () => {
        if (!header) return;

        const currentScrollY = window.scrollY;
        const isMenuOpen = toggle?.getAttribute("aria-expanded") === "true";
        const isScrollingDown = currentScrollY > lastScrollY;
        const movedEnough = Math.abs(currentScrollY - lastScrollY) > 6;

        header.classList.toggle("is-scrolled", currentScrollY > 16);

        if (currentScrollY < 40 || isMenuOpen) {
            header.classList.remove("is-hidden");
        } else if (movedEnough && isScrollingDown) {
            header.classList.add("is-hidden");
        } else if (movedEnough) {
            header.classList.remove("is-hidden");
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (!toggle || !navRow) return;

    const closeMenu = () => {
        toggle.setAttribute("aria-expanded", "false");
        navRow.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        onScroll();
    };

    toggle.addEventListener("click", () => {
        const isOpen = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!isOpen));
        navRow.classList.toggle("is-open", !isOpen);
        document.body.classList.toggle("nav-open", !isOpen);
        header?.classList.remove("is-hidden");
    });

    navRow.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });
}

function initReveal() {
    const items = document.querySelectorAll(".section-reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

    items.forEach((item) => observer.observe(item));
}

function initServiceButtons() {
    const select = document.querySelector("#serviceSelect");
    const helper = document.querySelector("#serviceHelper");
    const booking = document.querySelector("#agendamento");

    document.querySelectorAll("[data-service]").forEach((button) => {
        button.addEventListener("click", () => {
            const service = button.dataset.service || "";
            if (select) select.value = service;
            if (helper) helper.textContent = `Vamos preparar sua mensagem para ${service}.`;
            booking?.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => select?.focus({ preventScroll: true }), 520);
        });
    });
}

function initBookingForm() {
    const form = document.querySelector("#bookingForm");
    const error = document.querySelector("#formError");
    const helper = document.querySelector("#serviceHelper");
    const serviceSelect = document.querySelector("#serviceSelect");

    serviceSelect?.addEventListener("change", () => {
        const value = serviceSelect.value;
        if (helper) {
            helper.textContent = value
                ? `A mensagem será personalizada para ${value}.`
                : "Selecione uma opção para informar sua necessidade.";
        }
        if (error) error.textContent = "";
    });

    form?.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = new FormData(form);
        const name = String(data.get("patientName") || "").trim();
        const service = String(data.get("serviceSelect") || "").trim();
        const email = String(data.get("patientEmail") || "").trim();

        if (!name || !service) {
            if (error) error.textContent = "Preencha o nome e selecione um serviço para continuar.";
            if (!name) {
                form.querySelector("#patientName")?.focus();
            } else {
                serviceSelect?.focus();
            }
            return;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (error) error.textContent = "Confira o email ou deixe esse campo em branco.";
            form.querySelector("#patientEmail")?.focus();
            return;
        }

        if (error) error.textContent = "";
        openWhatsApp(buildWhatsAppMessage({ name, service, email }));
    });
}

function initPatientCarousel() {
    const track = document.querySelector("#patientTrack");
    const prev = document.querySelector("[data-carousel-prev]");
    const next = document.querySelector("[data-carousel-next]");
    if (!track || !prev || !next) return;

    const step = () => Math.min(track.clientWidth * 0.82, 460);

    prev.addEventListener("click", () => {
        track.scrollBy({ left: -step(), behavior: "smooth" });
    });

    next.addEventListener("click", () => {
        track.scrollBy({ left: step(), behavior: "smooth" });
    });
}

function initImageLightbox() {
    const lightbox = document.querySelector("#imageLightbox");
    const image = lightbox?.querySelector("img");
    const close = lightbox?.querySelector("[data-lightbox-close]");
    if (!lightbox || !image) return;

    const closeLightbox = () => {
        if (typeof lightbox.close === "function") {
            lightbox.close();
        } else {
            lightbox.removeAttribute("open");
        }
        document.body.classList.remove("nav-open");
    };

    document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
        button.addEventListener("click", () => {
            image.src = button.dataset.lightboxSrc || "";
            image.alt = button.dataset.lightboxAlt || "Imagem ampliada";
            document.body.classList.add("nav-open");

            if (typeof lightbox.showModal === "function") {
                lightbox.showModal();
            } else {
                lightbox.setAttribute("open", "");
            }
        });
    });

    close?.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("close", () => {
        document.body.classList.remove("nav-open");
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.open) {
            closeLightbox();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initReveal();
    initServiceButtons();
    initBookingForm();
    initPatientCarousel();
    initImageLightbox();
});

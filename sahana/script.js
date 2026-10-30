/* =========================================================
   GLOBAL HEADER, THEME TOGGLE & SECTION 01 SCRIPTS (START)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const rootHtml = document.documentElement;
  const themeToggleBtn = document.getElementById("sbThemeToggle");
  const mobileMenuBtn = document.getElementById("sbMobileMenuBtn");
  const mobileDrawer = document.getElementById("sbMobileDrawer");

  // 1. Light / Dark Theme Toggle with LocalStorage persistence
  const savedTheme = localStorage.getItem("sb-portfolio-theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    rootHtml.setAttribute("data-theme", savedTheme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute("aria-pressed", String(savedTheme === "dark"));
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = rootHtml.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      rootHtml.setAttribute("data-theme", nextTheme);
      localStorage.setItem("sb-portfolio-theme", nextTheme);
      themeToggleBtn.setAttribute("aria-pressed", String(nextTheme === "dark"));
    });
  }

  // 2. Mobile Navigation Drawer Toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener("click", () => {
      const isHidden = mobileDrawer.hasAttribute("hidden");
      if (isHidden) {
        mobileDrawer.removeAttribute("hidden");
        mobileMenuBtn.setAttribute("aria-expanded", "true");
      } else {
        mobileDrawer.setAttribute("hidden", "");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Close drawer when a link is clicked
    mobileDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileDrawer.setAttribute("hidden", "");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3. Smooth Single-Page Anchor Scrolling & Active Dock State
  const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
  const dockItems = document.querySelectorAll(".sb-bottom-dock__item");
  const headerLinks = document.querySelectorAll(".sb-header__nav-link");

  allAnchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });

        // Update active state on bottom dock & desktop nav
        dockItems.forEach((item) => {
          item.classList.toggle("is-active", item.getAttribute("href") === targetId);
        });
        headerLinks.forEach((item) => {
          item.classList.toggle("is-active", item.getAttribute("href") === targetId);
        });
      }
    });
  });
});
/* =========================================================
   GLOBAL HEADER, THEME TOGGLE & SECTION 01 SCRIPTS (END)
========================================================= */

// =========================================================
// PASTE NEXT SECTION JS BELOW THIS LINE
// =========================================================


/* =========================================================
   SECTION 02 — ABOUT ME / MY JOURNEY SCRIPTS (START)
   Scroll-Spy Active Navigation Sync for #about & Other Sections
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("main section[id]");
  const dockItems = document.querySelectorAll(".sb-bottom-dock__item");
  const headerLinks = document.querySelectorAll(".sb-header__nav-link");

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeHash = `#${entry.target.id}`;
          dockItems.forEach((item) => {
            item.classList.toggle("is-active", item.getAttribute("href") === activeHash);
          });
          headerLinks.forEach((item) => {
            item.classList.toggle("is-active", item.getAttribute("href") === activeHash);
          });
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((sec) => observer.observe(sec));
});
/* =========================================================
   SECTION 02 — ABOUT ME / MY JOURNEY SCRIPTS (END)
========================================================= */

// =========================================================
// PASTE NEXT SECTION JS BELOW THIS LINE
// =========================================================


/* =========================================================
   SECTION 04 — FEATURED PROJECTS SCRIPTS (START)
   Category Filter, 16:9 Gallery Switcher, Lightbox & Modal
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const projectsSection = document.getElementById("projects");
  if (!projectsSection) return;

  // 1. Category Filter Logic
  const filterBtns = projectsSection.querySelectorAll(".sb-projects__filter-btn");
  const projectCards = projectsSection.querySelectorAll("[data-project-card]");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedCat = btn.getAttribute("data-filter") || "all";

      filterBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });

      projectCards.forEach((card) => {
        const categories = (card.getAttribute("data-categories") || "").split(" ");
        const matches = selectedCat === "all" || categories.includes(selectedCat);
        card.style.display = matches ? "" : "none";
      });
    });
  });

  // 2. 16:9 Thumbnail Gallery & Fullscreen Lightbox
  const mainImg = document.getElementById("sbMainProjectImg");
  const mainPreviewBtn = document.getElementById("sbMainPreviewBtn");
  const thumbBtns = Array.from(projectsSection.querySelectorAll(".sb-projects__thumb-btn"));
  const thumbPrev = document.getElementById("sbThumbPrev");
  const thumbNext = document.getElementById("sbThumbNext");

  const lightbox = document.getElementById("sbProjectLightbox");
  const lightboxImg = document.getElementById("sbLightboxImg");
  const lightboxCounter = document.getElementById("sbLightboxCounter");
  const lightboxCloseBtn = document.getElementById("sbLightboxCloseBtn");
  const lightboxPrev = document.getElementById("sbLightboxPrev");
  const lightboxNext = document.getElementById("sbLightboxNext");

  let currentImgIndex = 0;

  function setGalleryImage(index) {
    if (!thumbBtns.length) return;
    currentImgIndex = (index + thumbBtns.length) % thumbBtns.length;
    const activeThumb = thumbBtns[currentImgIndex];
    const src = activeThumb.getAttribute("data-src");
    const alt = activeThumb.getAttribute("data-alt") || "CricPose Screenshot";

    if (mainImg && src) {
      mainImg.src = src;
      mainImg.alt = alt;
    }

    if (lightboxImg && src) {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentImgIndex + 1} / ${thumbBtns.length}`;
    }

    thumbBtns.forEach((btn, idx) => {
      const isSelected = idx === currentImgIndex;
      btn.classList.toggle("is-selected", isSelected);
      btn.setAttribute("aria-selected", String(isSelected));
    });
  }

  thumbBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => setGalleryImage(idx));
  });

  if (thumbPrev) {
    thumbPrev.addEventListener("click", () => setGalleryImage(currentImgIndex - 1));
  }
  if (thumbNext) {
    thumbNext.addEventListener("click", () => setGalleryImage(currentImgIndex + 1));
  }

  function openLightbox() {
    if (!lightbox) return;
    setGalleryImage(currentImgIndex);
    lightbox.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    if (lightboxCloseBtn) lightboxCloseBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute("hidden", "");
    document.body.style.overflow = "";
    if (mainPreviewBtn) mainPreviewBtn.focus();
  }

  if (mainPreviewBtn) {
    mainPreviewBtn.addEventListener("click", openLightbox);
  }
  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener("click", closeLightbox);
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => setGalleryImage(currentImgIndex - 1));
  }
  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => setGalleryImage(currentImgIndex + 1));
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target.hasAttribute("data-lightbox-close")) {
        closeLightbox();
      }
    });
  }

  // 3. Case Study Modal (View Details)
  const caseModal = document.getElementById("sbCaseStudyModal");
  const openCaseBtn = document.getElementById("sbOpenCaseStudyBtn");
  const closeCaseBtn = document.getElementById("sbCloseCaseStudyBtn");

  function openCaseModal() {
    if (!caseModal) return;
    caseModal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    if (closeCaseBtn) closeCaseBtn.focus();
  }

  function closeCaseModal() {
    if (!caseModal) return;
    caseModal.setAttribute("hidden", "");
    document.body.style.overflow = "";
    if (openCaseBtn) openCaseBtn.focus();
  }

  if (openCaseBtn) openCaseBtn.addEventListener("click", openCaseModal);
  if (closeCaseBtn) closeCaseBtn.addEventListener("click", closeCaseModal);

  if (caseModal) {
    caseModal.addEventListener("click", (event) => {
      if (event.target.hasAttribute("data-modal-close")) {
        closeCaseModal();
      }
    });
  }

  // Keyboard Navigation (Escape, ArrowLeft, ArrowRight)
  document.addEventListener("keydown", (event) => {
    const isLightboxOpen = lightbox && !lightbox.hasAttribute("hidden");
    const isCaseModalOpen = caseModal && !caseModal.hasAttribute("hidden");

    if (isLightboxOpen) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") setGalleryImage(currentImgIndex - 1);
      if (event.key === "ArrowRight") setGalleryImage(currentImgIndex + 1);
    } else if (isCaseModalOpen && event.key === "Escape") {
      closeCaseModal();
    }
  });
});
/* =========================================================
   SECTION 04 — FEATURED PROJECTS SCRIPTS (END)
========================================================= */

// =========================================================
// PASTE NEXT SECTION JS BELOW THIS LINE
// =========================================================


/* =========================================================
   SECTION 05 — EDUCATION & ACADEMIC JOURNEY SCRIPTS (START)
   Lightweight Scroll-Reveal & Active Nav Sync (#education)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const eduSection = document.getElementById("education");
  if (!eduSection) return;

  // Respect reduced-motion preferences; no heavy JS required
  const eduCards = eduSection.querySelectorAll(".sb-edu__card");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const cardObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  eduCards.forEach((card) => cardObserver.observe(card));
});
/* =========================================================
   SECTION 05 — EDUCATION & ACADEMIC JOURNEY SCRIPTS (END)
========================================================= */

// =========================================================
// PASTE NEXT SECTION JS BELOW THIS LINE
// =========================================================


/* =========================================================
   SECTION 06 & 07 — CERTIFICATIONS LIGHTBOX SCRIPTS (START)
   Full-Screen Certificate Viewer with Keyboard & Overlay Close
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const certSection = document.getElementById("certifications");
  if (!certSection) return;

  const triggers = certSection.querySelectorAll("[data-cert-trigger]");
  const lightbox = document.getElementById("sbCertLightbox");
  const lightboxImg = document.getElementById("sbCertLightboxImg");
  const lightboxTitle = document.getElementById("sbCertLightboxTitle");
  const lightboxIssuer = document.getElementById("sbCertLightboxIssuer");
  const closeBtn = document.getElementById("sbCertLightboxClose");

  let lastFocusedTrigger = null;

  function openCertLightbox(triggerEl) {
    if (!lightbox || !lightboxImg) return;
    const src = triggerEl.getAttribute("data-cert-src");
    const title = triggerEl.getAttribute("data-cert-title") || "Certificate";
    const issuer = triggerEl.getAttribute("data-cert-issuer") || "";

    lastFocusedTrigger = triggerEl;
    lightboxImg.src = src || "";
    lightboxImg.alt = `${title} — ${issuer}`;

    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxIssuer) lightboxIssuer.textContent = issuer;

    lightbox.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }

  function closeCertLightbox() {
    if (!lightbox || lightbox.hasAttribute("hidden")) return;
    lightbox.setAttribute("hidden", "");
    document.body.style.overflow = "";
    if (lastFocusedTrigger) lastFocusedTrigger.focus();
  }

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => openCertLightbox(btn));
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeCertLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target.hasAttribute("data-cert-close")) {
        closeCertLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && !lightbox.hasAttribute("hidden")) {
      closeCertLightbox();
    }
  });
});
/* =========================================================
   SECTION 06 & 07 — CERTIFICATIONS LIGHTBOX SCRIPTS (END)
========================================================= */

// =========================================================
// PASTE NEXT SECTION JS BELOW THIS LINE
// =========================================================



/* =========================================================
   SECTION 09 & 10 — CENTRAL CONTACT CONFIG & FORM SCRIPTS (START)
   Single Source of Truth for Contact Links + Validated Form
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Centralized Contact Configuration (Update actual details in one place)
  const SB_CONTACT_CONFIG = {
    email: "edu.sahanabharadwaj@gmail.com",
    whatsappNumber: "", // Add digits with country code (e.g., "919876543210") to enable wa.me
    whatsappDisplay: "Add WhatsApp in SB_CONTACT_CONFIG",
    linkedinUrl: "https://linkedin.com/in/sahana-bharadwaj",
    linkedinDisplay: "linkedin.com/in/sahana-bharadwaj",
    githubUrl: "https://github.com/", // Update with actual GitHub profile URL
    githubDisplay: "github.com",
    formEndpoint: "" // Optional backend/Formspree URL; uses mailto fallback when empty
  };

  // Sync all [data-sb-contact-link] & [data-sb-contact-text] across Section 09 & Footer
  const cleanPhone = SB_CONTACT_CONFIG.whatsappNumber.replace(/\D/g, "");
  const whatsappHref = cleanPhone ? `https://wa.me/${cleanPhone}` : "#contact";
  const whatsappLabel = cleanPhone ? SB_CONTACT_CONFIG.whatsappDisplay : "Direct WhatsApp Chat";

  document.querySelectorAll('[data-sb-contact-link="email"]').forEach((el) => {
    el.setAttribute("href", `mailto:${SB_CONTACT_CONFIG.email}`);
  });
  document.querySelectorAll('[data-sb-contact-text="email"]').forEach((el) => {
    el.textContent = SB_CONTACT_CONFIG.email;
  });

  document.querySelectorAll('[data-sb-contact-link="whatsapp"]').forEach((el) => {
    el.setAttribute("href", whatsappHref);
    if (!cleanPhone) {
      el.removeAttribute("target");
    }
  });
  document.querySelectorAll('[data-sb-contact-text="whatsapp"]').forEach((el) => {
    el.textContent = whatsappLabel;
  });

  document.querySelectorAll('[data-sb-contact-link="linkedin"]').forEach((el) => {
    el.setAttribute("href", SB_CONTACT_CONFIG.linkedinUrl);
  });
  document.querySelectorAll('[data-sb-contact-text="linkedin"]').forEach((el) => {
    el.textContent = SB_CONTACT_CONFIG.linkedinDisplay;
  });

  document.querySelectorAll('[data-sb-contact-link="github"]').forEach((el) => {
    el.setAttribute("href", SB_CONTACT_CONFIG.githubUrl);
  });
  document.querySelectorAll('[data-sb-contact-text="github"]').forEach((el) => {
    el.textContent = SB_CONTACT_CONFIG.githubDisplay;
  });

  // 2. Contact Form Validation & Submission / Mailto Fallback
  const form = document.getElementById("sbContactForm");
  if (!form) return;

  const nameInput = document.getElementById("sbInputName");
  const emailInput = document.getElementById("sbInputEmail");
  const subjectInput = document.getElementById("sbInputSubject");
  const messageInput = document.getElementById("sbInputMessage");

  const nameError = document.getElementById("sbErrorName");
  const emailError = document.getElementById("sbErrorEmail");
  const subjectError = document.getElementById("sbErrorSubject");
  const messageError = document.getElementById("sbErrorMessage");

  const submitBtn = document.getElementById("sbSubmitBtn");
  const submitBtnText = document.getElementById("sbSubmitBtnText");
  const feedbackBox = document.getElementById("sbFormFeedback");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(inputEl, errorEl, message) {
    if (!inputEl || !errorEl) return;
    if (message) {
      inputEl.classList.add("is-invalid");
      errorEl.textContent = message;
      errorEl.removeAttribute("hidden");
    } else {
      inputEl.classList.remove("is-invalid");
      errorEl.textContent = "";
      errorEl.setAttribute("hidden", "");
    }
  }

  function showFeedback(type, message) {
    if (!feedbackBox) return;
    feedbackBox.className = `sb-contact__feedback sb-contact__feedback--${type}`;
    feedbackBox.textContent = message;
    feedbackBox.removeAttribute("hidden");
  }

  [
    [nameInput, nameError],
    [emailInput, emailError],
    [subjectInput, subjectError],
    [messageInput, messageError]
  ].forEach(([inputEl, errorEl]) => {
    if (inputEl) {
      inputEl.addEventListener("input", () => setFieldError(inputEl, errorEl, ""));
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (feedbackBox) feedbackBox.setAttribute("hidden", "");

    const nameVal = nameInput ? nameInput.value.trim() : "";
    const emailVal = emailInput ? emailInput.value.trim() : "";
    const subjectVal = subjectInput ? subjectInput.value.trim() : "";
    const messageVal = messageInput ? messageInput.value.trim() : "";

    let isValid = true;

    if (!nameVal) {
      setFieldError(nameInput, nameError, "Please enter your name.");
      isValid = false;
    }
    if (!emailVal) {
      setFieldError(emailInput, emailError, "Please enter your email address.");
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      setFieldError(emailInput, emailError, "Please enter a valid email address.");
      isValid = false;
    }
    if (!subjectVal) {
      setFieldError(subjectInput, subjectError, "Please enter a subject.");
      isValid = false;
    }
    if (!messageVal) {
      setFieldError(messageInput, messageError, "Please enter your message.");
      isValid = false;
    }

    if (!isValid) return;

    if (submitBtn) submitBtn.disabled = true;
    if (submitBtnText) submitBtnText.textContent = "Preparing Message...";

    // Route A: Configured Backend Endpoint
    if (SB_CONTACT_CONFIG.formEndpoint) {
      try {
        const response = await fetch(SB_CONTACT_CONFIG.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            subject: subjectVal,
            message: messageVal
          })
        });

        if (response.ok) {
          form.reset();
          showFeedback("success", "Thank you! Your message has been sent.");
        } else {
          showFeedback("error", "Could not send message via server. Opening your email client instead...");
        }
      } catch (err) {
        showFeedback("error", "Network error occurred. Please reach out directly via email.");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = "Send Message";
      }
      return;
    }

    // Route B: Honest Mailto Fallback (Opens visitor's default email app with pre-filled details)
    const mailtoSubject = encodeURIComponent(subjectVal);
    const mailtoBody = encodeURIComponent(
      `Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`
    );

    window.location.href = `mailto:${SB_CONTACT_CONFIG.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

    showFeedback(
      "success",
      `Opening your default email application addressed to ${SB_CONTACT_CONFIG.email} with your message details pre-filled.`
    );

    if (submitBtn) submitBtn.disabled = false;
    if (submitBtnText) submitBtnText.textContent = "Send Message";
  });
});
/* =========================================================
   SECTION 09 & 10 — CENTRAL CONTACT CONFIG & FORM SCRIPTS (END)
========================================================= */
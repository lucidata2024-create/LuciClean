document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const backToTopBtn = document.querySelector(".back-to-top");
  const revealElements = document.querySelectorAll(".reveal");
  const statNumbers = document.querySelectorAll(".stat-number");
  const faqItems = document.querySelectorAll(".faq-item");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const packageCards = document.querySelectorAll(".package-card");

  /**
   * Toggle header style on scroll
   */
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    if (window.scrollY > 500) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  };

  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll);

  /**
   * Mobile navigation
   */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("menu-open", isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navMenu.contains(event.target);
      const clickedToggle = navToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
      }
    });
  }

  /**
   * Smooth scrolling with header offset
   */
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  smoothScrollLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      const headerOffset = header ? header.offsetHeight : 0;
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset + 2;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  /**
   * Reveal on scroll
   */
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  /**
   * Animated stats counter
   */
  const animateCounter = (element) => {
    const target = Number(element.dataset.target) || 0;
    const duration = 1500;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  statNumbers.forEach((stat) => {
    statsObserver.observe(stat);
  });

  /**
   * FAQ accordion
   */
  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faq) => {
        faq.classList.remove("active");
        faq.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        faq.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        button.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  /**
   * Package filtering
   */
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      packageCards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = filter === "all" || filter === category;

        card.classList.toggle("hidden", !shouldShow);
      });
    });
  });

  /**
   * Back to top button
   */
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  /**
   * Subtle parallax effect for hero background
   */
  const heroSection = document.querySelector(".hero");

  const handleParallax = () => {
    if (!heroSection || window.innerWidth < 900) return;

    const offset = window.scrollY * 0.25;
    heroSection.style.backgroundPosition = `center calc(50% + ${offset}px)`;
  };

  window.addEventListener("scroll", handleParallax, { passive: true });
});

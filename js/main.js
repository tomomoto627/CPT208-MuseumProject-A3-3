const revealItems = document.querySelectorAll(".reveal");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );

      revealItems.forEach((item) => observer.observe(item));

      const subNav = document.getElementById("sub-nav");
      const subNavList = document.getElementById("sub-nav-list");
      const topNavShell = document.querySelector(".top-nav-shell");
      const topNavLinks = document.querySelectorAll(
        ".top-nav-link[data-subnav]",
      );
      const mobileNavMedia = window.matchMedia("(max-width: 700px)");
      const isCoarsePointer = window.matchMedia("(hover: none)").matches;
      let closeSubNavTimer;
      let selectedSubHref = "";

      const subNavColumns = [
        {
          title: "DISCOVER",
          items: [
            { label: "The Way", href: "#the-why" },
            { label: "The Gap", href: "#the-gap" },
            { label: "The Stakeholders", href: "#the-stakeholders" },
          ],
        },
        {
          title: "DEFINE",
          items: [
            { label: "User Journey Map", href: "#user-journey-map" },
            { label: "Requirements List", href: "#requirements-list" },
            { label: "Evidence of Life", href: "#evidence-of-life" },
          ],
        },
        {
          title: "IDEATE",
          items: [
            { label: "The Crazy Eights", href: "#crazy-eights" },
            { label: "Design Alternatives", href: "#design-alternatives" },
            { label: "Low-Fi Prototype", href: "#low-fi-prototype" },
          ],
        },
        {
          title: "BUILD",
          items: [
            { label: "System Architecture", href: "#system-architecture" },
            { label: "High-Fi Prototype", href: "#high-fi-prototype" },
            {
              label: "Individual Contributions",
              href: "#individual-contributions",
            },
            {
              label: "AI-assisted Development",
              href: "#ai-assisted-development",
            },
          ],
        },
        {
          title: "EVALUATE",
          items: [
            { label: "Usability Testing", href: "#usability-testing" },
            { label: "Iterative Refinement", href: "#iterative-refinement" },
            { label: "Final Reflection", href: "#final-reflection" },
          ],
        },
      ];

      function renderSubNav() {
        subNavList.innerHTML = subNavColumns
          .map(
            (column) =>
              `<div class="sub-nav-col"><p class="sub-nav-col-title">${column.title}</p>${column.items
                .map(
                  (item) =>
                    `<a href="${item.href}"${
                      item.href === selectedSubHref
                        ? ' class="is-selected"'
                        : ""
                    }><span class="sub-nav-label">${item.label}</span><span class="sub-nav-link-icon" aria-hidden="true"></span></a>`,
                )
                .join("")}</div>`,
          )
          .join("");
      }

      function openSubNav(triggerEl) {
        clearTimeout(closeSubNavTimer);
        renderSubNav();
        topNavShell.classList.add("framework-open");
        subNav.classList.add("show");
      }

      function closeSubNav() {
        closeSubNavTimer = setTimeout(() => {
          topNavShell.classList.remove("framework-open");
          subNav.classList.remove("show");
        }, 120);
      }

      function closeSubNavImmediately() {
        clearTimeout(closeSubNavTimer);
        topNavShell.classList.remove("framework-open");
        subNav.classList.remove("show");
      }

      function isMobileViewport() {
        return mobileNavMedia.matches;
      }

      renderSubNav();

      topNavLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          if (isMobileViewport()) return;
          openSubNav(link);
        });
        link.addEventListener("focus", () => {
          if (isMobileViewport()) return;
          openSubNav(link);
        });
        link.addEventListener("click", (event) => {
          if (isMobileViewport()) {
            event.preventDefault();
            if (subNav.classList.contains("show")) {
              closeSubNavImmediately();
            } else {
              openSubNav(link);
            }
            return;
          }
          if (isCoarsePointer && !subNav.classList.contains("show")) {
            event.preventDefault();
            openSubNav(link);
          }
        });
      });

      const topNav = document.querySelector(".top-nav");
      topNav.addEventListener("mouseleave", closeSubNav);
      topNav.addEventListener("mouseenter", () =>
        clearTimeout(closeSubNavTimer),
      );
      subNav.addEventListener("mouseleave", closeSubNav);
      subNav.addEventListener("mouseenter", () =>
        clearTimeout(closeSubNavTimer),
      );
      subNavList.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (link) {
          selectedSubHref = link.getAttribute("href") || "";
          subNavList
            .querySelectorAll("a")
            .forEach((node) => node.classList.remove("is-selected"));
          link.classList.add("is-selected");
        }
        closeSubNavImmediately();
      });
      document.addEventListener("scroll", () => {
        if (!subNav.classList.contains("show")) return;
        if (isMobileViewport()) {
          closeSubNavImmediately();
          return;
        }
        if (!isCoarsePointer) closeSubNav();
      });
      document.addEventListener("click", (event) => {
        if (!isMobileViewport() || !subNav.classList.contains("show")) return;
        if (!subNav.contains(event.target) && !topNav.contains(event.target)) {
          closeSubNavImmediately();
        }
      });
      mobileNavMedia.addEventListener("change", () => closeSubNavImmediately());

      const lightbox = document.getElementById("image-lightbox");
      const lightboxImg = document.getElementById("image-lightbox-img");
      const lightboxClose = document.getElementById("image-lightbox-close");
      const previewImages = document.querySelectorAll(
        ".evidence-item img, .lowfi-item img",
      );

      function closeLightbox() {
        lightbox.classList.remove("show");
        lightboxImg.src = "";
        document.body.style.overflow = "";
      }

      previewImages.forEach((img) => {
        img.addEventListener("click", () => {
          lightboxImg.src = img.src;
          lightbox.classList.add("show");
          document.body.style.overflow = "hidden";
        });
      });

      lightboxClose.addEventListener("click", closeLightbox);

      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("show")) {
          closeLightbox();
        }
      });

      const journeyTabs = document.querySelectorAll("[data-journey-tab]");
      const journeyPanes = document.querySelectorAll("[data-journey-pane]");

      if (journeyTabs.length && journeyPanes.length) {
        function switchJourney(target) {
          journeyTabs.forEach((tab) => {
            const isActive = tab.getAttribute("data-journey-tab") === target;
            tab.classList.toggle("is-active", isActive);
            tab.setAttribute("aria-selected", isActive ? "true" : "false");
          });

          journeyPanes.forEach((pane) => {
            const isMatch = pane.getAttribute("data-journey-pane") === target;
            pane.classList.toggle("is-hidden", !isMatch);
          });
        }

        journeyTabs.forEach((tab) => {
          tab.addEventListener("click", () => {
            const target = tab.getAttribute("data-journey-tab");
            if (target) switchJourney(target);
          });
        });

        if (window.location.hash === "#user-journey-map-2") {
          switchJourney("jeanette");
        }
      }

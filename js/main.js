(function () {
  const content = window.PASTA_CONTENT;
  const pageId = document.body.dataset.page;
  const STORAGE_KEY = "pastaoner-language";
  let currentLang = window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "cs";

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (!element) return;
    const hasValue = value !== undefined && value !== null && value !== "";
    element.hidden = !hasValue;
    if (hasValue) element.textContent = value;
  }

  function localize(value, language = currentLang) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      (Object.prototype.hasOwnProperty.call(value, "cs") || Object.prototype.hasOwnProperty.call(value, "en"))
    ) {
      return value[language] ?? value.cs ?? value.en ?? "";
    }

    return value;
  }

  function setLocalizedText(selector, value) {
    setText(selector, localize(value));
  }

  function t(key) {
    return localize(content.ui?.[key]) || "";
  }

  function isExternalLink(href) {
    return /^(https?:)?\/\//.test(href);
  }

  function linkAttrs(href) {
    return isExternalLink(href) ? ' target="_blank" rel="noreferrer noopener"' : "";
  }

  function buildLink(href, label, className = "text-link") {
    return `<a class="${className}" href="${href}"${linkAttrs(href)}>${escapeHtml(localize(label))}</a>`;
  }

  function isActiveNavItem(itemId) {
    return itemId === pageId || (pageId === "interview" && itemId === "about") || (pageId === "available" && itemId === "works");
  }

  function renderSiteNav() {
    const navRoot = document.querySelector("[data-site-nav]");
    if (!navRoot) return;

    navRoot.innerHTML = content.site.nav
      .map((item, index) => {
        const activeClass = isActiveNavItem(item.id) ? " active" : "";
        const current = isActiveNavItem(item.id) ? ' aria-current="page"' : "";

        return `
          <li class="site-nav__item">
            <a class="menu-link${activeClass}" href="${item.href}"${current}>
              <span class="menu-link__index">${String(index + 1).padStart(2, "0")}</span>
              <span class="menu-link__label">${escapeHtml(localize(item.label))}</span>
              <span class="menu-link__hand menu-link__hand--hover" aria-hidden="true">
                <img src="assets/hand.png" alt="">
              </span>
              <span class="menu-link__hand menu-link__hand--current" aria-hidden="true">
                <img src="assets/handleftdown.png" alt="">
              </span>
            </a>
          </li>
        `;
      })
      .join("");
  }

  function renderFooter() {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) return;

    footer.innerHTML = `
      <div class="site-footer__inner">
        <a class="site-footer__email" href="mailto:${content.contact.email}">${escapeHtml(content.contact.email)}</a>
        <div class="site-footer__links">
          ${content.contact.social
            .map((item) => buildLink(item.href, item.label))
            .join("")}
        </div>
      </div>
    `;
  }

  function renderUiText() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-ui]").forEach((element) => {
      const value = t(element.dataset.ui);
      if (!value) return;
      element.textContent = value;
    });

    const menuToggle = document.querySelector("[data-menu-toggle]");
    if (menuToggle) menuToggle.setAttribute("aria-label", t("menu_open"));

    document.querySelectorAll("[data-menu-close]").forEach((button) => {
      button.setAttribute("aria-label", t("menu_close"));
    });
  }

  function renderHomePage() {
    if (!document.querySelector("[data-home-title]")) return;

    setLocalizedText("[data-home-kicker]", content.home.kicker);
    setLocalizedText("[data-home-title]", content.home.title);
    setLocalizedText("[data-home-copy]", content.home.copy);
    setLocalizedText("[data-home-note]", content.home.note);

    const links = document.querySelector("[data-home-links]");
    if (!links) return;

    links.innerHTML = content.home.links
      .map(
        (item, index) => `
          <a class="home-route home-route--tone-${(index % 4) + 1}" href="${item.href}">
            <span class="home-route__index">${escapeHtml(item.index)}</span>
            <span class="home-route__title">${escapeHtml(localize(item.title))}</span>
            <span class="home-route__cta">${escapeHtml(t("open"))}</span>
          </a>
        `
      )
      .join("");
  }

  function renderWorksPage() {
    if (!document.querySelector("[data-works-title]")) return;

    const page = content.pages.works;
    setLocalizedText("[data-works-kicker]", page.kicker);
    setLocalizedText("[data-works-title]", page.title);
    setLocalizedText("[data-works-copy]", page.copy);
    setLocalizedText("[data-artworks-note]", content.artworks.note);

    const list = document.querySelector("[data-artworks-list]");
    if (!list) return;

    list.innerHTML = content.artworks.items
      .map(
        (item) => {
          const targetHref = item.ctaHref
            ? `${item.ctaHref}${item.category ? `?category=${encodeURIComponent(item.category)}` : ""}#available-grid`
            : "";

          return `
          <a class="artwork-card artwork-card--link" href="${targetHref}">
            <div class="artwork-card__image">
              <img src="${item.image}" alt="${escapeHtml(localize(item.alt || item.title))}">
            </div>
            <div class="artwork-card__body">
              <div class="artwork-card__meta">
                <span class="artwork-card__index">${escapeHtml(item.year)}</span>
                ${item.status ? `<span class="status-pill">${escapeHtml(localize(item.status))}</span>` : ""}
              </div>
              <h2 class="artwork-card__title">${escapeHtml(localize(item.title))}</h2>
              ${item.medium ? `<p class="artwork-card__medium">${escapeHtml(localize(item.medium))}</p>` : ""}
              ${item.ctaLabel ? `<span class="artwork-card__link">${escapeHtml(localize(item.ctaLabel))}</span>` : ""}
            </div>
          </a>
        `;
        }
      )
      .join("");
  }

  function renderAvailablePage() {
    if (!document.querySelector("[data-available-title]")) return;

    const selection = content.artworks.selection;
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const currentCategory = content.artworks.items.find((item) => item.category === category);
    const filteredItems = currentCategory
      ? selection.items.filter((item) => item.category === category)
      : selection.items;
    const items = filteredItems.length ? filteredItems : selection.items;

    setLocalizedText("[data-available-kicker]", currentCategory ? "" : selection.kicker);
    setLocalizedText("[data-available-title]", currentCategory ? currentCategory.title : selection.title);
    setLocalizedText("[data-available-copy]", currentCategory ? "" : selection.copy);

    const grid = document.querySelector("[data-available-grid]");
    if (!grid) return;

    grid.innerHTML = items
      .map(
        (item) => `
          <article class="available-card">
            <div class="available-card__image">
              <img src="${item.image}" alt="${escapeHtml(localize(item.title))}">
            </div>
            <div class="available-card__body">
              <div class="available-card__meta">
                <span class="available-card__code">${escapeHtml(item.code)}</span>
                <span class="status-pill">${escapeHtml(localize(item.status))}</span>
              </div>
              <h2 class="available-card__title">${escapeHtml(localize(item.title))}</h2>
              <p class="available-card__type">${escapeHtml(localize(item.type))}</p>
              <p class="available-card__size">${escapeHtml(item.size)}</p>
              ${buildLink(`mailto:${content.contact.email}?subject=${encodeURIComponent(`Artwork inquiry - ${localize(item.title, "en")}`)}`, { cs: "Poslat poptavku", en: "Send inquiry" }, "available-card__link")}
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderTimeline(target, groups) {
    if (!target) return;

    target.innerHTML = groups
      .map(
        (group) => `
          <section class="timeline-group">
            <h3 class="timeline-group__year">${escapeHtml(group.year)}</h3>
            <ul class="timeline-group__items">
              ${group.items.map((item) => `<li>${escapeHtml(localize(item))}</li>`).join("")}
            </ul>
          </section>
        `
      )
      .join("");
  }

  function renderExhibitionsPage() {
    if (!document.querySelector("[data-exhibitions-featured]")) return;

    const page = content.pages.exhibitions;
    setLocalizedText("[data-exhibitions-kicker]", page.kicker);
    setLocalizedText("[data-exhibitions-title]", page.title);
    setLocalizedText("[data-exhibitions-copy]", page.copy);
    setLocalizedText("[data-exhibitions-current-title]", content.currentExhibition.title);
    setLocalizedText("[data-exhibitions-current-dates]", content.currentExhibition.dates);
    setLocalizedText("[data-exhibitions-current-venue]", content.currentExhibition.venue);
    setLocalizedText("[data-exhibitions-current-note]", content.currentExhibition.note);

    const featured = document.querySelector("[data-exhibitions-featured]");
    if (featured) {
      featured.innerHTML = content.featuredExhibitions
        .filter((item) => localize(item.status, "en") !== "Current")
        .map(
          (item) => `
            <details class="exhibition-item">
              <summary class="exhibition-item__summary">
                <span class="exhibition-item__status">${escapeHtml(localize(item.status))}</span>
                <div class="exhibition-item__headline">
                  <h2 class="exhibition-item__title">${escapeHtml(localize(item.title))}</h2>
                  <p>${escapeHtml(localize(item.venue))}</p>
                  <p>${escapeHtml(localize(item.dates))}</p>
                </div>
                <span class="exhibition-item__toggle">${escapeHtml(t("view_details"))}</span>
              </summary>
              <div class="exhibition-item__body">
                ${item.excerpt ? `<p class="body-copy body-copy--compact">${escapeHtml(localize(item.excerpt))}</p>` : ""}
                <div class="exhibition-gallery">
                  ${item.gallery
                    .map(
                      (image) => `
                        <figure class="exhibition-gallery__item">
                          <img src="${image.src}" alt="${escapeHtml(image.alt)}">
                        </figure>
                      `
                    )
                    .join("")}
                </div>
                ${buildLink(item.linkHref, item.linkLabel)}
              </div>
            </details>
          `
        )
        .join("");
    }

    const collections = document.querySelector("[data-collections-list]");
    if (collections) {
      collections.innerHTML = content.collections
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");
    }

    renderTimeline(document.querySelector("[data-solo-list]"), content.exhibitions.solo);
    renderTimeline(document.querySelector("[data-group-list]"), content.exhibitions.group);
    renderTimeline(document.querySelector("[data-public-list]"), content.exhibitions.publicSpace);
  }

  function renderInterviewPage() {
    if (!document.querySelector("[data-interview-title]")) return;

    const page = content.pages.interview;
    setLocalizedText("[data-interview-kicker]", page.kicker);
    setLocalizedText("[data-interview-title]", page.title);
    setLocalizedText("[data-interview-copy]", page.copy);
    const questionLabel = localize(content.interview.questionLabel) || "Interviewer";
    const answerLabel = localize(content.interview.answerLabel) || "Pasta Oner";

    const list = document.querySelector("[data-interview-list]");
    if (!list) return;

    list.innerHTML = content.interview.qa
      .map(
        (item, index) => `
          <article class="qa-thread">
            <div class="speech-bubble speech-bubble--question">
              <span class="speech-bubble__label">${escapeHtml(questionLabel)}</span>
              <p class="speech-bubble__text">${escapeHtml(localize(item.question))}</p>
            </div>
            <div class="speech-bubble speech-bubble--answer${index % 2 === 0 ? "" : " speech-bubble--answer-alt"}">
              <span class="speech-bubble__label">${escapeHtml(answerLabel)}</span>
              ${localize(item.answer)
                .map((paragraph) => `<p class="body-copy body-copy--muted">${escapeHtml(paragraph)}</p>`)
                .join("")}
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderBio(language) {
    const copy = document.querySelector("[data-bio-copy]");
    if (!copy) return;

    copy.innerHTML = localize(content.about.paragraphs, language)
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");
  }

  function renderAboutPage() {
    if (!document.querySelector("[data-about-title]")) return;

    const page = content.pages.about;
    setLocalizedText("[data-about-kicker]", page.kicker);
    setLocalizedText("[data-about-title]", page.title);
    setLocalizedText("[data-about-interview-title]", content.interviewTeaser.title);
    setLocalizedText("[data-about-interview-copy]", content.interviewTeaser.text);
    renderBio(currentLang);
  }

  function renderContactPage() {
    if (!document.querySelector("[data-contact-title]")) return;

    const page = content.pages.contact;
    setLocalizedText("[data-contact-kicker]", page.kicker);
    setLocalizedText("[data-contact-title]", page.title);
    const contactCopy = document.querySelector("[data-contact-copy]");
    if (contactCopy) {
      contactCopy.innerHTML = "";
      contactCopy.hidden = true;
    }

    const primary = document.querySelector("[data-contact-primary]");
    if (primary) {
      primary.innerHTML = `
        <span class="section-kicker">${escapeHtml(t("direct_contact"))}</span>
        <p>${buildLink(content.contact.phoneHref, content.contact.phoneDisplay, "info-link")}</p>
      `;
    }

    const social = document.querySelector("[data-contact-social]");
    if (social) {
      social.innerHTML = "";
    }

    const legal = document.querySelector("[data-contact-legal]");
    if (legal) {
      legal.innerHTML = `
        <span class="section-kicker">${escapeHtml(t("legal"))}</span>
        <h2 class="info-block__title info-block__title--legal">Emerging Art a.s.</h2>
        ${localize(content.contact.legal).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
      `;
    }
  }

  function syncLanguageButtons() {
    document.querySelectorAll("[data-set-lang]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.setLang === currentLang);
    });
  }

  function renderPage() {
    renderUiText();
    renderSiteNav();
    renderFooter();
    initPage();
    syncLanguageButtons();
  }

  function setLanguage(language) {
    currentLang = language === "en" ? "en" : "cs";
    window.localStorage.setItem(STORAGE_KEY, currentLang);
    renderPage();
  }

  function setupLanguageSwitch() {
    document.querySelectorAll("[data-set-lang]").forEach((button) => {
      button.addEventListener("click", () => setLanguage(button.dataset.setLang));
    });
  }

  function setupMenu() {
    const panel = document.querySelector("[data-menu-panel]");
    const toggle = document.querySelector("[data-menu-toggle]");
    if (!panel || !toggle) return;

    const closeMenu = () => {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
    };

    const openMenu = () => {
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
    };

    toggle.addEventListener("click", () => {
      if (document.body.classList.contains("menu-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.querySelectorAll("[data-menu-close]").forEach((button) => {
      button.addEventListener("click", closeMenu);
    });

    panel.addEventListener("click", (event) => {
      if (event.target.closest("[data-site-nav] a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  function initPage() {
    renderHomePage();
    renderWorksPage();
    renderAvailablePage();
    renderExhibitionsPage();
    renderInterviewPage();
    renderAboutPage();
    renderContactPage();
  }

  renderPage();
  setupLanguageSwitch();
  setupMenu();
})();

(function () {
  const content = window.PASTA_CONTENT;

  const navList = document.querySelector("[data-nav-list]");
  const heroEyebrow = document.querySelector("[data-hero-eyebrow]");
  const heroTitle = document.querySelector("[data-hero-title]");
  const heroCopy = document.querySelector("[data-hero-copy]");
  const heroStats = document.querySelector("[data-hero-stats]");
  const collectionsStrip = document.querySelector("[data-collections-strip]");
  const collectionsList = document.querySelector("[data-collections-list]");
  const worksGrid = document.querySelector("[data-works-grid]");
  const interviewGrid = document.querySelector("[data-interview-grid]");
  const interviewIntro = document.querySelector("[data-interview-intro]");
  const bioTitle = document.querySelector("[data-bio-title]");
  const bioCopy = document.querySelector("[data-bio-copy]");
  const contactCopy = document.querySelector("[data-contact-copy]");
  const contactEmail = document.querySelector("[data-contact-email]");
  const contactPhone = document.querySelector("[data-contact-phone]");
  const socialLinks = document.querySelector("[data-social-links]");
  const soloList = document.querySelector("[data-solo-list]");
  const groupList = document.querySelector("[data-group-list]");
  const publicList = document.querySelector("[data-public-list]");
  const preview = document.querySelector("[data-menu-preview]");
  const previewImage = preview?.querySelector(".menu-preview__image");
  const previewLabel = preview?.querySelector(".menu-preview__label");
  const previewEyebrow = preview?.querySelector(".menu-preview__eyebrow");
  const modalElement = document.getElementById("detailModal");
  const modal = modalElement ? new bootstrap.Modal(modalElement) : null;

  const modalKicker = modalElement?.querySelector("[data-modal-kicker]");
  const modalTitle = modalElement?.querySelector("[data-modal-title]");
  const modalMedia = modalElement?.querySelector("[data-modal-media]");
  const modalCopy = modalElement?.querySelector("[data-modal-copy]");
  const modalLink = modalElement?.querySelector("[data-modal-link]");

  let activeLanguage = "cs";

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function renderNavigation() {
    navList.innerHTML = content.menu
      .map(
        (item) => `
          <li class="nav-item">
            <a
              class="nav-link"
              href="${item.href}"
              data-preview-image="${item.preview}"
              data-preview-label="${escapeHtml(item.label)}"
            >${item.label}</a>
          </li>
        `
      )
      .join("");
  }

  function renderHero() {
    heroEyebrow.textContent = content.hero.eyebrow;
    heroTitle.textContent = content.hero.title;
    heroCopy.textContent = content.hero.copy;
    heroStats.innerHTML = content.hero.stats
      .map(
        (stat) => `
          <div class="col-sm-4">
            <div class="stat-card">
              <span class="stat-card__value">${stat.value}</span>
              <span class="stat-card__label">${stat.label}</span>
            </div>
          </div>
        `
      )
      .join("");
  }

  function renderCollections() {
    const stripItems = [...content.collections, ...content.collections]
      .map((collection) => `<span class="collections-strip__item">${collection}</span>`)
      .join("");
    collectionsStrip.innerHTML = stripItems;

    collectionsList.innerHTML = content.collections
      .map((collection) => `<li>${collection}</li>`)
      .join("");
  }

  function renderWorks() {
    worksGrid.innerHTML = content.selectedWorks
      .map(
        (work, index) => `
          <div class="col-md-6 col-xl-4">
            <article class="work-card">
              <div class="pop-panel">
                <button class="work-card__button" type="button" data-detail-type="work" data-detail-index="${index}">
                  <div class="work-card__media">
                    <img src="${work.image}" alt="${escapeHtml(work.title)}">
                    <span class="work-card__badge">selected work</span>
                    <img class="work-card__sticker" src="${work.sticker}" alt="">
                  </div>
                  <div class="work-card__content">
                    <div class="work-card__meta">${work.year} / source crawl</div>
                    <h3 class="work-card__title">${work.title}</h3>
                    <p class="work-card__venue">${work.venue}<br>${work.dates}</p>
                  </div>
                </button>
              </div>
            </article>
          </div>
        `
      )
      .join("");
  }

  function renderTimeline(target, groups) {
    target.innerHTML = groups
      .map(
        (group) => `
          <section class="timeline-group">
            <h3 class="timeline-group__year">${group.year}</h3>
            <ul class="timeline-group__items">
              ${group.items.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </section>
        `
      )
      .join("");
  }

  function renderInterview() {
    interviewIntro.textContent = content.interview.intro;
    interviewGrid.innerHTML = content.interview.themes
      .map(
        (theme, index) => `
          <div class="col-md-6 col-xl-4">
            <article class="interview-card">
              <button class="interview-card__button" type="button" data-detail-type="theme" data-detail-index="${index}">
                <div class="interview-card__surface pop-panel">
                  <span class="eyebrow eyebrow--small">${theme.kicker}</span>
                  <h3 class="interview-card__title">${theme.title}</h3>
                  <p class="interview-card__excerpt">${theme.excerpt}</p>
                </div>
              </button>
            </article>
          </div>
        `
      )
      .join("");
  }

  function renderBio(language) {
    activeLanguage = language;
    bioTitle.textContent = content.about.title;
    bioCopy.innerHTML = content.about[language]
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");

    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.langToggle === language);
    });
  }

  function renderContact() {
    contactCopy.textContent = content.contact.copy;
    contactEmail.href = `mailto:${content.contact.email}`;
    contactEmail.textContent = content.contact.email;
    contactPhone.href = content.contact.phoneHref;
    contactPhone.textContent = content.contact.phoneDisplay;
    socialLinks.innerHTML = content.contact.social
      .map(
        (item) => `
          <li>
            <a href="${item.href}" target="_blank" rel="noreferrer noopener">${item.label}</a>
          </li>
        `
      )
      .join("");
  }

  function openWorkModal(index) {
    const work = content.selectedWorks[index];
    modalKicker.textContent = `Selected work / ${work.year}`;
    modalTitle.textContent = work.title;
    modalMedia.innerHTML = `<img src="${work.image}" alt="${escapeHtml(work.title)}">`;
    modalCopy.innerHTML = `
      <p><strong>Venue:</strong> ${work.venue}</p>
      <p><strong>Dates:</strong> ${work.dates}</p>
      <p>
        This card uses the local <code>art.jpeg</code> image as a placeholder while the final
        project gathers a dedicated image set for each series or exhibition.
      </p>
    `;
    modalLink.href = work.sourceUrl;
    modalLink.textContent = "Open source page";
    modal.show();
  }

  function openThemeModal(index) {
    const theme = content.interview.themes[index];
    modalKicker.textContent = theme.kicker;
    modalTitle.textContent = theme.title;
    modalMedia.innerHTML = `<img src="${theme.image}" alt="">`;
    modalCopy.innerHTML = [
      `<p>${theme.excerpt}</p>`,
      ...theme.detail.map((paragraph) => `<p>${paragraph}</p>`)
    ].join("");
    modalLink.href = theme.sourceUrl;
    modalLink.textContent = "Open original interview";
    modal.show();
  }

  function setupDetailTriggers() {
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-detail-type]");
      if (!trigger) return;

      const index = Number(trigger.dataset.detailIndex);
      const type = trigger.dataset.detailType;

      if (Number.isNaN(index) || !modal) return;

      if (type === "work") {
        openWorkModal(index);
      }

      if (type === "theme") {
        openThemeModal(index);
      }
    });
  }

  function setupLanguageSwitch() {
    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.addEventListener("click", () => renderBio(button.dataset.langToggle));
    });
  }

  function setupMenuPreview() {
    if (!preview) return;

    document.querySelectorAll("[data-preview-image]").forEach((link) => {
      const activate = () => {
        preview.classList.remove("is-muted");
        previewImage.src = link.dataset.previewImage;
        previewLabel.textContent = link.dataset.previewLabel;
        previewEyebrow.textContent = "Menu preview";
      };

      const deactivate = () => {
        preview.classList.add("is-muted");
        previewImage.src = "assets/egg.png";
        previewLabel.textContent = content.meta.artist;
        previewEyebrow.textContent = "Hover signal";
      };

      link.addEventListener("mouseenter", activate);
      link.addEventListener("focus", activate);
      link.addEventListener("mouseleave", deactivate);
      link.addEventListener("blur", deactivate);
    });
  }

  function setupHeroParallax() {
    const root = document.querySelector("[data-parallax-root]");
    if (!root) return;

    const elements = root.querySelectorAll("[data-depth]");

    root.addEventListener("pointermove", (event) => {
      const bounds = root.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      elements.forEach((element) => {
        const depth = Number(element.dataset.depth) || 0;
        element.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });

    root.addEventListener("pointerleave", () => {
      elements.forEach((element) => {
        element.style.transform = "";
      });
    });
  }

  function init() {
    renderNavigation();
    renderHero();
    renderCollections();
    renderWorks();
    renderTimeline(soloList, content.exhibitions.solo);
    renderTimeline(groupList, content.exhibitions.group);
    renderTimeline(publicList, content.exhibitions.publicSpace);
    renderInterview();
    renderBio(activeLanguage);
    renderContact();
    setupDetailTriggers();
    setupLanguageSwitch();
    setupMenuPreview();
    setupHeroParallax();
  }

  init();
})();

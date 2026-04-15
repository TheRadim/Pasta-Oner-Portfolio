(function () {
  const content = window.PASTA_CONTENT;
  const pageId = document.body.dataset.page;

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function renderSiteNav() {
    const navRoot = document.querySelector("[data-site-nav]");
    if (!navRoot) return;

    navRoot.innerHTML = content.site.nav
      .map((item) => {
        const activeClass = item.id === pageId ? " active" : "";
        const current = item.id === pageId ? ' aria-current="page"' : "";
        return `
          <li class="nav-item">
            <a class="nav-link${activeClass}" href="${item.href}"${current}>${item.label}</a>
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
        <p>${content.site.footerNote}</p>
        <div class="site-footer__links">
          ${content.contact.social
            .map(
              (item) =>
                `<a href="${item.href}" target="_blank" rel="noreferrer noopener">${item.label}</a>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderHomePage() {
    document.querySelector("[data-home-kicker]").textContent = content.home.kicker;
    document.querySelector("[data-home-title]").textContent = content.home.title;
    document.querySelector("[data-home-copy]").textContent = content.home.copy;
    document.querySelector("[data-home-quote]").textContent = content.home.quote;

    const links = document.querySelector("[data-home-links]");
    links.innerHTML = content.home.links
      .map(
        (item) => `
          <div class="col-md-6">
            <a class="page-link-card page-frame" href="${item.href}">
              <span class="page-link-card__label">Section</span>
              <h3 class="page-link-card__title">${item.title}</h3>
              <p class="page-link-card__text">${item.text}</p>
            </a>
          </div>
        `
      )
      .join("");

    const works = document.querySelector("[data-home-works]");
    works.innerHTML = content.home.featuredWorkIndexes
      .map((index) => content.selectedWorks[index])
      .map(
        (work) => `
          <article class="compact-work">
            <div class="compact-work__year">${work.year}</div>
            <div class="compact-work__body">
              <h3>${work.title}</h3>
              <p>${work.venue}</p>
              <p>${work.dates}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderWorksPage() {
    const page = content.pages.works;
    document.querySelector("[data-works-kicker]").textContent = page.kicker;
    document.querySelector("[data-works-title]").textContent = page.title;
    document.querySelector("[data-works-copy]").textContent = page.copy;

    const feature = document.querySelector("[data-works-feature]");
    const latest = content.selectedWorks[0];
    feature.innerHTML = `
      <div class="feature-frame__label">Current lead</div>
      <div class="feature-frame__content">
        <div>
          <h2 class="section-title">${latest.title}</h2>
          <p class="body-copy">${latest.venue}</p>
          <p class="body-copy body-copy--muted">${latest.dates}</p>
        </div>
        <a class="text-link" href="${latest.sourceUrl}" target="_blank" rel="noreferrer noopener">Open source page</a>
      </div>
    `;

    const list = document.querySelector("[data-works-list]");
    list.innerHTML = content.selectedWorks
      .map(
        (work) => `
          <article class="archive-row">
            <div class="archive-row__year">${work.year}</div>
            <div class="archive-row__main">
              <h3>${work.title}</h3>
              <p>${work.venue}</p>
            </div>
            <div class="archive-row__dates">${work.dates}</div>
            <div class="archive-row__link">
              <a href="${work.sourceUrl}" target="_blank" rel="noreferrer noopener">Source</a>
            </div>
          </article>
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
              ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </section>
        `
      )
      .join("");
  }

  function renderExhibitionsPage() {
    const page = content.pages.exhibitions;
    document.querySelector("[data-exhibitions-kicker]").textContent = page.kicker;
    document.querySelector("[data-exhibitions-title]").textContent = page.title;
    document.querySelector("[data-exhibitions-copy]").textContent = page.copy;

    document.querySelector("[data-collections-list]").innerHTML = content.collections
      .map((item) => `<li>${item}</li>`)
      .join("");

    renderTimeline(document.querySelector("[data-solo-list]"), content.exhibitions.solo);
    renderTimeline(document.querySelector("[data-group-list]"), content.exhibitions.group);
    renderTimeline(document.querySelector("[data-public-list]"), content.exhibitions.publicSpace);
  }

  function renderInterviewPage() {
    const page = content.pages.interview;
    document.querySelector("[data-interview-kicker]").textContent = page.kicker;
    document.querySelector("[data-interview-title]").textContent = page.title;
    document.querySelector("[data-interview-copy]").textContent = page.copy;
    document.querySelector("[data-interview-quote]").textContent = content.interview.leadQuote;

    document.querySelector("[data-interview-list]").innerHTML = content.interview.themes
      .map(
        (theme) => `
          <article class="essay-card page-frame">
            <span class="essay-card__kicker">${theme.kicker}</span>
            <h2 class="essay-card__title">${theme.title}</h2>
            <p class="body-copy">${theme.excerpt}</p>
            ${theme.detail.map((paragraph) => `<p class="body-copy body-copy--muted">${paragraph}</p>`).join("")}
          </article>
        `
      )
      .join("");
  }

  function renderBio(language) {
    const title = document.querySelector("[data-bio-title]");
    const copy = document.querySelector("[data-bio-copy]");
    if (!title || !copy) return;

    title.textContent = content.about.title;
    copy.innerHTML = content.about[language]
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");

    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.langToggle === language);
    });
  }

  function renderAboutPage() {
    const page = content.pages.about;
    document.querySelector("[data-about-kicker]").textContent = page.kicker;
    document.querySelector("[data-about-title]").textContent = page.title;
    document.querySelector("[data-about-copy]").textContent = page.copy;
    renderBio("cs");

    document.querySelector("[data-about-points]").innerHTML = content.practicePoints
      .map(
        (point) => `
          <article class="practice-item">
            <p>${point}</p>
          </article>
        `
      )
      .join("");
  }

  function renderContactPage() {
    const page = content.pages.contact;
    document.querySelector("[data-contact-kicker]").textContent = page.kicker;
    document.querySelector("[data-contact-title]").textContent = page.title;
    document.querySelector("[data-contact-copy]").textContent = page.copy;

    document.querySelector("[data-contact-primary]").innerHTML = `
      <span class="section-kicker">Primary</span>
      <h2 class="section-title">Inquiries</h2>
      <p class="body-copy"><a href="mailto:${content.contact.email}">${content.contact.email}</a></p>
      <p class="body-copy"><a href="${content.contact.phoneHref}">${content.contact.phoneDisplay}</a></p>
    `;

    document.querySelector("[data-contact-social]").innerHTML = `
      <span class="section-kicker">Social</span>
      <h2 class="section-title">Channels</h2>
      <div class="stack-links">
        ${content.contact.social
          .map(
            (item) =>
              `<a href="${item.href}" target="_blank" rel="noreferrer noopener">${item.label}</a>`
          )
          .join("")}
      </div>
    `;

    document.querySelector("[data-contact-legal]").innerHTML = `
      <span class="section-kicker">Legal</span>
      <h2 class="section-title">Source note</h2>
      <div class="body-copy body-copy--muted">
        ${content.contact.legal.map((line) => `<p>${line}</p>`).join("")}
      </div>
    `;
  }

  function setupLanguageSwitch() {
    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.addEventListener("click", () => renderBio(button.dataset.langToggle));
    });
  }

  function initPage() {
    if (pageId === "home") renderHomePage();
    if (pageId === "works") renderWorksPage();
    if (pageId === "exhibitions") renderExhibitionsPage();
    if (pageId === "interview") renderInterviewPage();
    if (pageId === "about") renderAboutPage();
    if (pageId === "contact") renderContactPage();
  }

  renderSiteNav();
  renderFooter();
  initPage();
  setupLanguageSwitch();
})();

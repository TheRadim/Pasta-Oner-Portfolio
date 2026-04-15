(function () {
  const content = window.PASTA_CONTENT;
  const pageId = document.body.dataset.page;

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

  function isExternalLink(href) {
    return /^(https?:)?\/\//.test(href);
  }

  function linkAttrs(href) {
    return isExternalLink(href) ? ' target="_blank" rel="noreferrer noopener"' : "";
  }

  function buildLink(href, label, className = "text-link") {
    return `<a class="${className}" href="${href}"${linkAttrs(href)}>${escapeHtml(label)}</a>`;
  }

  function isActiveNavItem(itemId) {
    return itemId === pageId || (pageId === "interview" && itemId === "about");
  }

  function renderSiteNav() {
    const navRoot = document.querySelector("[data-site-nav]");
    if (!navRoot) return;

    navRoot.innerHTML = content.site.nav
      .map((item, index) => {
        const activeClass = isActiveNavItem(item.id) ? " active" : "";
        const current = isActiveNavItem(item.id) ? ' aria-current="page"' : "";
        const handClass = index % 2 === 0 ? "" : " nav-link__hand--alt";

        return `
          <li class="nav-item">
            <a class="nav-link${activeClass}" href="${item.href}"${current}>
              <span class="nav-link__label">${escapeHtml(item.label)}</span>
              <span class="nav-link__hand${handClass}" aria-hidden="true">
                <img src="${item.hand}" alt="">
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
        ${content.site.footerNote ? `<p>${escapeHtml(content.site.footerNote)}</p>` : ""}
        <div class="site-footer__links">
          ${content.contact.social
            .map((item) => buildLink(item.href, item.label))
            .join("")}
        </div>
      </div>
    `;
  }

  function renderHomePage() {
    if (!document.querySelector("[data-home-title]")) return;

    setText("[data-home-kicker]", content.home.kicker);
    setText("[data-home-title]", content.home.title);
    setText("[data-home-copy]", content.home.copy);
    setText("[data-home-note]", content.home.note);
    setText("[data-home-current-title]", content.currentExhibition.title);
    setText("[data-home-current-dates]", content.currentExhibition.dates);
    setText("[data-home-current-venue]", content.currentExhibition.venue);
    setText("[data-home-current-copy]", content.currentExhibition.blurb);

    const links = document.querySelector("[data-home-links]");
    if (!links) return;

    links.innerHTML = content.home.links
      .map(
        (item) => `
          <a class="section-link" href="${item.href}">
            <span class="section-link__index">${escapeHtml(item.index)}</span>
            <h2 class="section-link__title">${escapeHtml(item.title)}</h2>
            ${item.text ? `<p class="section-link__text">${escapeHtml(item.text)}</p>` : ""}
            <span class="section-link__arrow">Open</span>
          </a>
        `
      )
      .join("");
  }

  function renderWorksPage() {
    if (!document.querySelector("[data-works-title]")) return;

    const page = content.pages.works;
    setText("[data-works-kicker]", page.kicker);
    setText("[data-works-title]", page.title);
    setText("[data-works-copy]", page.copy);
    setText("[data-artworks-note]", content.artworks.note);

    const list = document.querySelector("[data-artworks-list]");
    if (!list) return;

    list.innerHTML = content.artworks.items
      .map(
        (item) => `
          <article class="artwork-item">
            <div class="artwork-item__year">${escapeHtml(item.year)}</div>
            <div class="artwork-item__main">
              <h2 class="artwork-item__title">${escapeHtml(item.title)}</h2>
              ${item.medium ? `<p class="artwork-item__medium">${escapeHtml(item.medium)}</p>` : ""}
              ${item.note ? `<p class="artwork-item__note">${escapeHtml(item.note)}</p>` : ""}
            </div>
            <div class="artwork-item__side">
              ${item.status ? `<span class="status-pill">${escapeHtml(item.status)}</span>` : ""}
              ${item.ctaHref && item.ctaLabel ? buildLink(item.ctaHref, item.ctaLabel) : ""}
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
              ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </section>
        `
      )
      .join("");
  }

  function renderExhibitionsPage() {
    if (!document.querySelector("[data-exhibitions-title]")) return;

    const page = content.pages.exhibitions;
    setText("[data-exhibitions-kicker]", page.kicker);
    setText("[data-exhibitions-title]", page.title);
    setText("[data-exhibitions-copy]", page.copy);
    setText("[data-exhibitions-current-title]", content.currentExhibition.title);
    setText("[data-exhibitions-current-dates]", content.currentExhibition.dates);
    setText("[data-exhibitions-current-venue]", content.currentExhibition.venue);
    setText("[data-exhibitions-current-note]", content.currentExhibition.note);

    const featured = document.querySelector("[data-exhibitions-featured]");
    if (featured) {
      featured.innerHTML = content.featuredExhibitions
        .map(
          (item) => `
            <details class="exhibition-item">
              <summary class="exhibition-item__summary">
                <span class="exhibition-item__status">${escapeHtml(item.status)}</span>
                <div class="exhibition-item__headline">
                  <h2 class="exhibition-item__title">${escapeHtml(item.title)}</h2>
                  <p>${escapeHtml(item.venue)}</p>
                  <p>${escapeHtml(item.dates)}</p>
                </div>
                <span class="exhibition-item__toggle">View details</span>
              </summary>
              <div class="exhibition-item__body">
                ${item.excerpt ? `<p class="body-copy body-copy--compact">${escapeHtml(item.excerpt)}</p>` : ""}
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
    setText("[data-interview-kicker]", page.kicker);
    setText("[data-interview-title]", page.title);
    setText("[data-interview-copy]", page.copy);
    setText("[data-interview-quote]", content.interview.leadQuote);
    const questionLabel = content.interview.questionLabel || "Interviewer";
    const answerLabel = content.interview.answerLabel || "Pasta Oner";

    const list = document.querySelector("[data-interview-list]");
    if (!list) return;

    list.innerHTML = content.interview.qa
      .map(
        (item, index) => `
          <article class="qa-thread">
            <div class="speech-bubble speech-bubble--question">
              <span class="speech-bubble__label">${escapeHtml(questionLabel)}</span>
              <p class="speech-bubble__text">${escapeHtml(item.question)}</p>
            </div>
            <div class="speech-bubble speech-bubble--answer${index % 2 === 0 ? "" : " speech-bubble--answer-alt"}">
              <span class="speech-bubble__label">${escapeHtml(answerLabel)}</span>
              ${item.answer
                .map((paragraph) => `<p class="body-copy body-copy--muted">${escapeHtml(paragraph)}</p>`)
                .join("")}
            </div>
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
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");

    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.langToggle === language);
    });
  }

  function renderAboutPage() {
    if (!document.querySelector("[data-about-title]")) return;

    const page = content.pages.about;
    setText("[data-about-kicker]", page.kicker);
    setText("[data-about-title]", page.title);
    setText("[data-about-copy]", page.copy);
    setText("[data-about-interview-title]", content.interviewTeaser.title);
    setText("[data-about-interview-copy]", content.interviewTeaser.text);
    renderBio("cs");

    const list = document.querySelector("[data-about-points]");
    if (list) {
      list.innerHTML = content.practicePoints
        .map(
          (point) => `
            <article class="practice-item">
              <p>${escapeHtml(point)}</p>
            </article>
          `
        )
        .join("");
    }
  }

  function renderContactPage() {
    if (!document.querySelector("[data-contact-title]")) return;

    const page = content.pages.contact;
    setText("[data-contact-kicker]", page.kicker);
    setText("[data-contact-title]", page.title);
    setText("[data-contact-copy]", page.copy);

    const primary = document.querySelector("[data-contact-primary]");
    if (primary) {
      primary.innerHTML = `
        <span class="section-kicker">Primary</span>
        <h2 class="info-block__title">Email & phone</h2>
        <p>${buildLink(`mailto:${content.contact.email}`, content.contact.email, "info-link")}</p>
        <p>${buildLink(content.contact.phoneHref, content.contact.phoneDisplay, "info-link")}</p>
        <p>${escapeHtml(content.contact.csIntro)}</p>
        <p>${escapeHtml(content.contact.enIntro)}</p>
      `;
    }

    const social = document.querySelector("[data-contact-social]");
    if (social) {
      social.innerHTML = `
        <span class="section-kicker">Social</span>
        <h2 class="info-block__title">Facebook & Instagram</h2>
        <div class="stack-links">
          ${content.contact.social.map((item) => buildLink(item.href, item.label, "info-link")).join("")}
        </div>
      `;
    }

    const legal = document.querySelector("[data-contact-legal]");
    if (legal) {
      legal.innerHTML = `
        <span class="section-kicker">Source note</span>
        <h2 class="info-block__title">Preserved legal information</h2>
        ${content.contact.legal.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
      `;
    }
  }

  function setupLanguageSwitch() {
    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.addEventListener("click", () => renderBio(button.dataset.langToggle));
    });
  }

  function initPage() {
    renderHomePage();
    renderWorksPage();
    renderExhibitionsPage();
    renderInterviewPage();
    renderAboutPage();
    renderContactPage();
  }

  renderSiteNav();
  renderFooter();
  initPage();
  setupLanguageSwitch();
})();

/* Mobile menu. The button is only visible below 700px; on wider screens the
   nav is always shown and this state is ignored. */
(function () {
  "use strict";

  var button = document.querySelector(".menu-button");
  var nav = document.getElementById("site-nav");
  if (!button || !nav) return;

  function setOpen(open, returnFocus) {
    button.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    if (!open && returnFocus) button.focus();
  }

  function isOpen() {
    return button.getAttribute("aria-expanded") === "true";
  }

  button.addEventListener("click", function () {
    setOpen(!isOpen());
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) setOpen(false, true);
  });

  document.addEventListener("click", function (event) {
    if (isOpen() && !nav.contains(event.target) && !button.contains(event.target)) setOpen(false);
  });

  // Close when focus moves past the last link.
  nav.addEventListener("focusout", function (event) {
    if (isOpen() && event.relatedTarget && !nav.contains(event.relatedTarget) && event.relatedTarget !== button) {
      setOpen(false);
    }
  });

  var wide = window.matchMedia("(min-width: 700px)");
  function reset() { if (wide.matches) setOpen(false); }
  if (wide.addEventListener) wide.addEventListener("change", reset);
  else if (wide.addListener) wide.addListener(reset);
})();

(function () {
  "use strict";

  var C = window.CONTENT;
  if (!C) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Small element builder: el("p", { class: "x" }, "text", childNode)
  function el(tag, attrs) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === undefined || value === null || value === false) return;
        if (key === "text") node.textContent = value;
        else node.setAttribute(key, value === true ? "" : value);
      });
    }
    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (child === null || child === undefined || child === false) continue;
      if (Array.isArray(child)) child.forEach(function (c) { if (c) node.appendChild(c); });
      else node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    }
    return node;
  }

  function slot(name) {
    return document.querySelector('[data-render="' + name + '"]');
  }

  function isExternal(href) {
    return /^https?:\/\//.test(href);
  }

  function link(href, label, className) {
    var external = isExternal(href);
    return el("a", {
      href: href,
      class: className,
      target: external ? "_blank" : null,
      rel: external ? "noopener" : null
    }, label);
  }

  /* About */

  function renderAbout() {
    var target = slot("about");
    if (!target || !C.about) return;
    C.about.paragraphs.forEach(function (text) {
      target.appendChild(el("p", { text: text }));
    });
    if (C.about.languages) {
      target.appendChild(el("p", { class: "languages" },
        el("strong", { text: "Languages: " }), C.about.languages));
    }
  }

  function renderTimeline() {
    var target = slot("timeline");
    if (!target || !C.timeline) return;
    C.timeline.forEach(function (item) {
      var current = /^(now|present)$/i.test(item.end);
      target.appendChild(el("li", { class: "timeline-item" + (current ? " is-current" : "") },
        el("p", { class: "timeline-date", text: item.start + " to " + item.end }),
        el("h4", { class: "timeline-role", text: item.role }),
        el("p", { class: "timeline-org", text: item.org }),
        item.detail ? el("p", { class: "timeline-detail", text: item.detail }) : null
      ));
    });
  }

  function renderStats() {
    var target = slot("stats");
    if (!target) return;
    if (!C.heroStats || !C.heroStats.length) {
      target.hidden = true;
      return;
    }
    C.heroStats.forEach(function (s) {
      target.appendChild(el("div", { class: "stat" },
        el("dt", { text: s.label }),
        el("dd", { text: s.value })));
    });
  }

  /* Projects */

  var LINK_LABELS = { demo: "Live demo", github: "GitHub", caseStudy: "Case study" };

  function projectLinks(links) {
    if (!links) return null;
    var items = Object.keys(LINK_LABELS)
      .filter(function (key) { return links[key]; })
      .map(function (key) { return el("li", null, link(links[key], LINK_LABELS[key])); });
    return items.length ? el("ul", { class: "project-links" }, items) : null;
  }

  function tagList(tags) {
    if (!tags || !tags.length) return null;
    return el("ul", { class: "tags", "aria-label": "Technologies" },
      tags.map(function (t) { return el("li", { text: t }); }));
  }

  function projectTitle(project, level) {
    return el(level, { class: "project-title" },
      project.title,
      project.status ? el("span", { class: "status", text: project.status }) : null);
  }

  function funnel(f) {
    var share = f.done / f.total;
    var percent = Math.round(share * 100);
    return el("figure", { class: "funnel" },
      el("div", {
        class: "funnel-bar",
        role: "img",
        "aria-label": f.doneLabel + " from " + f.totalLabel + ", about " + percent + "%"
      }, el("span", { class: "funnel-fill", style: "width:" + (share * 100).toFixed(1) + "%" })),
      el("figcaption", { class: "funnel-labels" },
        el("span", { class: "funnel-done" }, el("strong", { text: f.doneLabel })),
        el("span", { text: "from " + f.totalLabel })
      )
    );
  }

  function renderFeatured(project) {
    var results = null;
    if (project.results && project.results.length) {
      results = el("ul", { class: "results" }, project.results.map(function (r) {
        return el("li", null, el("strong", { text: r.value }), " " + r.text);
      }));
    }
    return el("article", { class: "case-study" },
      el("div", { class: "case-main" },
        projectTitle(project, "h3"),
        el("p", { class: "case-summary", text: project.summary }),
        project.details ? el("div", { class: "case-details" }, project.details.map(function (d) {
          return el("div", null, el("h4", { text: d.heading }), el("p", { text: d.text }));
        })) : null,
        tagList(project.tags),
        projectLinks(project.links)
      ),
      el("aside", { class: "case-results", "aria-label": "Results" },
        el("h4", { text: "Results so far" }),
        project.funnel ? funnel(project.funnel) : null,
        results
      )
    );
  }

  function renderCard(project) {
    return el("li", { class: "project-card" },
      project.image ? el("img", {
        class: "project-image",
        src: project.image,
        alt: project.imageAlt || "",
        width: "800",
        height: "450",
        loading: "lazy",
        decoding: "async"
      }) : null,
      el("div", { class: "project-body" },
        projectTitle(project, "h3"),
        el("p", { text: project.summary }),
        tagList(project.tags),
        projectLinks(project.links)
      )
    );
  }

  function renderProjects() {
    var featuredSlot = slot("featured");
    var grid = slot("projects");
    var slots = slot("slots");
    if (!grid || !C.projects) return;
    C.projects.forEach(function (project) {
      if (project.featured && featuredSlot) featuredSlot.appendChild(renderFeatured(project));
      else grid.appendChild(renderCard(project));
    });
    // Empty slots get their own row so they never stretch to a real card's height.
    for (var i = 0; slots && i < (C.comingSoon || 0); i++) {
      slots.appendChild(el("li", { class: "project-card is-empty" },
        el("p", { text: "Coming soon" })));
    }
  }

  /* Skills */

  function renderSkills() {
    var target = slot("skills");
    if (!target || !C.skills) return;
    C.skills.forEach(function (group) {
      target.appendChild(el("div", { class: "skill-group" },
        el("h3", { class: "subheading", text: group.group }),
        el("ul", { class: "skill-list" }, group.items.map(function (s) {
          return el("li", { text: s });
        }))
      ));
    });
  }

  /* Contact */

  function renderContact() {
    var target = slot("contact");
    var c = C.contact;
    if (!target || !c) return;
    target.textContent = "";

    var address = c.email[0] + "@" + c.email.slice(1).join(".");
    var status = el("span", { class: "copy-status", role: "status" });
    var copy = el("button", { type: "button", class: "button button-secondary copy-button" }, "Copy email");

    copy.addEventListener("click", function () {
      function done(ok) {
        status.textContent = ok ? "Email copied" : "Copy failed, select the address instead";
        window.clearTimeout(copy._t);
        copy._t = window.setTimeout(function () { status.textContent = ""; }, 2500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });

    var links = [];
    if (c.linkedin) links.push(el("li", null, link(c.linkedin, "LinkedIn")));
    if (c.github) links.push(el("li", null, link(c.github, "GitHub")));
    if (c.cv) {
      var cv = link(c.cv, "Download CV");
      cv.setAttribute("download", "");
      links.push(el("li", null, cv));
    }

    target.appendChild(el("div", { class: "email-row" },
      el("a", { class: "email", href: "mailto:" + address, text: address }),
      copy,
      status
    ));
    target.appendChild(el("ul", { class: "contact-links" }, links));
    if (c.location) target.appendChild(el("p", { class: "location", text: c.location }));
  }

  /* Hero chat */

  function renderChat() {
    var figure = document.getElementById("hero-chat");
    var chat = C.heroChat;
    if (!figure || !chat) return;

    var steps = [];
    var log = el("ol", { class: "chat-log" });

    chat.messages.forEach(function (m) {
      var who = m.from === "agent" ? "Agent" : chat.lead.name;
      var item = el("li", { class: "msg " + (m.from === "agent" ? "msg-out" : "msg-in") },
        el("span", { class: "bubble" },
          el("span", { class: "visually-hidden", text: who + ": " }),
          m.text),
        m.from === "agent" ? el("span", { class: "typing", "aria-hidden": "true" },
          el("span"), el("span"), el("span")) : null);
      log.appendChild(item);
      steps.push({ node: item, typing: m.from === "agent" });
    });

    var chips = chat.slots.map(function (s) { return el("li", { class: "chip", text: s }); });
    var slotsItem = el("li", { class: "slots" },
      el("span", { class: "visually-hidden", text: "Offered times: " }),
      el("ul", { class: "chip-row" }, chips));
    log.appendChild(slotsItem);
    steps.push({ node: slotsItem });

    var picked = chips[chat.picked] || chips[0];
    steps.push({ pick: picked });

    var booked = el("li", { class: "booked" },
      calendarIcon(),
      el("span", { class: "booked-text" },
        el("strong", { text: chat.booked.title }),
        el("span", { text: chat.booked.detail })));
    log.appendChild(booked);
    steps.push({ node: booked });

    var replay = el("button", { type: "button", class: "replay" }, "Replay");

    figure.appendChild(el("div", { class: "chat-panel" },
      el("div", { class: "chat-head" },
        el("span", { class: "avatar", "aria-hidden": "true", text: chat.lead.name.charAt(0) }),
        el("span", { class: "chat-who" },
          el("strong", { text: chat.lead.name }),
          el("span", { text: chat.lead.note }))),
      log));
    figure.appendChild(el("figcaption", { class: "chat-caption" },
      el("span", { text: chat.caption }),
      reduceMotion ? null : replay));
    figure.hidden = false;

    if (reduceMotion) {
      figure.classList.add("is-static");
      picked.classList.add("is-picked");
      return;
    }

    var timers = [];
    function later(fn, ms) { timers.push(window.setTimeout(fn, ms)); }

    function reset() {
      timers.forEach(window.clearTimeout);
      timers = [];
      steps.forEach(function (s) {
        if (s.node) s.node.classList.remove("is-shown", "is-typing");
        if (s.pick) s.pick.classList.remove("is-picked");
      });
    }

    function play() {
      reset();
      figure.classList.add("is-playing");
      var t = 300;
      steps.forEach(function (s) {
        if (s.typing) {
          t += 450;
          later(function () { s.node.classList.add("is-typing"); }, t);
          t += 1000;
          later(function () { s.node.classList.remove("is-typing"); s.node.classList.add("is-shown"); }, t);
        } else if (s.pick) {
          t += 900;
          later(function () { s.pick.classList.add("is-picked"); }, t);
        } else {
          t += s.node === booked ? 600 : 800;
          later(function () { s.node.classList.add("is-shown"); }, t);
        }
      });
    }

    replay.addEventListener("click", play);

    // Start when the chat is on screen, so mobile visitors see it play.
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          io.disconnect();
          play();
        }
      }, { threshold: 0.35 });
      io.observe(figure);
    } else {
      play();
    }
  }

  function calendarIcon() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.innerHTML =
      '<rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M8.5 15.5l2.2 2.2 4.8-4.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    return svg;
  }

  renderAbout();
  renderTimeline();
  renderStats();
  renderProjects();
  renderSkills();
  renderContact();
  renderChat();
})();

/* Header border once the page scrolls, so the sticky bar separates from content. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  if (!header) return;

  function update() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/* Sections fade in each time they reach the screen. The hidden state only applies
   to elements this script marks, so content never hides without JavaScript. */
(function () {
  "use strict";

  var items = document.querySelectorAll(".section > *");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (node) { node.classList.add("is-visible"); });
    return;
  }

  // Show once a bit of the element is on screen, and hide again only after it
  // has fully left, so it replays every time you scroll back to it.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        entry.target.classList.remove("is-visible");
      } else if (entry.intersectionRatio >= 0.08 || entry.intersectionRect.height >= 80) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: [0, 0.08, 0.2] });

  items.forEach(function (node) {
    node.classList.add("reveal");
    io.observe(node);
  });
})();

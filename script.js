const navbar = document.getElementById("navbar");
const progress = document.getElementById("scrollProgress");
const workshopStart = new Date("2026-10-25T14:10:00+02:00");

const challengeCopy = {
    architectures: {
        title: "Architectures for PKG-based agentic systems",
        body: "How should a personal knowledge graph sit inside an agent loop—planning, memory, tool use, and action? We need reference architectures that make context, policies, and provenance first-class, and that scale from a single personal agent to families of collaborating systems."
    },
    reliability: {
        title: "Operationalizing reliability, explainability, and accountability",
        body: "When agents act, failures are no longer just bad answers. We will work toward mechanisms that make decisions inspectable, provenance-preserving, and accountable to the people and institutions they affect."
    },
    autonomy: {
        title: "Balancing autonomy with user control",
        body: "Useful agents must be allowed to act—without quietly taking over. The open question is how policies, permissions, and human override stay meaningful once an agent is operating over a personal graph."
    },
    coordination: {
        title: "Multi-agent and multi-stakeholder coordination",
        body: "Personal agents will not live alone. Families, organizations, and public services will field agents with overlapping graphs and conflicting obligations. Coordination is a semantic and governance problem, not only an engineering one."
    },
    interop: {
        title: "Interoperability, decentralization, and compliance",
        body: "Without shared protocols, PKG-based agents recreate the walled gardens they were meant to escape. We will identify the standards, decentralized substrates, and regulatory hooks the community should rally around."
    }
};

function updateScrollChrome() {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (navbar) {
        navbar.classList.toggle("navbar-scrolled", scrolled > 40);
    }
    if (progress && height > 0) {
        progress.style.width = `${Math.min(100, (scrolled / height) * 100)}%`;
    }
}

function pad(value) {
    return String(value).padStart(2, "0");
}

function tickCountdown() {
    const daysEl = document.getElementById("countDays");
    if (!daysEl) {
        return;
    }

    const remaining = workshopStart.getTime() - Date.now();
    if (remaining <= 0) {
        daysEl.textContent = "00";
        document.getElementById("countHours").textContent = "00";
        document.getElementById("countMins").textContent = "00";
        document.getElementById("countSecs").textContent = "00";
        return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    daysEl.textContent = pad(days);
    document.getElementById("countHours").textContent = pad(hours);
    document.getElementById("countMins").textContent = pad(mins);
    document.getElementById("countSecs").textContent = pad(secs);
}

function setupChallenges() {
    const cards = document.querySelectorAll(".challenge-card");
    const title = document.getElementById("challengeDetailTitle");
    const body = document.getElementById("challengeDetailBody");
    if (!cards.length || !title || !body) {
        return;
    }

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            cards.forEach((other) => {
                other.classList.toggle("active", other === card);
                other.setAttribute("aria-expanded", other === card ? "true" : "false");
            });
            const copy = challengeCopy[card.dataset.challenge];
            if (copy) {
                title.textContent = copy.title;
                body.textContent = copy.body;
            }
        });
    });
}

function setupTopics() {
    const chips = document.querySelectorAll(".filter-chip");
    const tiles = document.querySelectorAll(".topic-tile");
    const detail = document.getElementById("topicDetail");
    const title = document.getElementById("topicDetailTitle");
    const body = document.getElementById("topicDetailBody");
    const close = document.getElementById("topicDetailClose");

    const applyFilter = (filter) => {
        tiles.forEach((tile) => {
            const match = filter === "all" || tile.dataset.cluster === filter;
            tile.classList.toggle("dimmed", !match);
            if (!match) {
                tile.classList.remove("selected");
            }
        });
        if (detail) {
            detail.hidden = true;
        }
    };

    chips.forEach((chip) => {
        chip.addEventListener("click", () => {
            chips.forEach((other) => other.classList.toggle("active", other === chip));
            applyFilter(chip.dataset.filter);
        });
    });

    tiles.forEach((tile) => {
        tile.addEventListener("click", () => {
            tiles.forEach((other) => other.classList.toggle("selected", other === tile));
            title.textContent = tile.dataset.title;
            body.textContent = tile.dataset.body;
            detail.hidden = false;
            detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    });

    close?.addEventListener("click", () => {
        detail.hidden = true;
        tiles.forEach((tile) => tile.classList.remove("selected"));
    });
}

function setupFormatTabs() {
    const tabs = document.querySelectorAll(".format-tab");
    const panels = document.querySelectorAll(".format-panel");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((other) => {
                const active = other === tab;
                other.classList.toggle("active", active);
                other.setAttribute("aria-selected", active ? "true" : "false");
            });
            panels.forEach((panel) => {
                panel.classList.toggle("active", panel.dataset.format === tab.dataset.format);
            });
        });
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a.nav-link[href^="#"], a.btn[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const href = anchor.getAttribute("href");
            if (!href || href === "#") {
                return;
            }
            const target = document.querySelector(href);
            if (!target) {
                return;
            }
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        });
    });
}

updateScrollChrome();
tickCountdown();
setupChallenges();
setupTopics();
setupFormatTabs();
setupSmoothScroll();

window.addEventListener("scroll", updateScrollChrome, { passive: true });
setInterval(tickCountdown, 1000);

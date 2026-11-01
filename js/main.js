/* ============================================================
   Osanda Wedamulla — Portfolio
   Vanilla JS. No libraries. ~6KB.
   Motion: Standard tier, all effects respect prefers-reduced-motion.
   ============================================================ */
(() => {
    "use strict";

    const doc = document.documentElement;
    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    doc.classList.add("js");
    if (!("IntersectionObserver" in window)) doc.classList.add("no-observer");
    if (REDUCED) doc.classList.add("reduced");

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ---------- 1. Theme (persisted, defaults to dark) ---------- */
    const initTheme = () => {
        const saved = localStorage.getItem("theme");
        doc.setAttribute("data-theme", saved === "light" ? "light" : "dark");

        const toggle = $("#theme-toggle");
        if (!toggle) return;
        const apply = (t) => {
            doc.setAttribute("data-theme", t);
            localStorage.setItem("theme", t);
        };
        toggle.addEventListener("click", () => {
            apply(doc.getAttribute("data-theme") === "dark" ? "light" : "dark");
        });
    };

    /* ---------- 2. Navbar: scrolled state, mobile menu, active link ---------- */
    const initNav = () => {
        const nav = $("#navbar");
        const toggle = $("#nav-toggle");
        const menu = $("#nav-menu");

        const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        if (toggle && menu) {
            toggle.addEventListener("click", () => {
                const open = menu.classList.toggle("open");
                toggle.setAttribute("aria-expanded", String(open));
            });
            menu.addEventListener("click", (e) => {
                if (e.target.closest("a")) {
                    menu.classList.remove("open");
                    toggle.setAttribute("aria-expanded", "false");
                }
            });
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && menu.classList.contains("open")) {
                    menu.classList.remove("open");
                    toggle.setAttribute("aria-expanded", "false");
                    toggle.focus();
                }
            });
        }

        // Scroll progress bar
        const bar = $("#scroll-progress");
        if (bar) {
            let ticking = false;
            window.addEventListener("scroll", () => {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(() => {
                    const max = document.body.scrollHeight - window.innerHeight;
                    bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
                    ticking = false;
                });
            }, { passive: true });
        }
    };

    /* ---------- 3. Reveal on scroll (staggered) ---------- */
    const initReveal = () => {
        const items = $$("[data-reveal]");
        if (doc.classList.contains("no-observer") || REDUCED) {
            items.forEach((el) => el.classList.add("shown"));
            return;
        }
        // Assign a stagger index once, per reveal group (a section or grid).
        let currentGroup = null, currentIndex = 0;
        items.forEach((el) => {
            const group = el.closest(".section") || el;
            if (group !== currentGroup) { currentGroup = group; currentIndex = 0; }
            el.style.setProperty("--reveal-delay", `${Math.min(currentIndex * 70, 420)}ms`);
            currentIndex++;
        });
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("shown");
                io.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
        items.forEach((el) => io.observe(el));
    };

    /* ---------- 4. Hero metrics count-up ---------- */
    const initCounters = () => {
        const nums = $$(".metric-num");
        const run = (el) => {
            const target = parseFloat(el.dataset.count);
            const decimals = parseInt(el.dataset.decimals || "0", 10);
            if (REDUCED) { el.textContent = target.toFixed(decimals); return; }
            const dur = 900;
            const t0 = performance.now();
            const tick = (t) => {
                const p = Math.min((t - t0) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = (target * eased).toFixed(decimals);
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };
        if (doc.classList.contains("no-observer") || REDUCED) {
            nums.forEach(run);
            return;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
            });
        }, { threshold: 0.6 });
        nums.forEach((el) => io.observe(el));
    };

    /* ---------- 5. Typewriter role rotation ---------- */
    const ROLES = [
        "distributed systems.",
        "Kubernetes platforms.",
        "high-throughput teams.",
        "event-driven backends.",
        "AI-augmented pipelines."
    ];
    const initTypewriter = () => {
        const el = $("#typewriter");
        if (!el) return;
        if (REDUCED) { el.textContent = ROLES[0]; return; }
        let ri = 0, ci = 0, deleting = false;
        const TYPE = 55, HOLD = 1700, ERASE = 28;
        const step = () => {
            const word = ROLES[ri];
            ci += deleting ? -1 : 1;
            el.textContent = word.slice(0, ci);
            if (!deleting && ci === word.length) {
                setTimeout(() => { deleting = true; step(); }, HOLD);
            } else if (deleting && ci === 0) {
                deleting = false; ri = (ri + 1) % ROLES.length;
                setTimeout(step, TYPE + 240);
            } else {
                setTimeout(step, deleting ? ERASE : TYPE);
            }
        };
        step();
    };

    /* ---------- 6. Magnetic buttons ---------- */
    const initMagnetic = () => {
        if (REDUCED) return;
        $$(".magnetic").forEach((el) => {
            el.addEventListener("pointermove", (e) => {
                const r = el.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                el.style.transform = `translate(${x * 0.16}px, ${y * 0.22}px)`;
            });
            el.addEventListener("pointerleave", () => { el.style.transform = ""; });
        });
    };

    /* ---------- 7. Cursor-follow card glow ---------- */
    const initGlow = () => {
        if (REDUCED) return;
        let lastY = 0, frame = 0;
        document.addEventListener("pointermove", (e) => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                $$(".glow-card:hover").forEach((card) => {
                    const r = card.getBoundingClientRect();
                    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
                    card.style.setProperty("--my", `${e.clientY - r.top}px`);
                });
                frame = 0;
            });
        }, { passive: true });
        void lastY;
    };

    /* ---------- 8. Timeline progress fill ---------- */
    const initTimeline = () => {
        const tl = $("#timeline");
        const bar = $(".timeline-progress");
        if (!tl || !bar) return;
        const update = () => {
            const r = tl.getBoundingClientRect();
            const vh = window.innerHeight;
            const total = r.height;
            const passed = Math.min(Math.max(vh * 0.62 - r.top, 0), total);
            bar.style.height = `${total > 0 ? (passed / total) * 100 : 0}%`;
        };
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        update();
    };

    /* ---------- 9. Project filter ---------- */
    const initFilter = () => {
        const grid = $("#projects-grid");
        const btns = $$(".filter-btn");
        if (!grid || !btns.length) return;
        btns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const f = btn.dataset.filter;
                btns.forEach((b) => {
                    b.classList.toggle("active", b === btn);
                    b.setAttribute("aria-pressed", String(b === btn));
                });
                grid.classList.add("filtering");
                const apply = () => {
                    $$(".project", grid).forEach((p) => {
                        p.classList.toggle("hide", f !== "all" && p.dataset.category !== f);
                    });
                    requestAnimationFrame(() => grid.classList.remove("filtering"));
                };
                if (REDUCED) apply();
                else setTimeout(apply, 190);
            });
        });
    };

    /* ---------- 10. Copy email ---------- */
    const initCopy = () => {
        const btn = $("#email-copy");
        if (!btn) return;
        btn.addEventListener("click", async () => {
            const email = btn.dataset.email;
            try { await navigator.clipboard.writeText(email); }
            catch {
                const ta = document.createElement("textarea");
                ta.value = email; document.body.appendChild(ta);
                ta.select(); document.execCommand("copy"); ta.remove();
            }
            btn.classList.add("copied");
            $(".copy-label", btn).textContent = "Copied";
            setTimeout(() => {
                btn.classList.remove("copied");
                $(".copy-label", btn).textContent = "Copy email";
            }, 1800);
        });
    };

    /* ---------- 11. Contact form → real mailto compose (no fake sends) ---------- */
    const initForm = () => {
        const form = $("#contact-form");
        if (!form) return;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const val = (id) => $(id).value.trim();
            let ok = true;
            $$(".field", form).forEach((f) => {
                const input = f.querySelector("input, textarea");
                const bad = input.required && !input.value.trim();
                input.classList.toggle("error", bad);
                if (bad) ok = false;
            });
            if (!ok) return;
            const subject = encodeURIComponent(`[Portfolio] ${val("#f-subject")}`);
            const body = encodeURIComponent(
                `${val("#f-message")}\n\n— ${val("#f-name")} (${val("#f-email")})`
            );
            window.location.href = `mailto:osanda1989@gmail.com?subject=${subject}&body=${body}`;
        });
    };

    /* ---------- 12. Footer year ---------- */
    const initYear = () => {
        const y = $("#year");
        if (y) y.textContent = new Date().getFullYear();
    };

    /* ---------- boot ---------- */
    const boot = () => {
        initTheme();
        initNav();
        initReveal();
        initCounters();
        initTypewriter();
        initMagnetic();
        initGlow();
        initTimeline();
        initFilter();
        initCopy();
        initForm();
        initYear();
    };
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();

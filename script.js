/* ─────────────────────────────────────────
   GSAP Registration
───────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08 });
});

// Smooth follower
(function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    gsap.set(follower, { x: followerX, y: followerY });
    requestAnimationFrame(animateFollower);
})();

/* ─────────────────────────────────────────
   LOADER  0% → 100%
───────────────────────────────────────── */
const loaderEl   = document.getElementById('loader');
const loaderNum  = document.getElementById('loader-num');
const loaderFill = document.getElementById('loader-fill');

const bootMessages = [
    "Initializing secure kernel…",
    "Decrypting payloads…",
    "Loading threat models…",
    "Bypassing firewalls…",
    "Mapping attack surface…",
    "Boot sequence complete."
];

let progress  = 0;
let msgIndex  = 0;
const loaderInterval = setInterval(() => {
    progress += Math.random() * 14;
    if (progress >= 100) {
        progress = 100;
        clearInterval(loaderInterval);

        // Brief pause then dismiss loader
        setTimeout(() => {
            loaderEl.classList.add('out');
            setTimeout(() => loaderEl.remove(), 700);

            // Animate hero elements in after loader disappears
            gsap.from('.hero-name', { y: 60, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 });
            gsap.from('.badge', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.4 });
            gsap.from('.hero-portrait-wrap', { scale: 0.9, opacity: 0, duration: 1.4, ease: 'power3.out', delay: 0.1 });

            // Refresh ScrollTrigger after DOM settles
            setTimeout(() => ScrollTrigger.refresh(), 500);
        }, 400);
    }

    loaderNum.textContent  = Math.floor(progress);
    loaderFill.style.width = progress + '%';

    // Cycle boot messages
    const msgStep = Math.floor(progress / (100 / bootMessages.length));
    if (msgStep > msgIndex && msgIndex < bootMessages.length) {
        msgIndex = msgStep;
    }
}, 110);

/* ─────────────────────────────────────────
   HAMBURGER / NAV OVERLAY
───────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const navOverlay = document.getElementById('nav-overlay');
const navLinks   = document.querySelectorAll('.nav-link-item');

hamburger.addEventListener('click', () => {
    const isOpen = navOverlay.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    navOverlay.setAttribute('aria-hidden', !isOpen);
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navOverlay.classList.remove('open');
        hamburger.classList.remove('active');
    });
});

/* ─────────────────────────────────────────
   SPIDER-MAN MASK REVEAL  (clip-path circle)
───────────────────────────────────────── */
const portraitWrap = document.getElementById('portrait-wrap');
const maskLayer    = document.getElementById('mask-layer');

if (portraitWrap && maskLayer) {
    portraitWrap.addEventListener('mousemove', e => {
        const { left, top } = portraitWrap.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        // Iron Man gold tint: warm amber-gold overlay
        const radius = 130;
        gsap.to(maskLayer, {
            clipPath: `circle(${radius}px at ${x}px ${y}px)`,
            duration: 0.55,
            ease: 'power3.out'
        });
    });

    portraitWrap.addEventListener('mouseleave', () => {
        gsap.to(maskLayer, {
            clipPath: 'circle(0px at 50% 50%)',
            duration: 0.9,
            ease: 'power3.out'
        });
    });
}

/* ─────────────────────────────────────────
   FLOATING KEYWORD PARALLAX (scroll-based)
───────────────────────────────────────── */
const floaters = document.querySelectorAll('.float-cloud span');
floaters.forEach((el, i) => {
    const depth = (i % 3) + 1;
    gsap.to(el, {
        y: `-=${depth * 80}`,
        ease: 'none',
        scrollTrigger: {
            trigger: '.intro-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: depth * 0.8
        }
    });
});

/* ─────────────────────────────────────────
   SCROLL REVEAL  (data-reveal via GSAP)
───────────────────────────────────────── */
gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
    gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
            opacity: 1, y: 0,
            duration: 1,
            delay: (i % 3) * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        }
    );
});

/* ─────────────────────────────────────────
   PROJECT HOVER IMAGE PREVIEW
───────────────────────────────────────── */
const projectRows    = document.querySelectorAll('.project-row');
const imgPreview     = document.getElementById('project-img-preview');
let previewRAF;

projectRows.forEach(row => {
    const imgUrl = row.getAttribute('data-img');

    row.addEventListener('mouseenter', () => {
        if (!imgUrl) return;
        imgPreview.style.backgroundImage = `url(${imgUrl})`;
        imgPreview.classList.add('shown');
    });

    row.addEventListener('mouseleave', () => {
        imgPreview.classList.remove('shown');
    });

    row.addEventListener('mousemove', e => {
        cancelAnimationFrame(previewRAF);
        previewRAF = requestAnimationFrame(() => {
            gsap.to(imgPreview, {
                x: e.clientX + 30,
                y: e.clientY - 125,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });
});

/* ─────────────────────────────────────────
   GSAP HERO TEXT  (glitch flicker on load)
───────────────────────────────────────── */
function glitchHero() {
    const heroName = document.querySelector('.hero-name');
    if (!heroName) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
    tl.to(heroName, { x: -4, duration: 0.05, ease: 'steps(1)' })
      .to(heroName, { x: 4, duration: 0.05, ease: 'steps(1)' })
      .to(heroName, { x: 0, duration: 0.05, ease: 'steps(1)' })
      .to(heroName, { x: -2, duration: 0.03, ease: 'steps(1)', delay: 0.1 })
      .to(heroName, { x: 0, duration: 0.03, ease: 'steps(1)' });
}
setTimeout(glitchHero, 3000);

/* ═════════════════════════════════════════
   ██  HACKER EXTRAS JS  ██
═════════════════════════════════════════ */

/* ── LIVE CLOCK in hero corner ── */
const heroClock = document.getElementById('hero-clock');
function updateClock() {
    if (!heroClock) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const ss = String(now.getSeconds()).padStart(2,'0');
    heroClock.textContent = `${hh}:${mm}:${ss}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ── LIVE HEX TICKER in header ── */
const hexTickerEl = document.getElementById('hex-ticker');
const hexMessages = [
    'SYS_OK', 'CONN_SECURE', 'THREAT::NONE', 'AUTH_OK',
    'SCAN_ACTIVE', 'FW_ENABLED', 'PKT_SNIFF::OFF', 'ZERO_TRUST::ON'
];
let hexMsgIdx = 0;
function updateHexTicker() {
    if (!hexTickerEl) return;
    const hex = '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4,'0');
    hexTickerEl.textContent = `${hex} :: ${hexMessages[hexMsgIdx % hexMessages.length]}`;
    hexMsgIdx++;
}
setInterval(updateHexTicker, 2000);

/* ── BOOT LOG during loader ── */
const bootLog = document.getElementById('loader-boot-log');
const loaderHex = document.getElementById('loader-hex');
const hackerBootLines = [
    { text: '> AUTH MODULE LOADED', cls: 'ok' },
    { text: '> KERNEL v2.5.1 INITIALIZED', cls: 'ok' },
    { text: '> LOADING THREAT DATABASE...', cls: '' },
    { text: '> CVE SCAN: 0 CRITICAL', cls: 'ok' },
    { text: '> FIREWALL ENABLED', cls: 'ok' },
    { text: '> DECRYPTING PAYLOAD...', cls: '' },
    { text: '> ZERO-TRUST: ACTIVE', cls: 'ok' },
    { text: '> ALL SYSTEMS NOMINAL', cls: 'ok' },
];
let bootLineIdx = 0;
const bootLogInterval = setInterval(() => {
    if (!bootLog || bootLineIdx >= hackerBootLines.length) {
        clearInterval(bootLogInterval);
        return;
    }
    const line = hackerBootLines[bootLineIdx];
    const span = document.createElement('span');
    span.textContent = line.text;
    if (line.cls) span.classList.add(line.cls);
    bootLog.appendChild(span);
    bootLineIdx++;

    // Also update hex display
    if (loaderHex) {
        loaderHex.textContent = '0x' + Math.floor(Math.random() * 0xFFFF)
            .toString(16).toUpperCase().padStart(4,'0');
    }
}, 600);

/* ── RANDOM GLITCH BAR that flickers across screen ── */
const glitchBar = document.getElementById('glitch-bar');
function triggerGlitchBar() {
    if (!glitchBar) return;
    const y = Math.random() * window.innerHeight;
    glitchBar.style.top = y + 'px';
    glitchBar.style.opacity = '1';
    glitchBar.style.height = (Math.random() * 4 + 1) + 'px';
    setTimeout(() => {
        glitchBar.style.opacity = '0';
    }, 80 + Math.random() * 80);
}
setInterval(triggerGlitchBar, 3000 + Math.random() * 5000);
// Random extra flash
setInterval(() => {
    if (Math.random() > 0.6) triggerGlitchBar();
}, 7000);

/* ── BINARY STRIP — randomize content periodically ── */
const binaryStripEl = document.getElementById('binary-strip');
function randomByte() {
    return Math.floor(Math.random() * 256).toString(2).padStart(8, '0');
}
function refreshBinaryStrip() {
    if (!binaryStripEl) return;
    const bytes = Array.from({ length: 20 }, randomByte).join(' ');
    binaryStripEl.textContent = bytes;
}
setInterval(refreshBinaryStrip, 3000);

/* ═══════════════════════════════════════════
   ██  SPLINE 3D — SPOTLIGHT + LOADER  ██
════════════════════════════════════════════ */

/* Mouse-following spotlight inside the Spline card */
const splineCard      = document.getElementById('spline-card');
const splineSpotlight = document.getElementById('spline-spotlight');

if (splineCard && splineSpotlight) {
    splineCard.addEventListener('mousemove', e => {
        const { left, top } = splineCard.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        splineSpotlight.style.left = x + 'px';
        splineSpotlight.style.top  = y + 'px';
    });
}

/* Hide the spinner once the spline-viewer fires its 'load' event */
const splineViewer = document.getElementById('spline-viewer');
const splineLoader = document.getElementById('spline-loader');

if (splineViewer && splineLoader) {
    splineViewer.addEventListener('load', () => {
        splineLoader.classList.add('hidden');
        // Remove after fade-out so it doesn't intercept pointer events
        setTimeout(() => splineLoader.remove(), 600);
    });

    // Fallback: hide loader after 12 seconds even if 'load' doesn't fire
    setTimeout(() => {
        if (splineLoader && splineLoader.parentNode) {
            splineLoader.classList.add('hidden');
        }
    }, 12000);
}

/* ═══════════════════════════════════════════
   ██  SHADER LINES — Three.js  ██
════════════════════════════════════════════ */
(function initShader() {
    const container = document.getElementById('shader-canvas');
    if (!container) return;

    // Load Three.js r89 from CDN (matches the original React component)
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js';
    script.onload = () => startShader(container);
    document.head.appendChild(script);

    function startShader(container) {
        if (!window.THREE) return;
        const THREE = window.THREE;

        // --- Camera & Scene ---
        const camera = new THREE.Camera();
        camera.position.z = 1;
        const scene  = new THREE.Scene();

        // --- Geometry ---
        const geometry = new THREE.PlaneBufferGeometry(2, 2);

        // --- Uniforms ---
        const uniforms = {
            time:       { type: 'f',  value: 1.0 },
            resolution: { type: 'v2', value: new THREE.Vector2() }
        };

        // --- Vertex Shader ---
        const vertexShader = `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `;

        // --- Fragment Shader (exact port from React component) ---
        const fragmentShader = `
            #define TWO_PI 6.2831853072
            #define PI 3.14159265359

            precision highp float;
            uniform vec2  resolution;
            uniform float time;

            float random(in float x) {
                return fract(sin(x) * 1e4);
            }
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }

            varying vec2 vUv;

            void main(void) {
                vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

                vec2 fMosaicScal  = vec2(4.0, 2.0);
                vec2 vScreenSize  = vec2(256.0, 256.0);
                uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
                uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

                float t = time * 0.06 + random(uv.x) * 0.4;
                float lineWidth = 0.0008;

                vec3 color = vec3(0.0);
                for (int j = 0; j < 3; j++) {
                    for (int i = 0; i < 5; i++) {
                        color[j] += lineWidth * float(i * i) /
                            abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 1.0 - length(uv));
                    }
                }

                gl_FragColor = vec4(color[2], color[1], color[0], 1.0);
            }
        `;

        // --- Material & Mesh ---
        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // --- Renderer ---
        const renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // --- Resize handler ---
        function onResize() {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
        }
        onResize();
        window.addEventListener('resize', onResize, { passive: true });

        // --- Animation loop (pause when section is off-screen) ---
        let rafId = null;
        let running = false;

        function animate() {
            rafId = requestAnimationFrame(animate);
            uniforms.time.value += 0.05;
            renderer.render(scene, camera);
        }

        // Use IntersectionObserver to save GPU when section is not visible
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !running) {
                running = true;
                animate();
            } else if (!entry.isIntersecting && running) {
                running = false;
                cancelAnimationFrame(rafId);
            }
        }, { rootMargin: '200px' });

        observer.observe(document.getElementById('shader-section'));
    }
})();

// ════════════════════════════════════════════════════════
//   WAVES BACKGROUND ANIMATION
// ════════════════════════════════════════════════════════
(function initWaves() {
    const container = document.getElementById('waves-container');
    const svg = document.getElementById('waves-svg');
    if (!container || !svg || typeof SimplexNoise === 'undefined') return;

    // Use global simplex (from the CDN script, it exposes window.simplexNoise)
    // The library we loaded exposes window.simplexNoise
    let noise2D;
    // Check if it's the 2.x API (SimplexNoise constructor) or 3.x+ API (createNoise2D)
    if (typeof SimplexNoise === 'function') {
        const simplexInst = new SimplexNoise();
        noise2D = (x, y) => simplexInst.noise2D(x, y);
    } else {
        // Fallback or generic
        noise2D = (x, y) => Math.sin(x) * Math.cos(y); // Simple fallback, shouldn't happen with the CDN we used
    }

    let bounding = container.getBoundingClientRect();
    let paths = [];
    let lines = [];
    let rafId = null;

    const mouse = {
        x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0,
        v: 0, vs: 0, a: 0, set: false,
    };

    function setSize() {
        bounding = container.getBoundingClientRect();
        svg.style.width = bounding.width + 'px';
        svg.style.height = bounding.height + 'px';
    }

    function setLines() {
        const width = bounding.width;
        const height = bounding.height;
        lines = [];
        paths.forEach(p => p.remove());
        paths = [];

        const xGap = 8;
        const yGap = 8;
        const oWidth = width + 200;
        const oHeight = height + 30;

        const totalLines = Math.ceil(oWidth / xGap);
        const totalPoints = Math.ceil(oHeight / yGap);
        const xStart = (width - xGap * totalLines) / 2;
        const yStart = (height - yGap * totalPoints) / 2;

        for (let i = 0; i < totalLines; i++) {
            const points = [];
            for (let j = 0; j < totalPoints; j++) {
                points.push({
                    x: xStart + xGap * i,
                    y: yStart + yGap * j,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 }
                });
            }

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.classList.add('a__line', 'js-line');
            path.setAttribute('fill', 'none');
            // Hardcode bright white lines similar to the component props
            path.setAttribute('stroke', 'rgba(255, 255, 255, 0.4)');
            path.setAttribute('stroke-width', '1');

            svg.appendChild(path);
            paths.push(path);
            lines.push(points);
        }
    }

    function updateMousePosition(x, y) {
        mouse.x = x - bounding.left;
        mouse.y = y - bounding.top + window.scrollY;

        if (!mouse.set) {
            mouse.sx = mouse.x;
            mouse.sy = mouse.y;
            mouse.lx = mouse.x;
            mouse.ly = mouse.y;
            mouse.set = true;
        }

        container.style.setProperty('--x', `${mouse.sx}px`);
        container.style.setProperty('--y', `${mouse.sy}px`);
    }

    function movePoints(time) {
        lines.forEach(points => {
            points.forEach(p => {
                const move = noise2D((p.x + time * 0.008) * 0.003, (p.y + time * 0.003) * 0.002) * 8;
                p.wave.x = Math.cos(move) * 12;
                p.wave.y = Math.sin(move) * 6;

                const dx = p.x - mouse.sx;
                const dy = p.y - mouse.sy;
                const d = Math.hypot(dx, dy);
                const l = Math.max(175, mouse.vs);

                if (d < l) {
                    const s = 1 - d / l;
                    const f = Math.cos(d * 0.001) * s;
                    p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00035;
                    p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00035;
                }

                p.cursor.vx += (0 - p.cursor.x) * 0.01;
                p.cursor.vy += (0 - p.cursor.y) * 0.01;
                p.cursor.vx *= 0.95;
                p.cursor.vy *= 0.95;
                p.cursor.x += p.cursor.vx;
                p.cursor.y += p.cursor.vy;
                p.cursor.x = Math.min(50, Math.max(-50, p.cursor.x));
                p.cursor.y = Math.min(50, Math.max(-50, p.cursor.y));
            });
        });
    }

    function drawLines() {
        lines.forEach((points, lIndex) => {
            if (points.length < 2 || !paths[lIndex]) return;

            const fp = points[0];
            const fx = fp.x + fp.wave.x;
            const fy = fp.y + fp.wave.y;
            let d = `M ${fx} ${fy}`;

            for (let i = 1; i < points.length; i++) {
                const p = points[i];
                const x = p.x + p.wave.x + p.cursor.x;
                const y = p.y + p.wave.y + p.cursor.y;
                d += `L ${x} ${y}`;
            }
            paths[lIndex].setAttribute('d', d);
        });
    }

    function tick(time) {
        mouse.sx += (mouse.x - mouse.sx) * 0.1;
        mouse.sy += (mouse.y - mouse.sy) * 0.1;

        const dx = mouse.x - mouse.lx;
        const dy = mouse.y - mouse.ly;
        const d = Math.hypot(dx, dy);

        mouse.v = d;
        mouse.vs += (d - mouse.vs) * 0.1;
        mouse.vs = Math.min(100, mouse.vs);

        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.a = Math.atan2(dy, dx);

        container.style.setProperty('--x', `${mouse.sx}px`);
        container.style.setProperty('--y', `${mouse.sy}px`);

        movePoints(time);
        drawLines();

        rafId = requestAnimationFrame(tick);
    }

    // Init and listeners
    setSize();
    setLines();

    window.addEventListener('resize', () => { setSize(); setLines(); });
    window.addEventListener('mousemove', e => updateMousePosition(e.pageX, e.pageY));
    container.addEventListener('touchmove', e => {
        const t = e.touches[0];
        updateMousePosition(t.clientX, t.clientY);
    }, { passive: false });

    rafId = requestAnimationFrame(tick);
})();

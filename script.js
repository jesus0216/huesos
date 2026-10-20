const CONFIG = {
    titulo: "¡Feliz cumpleaños, hermana!",
    mensaje: "Huesos hui jaja, ¡feliz cumpleaños, pestosa! Que sigas cumpliendo muchísimos años más, siempre con muy buena vibra. Te quiero mucho y te deseo lo mejor de lo mejor: salud, alegría y que todo lo que te propongas se te cumpla. Te mando un abrazo fuerte a ti y a mi sobrina Ame. Las quiero mucho.",
    firma: "Con mucho cariño, Pipe",
    foto: "img/hermanos.jpeg"
};

const $ = id => document.getElementById(id);
const stage = $('stage'), colors = ['#ff5d8f', '#ffd36e', '#7be0c3', '#8ab4ff', '#ffffff'];

// Texto
$('mensaje').textContent = CONFIG.mensaje;
$('firma').textContent = CONFIG.firma;
let i = 0;
$('titulo').setAttribute('aria-label', CONFIG.titulo);
$('titulo').innerHTML = CONFIG.titulo.split(' ').map(w =>
    `<span class="w" aria-hidden="true">${[...w].map(c => `<span class="l" style="--i:${i++}">${c}</span>`).join('')}</span>`
).join(' ');

// Foto (si no existe, muestra un pastelito)
const img = $('foto');
img.onerror = () => $('photo').classList.add('sin-foto');
img.src = CONFIG.foto;

// Confeti
const cv = $('confetti'), ctx = cv.getContext('2d');
let W, H, parts = [];
const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
addEventListener('resize', size); size();

function burst(x, y, n = 90) {
    for (let k = 0; k < n; k++) {
        const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 9;
        parts.push({
            x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, w: 6 + Math.random() * 6,
            h: 3 + Math.random() * 5, r: 0, vr: (Math.random() - .5) * .4, c: colors[k % colors.length]
        });
    }
}
function rain() {
    parts.push({
        x: Math.random() * W, y: -10, vx: (Math.random() - .5) * 2, vy: 1 + Math.random() * 2,
        w: 6 + Math.random() * 5, h: 3 + Math.random() * 4, r: 0, vr: (Math.random() - .5) * .3,
        c: colors[Math.random() * 5 | 0]
    });
}
(function tick() {
    ctx.clearRect(0, 0, W, H);
    parts = parts.filter(p => p.y < H + 20);
    for (const p of parts) {
        p.vy = Math.min(p.vy + .15, 6); p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    }
    requestAnimationFrame(tick);
})();

// Globos
function globos(n = 16) {
    const box = $('balloons');
    for (let k = 0; k < n; k++) {
        const b = document.createElement('i');
        b.style.cssText = `--x:${Math.random() * 92}vw;--c:${colors[k % 4]};--d:${(Math.random() * 1.8).toFixed(2)}s;--t:${(6 + Math.random() * 4).toFixed(2)}s;--s:${(.7 + Math.random() * .6).toFixed(2)}`;
        b.addEventListener('animationend', () => b.remove());
        box.append(b);
    }
}

// Abrir
$('abrir').addEventListener('click', () => {
    stage.classList.add('opening');
    setTimeout(() => {
        stage.classList.add('revealed');
        burst(W / 2, H * .45, 140); globos();
        const t = setInterval(rain, 120);
        setTimeout(() => clearInterval(t), 7000);
    }, 900);
});

// Más confeti al tocar la carta
$('card').addEventListener('click', e => { burst(e.clientX, e.clientY, 70); globos(6); });

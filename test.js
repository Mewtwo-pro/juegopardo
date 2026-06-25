const canvas = document.getElementById("miCanvas");
const ctx = canvas.getContext("2d");

// Imagen normal y su pose
const personajes = [
    {
        normal: "/assets/player/caraCposeA.png",
        pose: "/assets/player/caraCposeB.png"
    },
    {
        normal: "/assets/player/caraDposeA.png",
        pose: "/assets/player/caraDposeB.png"
    },
    {
        normal: "/assets/player/caraEposeA.png",
        pose: "/assets/player/caraEposeB.png"
    },
    {
        normal: "/assets/player/caraFposeA.png",
        pose: "/assets/player/caraFposeB.png"
    }
];

const playerFondo = new Image(); playerFondo.src = "/assets/player/fondo.png";
// Cargar imágenes
personajes.forEach(p => {
    p.imgNormal = new Image();
    p.imgNormal.src = p.normal;

    p.imgPose = new Image();
    p.imgPose.src = p.pose;
});

let angle = 0;
let targetAngle = 0;

const paso = (Math.PI * 2) / personajes.length;

// Alternar pose cada 500 ms
let usarPose = false;

setInterval(() => {
    usarPose = !usarPose;
}, 500);

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerFondo, 0, 0, canvas.width, canvas.height);
    angle += (targetAngle - angle) * 0.1;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const radioX = 200;
    const radioY = 50;

    const items = [];

    personajes.forEach((p, i) => {
        const itemAngle = angle + i * paso;

        const x = centerX + Math.cos(itemAngle) * radioX;
        const y = centerY + Math.sin(itemAngle) * radioY;

        const scale = 0.5 + (Math.sin(itemAngle) + 1) * 0.25;
        const size = 350 * scale;

        items.push({
            personaje: p,
            x,
            y,
            size
        });
    });
     // Encontrar la imagen que está más adelante
    let itemFrente = items[0];
    for (let i = 1; i < items.length; i++) {
        if (items[i].y > itemFrente.y) {
            itemFrente = items[i];
        }
    }
    // Dibujar de atrás hacia adelante
    items.sort((a, b) => a.y - b.y);
    items.forEach(item => {
        const esFrente = item === itemFrente;
        let img = item.personaje.imgNormal;
        if (esFrente) {
            img = usarPose
                ? item.personaje.imgPose
                : item.personaje.imgNormal;
        }
        // SOMBRA ELÍPTICA
        if (esFrente) {
            ctx.save();

            ctx.fillStyle = "rgba(0,0,0,0.8)";
            ctx.beginPath();

            ctx.ellipse(
                item.x,
                item.y + item.size * 0.48,
                item.size * 0.22,
                item.size * 0.06,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();
            ctx.restore();
        }

        ctx.save();

        if (esFrente) {
            ctx.filter = "blur(0px)";
            ctx.globalAlpha = 1;
        } else {
            ctx.filter = "blur(3px)";
            ctx.globalAlpha = 0.75;
        }

        ctx.drawImage(
            img,
            item.x - item.size / 2,
            item.y - item.size / 2,
            item.size,
            item.size
        );

        ctx.restore();
    });
              
            
    requestAnimationFrame(dibujar);
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        targetAngle -= paso;
    }

    if (e.key === "ArrowRight") {
        targetAngle += paso;
    }
});

dibujar();

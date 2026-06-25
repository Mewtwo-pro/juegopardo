const canvas = document.getElementById("miCanvas");
const ctx = canvas.getContext("2d");

// Imagen normal y su pose
const personajes = [
    {
        normal: "/assets/player/cara.png",
        pose: "/assets/player/carb.png"
    },
    {
        normal: "/assets/player/carb.png",
        pose: "/assets/player/carb.png"
    },
    {
        normal: "/assets/player/precara.png",
        pose: "/assets/player/carb.png"
    },
    {
        normal: "/assets/player/precarb.png",
        pose: "/assets/player/carb.png"
    }
];

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
        const size = 300 * scale;

        items.push({
            personaje: p,
            x,
            y,
            size
        });
    });

    // Encontrar la imagen que está más adelante
    let frente = 0;

    for (let i = 1; i < items.length; i++) {
        if (items[i].y > items[frente].y) {
            frente = i;
        }
    }

    // Dibujar de atrás hacia adelante
    items.sort((a, b) => a.y - b.y);

    items.forEach(item => {

        let img = item.personaje.imgNormal;

        // Si es el personaje del frente, alternar la pose
        if (item === items.find((_, idx) => {
            return items[idx].personaje === personajes[frente];
        })) {
            img = usarPose
                ? item.personaje.imgPose
                : item.personaje.imgNormal;
        }

        ctx.drawImage(
            img,
            item.x - item.size / 2,
            item.y - item.size / 2,
            item.size,
            item.size
        );
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

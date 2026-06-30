const canvas = document.getElementById("miCanvas");
const ctx = canvas.getContext("2d");

const namePlayer = [
    {
        normal: "/assets/player/carlos.png",
    },
    {
        normal: "/assets/player/fernando.png",
    },
    {
        normal: "/assets/player/elena.png",
    },
    {
        normal: "/assets/player/diego.png",
    }
];

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

let playerFondo = null;
function cargarImgData(){
    playerFondo = new Image();
    playerFondo.src = "/assets/player/playerfondo.png";
    personajes.forEach(p => {
        p.imgNormal = new Image();
        p.imgNormal.src = p.normal;
        p.imgPose = new Image();
        p.imgPose.src = p.pose;
    });
    namePlayer.forEach(p => {
        p.imgNormal = new Image();
        p.imgNormal.src = p.normal;
    });
}
//name player
let indiceActual = 0;
let indiceDestino = 0;

let animando = false;
let progreso = 0;
let direccion = 1; // 1=derecha, -1=izquierda
function siguiente() {
    if(animando) return;

    direccion = 1;
    indiceDestino = (indiceActual + 1) % namePlayer.length;

    progreso = 0;
    animando = true;
}

function anterior() {
    if(animando) return;

    direccion = -1;
    indiceDestino =
        (indiceActual - 1 + namePlayer.length) % namePlayer.length;

    progreso = 0;
    animando = true;
}
function dibujarImagen(img, x) {
    const w = 300;
    const h = 300;
    ctx.drawImage(
        img,
        x - w/2,
        500,
        w,
        h
    );
}

let angle = 0;
let targetAngle = 0;

const paso = (Math.PI * 2) / personajes.length;

// Alternar pose cada 500 ms
let usarPose = false;

setInterval(() => {
    usarPose = !usarPose;
}, 500);

function dibujarPersonaje() {
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
            
    if(!animando){

        const img =
            namePlayer[indiceActual].imgNormal;

        dibujarImagen(
            img,
            canvas.width/2
        );

    }else{

        progreso += 0.05;

        if(progreso >= 1){

            progreso = 1;

            indiceActual = indiceDestino;
            animando = false;
        }

        // easing suave
        const t =
            1 - Math.pow(1 - progreso, 3);

        const desplazamiento =
            canvas.width * t;

        const imgActual =
            namePlayer[indiceActual].imgNormal;

        const imgNueva =
            namePlayer[indiceDestino].imgNormal;

        if(direccion === 1){

            // actual sale a la izquierda
            dibujarImagen(
                imgActual,
                canvas.width/2 - desplazamiento
            );

            // nueva entra por la derecha
            dibujarImagen(
                imgNueva,
                canvas.width/2 + canvas.width - desplazamiento
            );

        }else{

            // actual sale a la derecha
            dibujarImagen(
                imgActual,
                canvas.width/2 + desplazamiento
            );

            // nueva entra por la izquierda
            dibujarImagen(
                imgNueva,
                canvas.width/2 - canvas.width + desplazamiento
            );

        }

    }
            
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        targetAngle -= paso;
        anterior();
    }

    if (e.key === "ArrowRight") {
        targetAngle += paso;
        siguiente();
    }
});
export function selectPlayerCargaImg(){
    cargarImgData();
}
export function selectPersonaje(){
    dibujarPersonaje();
}

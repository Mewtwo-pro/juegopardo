const personajes = [
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

// Cargar imágenes
personajes.forEach(p => {
    p.imgNormal = new Image();
    p.imgNormal.src = p.normal;
});

const canvas = document.getElementById("miCanvas");
const ctx = canvas.getContext("2d");

let indiceActual = 0;
let indiceDestino = 0;

let animando = false;
let progreso = 0;
let direccion = 1; // 1=derecha, -1=izquierda

function siguiente() {
    if(animando) return;

    direccion = 1;
    indiceDestino = (indiceActual + 1) % personajes.length;

    progreso = 0;
    animando = true;
}

function anterior() {
    if(animando) return;

    direccion = -1;
    indiceDestino =
        (indiceActual - 1 + personajes.length) % personajes.length;

    progreso = 0;
    animando = true;
}

document.addEventListener("keydown", e => {

    if(e.code === "ArrowRight"){
        siguiente();
    }

    if(e.code === "ArrowLeft"){
        anterior();
    }

});

function dibujarImagen(img, x) {

    const w = 300;
    const h = 300;

    ctx.drawImage(
        img,
        x - w/2,
        canvas.height/2 - h/2,
        w,
        h
    );
}

function actualizar() {

    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(!animando){

        const img =
            personajes[indiceActual].imgNormal;

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
            personajes[indiceActual].imgNormal;

        const imgNueva =
            personajes[indiceDestino].imgNormal;

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

    requestAnimationFrame(actualizar);
}

actualizar();

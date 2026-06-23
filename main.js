const canvas = document.getElementById("miCanvas");
const ctx= canvas.getContext("2d");

const fondo = new Image();
fondo.src = "fondo.png";


const tituloa= new Image();
tituloa.src = "tituloa.png";
const titulob= new Image();
titulob.src = "titulob.png";
const imgNormal = new Image();
const imgHover = new Image();

imgNormal.src = "start.png";
imgHover.src = "start-hover.png";

const btnX =170;
const btnY = 210;
const btnW = 250;
const btnH = 100;  
let hover = false;

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fondo , 0 , 0 , canvas.width , canvas.height);
    ctx.drawImage(titulob, 0 , -200 , 600 , 600);

    if (hover) {
        const scale = hover ? 1.1 : 1.0;
    const w = btnW * scale;
    const h = btnH * scale;

    // Mantener el botón centrado al escalar
    const x = btnX - (w - btnW) / 2;
    const y = btnY - (h - btnH) / 2;

    const imagen = hover ? imgHover : imgNormal;

    ctx.drawImage(imagen, x, y, w, h);
        
    } else {
        ctx.drawImage(imgNormal, btnX, btnY, btnW, btnH);
    }
}

const cuadrado = {x: 0 , y : 50 , size : 50}
const distanciaTotal = 50
const duracionMovimiento = 2000
const tiempoEspera = 10000
        
let startTime = null;
let estado = "mover"
let posStart = 0
function dibujarAnimation(timestamp){
    if(!startTime) startTime = timestamp
    const elepsed = timestamp - startTime
    
    ctx.drawImage(tituloa , 0 , -50 , 600 , 600);
    ctx.fillStyle = "blue"
    if (estado == "mover"){
        const progreso = Math.min(elepsed/ duracionMovimiento , 1)
        cuadrado.x = distanciaTotal* (progreso*progreso); 
        if (progreso == 1){
            estado = "esperar"
            startTime = timestamp
        }
    }else if (estado == "esperar"){
        cuadrado.x = distanciaTotal
        if(elepsed >= tiempoEspera){
            estado = "regresar"
            startTime =timestamp 
        }
    }else if (estado == "regresar"){
        const progreso = Math.min(elepsed / duracionMovimiento , 1)
        cuadrado.x = distanciaTotal - (distanciaTotal * progreso)
        if (progreso == 1){
            estado = "mover"
            startTime = timestamp
        }
    }
    ctx.drawImage(tituloa , cuadrado.x , -50 , 600 , 600);
    requestAnimationFrame(dibujarAnimation)
}
    
imgNormal.onload = () => {
    if (imgHover.complete)
        dibujar();
};

imgHover.onload = () => {
    if (imgNormal.complete)
        dibujar();
};

requestAnimationFrame(dibujarAnimation)
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    hover =
        mouseX >= btnX &&
        mouseX <= btnX + btnW &&
        mouseY >= btnY &&
        mouseY <= btnY + btnH;

    dibujar();
});

canvas.addEventListener("mousedown", (e) => {
    if (hover) {
        alert("¡Botón presionado!");
    }
});
    
//animar

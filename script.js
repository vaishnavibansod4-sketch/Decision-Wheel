const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let rotation = 0;

const colors = [
    "#ff595e",
    "#ffca3a",
    "#8ac926",
    "#1982c4",
    "#6a4c93",
    "#f72585",
    "#43aa8b",
    "#f9844a",
    "#90be6d",
    "#577590",
    "#ff99c8",
    "#a0c4ff",
    "#bdb2ff",
    "#ffc6ff",
    "#ffd6a5",
    "#caffbf",
    "#9bf6ff",
    "#fdffb6",
    "#e4c1f9",
    "#d0f4de"
];

document.getElementById("count").addEventListener("keydown", function(event){

    if(event.key === "Enter"){
        createInputs();
    }

});

function createInputs(){

    const number = parseInt(document.getElementById("count").value);

    const inputArea = document.getElementById("inputs");

    inputArea.innerHTML = "";

    if(isNaN(number) || number < 2){
        alert("Enter at least 2 options.");
        return;
    }

    for(let i = 1; i <= number; i++){

        const input = document.createElement("input");

        input.type = "text";

        input.placeholder = "Option " + i;

        input.className = "option";

        input.addEventListener("input", drawWheel);

        input.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        event.preventDefault();

        const allInputs =
            document.querySelectorAll(".option");

        if(i < number){

            allInputs[i].focus();

        }else{

            spinWheel();

        }

    }

});

        inputArea.appendChild(input);

    }

    drawWheel();

}
function getOptions(){

    return [...document.querySelectorAll(".option")]

        .map(function(input){
            return input.value.trim();
        })

        .filter(function(text){
            return text !== "";
        });

}

function drawWheel(){

    const options = getOptions();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const radius = 220;

    if(options.length === 0){

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        return;

    }

    const slice = (Math.PI * 2) / options.length;

    for(let i = 0; i < options.length; i++){

        ctx.beginPath();

        ctx.moveTo(centerX, centerY);

        ctx.fillStyle = colors[i % colors.length];

        ctx.arc(
            centerX,
            centerY,
            radius,
            rotation + (i * slice),
            rotation + ((i + 1) * slice)
        );

        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();

const angle = rotation + (i * slice) + (slice / 2);

const textRadius = radius * 0.65;

const x = centerX + Math.cos(angle) * textRadius;
const y = centerY + Math.sin(angle) * textRadius;

ctx.translate(x, y);

// Keep text upright
ctx.rotate(angle);

if (angle > Math.PI / 2 && angle < Math.PI * 1.5) {
    ctx.rotate(Math.PI);
}

ctx.fillStyle = "black";
ctx.font = "bold 18px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.fillText(options[i], 0, 0);

ctx.restore();

    }

    /* Centre Circle */

    ctx.beginPath();

    ctx.fillStyle = "white";

    ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);

    ctx.fill();

    ctx.strokeStyle = "#333";

    ctx.lineWidth = 3;

    ctx.stroke();

    /* Pointer */

    ctx.fillStyle = "#222";

ctx.beginPath();

ctx.moveTo(centerX - 15, 15);

ctx.lineTo(centerX + 15, 15);

ctx.lineTo(centerX, 45);

ctx.closePath();

ctx.fill();

}
function spinWheel(){

    const options = getOptions();

    if(options.length < 2){

        alert("Please enter at least 2 options.");

        return;

    }

    const slice = (Math.PI * 2) / options.length;

    const spins = 6 + Math.random() * 4;

    const extraAngle = Math.random() * Math.PI * 2;

    const startRotation = rotation;

    const endRotation =
        rotation + (spins * Math.PI * 2) + extraAngle;

    const duration = 5000;

    const startTime = performance.now();

    function animate(currentTime){

        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, 1);

        const eased =
            1 - Math.pow(1 - progress, 3);

        rotation =
            startRotation +
            (endRotation - startRotation) * eased;

        drawWheel();

        if(progress < 1){

            requestAnimationFrame(animate);

        }
        else{

            rotation = rotation % (Math.PI * 2);

            const pointerAngle = (Math.PI * 1.5 - rotation + Math.PI * 2) % (Math.PI * 2);

            let winnerIndex =
                Math.floor(pointerAngle / slice);

            winnerIndex =
                winnerIndex % options.length;

            document.getElementById("winner").innerHTML =
                "🎉 Winner: <br><br>" + options[winnerIndex];

        }

    }

    requestAnimationFrame(animate);

}

drawWheel();
const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#file-color"),
sizeSlider = document.querySelector("#size_slider"),
colorBtns = document.querySelectorAll(".colors .option_item"),
colorPicker = document.querySelector("#color_picker"),
allClearCanvas = document.querySelector(".clear_canvas"),
saveImg = document.querySelector(".save_canvas"),
ctx = canvas.getContext("2d");


let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
seleltedTool = "brush"
brushWidth = 5;
selectedColor = "#000";

const setCanvasBackground = () =>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () =>{
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBackground();
})
// rectangle operation
const drawRect = (e) =>{
    if(!fillColor.checked){
       return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    
}
// Circle operation
const drawCircle = (e) =>{
    ctx.beginPath();
    let redius = Math.sqrt(Math.pow(prevMouseX - e.offsetX , 2) + Math.pow(prevMouseX - e.offsetX , 2))
    ctx.arc(prevMouseX, prevMouseY, redius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}
// drawTriangle peraton
const drawTriangle = (e) =>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}
const startDraw = (e) =>{
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

const drawing = (e) => {
    if(!isDrawing) return ;
    ctx.putImageData(snapshot, 0 ,0)
    if(seleltedTool === "brush" || seleltedTool === "eraser") {
        ctx.strokeStyle = seleltedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }else if(seleltedTool === "rectangle") {
        drawRect(e)
    }else if(seleltedTool === "circle") {
        drawCircle(e)
    }else{
        drawTriangle(e)
    }
}


toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".option .active").classList.remove("active");
        btn.classList.add("active")
        seleltedTool = btn.id
        console.log(seleltedTool);
    });
});

sizeSlider.addEventListener("change", ()=> brushWidth = sizeSlider.value);


// color operation
colorBtns.forEach(btn =>{
    btn.addEventListener("click", () =>{
        document.querySelector(".option .selected").classList.remove("selected");
        btn.classList.add("selected")
        selectedColor = (window.getComputedStyle(btn).getPropertyValue("background-color"));
    });
});

// color picker operaton
colorPicker.addEventListener("change", () =>{
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

// allClearCanvas operation
allClearCanvas.addEventListener("click", () =>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
})
// saveImg operation
saveImg.addEventListener("click", () =>{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener('mousemove', drawing)
canvas.addEventListener("mouseup", () => isDrawing = false)
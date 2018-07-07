window.onload = function () {

$('body').on('contextmenu', '#work-area-canvas', function(e){ return false; });

updateCanvasSize();
document.getElementById("work-area-canvas").addEventListener('mouseup', addPoint, false);
}

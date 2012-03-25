$(function(){

  var cvsCursor = $('#cvsCursor'),
      ctxCursor = cvsCursor[0].getContext('2d'),
      ctxNoBeard = $('#cvsNoBeard')[0].getContext('2d');
      //ctxBeard = $('#cvsBeard')[0].getContext('2d');

  var imgBeard = $('<img src="MikeBeard.jpg" alt="Beard"/>'),
      imgNoBeard = new Image();

  imgNoBeard.src = 'MikeNoBeard.jpg';
  imgNoBeard.onload = function(ev) {
    $('body').prepend(imgBeard);
    ctxNoBeard.drawImage(imgNoBeard,0,0);
    ctxNoBeard.globalCompositeOperation = 'destination-out';
  };


  var prevPos = {x:0,y:0},
      offset = cvsCursor.offset(),
      brushSize = 10,
      mousedown = false,
      divisor = 10;
  cvsCursor.mousemove(function(ev){
    ctxCursor.clearRect(prevPos.x - brushSize*2, prevPos.y - brushSize*2, brushSize*4, brushSize*4);

    var x = prevPos.x = ev.offsetX;
    var y = prevPos.y = ev.offsetY;

    ctxCursor.beginPath();
    ctxCursor.arc(x,y,brushSize,0,Math.PI*2,true);
    ctxCursor.closePath();
    ctxCursor.stroke();

    if (mousedown) {
      var grad = ctxNoBeard.createRadialGradient(x, y, brushSize/divisor - 1, x, y, brushSize);
      grad.addColorStop(0.0, 'rgba(0,0,0,1.0)');
      grad.addColorStop(0.7, 'rgba(0,0,0,0.4)');
      grad.addColorStop(1.0, 'rgba(0,0,0,0.0)');
      ctxNoBeard.fillStyle = grad;
      ctxNoBeard.fillRect(0, 0, 500, 646);
    }

  }).mouseout(function(){
    ctxCursor.clearRect(prevPos.x - brushSize*2, prevPos.y - brushSize*2, brushSize*4, brushSize*4);
  }).mousedown(function(ev){
    mousedown = true;
  }).click(function(ev){

  });

  $('html').mouseup(function(ev){
    mousedown = false;
  });

  brushSize = $('#brushSize').change(function(ev){
    brushSize = $(this).val();
  }).val();

});
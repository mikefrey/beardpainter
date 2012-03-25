$(function(){

  var cvsCursor = $('#cvsCursor'),
      ctxCursor = cvsCursor[0].getContext('2d'),
      ctxNoBeard = $('#cvsNoBeard')[0].getContext('2d'),
      cvsBrush = $('#cvsBrush'),
      ctxBrush = cvsBrush[0].getContext('2d');

  var imgBeard = $('<img src="MikeBeard.jpg" alt="Beard"/>'),
      imgNoBeard = new Image();

  imgNoBeard.src = 'MikeNoBeard.jpg';
  imgNoBeard.onload = function(ev) {
    $('#composition').prepend(imgBeard);
    ctxNoBeard.drawImage(imgNoBeard,0,0);
    calcBrushSize();
    setBrushType();
  };


  var prevPos = {x:0,y:0},
      offset = cvsCursor.offset(),
      brushSize = 10,
      brushType = 'paint',
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
    if (mousedown) console.log('Click!');
  });

  $('html').mouseup(function(ev){
    mousedown = false;
  });

  $('input[name="brushType"]').click(setBrushType);



  // Brush size

  var brushw = cvsBrush.width(),
      brushh = cvsBrush.height();
  brushSize = $('#brushSize').change(calcBrushSize).val();

  function calcBrushSize(ev){
    brushSize = $('#brushSize').val();
    ctxBrush.clearRect(0,0,brushw,brushh);
    ctxBrush.beginPath();
    ctxBrush.arc(brushw/2, brushh/2, brushSize, 0, Math.PI*2, true);
    ctxBrush.closePath();
    ctxBrush.stroke();
  }


  // Brush type

  function setBrushType() {
    if ($('#ctrlPaint').prop('checked')) {
      brushType = 'paint';
      ctxNoBeard.globalCompositeOperation = 'destination-out';
    } else {
      brushType = 'erase';
      ctxNoBeard.globalCompositeOperation = 'source-over';
    }
  }

});
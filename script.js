$(function(){

  var cvsCursor = $('#cvsCursor'),
      ctxCursor = cvsCursor[0].getContext('2d'),
      ctxActive = $('#cvsActive')[0].getContext('2d'),
      ctxSurface = $('#cvsSurface')[0].getContext('2d'),
      cvsBrush = $('#cvsBrush'),
      ctxBrush = cvsBrush[0].getContext('2d'),
      imgActive;

  var imgBeard = new Image(),
      imgNoBeard = new Image();

  imgBeard.src = 'MikeBeard.jpg';
  imgNoBeard.src = 'MikeNoBeard.jpg';

  function loadImage(image) {
    var dfd = $.Deferred();
    image.onload = function(ev) {
      dfd.resolve();
    }
    return dfd.promise();
  }

  $.when(loadImage(imgBeard), loadImage(imgNoBeard)).done(function(){
    $('#composition').prepend(imgNoBeard);
    ctxSurface.drawImage(imgNoBeard,0,0);
    //ctxActive.drawImage(imgBeard,0,0);
    calcBrushSize();
    setBrushType();
  });


  var prevPos = {x:0,y:0},
      offset = cvsCursor.offset(),
      brushSize = 10,
      brushType = 'paint',
      mousedown = false,
      divisor = 10,
      offset;

  cvsCursor.mousemove(function(ev){
    ctxCursor.clearRect(prevPos.x - brushSize*2, prevPos.y - brushSize*2, brushSize*4, brushSize*4);

    if (ev.offsetX === undefined) {
      offset = $(this).offset();
      ev.offsetX = ev.pageX - offset.left;
      ev.offsetY = ev.pageY - offset.top;
    }

    var x = prevPos.x = ev.offsetX;
    var y = prevPos.y = ev.offsetY;

    ctxCursor.beginPath();
    ctxCursor.arc(x,y,brushSize,0,Math.PI*2,true);
    ctxCursor.closePath();
    ctxCursor.stroke();

    if (mousedown) {
      ctxActive.globalCompositeOperation = 'source-over';
      ctxActive.drawImage(imgActive, 0, 0);
      ctxActive.globalCompositeOperation = 'destination-in';

      var grad = ctxActive.createRadialGradient(x, y, brushSize/divisor - 1, x, y, brushSize);
      grad.addColorStop(0.0, 'rgba(0,0,0,1.0)');
      grad.addColorStop(0.7, 'rgba(0,0,0,0.4)');
      grad.addColorStop(1.0, 'rgba(0,0,0,0)');
      ctxActive.fillStyle = grad;
      ctxActive.fillRect(0, 0, 500, 646);

      var xx = x - brushSize - 10,
          yy = y - brushSize - 10,
          ww = brushSize*2 + 20,
          hh = brushSize*2 + 20;

      ctxSurface.drawImage(ctxActive.canvas, xx, yy, ww, hh, xx, yy, ww, hh);

      ctxActive.globalCompositeOperation = 'source-over';
      ctxActive.strokeStyle = '#FFFFFF';
      ctxActive.beginPath();
      ctxActive.rect(xx, yy, ww, hh);
      ctxActive.closePath();
      ctxActive.stroke();
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
  $('#brushSize').change(calcBrushSize);

  function calcBrushSize(ev){
    brushSize = parseInt($('#brushSize').val(), 10);
    ctxBrush.clearRect(0,0,brushw,brushh);
    ctxBrush.beginPath();
    ctxBrush.strokeStyle = '#FFFFFF';
    ctxBrush.arc(brushw/2, brushh/2, brushSize, 0, Math.PI*2, true);
    ctxBrush.closePath();
    ctxBrush.stroke();
  }


  // Brush type

  function setBrushType() {
    if ($('#ctrlPaint').prop('checked')) {
      brushType = 'paint';
      imgActive = imgBeard;
      // ctxNoBeard.globalCompositeOperation = 'destination-out';
    } else {
      brushType = 'erase';
      imgActive = imgNoBeard;
      // ctxNoBeard.globalCompositeOperation = 'source-over';
    }
  }

});
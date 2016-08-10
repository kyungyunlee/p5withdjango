s.appearRandomBox=function(){


var randomBeat=false;
var randomcol=color(240,10,20);
var random_rotateCameraX=0;
var random_rotateCameraY=0;

q.draw=function() {
  q.background(20);
  q.ambientLight(200);
  q.pointLight(200,150,100);
  q.specularMaterial(randomcol);
  q.camera(-100,-300,0);
  q.rotateX(q.radians(10));
  q.rotateX(q.radians(random_rotateCameraX));
  q.rotateY(q.radians(random_rotateCameraY));

  var random_timer = q.int(q.millis()/1000);
  if(random_timer>0){
    if (random_timer%30==0){
      random_rotateCameraY -=0.5;
      random_rotateCameraX -=0.5;
    }
    else if (random_timer%20==0){
      random_rotateCameraY +=0.2;
    }
    else if (random_timer%10==0){
      random_rotateCameraX +=0.5;
    }
  }

  var rand_amp=q.amplitude.getLevel();
  q.detectBeat(rand_amp);

  if (randomBeat){
    randombox.push(new q.randomBox(q.random(-800,0),q.random(0,-1000), q.random(20),q.color(q.random(150,255),q.random(0,150),20,200)));
  }
  if (randombox.length>20){
      randombox.splice(0,1);
    }
  if(amp<0.05){
    randombox.splice(0,randombox.length-1);
  }
  for(var i=0; i<randombox.length;i++){
    randombox[i].display();
  }
}

q.detectBeat=function(level){
  if(level>beatCutOff && level>beatThreshold){
    backgroundColor = color(random(255),random(255),random(255));
    boxColor = color(74,143,99);
    beatCutOff = level*1.2;
    countFramesSinceLastBeat=0;
    randomBeat=true;
  }
  else{
    randomBeat=false;

    boxColor = color(random(20,40), random(100,120), random(140,180));
    if(countFramesSinceLastBeat <= beatHoldFrames){
      countFramesSinceLastBeat++;
    }
    else{
      beatCutOff *= beatDecayRate;
      beatCutOff = Math.max(beatCutOff,beatThreshold);
    }
  }
}
}

var song,amplitude;
var musicPlaying =true;

var beatHoldFrames = 20;
//what amplitude level can trigger a beat
var beatThreshold = 0.4;
//when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
var beatCutOff = 0;
var beatDecayRate = 0.98;
var countFramesSinceLastBeat = 0;


function preload(){
  song=loadSound('static/assets/lifeincolor.mp3');
}

function setup(){
  song.play();
}


var callSketch1= function(p){
  var newbox = [];
  var newbox2=[];
  var cameraZ = 0;
  var zpos = -500;
  var w = 300;
  var l = 300;

  var onBeat=false;

  var sizeSlider;
  var moveCameraY = -300;
  var moveCameraX = 500;
  var angleOfCam=0;
  var boxheight;
  var amp;
  var amplitude;
  var timer=0;
  var canvas;

  p.setup=function(){
    canvas = p.createCanvas(p.windowWidth, p.windowHeight,p.WEBGL);
    canvas.parent('sketchholder1');
    p.frameRate(20);
    sizeSlider = p.createSlider(50,300,300,0.1);
    sizeSlider.position(canvas.x/2-10,canvas.y-30);

    boxColor = p.color(p.random(20,40), p.random(100,120), p.random(140,180));
    // p.angleOfCam=0;

    // song.play();
    amplitude = new p5.Amplitude();
    amplitude.setInput(song);
  }

  p.draw=function(){
    amp=amplitude.getLevel();
    timer = int(millis()/1000);
  // var timer = frameCount;
    // print(timer);
    p.background(20);
    p.ambientLight(150);
    p.pointLight(250, 250, 250, 200, 300, 100);

    if(timer>0){
      if (timer%30==0){
        angleOfCam-=1;
        moveCameraY+=15;
      }
      else if (timer%20==0){
        angleOfCam +=2;
        moveCameraY -=20;
      }
      else if (timer%10==0){
        angleOfCam -=1;
        moveCameraY +=5;
      }
    }

    p.rotateY(p.radians(angleOfCam));
    p.camera(moveCameraX, moveCameraY, cameraZ);


    boxheight = p.map(amp, 0, 1, 30, 2000);
    newbox.push(new p.NewBox(0, 0, zpos, sizeSlider.value(), boxheight, sizeSlider.value(),boxColor));
    newbox2.push(new p.NewBox(1000, 0, zpos, sizeSlider.value(), boxheight, sizeSlider.value(), boxColor));
    // detectBeat(amplitude.getLevel());

    for (var i = 0; i < newbox.length; i++) {
      newbox[i].display();
      newbox2[i].display();
    }

    if ((cameraZ-zpos)>5000){
      cameraZ -= sizeSlider.value()*1.3;
    }
    else {
      zpos -= sizeSlider.value() + 10;
      cameraZ -= sizeSlider.value();
    }
    if (newbox.length>100){
        newbox.splice(0,1);
        newbox2.splice(0,1);
      }
    }

  p.NewBox=function(x,y,z,w,h,l,boxcolor){
    // var npos = createVector(x,y,z);
    this.nx=x;
    this.ny=y;
    this.nz=z;
    this.newW=w;
    this.newH=h;
    this.newL=l;
    this.bc = boxcolor;

    this.display = function(){

      p.specularMaterial(this.bc);
      p.push();
      p.translate(this.nx,this.ny-this.newH/2,this.nz);
      p.box(this.newW,this.newH,this.newL);
      p.pop();
  }
}

  // p.keyPressed = function(){
  //   if(p.keyCode==32){
  //     if (musicPlaying){
  //       song.pause();
  //       musicPlaying=false;
  //     }
  //     else{
  //       song.play();
  //       musicPlaying=true;
  //     }
  //   }
  // }

}

var callSketch2 = function(p){
  var drawParticle = false;
  // var numOfPoints=30;
  var r=255;
  var g=255;
  var b=255;
  var lines=[];
  var canvas1;
  var amp1;
  var amplitude1;
  var fft;
  var strokeSlider;


  var beatHoldFrames = 20;
//what amplitude level can trigger a beat
  var beatThreshold = 0.4;
  //when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
  var beatCutOff = 0;
  var beatDecayRate = 0.98;
  var countFramesSinceLastBeat = 0;

  p.setup = function(){
    canvas1 = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas1.parent('sketchholder2');
    // song.play();
    amplitude1 = new p5.Amplitude();
    amplitude1.setInput(song);
    lines.push(new p.Lines(r,g,b));
    fft = new p5.FFT();
    fft.setInput(song);
    // p.smooth(1);
    strokeSlider = p.createSlider(2,30,30,1);
    strokeSlider.position(canvas1.x-10,canvas1.y-30);

  }
  p.draw=function(){
    amp1=amplitude1.getLevel();
    p.background(20);
    // p.amp = amplitude.getLevel();

    p.detectBeat(amp1);
    r=p.random(255);
    g=p.random(255);
    b=p.random(255);
    if (drawParticle==true){
      lines.push(new p.Lines(r,g,b));
    }
    if (lines.length>4){
      lines.splice(0,1);
    }
    for (var i=0; i<lines.length;i++){
      lines[i].display();
    }
  }

  p.Lines=function(r,g,b){
      this.op=255;
      this.lineR=r;
      this.lineG=g;
      this.lineB=b;
      this.history=[];

      this.numOfPoints=30;
      this.lengthBetweenPoints;
      this.heightOfPoints=[];

      this.smoothFactor=1;
      this.sum=[];
      this.newFreq=[];

      for (var i=0;i<this.numOfPoints;i++){
        this.sum[i]=0;
        this.newFreq[i]=0;
        this.heightOfPoints[i]=0;
      }

      for(var i=0;i<this.numOfPoints;i++){
          this.history[i]=[];
        }

      this.display=function(){
        this.lengthBetweenPoints = (p.windowWidth-100)/this.numOfPoints;

        var freq = fft.analyze();
        this.range = freq.length/this.numOfPoints; //1024/30

        this.col= color(this.lineR,this.lineG,this.lineB,this.op);
        p.stroke(this.col);
        p.strokeWeight(strokeSlider.value());
        p.noFill();
        // fill(255,1);
        p.ellipse(50,p.windowHeight/2,3,3);
        p.ellipse(p.windowWidth-50, p.windowHeight/2,3,3);

        p.beginShape();
        p.vertex(50,p.windowHeight/2);
        p.curveVertex(50,p.windowHeight/2);
        for(var i=0; i<this.numOfPoints;i++){
          this.heightOfPoints[i] = p.map(fft.getEnergy(this.range*i+1, this.range*i+this.range),0,255,0,p.windowHeight*0.8);
          p.curveVertex(i*this.lengthBetweenPoints+50, this.heightOfPoints[i]);
          // ellipse(i*lengthBetweenPoints+50, heightOfPoints[i]+30,1,1);
          this.history[i].push(this.heightOfPoints[i]);
        }
        p.curveVertex(p.windowWidth-50, p.windowHeight/2);
        p.vertex(p.windowWidth-50, p.windowHeight/2);
        p.endShape();


        for (var i=0;i<this.numOfPoints;i++){
          if (this.history[i].length>1){
            this.history[i].splice(0,1);
          }
          for (var j=0; j<this.history[i].length;j++){
            this.op=80*j+10;
            this.col= color(this.lineR,this.lineG,this.lineB,this.op);
            p.stroke(this.col);
            p.beginShape();
            p.vertex(50,p.windowHeight/2);
            p.curveVertex(50,p.windowHeight/2);
            for(var k=0; k<this.numOfPoints;k++){
              p.curveVertex(k*this.lengthBetweenPoints+50, this.history[k][j]);
            }
            p.curveVertex(p.windowWidth-50, p.windowHeight/2);
            p.vertex(p.windowWidth-50, p.windowHeight/2);
            p.endShape();
          }
        }
      }
  }
  // p.keyPressed = function(){
  //   if(p.keyCode==32){
  //     if (musicPlaying){
  //       song.pause();
  //       musicPlaying=false;
  //     }
  //     else{
  //       song.play();
  //       musicPlaying=true;
  //     }
  //   }
  // }
  p.detectBeat=function(level){
    if(level>beatCutOff && level>beatThreshold){
      p.backgroundColor = p.color(p.random(255),p.random(255),p.random(255));
      drawParticle = true;
      beatCutOff = level*1.2;
      countFramesSinceLastBeat=0;
    }
    else{
      drawParticle=false;
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

function keyPressed(){
  if (keyCode ==32){
    if (musicPlaying){
      song.pause();
      musicPlaying=false;
    }
    else{
      song.play();
      musicPlaying=true;
    }
  }
}






  s.freqcurve = function(){
    var drawParticle = false;
  // var numOfPoints=30;
    var r=255;
    var g=255;
    var b=255;
    var lines=[];
    q.amp1;
    // var strokeSlider;
    q.canvas2;


    q.beatHoldFrames = 20;
  //what amplitude level can trigger a beat
    q.beatThreshold = 0.4;
    //when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
    q.beatCutOff = 0;
    q.beatDecayRate = 0.98;
    q.countFramesSinceLastBeat = 0;

     q.setup = function(){

        lines.push(new q.Lines(r,g,b));

    }
      q.draw=function(){
        q.amp1=q.amplitude.getLevel();
        q.background(20);
        // q.amp = amplitude.getLevel();

        q.detectBeat(q.amp1);
        r=q.random(255);
        g=q.random(255);
        b=q.random(255);
        if (drawParticle==true){
          lines.push(new q.Lines(r,g,b));
        }
        if (lines.length>4){
          lines.splice(0,1);
        }
        for (var i=0; i<lines.length;i++){
          lines[i].display();
        }
      }

   //for freqcurve

  q.Lines=function(r,g,b){
      this.op=255;
      this.lineR=r;
      this.lineG=g;
      this.lineB=b;
      this.history=[];

      this.numOfPoints=30;
      this.lengthBetweenPoints;
      this.heightOfPoints=[];

      this.smoothFactor=1;
      this.sum=[];
      this.newFreq=[];
      this.freq;

      for (var i=0;i<this.numOfPoints;i++){
        this.sum[i]=0;
        this.newFreq[i]=0;
        this.heightOfPoints[i]=0;
      }

      for(var i=0;i<this.numOfPoints;i++){
          this.history[i]=[];
        }

      this.display=function(){
        this.lengthBetweenPoints = (q.windowWidth-100)/this.numOfPoints;

        this.freq = q.fft.analyze();
        this.range = this.freq.length/this.numOfPoints; //1024/30

        this.col= q.color(this.lineR,this.lineG,this.lineB,this.op);
        q.stroke(this.col);
        q.strokeWeight(20);
        q.noFill();
        // fill(255,1);
        q.ellipse(50,q.windowHeight/2,3,3);
        q.ellipse(q.windowWidth-50, q.windowHeight/2,3,3);

        q.beginShape();
        q.vertex(50,q.windowHeight/2);
        q.curveVertex(50,q.windowHeight/2);
        for(var i=0; i<this.numOfPoints;i++){
          this.heightOfPoints[i] = q.map(q.fft.getEnergy(this.range*i+1, this.range*i+this.range),0,255,0,q.windowHeight*0.8);
          q.curveVertex(i*this.lengthBetweenPoints+50, this.heightOfPoints[i]);
          // ellipse(i*lengthBetweenPoints+50, heightOfPoints[i]+30,1,1);
          this.history[i].push(this.heightOfPoints[i]);
        }
        q.curveVertex(q.windowWidth-50, q.windowHeight/2);
        q.vertex(q.windowWidth-50, q.windowHeight/2);
        q.endShape();


        for (var i=0;i<this.numOfPoints;i++){
          if (this.history[i].length>1){
            this.history[i].splice(0,1);
          }
          for (var j=0; j<this.history[i].length;j++){
            this.op=80*j+10;
            this.col= q.color(this.lineR,this.lineG,this.lineB,this.op);
            q.stroke(this.col);
            q.beginShape();
            q.vertex(50,q.windowHeight/2);
            q.curveVertex(50,q.windowHeight/2);
            for(var k=0; k<this.numOfPoints;k++){
              q.curveVertex(k*this.lengthBetweenPoints+50, this.history[k][j]);
            }
            q.curveVertex(q.windowWidth-50, q.windowHeight/2);
            q.vertex(q.windowWidth-50, q.windowHeight/2);
            q.endShape();
          }
        }
      }
  } ///////q.lines end


  q.detectBeat=function(level){
    if(level>q.beatCutOff && level>q.beatThreshold){
      backgroundColor = q.color(q.random(255),q.random(255),q.random(255));
      drawParticle = true;
      q.beatCutOff = level*1.2;
      q.countFramesSinceLastBeat=0;
    }
    else{
      drawParticle=false;
      if(q.countFramesSinceLastBeat <= q.beatHoldFrames){
        q.countFramesSinceLastBeat++;

      }
      else{
        q.beatCutOff *= q.beatDecayRate;
        q.beatCutOff = Math.max(q.beatCutOff,q.beatThreshold);

    }
  }
} ////////detectbeat end

}

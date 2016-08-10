var allSketch = function(q){
  q.song;
  var musicPlaying =true;
  q.allcanvas;
  var state='movingbox';
  var button1;
  var button2;
  var button3;
  q.amplitude;
  q.fft;
  var canvas1;
  var canvas2;
  var reset;

  q.preload=function(){
    q.song=q.loadSound('static/assets/lifeincolor.mp3');
  }

  q.setup=function(){
    q.createCanvas(q.windowWidth,q.windowHeight,q.WEBGL);

    q.song.play();
    q.frameRate(20);

    button1=q.createButton('sketch1');
    button1.position(0,0);
    button1.mousePressed(s.movingbox);

    button2=q.createButton('sketch2');
    button2.position(60,0);
    button2.mousePressed(s.spreadingShapes);

    q.amplitude = new p5.Amplitude();
    q.amplitude.setInput(q.song);

    q.fft = new p5.FFT();
    q.fft.setInput(q.song);

  }

  q.draw=function(){
    q.background(20);
    // if button clicked hide div.


  }

  var s={};

  s.movingbox = function(){
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
    q.amp;
    var timer=0;

    q.boxColor=q.color(q.random(20,40), q.random(100,120), q.random(140,180));

    var canvas1;

     q.setup=function(){
      // canvas1=q.createGraphics(q.windowWidth,q.windowHeight,q.WEBGL);
      // canvas1=q.createGraphics(q.windowWidth,q.windowHeight,q.WEBGL);
      // canvas1.parent('sketchholder1');
      // q.frameRate(20);
      // sizeSlider = q.createSlider(50,300,300,0.1);
      // sizeSlider.position(300,500);
      // q.boxColor = q.color(q.random(20,40), q.random(100,120), q.random(140,180));
      // q.angleOfCam=0;
      // song.play();
      // q.amplitude = new p5.Amplitude();
      // q.amplitude.setInput(q.song);
      console.log('dd');
    }

      q.draw=function(){
        canvas1=q.createGraphics(q.windowWidth,q.windowHeight,q.WEBGL);
        // console.log(q.boxColor);
        // canvas1.background(10);
        q.background(20);
        q.ambientLight(150);
        q.pointLight(250, 250, 250, 200, 300, 100);
        q.amp=q.amplitude.getLevel();
        timer = q.int(q.millis()/1000);
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

        q.rotateY(q.radians(angleOfCam));
        q.camera(moveCameraX, moveCameraY, cameraZ);


        boxheight = q.map(q.amp, 0, 1, 30, 2000);
        newbox.push(new q.NewBox(0, 0, zpos, 300, boxheight, 300, q.boxColor));
        newbox2.push(new q.NewBox(1000, 0, zpos, 300, boxheight, 300, q.boxColor));

        for (var i = 0; i < newbox.length; i++) {
          newbox[i].display();
          newbox2[i].display();
        }

        if ((cameraZ-zpos)>5000){
          cameraZ -= 300*1.3;
        }
        else {
          zpos -= 300 + 10;
          cameraZ -= 300;
        }
        if (newbox.length>100){
            newbox.splice(0,1);
            newbox2.splice(0,1);
          }
      }

      q.NewBox=function(x,y,z,w,h,l,bc){
        this.nx=x;
        this.ny=y;
        this.nz=z;
        this.newW=w;
        this.newH=h;
        this.newL=l;
        this.bc = bc;
        this.display = function(){
          q.specularMaterial(this.bc);
          q.push();
          q.translate(this.nx,this.ny-this.newH/2,this.nz);
          q.box(this.newW,this.newH,this.newL);
          q.pop();
       }
      }



  } //////////movingbox end

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

  s.spreadingShapes=function(){
    q.beatHoldFrames = 20;
  //what amplitude level can trigger a beat
    q.beatThreshold = 0.4;
    //when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
    q.beatCutOff = 0;
    q.beatDecayRate = 0.98;
    q.countFramesSinceLastBeat = 0;

    var spreadingOnBeat=false;
    var bouncingspheres=[];
    var spreadingline=[];
    var centershape;
    var spreading_angle=0;
    var spreading_rotateCameraX=0;
    var spreading_rotateCameraY=0;
    var spreading_rotateCameraZ=0;

    var spreading_rectColor;
    var smallMult;

    q.setup=function(){
      bouncingspheres.push(new q.bouncingSphere());
      centershape=new q.centerShape();
      spreading_rectColor=q.color(0,200,255);
    }
    q.draw=function(){
      q.background(20);
      q.ambientLight(200);
      q.pointLight(250, 250, 250, 200, 300, 100);
      q.specularMaterial(spreading_rectColor);

      q.rotateX(q.radians(spreading_rotateCameraX));
      q.rotateY(q.radians(spreading_rotateCameraY));
      q.camera(0,0,0);
      // pop();
      var spreading_timer = q.int(q.millis()/1000);
      if(spreading_timer>0){
        if (spreading_timer%30==0){
          spreading_rotateCameraY -=2;
        }
        else if (spreading_timer%20==0){
          spreading_rotateCameraX +=3;
        }
        else if (spreading_timer%10==0){
          spreading_rotateCameraY +=1;
        }
      }

        centershape.update();
        centershape.display();

        var spreading_amp=q.amplitude.getLevel();
        q.detectBeat(spreading_amp);

        smallMult=q.map(spreading_amp,0,1,1,5);

        if(spreadingOnBeat){
          spreading_rectColor=q.color(10,q.random(0,255),q.random(200,255));
          spreadingline.push(new q.spreadingLine(spreading_rectColor,smallMult));
        }

        if(spreadingline.length>20){
          spreadingline.splice(0,10);
        }
        for (var i=0;i<spreadingline.length;i++){
          spreadingline[i].update();
          spreadingline[i].display();
        }

    }

    q.spreadingLine=function(rectColor,smallMult){
      this.x;
      this.y;
      this.rectColor=rectColor;
      this.startRadius=1;
      this.numOfLines=20;
      this.boxlength=5;
      this.angle=0;
      this.z=0;
      this.radiusMult=1;
      this.smallSize=5;
      this.individual=0;

      this.update=function(){
        var spreading_amp2=q.amplitude.getLevel();
        this.radiusMult=map(spreading_amp2,0,1,0,14);
        this.startRadius+=1*this.radiusMult;

        // this.z+=3;
      }
      this.display=function(){
        q.specularMaterial(this.rectColor);
        // rotateZ(radians(this.angle));
        // rotateY(radians(this.angle));
        for(var i=0;i<this.numOfLines;i++){
          this.x=this.startRadius*cos(TWO_PI/this.numOfLines*i);
          this.y= this.startRadius*sin(TWO_PI/this.numOfLines*i);
          q.push();
          q.translate(this.x,this.y,this.z);
          q.rotateX(radians(this.individual));
          q.rotateY(radians(this.individual));
          q.box(this.smallSize*smallMult);
          q.pop();
          this.individual+=0.1;
          // boxlength+=5;
        }
        this.angle+=0.1;
        if (this.boxlength>50){
          this.boxlength=50;
        }
      }
      q.bouncingSphere =function(){
        this.x;
        this.y;
        this.startRadius=20;
        this.numOfSpheres=100;
        this.history=[];

        this.update=function(){
          var bounce_amp=amplitude.getLevel();
          this.startRadius=q.map(bounce_amp,0,1,0,300);


          var v=q.createVector(this.x,this.y,0);
          this.history.push(v);

          if(this.history.length>5){
            this.history.splice(0,1);
          }
        }
        this.display=function(){
          for (var i=0;i<this.numOfSpheres;i++){
            this.x=this.startRadius*q.cos(TWO_PI/this.numOfSpheres*i);
            this.y= this.startRadius*q.sin(TWO_PI/this.numOfSpheres*i);
            q.push();
            q.translate(this.x,this.y,0);
            q.sphere(3);
            q.pop();
          }
        }
      }
      q.centerShape=function(){
        this.x;
        this.y;
        this.boxsize=30;

        this.update=function(){
          var center_amp=amplitude.getLevel();
          this.boxsize=map(center_amp,0,1,0,100);

        }
        this.display=function(){
          this.x=0;
          this.y=0;
          sphere(this.boxsize);
        }
      }

        q.detectBeat=function(level){
          if(level>q.beatCutOff && level>q.beatThreshold){
            backgroundColor = q.color(q.random(255),q.random(255),q.random(255));
            spreadingOnBeat = true;
            q.beatCutOff = level*1.2;
            q.countFramesSinceLastBeat=0;
          }
          else{
            spreadingOnBeat=false;
            if(q.countFramesSinceLastBeat <= q.beatHoldFrames){
              q.countFramesSinceLastBeat++;

            }
            else{
              q.beatCutOff *= q.beatDecayRate;
              q.beatCutOff = Math.max(q.beatCutOff,q.beatThreshold);

          }
        }
      }

    }////spreadingline end


  }


}

// function keyPressed(){
//   if (keyCode ==32){
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





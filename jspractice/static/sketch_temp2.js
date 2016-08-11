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
  var allcanvas;
  var reset;
  q.beatHoldFrames = 20;
//what amplitude level can trigger a beat
  q.beatThreshold = 0.4;
  //when we have a beat, beatcutoff will be reset to 1.1*beatTreshold and then decay
  q.beatCutOff = 0;
  q.beatDecayRate = 0.98;
  q.countFramesSinceLastBeat = 0;

  ////setup for moving box
  var onBeat=false;

  ///////setup for spreadingline
  q.bouncingspheres=[];
  var bouncingX,bouncingY;
  var spreading_rectColor;
  var numOfBouncingCircles=20;
  var spreadingOnBeat=false;
////////////////////////////////

////////setup for random box
  q.randombox=[];
  var randomBeat=false;

  q.preload=function(){
    q.song=q.loadSound('static/assets/colours.mp3');
  }
  q.setup=function(){
    q.createCanvas(q.windowWidth,q.windowHeight,q.WEBGL);
    q.song.play();
    s.movingbox();

    button1=q.createButton('');
    button1.parent('button1');
    button1.size(232,140);
    button1.style('background','rgba(255,255,255,0)');
    button1.style('border','0px');
    button1.mousePressed(s.movingbox);

    button2=q.createButton('');
    button2.parent('button2');
    button2.size(232,140);
    button2.style('background','rgba(255,255,255,0)');
    button2.style('border','0px');
    button2.mousePressed(s.spreadingShapes);

    button3=q.createButton('');
    button3.parent('button3');
    button3.size(232,140);
    button3.style('background','rgba(255,255,255,0)');
    button3.style('border','0px');
    button3.mousePressed(s.appearRandomBox);

    button4=q.createButton('');
    button4.parent('button4');
    button4.size(232,140);
    button4.style('background','rgba(255,255,255,0)');
    button4.style('border','0px');
    button4.mousePressed(s.shootingBall);

    q.amplitude = new p5.Amplitude();
    q.amplitude.setInput(q.song);

    q.fft = new p5.FFT();
    q.fft.setInput(q.song);

/////////for spreadingline
    spreading_rectColor=q.color(39, 174, 96);
    for (var i=0;i<numOfBouncingCircles;i++){
      bouncingX=20*q.cos(q.random(q.TWO_PI/numOfBouncingCircles*i,q.TWO_PI/numOfBouncingCircles*i+q.TWO_PI/numOfBouncingCircles));
      bouncingY=20*q.sin(q.random(q.TWO_PI/numOfBouncingCircles*i,q.TWO_PI/numOfBouncingCircles*i+q.TWO_PI/numOfBouncingCircles));
      q.bouncingspheres.push(new q.bouncingSphere(bouncingX,bouncingY));
    }
  }
  q.draw=function(){
    q.background(20);
  }
////////////////////////////////////////////////////////////////
///////////////start individual sketches///////////////////////
  var s={};

  s.movingbox = function(){
    var newbox = [];
    var newbox2=[];
    var cameraZ = 0;
    var zpos = -500;
    var w = 300;
    var l = 300;
    var sizeSlider;
    var moveCameraY = -300;
    var moveCameraX = 500;
    var angleOfCam=0;
    var boxheight;
    q.amp;
    var timer=0;

    q.boxColor=q.color(q.random(20,40), q.random(100,120), q.random(140,180));

      q.draw=function(){
        q.frameRate(20);
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
        q.detectBeat(q.amp);
        q.rotateY(q.radians(angleOfCam));
        q.camera(moveCameraX, moveCameraY, cameraZ);
        if (onBeat){
          q.boxColor=q.color(q.random(255),q.random(255),q.random(255));
        }


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

  } //////////movingbox end//////////////////////////////

//////////////////////////////////////////////////////////////////

  s.spreadingShapes=function(){
    var spreadingline=[];
    var centershape;
    var spreading_angle=0;
    var spreading_rotateCameraX=0;
    var spreading_rotateCameraY=0;
    var spreading_rotateCameraZ=0;

    var smallMult;
    var circlePos=20;

    q.draw=function(){
      q.background(20);
      q.ambientLight(150,100);
      q.pointLight(200,150,100);
      q.specularMaterial(spreading_rectColor);

      q.rotateX(q.radians(spreading_rotateCameraX));
      q.rotateY(q.radians(spreading_rotateCameraY));
      q.camera(0,0,0);
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
      centershape = new q.centerShape();
        centershape.update();
        centershape.display();

        var spreading_amp=q.amplitude.getLevel();
        q.detectBeat(spreading_amp);

        smallMult=q.map(spreading_amp,0,1,1,5);

        if(spreadingOnBeat){
          if(spreading_amp>0.45){
            spreading_rectColor=q.color(q.random(180,231), q.random(40,80), q.random(40,100));
            }
            else{
            spreading_rectColor=q.color(q.random(60), q.random(140,235), q.random(70,180));
          }
          spreadingline.push(new q.spreadingLine(spreading_rectColor,smallMult));
        }

        if(spreadingline.length>10){
          spreadingline.splice(0,1);
        }
        for (var i=0;i<spreadingline.length;i++){
          spreadingline[i].update();
          spreadingline[i].display();
        }

        var mult_cpos=q.map(spreading_amp,0,1,1,10);
        var mult_maxspeed=q.map(spreading_amp,0,1,1,70);

        for (var i=0;i<q.bouncingspheres.length;i++){
          var bouncingC=q.createVector(circlePos*q.cos(q.TWO_PI/q.bouncingspheres.length*i)*mult_cpos, circlePos*q.sin(q.TWO_PI/q.bouncingspheres.length*i)*mult_cpos,0);
          q.bouncingspheres[i].pushpull(bouncingC,mult_maxspeed);
          q.bouncingspheres[i].update(mult_maxspeed);
          q.bouncingspheres[i].display();
        }

    }

    q.spreadingLine=function(rectColor,smallMult){
      this.x;
      this.y;
      this.rectColor=rectColor;
      this.smallMult=smallMult;
      this.startRadius=1;
      this.numOfLines=20;
      this.boxlength=5;
      this.angle=0;
      this.z=0;
      this.radiusMult=1;
      this.smallSize=3;
      this.individual=0;

      this.update=function(){
        var spreading_amp2=q.amplitude.getLevel();
        this.radiusMult=q.map(spreading_amp2,0,1,0,14);
        this.startRadius+=1*this.radiusMult;

      }
      this.display=function(){
        q.specularMaterial(this.rectColor);
        // rotateZ(radians(this.angle));
        // rotateY(radians(this.angle));
        for(var i=0;i<this.numOfLines;i++){
          this.x=this.startRadius*q.cos(q.TWO_PI/this.numOfLines*i);
          this.y= this.startRadius*q.sin(q.TWO_PI/this.numOfLines*i);
          q.push();
          q.translate(this.x,this.y,this.z);
          q.rotateX(q.radians(this.individual));
          q.rotateY(q.radians(this.individual));
          q.box(this.smallSize*this.smallMult);
          q.pop();
          this.individual+=0.1;
        }
        this.angle+=0.1;
      }
    } //end spreadingLine

      q.centerShape=function(){
        this.x;
        this.y;
        this.boxsize=30;
        this.spheredetail=20;

        this.update=function(){
          var center_amp=q.amplitude.getLevel();
          this.boxsize=q.map(center_amp,0,1,0,100);
          this.spheredetail=q.int(q.map(center_amp,0,1,3,7));
        }
        this.display=function(){
          this.x=0;
          this.y=0;
          q.sphere(this.boxsize,this.spheredetail,this.spheredetail);
        }
      }

    }////spreadingline end
      q.bouncingSphere =function(x,y){
        this.pos =q.createVector(x,y,0);
        this.vel=q.createVector(0,0,0);
        this.acc=q.createVector(0,0,0);
        this.startRadius=20;
        this.maxspeed=0.3;
        this.ampspeed=q.random(0.08,this.maxspeed);
        this.numOfSpheres=20;

        this.applyForce=function(f){
          this.acc.add(f);
        }
        this.pushpull=function(center,mult_max){
          var pushF=p5.Vector.sub(center,this.pos);
          var pushD=pushF.mag();
          pushF.normalize();
          var pushM=q.map(pushD,0,100,0,mult_max*this.ampspeed);
          pushF.setMag(pushM);
          this.applyForce(pushF);
        }

        this.update=function(mult_max){
          this.vel.add(this.acc);
          this.vel.limit(this.maxspeed*mult_max);
          this.pos.add(this.vel);
          this.acc.set(0,0);
          var bounce_amp=q.amplitude.getLevel();
          this.startRadius=q.map(bounce_amp,0,1,0,300);

        }
        this.display=function(){
          for (var i=0;i<this.numOfSpheres;i++){
            q.push();
            q.translate(this.pos.x,this.pos.y,0);
            q.sphere(3);
            q.pop();
          }
        }
    }///end bouncing sphere////////////////////////////////

///////////////appearRandomBox start///////////////////////////
    s.appearRandomBox=function(){
      var randomcol=q.color(240,10,20);
      var random_rotateCameraX=0;
      var random_rotateCameraY=0;
      var rand_amp;

      q.draw=function() {
        q.frameRate(20);
        q.background(20);
        q.ambientLight(200);
        q.pointLight(200,150,100);
        q.specularMaterial(randomcol);
        q.camera(-500,-300,0);
        q.rotateX(q.radians(5
           ));
        q.rotateX(q.radians(random_rotateCameraX));
        q.rotateY(q.radians(random_rotateCameraY));

        rand_amp=q.amplitude.getLevel();
        q.detectBeat(rand_amp);

        for(var i=0; i<q.randombox.length;i++){
          q.randombox[i].display();
        }

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

        if(rand_amp>0.35){
            q.randombox.push(new q.randomBox(q.random(-1000,0),-200,q.random(-1000,-600), q.random(5,10),q.color(q.random(200,255),q.random(190,240),20,200)));
        }
        else if(rand_amp>0.2){
            q.randombox.push(new q.randomBox(q.random(-1000,0),-50,q.random(-600,-300), q.random(10,15),q.color(q.random(170,250),q.random(100,150),20,200)));
        }
        else if(rand_amp>0.05 ){
            q.randombox.push(new q.randomBox(q.random(-1000,0),70,q.random(0,-300), q.random(15,20),q.color(q.random(150,200),q.random(0,40),20,200)));
        }

        // if(rand_amp>0.003){
        //     q.randombox.push(new q.randomBox(q.random(-800,0),q.random(0,-1000), q.random(20),q.color(q.random(150,255),q.random(0,150),20,200)));
        // }
        if (randomBeat){
          // q.randombox.push(new q.randomBox(q.random(-800,0),q.random(0,-1000), q.random(20),q.color(q.random(150,255),q.random(0,150),20,200)));
        }
        if (q.randombox.length>30){
            q.randombox.splice(0,1);
          }
        // if(rand_amp<0.02){
        //   q.randombox.splice(0,q.randombox.length-1);
        // }
      }

    }//////////////end random appear box////////////////////

    q.randomBox=function(x,y,z,randomnum,col){
      this.x=x;
      this.y=y;
      this.z=z;
      this.boxh=10;
      this.numOfRange=20;
      this.randomnum=randomnum;
      this.col=col;

      this.display=function(){
        q.specularMaterial(this.col);
        this.freq = q.fft.analyze();
        this.range = this.freq.length/this.numOfRange; //1024/30
        this.randomamp=q.amplitude.getLevel();
        // this.boxh=map(randomamp,0,1,10,300);
        this.boxh=q.map(q.fft.getEnergy(this.range*this.randomnum,this.range*this.randomnum+this.range),0,255,0,400);
        q.push();
        q.translate(this.x,this.y-this.boxh/2,this.z);
        q.rotateY(q.radians(40));
        q.box(80,this.boxh,80);
        q.pop();
      }
    }/////////end q.randombox

///////////shootingBall start/////////////////////////////////
    s.shootingBall=function(){
      var ballsize;
      var shooting_rotateCameraY=0;
      var ballcolor;
      var bouncecircle=[];

      q.draw=function(){
        q.frameRate(20);
        q.background(20);
        q.ambientLight(200);
      // pointLight(200,100,20);
        q.rotateY(q.radians(-90));
        q.camera(0,0,500);

        q.rotateY(q.radians(shooting_rotateCameraY));
        var shooting_timer = q.int(q.millis()/1000);
        if(shooting_timer>0){
          if (shooting_timer%30==0){
            shooting_rotateCameraY -=3.5;
          }
          else if (shooting_timer%20==0){
            shooting_rotateCameraY +=1;
          }
          else if (shooting_timer%10==0){
            shooting_rotateCameraY +=1.3;
          }
        }
        var shootamp=q.amplitude.getLevel();
        var shootspeedmult=q.map(shootamp,0,0.8,1,15);
        ballsize=q.map(shootamp,0.1,0.8,10,120);
        ballcolor=q.color(q.random(100,200),q.random(100),q.random(50));

        q.detectBeat(shootamp);
        if (shootamp>0.1){
          bouncecircle.push(new q.BounceCircle(ballsize,shootspeedmult,ballcolor));
        }

        for(var i=0;i<bouncecircle.length;i++){
          q.push();
          bouncecircle[i].shoot();
          bouncecircle[i].update();
          bouncecircle[i].display();
          q.pop();
        }
        if(bouncecircle.length>400){
          bouncecircle.splice(0,30);
        }
      }///////end shootingball.draw()

      q.BounceCircle=function(ballsize,shootspeedmult,col){
        this.pos=q.createVector(0,-100,0);
        this.vel=q.createVector(0,0,0);
        this.acc=q.createVector(0,0,0);
        var shootangle=q.random(10,30);
        var gravity=5;
        var shootspeed=3;
        this.shootspeedmult=shootspeedmult;
        this.ballsize=ballsize;
        this.col=col;

        this.shoot=function(){//amplitude determines the power of shoot
          this.vel.x+=q.random(-1,1);
          this.vel.z=shootspeed*this.shootspeedmult*q.cos(q.radians(shootangle));
          this.vel.y=-(shootspeed*this.shootspeedmult*q.sin(q.radians(shootangle))-gravity);
        }
        this.update=function(){
          this.vel.add(this.acc);
          this.pos.add(this.vel);
          this.acc.set(0,0);
        }
        this.display=function(){
          q.specularMaterial(this.col);
          q.push();
          q.translate(this.pos.x,this.pos.y,this.pos.z);
          q.sphere(this.ballsize);
          q.pop();
        }
      }/////end bounceCircle

    }
    /////////end shootingBall////////////////////////////////


    q.detectBeat=function(level){
        if(level>q.beatCutOff && level>q.beatThreshold){
          backgroundColor = q.color(q.random(255),q.random(255),q.random(255));
          spreadingOnBeat = true;
          randomBeat=true;
          onBeat=true;
          q.beatCutOff = level*1.2;
          q.countFramesSinceLastBeat=0;
        }
        else{
          spreadingOnBeat=false;
          randomBeat=false;
          onBeat=false;
          ///for movingbox color
           q.boxColor=q.color(q.random(20,40), q.random(100,120), q.random(140,180));
          if(q.countFramesSinceLastBeat <= q.beatHoldFrames){
            q.countFramesSinceLastBeat++;

          }
          else{
            q.beatCutOff *= q.beatDecayRate;
            q.beatCutOff = Math.max(q.beatCutOff,q.beatThreshold);

        }
      }
    }

  q.keyPressed=function(){
    if (q.keyCode ==32){
      if (musicPlaying){
        q.song.pause();
        musicPlaying=false;
      }
      else{
        q.song.play();
        musicPlaying=true;
      }
    }
  }
  }////////end







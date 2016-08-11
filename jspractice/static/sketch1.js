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

}/////////////end shootingBall

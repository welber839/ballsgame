// setup canvas
alert('利用\'w\' \'s\' \'a\' \'d\'鍵移動白色圓圈來吃掉彩球');
const para=document.querySelector('p');
var count=0;


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function Shape(x,y,velX,velY,exists){
	this.x = x;
	this.y = y;
	this.velX = velX; 
	this.velY = velY;
	this.exists= exists;
}

function Ball(x,y,velX,velY,exists,color,size){
	Shape.call(this,x,y,velX,velY,exists);
	
	this.color=color;
	this.size=size;
}

Ball.prototype=Object.create(Shape.prototype);
Ball.prototype.constructor=Ball;



Ball.prototype.draw=function(){
	ctx.beginPath();
	ctx.fillStyle=this.color;
	ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
	ctx.fill();
}

Ball.prototype.update=function(){
	
	if(this.x+this.size>=width){
		this.velX=-(this.velX);
	}
	
	if(this.x-this.size<=0){
		this.velX=-(this.velX);
	}
	
	if(this.y+this.size>=height){
		this.velY=-(this.velY);
	}
	
	if(this.y-this.size<=0){
		this.velY=-(this.velY);
	}
	
	this.x+=this.velX;
	this.y+=this.velY;
}

Ball.prototype.collisionDetect=function(){
	for(j=0;j<balls.length;j++){
		if(!(this.x===balls[j].x&&this.y===balls[j].y&&this.velX===balls[j].velX&&this.velY===balls[j].velY)){
			var dx=this.x-balls[j].x;
			var dy=this.y-balls[j].y;
			var distance=Math.sqrt(dx*dx+dy*dy);
			
			if (distance<this.size+balls[j].size){
				balls[j].color=this.color='rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')';
				balls[j].size=random(10,20);
				this.size=random(10,20);
			}
		}
	}
	
}


function EvilCircle(x,y,exists){
	Shape.call(this,x,y,20,20,exists);
	
	this.color = 'white';  //EvilCircle的顏色固定為白色
	this.size=10;    //尺寸固定為10因此不用設定參數
}
EvilCircle.prototype=Object.create(Shape.prototype);
EvilCircle.prototype.constructor=EvilCircle;

EvilCircle.prototype.draw=function(){
	ctx.beginPath();
	ctx.strokeStyle=this.color;
	ctx.lineWidth=3;
	ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
	ctx.stroke();
};

EvilCircle.prototype.checkBounds=function(){
	if(this.x+this.size>=width){
		this.x-=this.size;
	}
	
	if(this.x-this.size<=0){
		this.x+=this.size;
	}
	
	if(this.y+this.size>=height){
		this.y-=this.size;
	}
	
	if(this.y-this.size<=0){
		this.y+=this.size;
	}
};

EvilCircle.prototype.setControls=function(){
	window.onkeydown = e =>{
		switch(e.key){
			case 'a':
				this.x-=this.velX;
				break;
			case 'd':
				this.x+=this.velX;
				break;
			case 'w':
				this.y-=this.velY;
				break;
			case 's':
				this.y+=this.velY;
				break;	
		}
	};
};

EvilCircle.prototype.collisionDetect=function(){
	for(j=0;j<balls.length;j++){
		if(balls[j].exists){
			var dx=this.x-balls[j].x;
			var dy=this.y-balls[j].y;
			var distance=Math.sqrt(dx*dx+dy*dy);
			
			if (distance<this.size+balls[j].size){
				balls[j].exists=false;
				count--;
				para.textContent="Ball Count: "+count;
			}
		}
	}
}
var evil=new EvilCircle(random(0,width),random(0,height),true);
evil.setControls();

// x:random(0,width);
// y:random(0,height);
// velX:random(-7,7);
// velY:random(-7,7);
// color:"rgb("+random(0,255)+","+random(0,255)+","+random(0,255)+")"
// size:random(10,20)
// exists:true


var balls=[];

function loop(){
	ctx.fillStyle='rgba(0,0,0,0.25)';
	ctx.fillRect(0,0,width,height);
	
	while(balls.length<=25){
		var ball=new Ball(random(0,width),random(0,height),random(-7,7),random(-7,7),
		true,"rgb("+random(0,255)+","+random(0,255)+","+random(0,255)+")",random(10,20));
		balls.push(ball);
		count++;
		para.textContent='Ball Count: '+count;
	}
	
	for (i=0;i<balls.length;i++){
		if (balls[i].exists){
		balls[i].draw();
		balls[i].update();
		balls[i].collisionDetect();
		}
	}
	
	evil.draw();
	evil.checkBounds();
	evil.collisionDetect();
	
	requestAnimationFrame(loop);
}
loop();
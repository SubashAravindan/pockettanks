var canvas=document.getElementById('canvas');
var ctx=canvas.getContext("2d");
var backg=document.createElement("img");
backg.src="assets/images/back.jpg";

var vinput=document.getElementById("velocity");
var ainput=document.getElementById("angle");
var shootButton=document.querySelector("#shootButton");
var tankImg=document.createElement("img");
var startButton=document.querySelector("#startButton");
var controls=document.querySelector("#controls");
var type0Button=document.querySelector("#type0Button");
var type1Button=document.querySelector("#type1Button");
var angleUp=document.querySelector("#angleup");
var angleDown=document.querySelector("#angledown");
var normalBox=document.querySelector("#normalBox");
var specialBox=document.querySelector("#specialBox");
var velocityUp=document.querySelector("#velocityUp")
var velocityDown=document.querySelector("#velocityDown")
var velocityProgess=document.querySelector("#vDispIn");

tankImg.src="assets/images/Picture1.png";
var p=-1;
var k,i,a;
var paused=false;
var noOfShots=20;
var pauseButton=document.querySelector("#pauseButton");

var missile={
	"x":Number(100),
	"y":Number(530),
	"angle":'',
	"v":'',

}

function tank(x,y){
	this.xpos=x;
	this.ypos=y;
	this.score=0;
	this.normalMissile=8;
	this.specialMissile=2;
	this.draw=function(invert){
		if (invert) {
			ctx.save();
			ctx.translate(this.xpos,0);
			ctx.scale(-1,1);
			ctx.drawImage(tankImg,0,this.ypos,-78,30);
			ctx.restore();
		}
		else
		ctx.drawImage(tankImg,this.xpos,this.ypos,78,30);

	}
}


// var tank1 = new tank(50,520);
// var tank2 = new tank(1195,520);


// var mountainStartX=465-Math.floor(Math.random()*30);
// var mountainEndX=835+Math.floor(Math.random()*30);
// var arr=[];
// var peakElevation=5;
// for (var u = 1; u < 37; u++) {
// 	arr[u]=((550-(1.29729*u*5))-(Math.floor(Math.random()*70)));
// }

// var sarr=[];
// for (var u = 1; u < 37; u++) {
// 	sarr[u]=((arr[36]+peakElevation+(u*1.29729*5))-(Math.floor(Math.random()*70)));
// }



function gameOver(){
	if (tank1.score>tank2.score) {
		winner =1;
	} else if(tank2.score>tank1.score){
		winner=2;
	}
	else{
		winner=0;
	}
	controls.classList.add("hidden");
	pauseButton.classList.add("hidden");
	ctx.fillStyle="orange";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.font="50px Arial";
	if (winner) {
		ctx.fillText("Game Over!! Player "+winner+" wins!!",300,250);
	} else {
		ctx.fillText("Game Over!! Game is drawn!!",350,250);
	}
	
}



function startGame() {
	p=-1;
	a=0;
	pauseButton.classList.remove("hidden");
	ctx.drawImage(backg,0,0,canvas.width,canvas.height);
	tank1 = new tank(20+Math.random()*225,520);
	tank2 = new tank(1195-Math.random()*200,520);

	stopShoot();
	generateNewMount();
	drawElements();

	tank1.score=0;
	tank2.score=0;
}
// startGame();
startButton.addEventListener("click",startGame);

function drawMount() {
	ctx.beginPath();
	ctx.moveTo(mountainStartX,550);
	// ctx.lineTo(650,210);

	for (var u = 1; u < 185; u+=5) {
		ctx.lineTo(mountainStartX+u,arr[(u-1)/5 +1]);
	}	
	ctx.lineTo(650,arr[36]+peakElevation);


	// ctx.lineTo(835,550);

	for (var u = 1; u < 185; u+=5) {
		ctx.lineTo(650+u,sarr[(u-1)/5 +1]);
	}		

	ctx.lineTo(mountainEndX,550);
	ctx.closePath();
	ctx.fillStyle="#049617";
	ctx.fill();
	if(ctx.isPointInPath(missile.x,missile.y))
	{
		if (i) {
			explosion();
		}
		stopShoot();						
	}
	ctx.closePath();
}

function drawElements() {
	tank1.draw(1);
	tank2.draw(0);
	displayScore();
	displayTarget();
	ctx.fillStyle="#774120";
	ctx.fillRect(0,550,1300,50);
	drawMount();
}


// drawElements();

function generateNewMount() {
	mountainStartX=465-Math.floor(Math.random()*50);
	mountainEndX=835+Math.floor(Math.random()*50);
	arr=[];
	peakElevation=30;
	for (var u = 1; u < 37; u++) {
		arr[u]=((550-(1.29729*u*5))-(Math.floor(Math.random()*70)));
	}

	sarr=[];
	for (var u = 1; u < 37; u++) {
		sarr[u]=((arr[36]+peakElevation+(u*((550-arr[36]-peakElevation)/(mountainEndX-650))*5))-(Math.floor(Math.random()*70)));
	}
}

function shoot() {
	
	// ctx.fillStyle="red";
	// ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.save();
	ctx.globalAlpha="0.3";
	ctx.drawImage(backg,0,0,canvas.width,canvas.height);
	ctx.restore();

	drawMissile(i,t);
	i++;
	displayScore();
	k=requestAnimationFrame(shoot);
	checkImpact(t);
	drawElements();
	if (missile.y>=550) {
		stopShoot();
	}
}

function drawMissile(i) {
	ctx.beginPath();
	
	if (t===0) {
		ctx.fillStyle='cyan';
		r=3
	} else {
		ctx.fillStyle="red";
		r=6;

	}
	ctx.arc(missile.x,missile.y,r,0,Math.PI*2);
	ctx.fill();
	ctx.closePath();
	missile.x+=Math.cos((Math.PI/180)*missile.angle)*missile.v*p;
	missile.y-=(missile.v*Math.sin((Math.PI/180)*missile.angle))-(i/30);

}

shootButton.addEventListener("click",function(){

	controls.classList.add("hidden");
	a++;
	p*=-1;
	missile.v=Number(vinput.textContent)/25 + 4;
	missile.angle=Number(ainput.textContent);
	
	missile.x=p===1?tank1.xpos+78:tank2.xpos;
	missile.y=530;
	
	if (normalBox.classList.contains("active")) {
		p===1?tank1.normalMissile--:tank2.normalMissile--;
		t=0;
		shoot();
	} else {
		p===1?(tank1.specialMissile--):(tank2.specialMissile--);
		t=1;
		shoot();
	}	
	
	
});


function explosion() {

	e=1;
	intervalId=setInterval(function () {
		ctx.beginPath();
		ctx.moveTo(missile.x,missile.y);
		ctx.arc(missile.x,missile.y,e,0,2*Math.PI);
		ctx.closePath();
		ctx.fillStyle="#fcb70a";
		ctx.fill();
		if (t) {
			ctx.fillStyle="red";
			ctx.beginPath();
			ctx.arc(missile.x,missile.y,3*e/4,0,2*Math.PI);
			ctx.closePath();
			ctx.fill();
		}
		e+=1;
		if (e>16+24*t) {
			clearInterval(intervalId);
			ctx.drawImage(backg,0,0,canvas.width,canvas.height);
			drawElements();
		}
	},50);
}



function stopShoot() {
	i=0;
	cancelAnimationFrame(k);
	controls.classList.remove("hidden");
	updateMissiles();
	if (a>=noOfShots) {
		gameOver();
	}
}



function checkImpact(t) {
	if(missile.x>=(p===1?tank2.xpos:tank1.xpos)&&missile.x<=(p===1?tank2.xpos+78:tank1.xpos+78)&&missile.y>=520)
	{
		
		if(p===1){
			if (t) {
				tank1.score+=5;
			} else {
				tank1.score++;
			}
			
		}
		else{
			if (t) {
				tank2.score+=5;
			} else {
				tank2.score++;
			}
		}
		displayScore();
		stopShoot();
		explosion();
	}

}

function displayScore() {

	ctx.font= "20px Georgia";
	ctx.fillStyle="white";
	ctx.fillText("Score :",5,20);
	ctx.fillText("Score :",canvas.width-65,20);
	ctx.font= "30px Georgia";
	ctx.clearRect(0,30,30,30);
	ctx.clearRect(canvas.width-30,30,30,30);
	ctx.fillStyle="#1F0F29";
	ctx.fillRect(0,30,30,30);
	ctx.fillStyle="#1C0D24";	
	ctx.fillRect(canvas.width-30,30,30,30);
	ctx.fillStyle="white";
	ctx.fillText(tank1.score,10,50);
	ctx.fillText(tank2.score,canvas.width-30,50);
}



type0Button.addEventListener("click",function(){
	if ((p===-1?tank1.normalMissile:tank2.normalMissile)>0) {
		normalBox.classList.add("active");
		specialBox.classList.remove("active");
	} else {
		specialBox.classList.add("active");
		normalBox.classList.remove("active");
	}
})

type1Button.addEventListener("click",function(){
	if ((p===-1?tank1.specialMissile:tank2.specialMissile)>0) {

		specialBox.classList.add("active");
		normalBox.classList.remove("active");
	} else {
		normalBox.classList.add("active");
		specialBox.classList.remove("active");
	}
})

function updateMissiles(){
	if (p===-1) {
		type0Button.textContent="Normal "+tank1.normalMissile+" remaining";
		type1Button.textContent="Special "+tank1.specialMissile+" remaining";
		if (tank1.normalMissile<=0) {
			normalBox.classList.remove("active");
			specialBox.classList.add("active");
		}
		if (tank1.specialMissile<=0) {
			normalBox.classList.add("active");
			specialBox.classList.remove("active");
		}
	} 
	else {
		type0Button.textContent="Normal "+tank2.normalMissile+" remaining";
		type1Button.textContent="Special "+tank2.specialMissile+" remaining";

		if (tank2.normalMissile<=0) {
			normalBox.classList.remove("active");
			specialBox.classList.add("active");
		}
		if (tank2.specialMissile<=0) {
			normalBox.classList.add("active");
			specialBox.classList.remove("active");
		}
	}
}

pauseButton.addEventListener("click",function () {
	if (paused===true) {
		resume();		
		this.innerHTML="<i class='fas fa-pause'></i>  PAUSE";
	} else {
		pause();
		this.innerHTML="<i class='fas fa-play'></i>  RESUME";		
	}
	paused=!paused;
});

function pause() {
	if (i) {
		cancelAnimationFrame(k);
	}

	ctx.fillStyle="rgba(0, 0, 0, 0.7)";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle="orange";
	ctx.font="50px Arial";
	ctx.fillText("Game Paused",500,200);
	controls.classList.add("hidden");
}


function resume() {
	if(!i){
		controls.classList.remove("hidden");
		ctx.drawImage(backg,0,0,canvas.width,canvas.height);
		drawElements();
	}
	else{
	k=requestAnimationFrame(shoot);
	}

}


function displayTarget(){
	ctx.beginPath();
	if (p===-1) {
		ctx.moveTo(10*Math.cos(Math.PI*Number(ainput.textContent)/180)+tank1.xpos+78,530-10*Math.sin(Math.PI*Number(ainput.textContent)/180));
		ctx.setLineDash([7, 4]);
		ctx.lineTo(90*Math.cos(Math.PI*Number(ainput.textContent)/180)+tank1.xpos+78,530-90*Math.sin(Math.PI*Number(ainput.textContent)/180))
	} else {
		ctx.moveTo(tank2.xpos-10*Math.cos(Math.PI*Number(ainput.textContent)/180),530-10*Math.sin(Math.PI*Number(ainput.textContent)/180));
		ctx.setLineDash([7, 4]);
		ctx.lineTo(tank2.xpos-90*Math.cos(Math.PI*Number(ainput.textContent)/180),530-90*Math.sin(Math.PI*Number(ainput.textContent)/180))		
	}

	ctx.closePath();
	if (specialBox.classList.contains("active")) {
		ctx.strokeStyle="red";
	} else {
		ctx.strokeStyle="white";
	}

	
	ctx.stroke();
}

// ainput.addEventListener("change",function(){
// 	ctx.drawImage(backg,0,0,canvas.width,canvas.height);
// 	drawElements();
// 	console.log("change");
// 	displayTarget();
// })
	
angleUp.addEventListener("click",function () {
	ctx.drawImage(backg,0,0,canvas.width,canvas.height);
	ainput.textContent=Number(ainput.textContent)+1;
	drawElements();
	displayTarget();
})

angleDown.addEventListener("click",function () {
	ctx.drawImage(backg,0,0,canvas.width,canvas.height);
	ainput.textContent=Number(ainput.textContent)-1;
	displayTarget();
	drawElements();
})

velocityUp.addEventListener("click",function () {
	if (Number(vinput.textContent)<100){
		vinput.textContent=Number(vinput.textContent)+1;
		velocityProgess.style.width=vinput.textContent+"%";
	}
})

velocityDown.addEventListener("click",function () {
	if (Number(vinput.textContent)>0){
		vinput.textContent=Number(vinput.textContent)-1;
		velocityProgess.style.width=vinput.textContent+"%";
	}

})

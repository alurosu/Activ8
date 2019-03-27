var PU = null;
function powerUp(){
	this.type = 0;
	this.x = -50;
	this.xSpeed = cWidth/5;
	this.xDirection = 1;
	this.y = 0;
	this.width = cHeight/17;
	this.height = cHeight/17;
	this.cx = this.x + this.width*0.5;
	this.cy = this.y + this.height*0.5;
	// animation modifiers
	this.angle = Math.PI;
	this.sdY = 0;
	this.sdDirection = 1;
	
	this.draw = function(modifier){		
		if (this.x >= -this.width && this.x <= cWidth+this.width) {
			this.x += this.xDirection*this.xSpeed*modifier;
			this.cx += this.xDirection*this.xSpeed*modifier;
			ctx.beginPath();
			ctx.fillStyle="#fff";
			ctx.strokeStyle="#ccc";
			ctx.lineWidth = 1;
			ctx.arc(this.cx, this.cy,this.width*0.5,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			
			if (this.type == 1) {
				this.angle = this.angle + modifier*Math.PI;
				// power up: more bullets
				ctx.fillStyle="#008000";
				ctx.strokeStyle="#000";
				ctx.lineWidth = 1;
				
				ctx.beginPath();
				ctx.arc(
					this.cx + this.width*0.2 * Math.cos(this.angle),
					this.cy + this.width*0.2 * Math.sin(this.angle),
					this.width*0.2,0,2*Math.PI
				);
				ctx.fill();
				ctx.stroke();
				
				ctx.beginPath();
				ctx.arc(
					this.cx + this.width*0.2 * Math.cos(this.angle+Math.PI*2/3),
					this.cy + this.width*0.2 * Math.sin(this.angle+Math.PI*2/3),
					this.width*0.2,0,2*Math.PI
				);
				ctx.fill();
				ctx.stroke();
				
				ctx.beginPath();
				ctx.arc(
					this.cx + this.width*0.2 * Math.cos(this.angle+Math.PI*4/3),
					this.cy + this.width*0.2 * Math.sin(this.angle+Math.PI*4/3),
					this.width*0.2,0,2*Math.PI
				);
				ctx.fill();
				ctx.stroke();			
			} else if (this.type == 2) {
				// power up: slow down
				this.sdY = this.sdY + this.sdDirection * modifier*0.4;	
				if (this.sdY>0.1) {
					this.sdY = 0.1;
					this.sdDirection *=-1;
				} else if (this.sdY<0) {
					this.sdY = 0;
					this.sdDirection *=-1;
				}
				
				ctx.fillStyle="#FBB829";
				ctx.strokeStyle="#000";
				ctx.lineWidth = 1;
				
				ctx.beginPath();
				ctx.moveTo(this.x+this.width*0.25,this.y + this.height*(0.2 + this.sdY));
				ctx.lineTo(this.cx,this.y+ this.height*(0.3 + this.sdY));
				ctx.lineTo(this.x+this.width*0.75,this.y + this.height*(0.2 + this.sdY));
				ctx.lineTo(this.cx,this.y + this.height*(0.65 + this.sdY));
				ctx.closePath();
				ctx.fill();	
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(this.x+this.width*0.15,this.y + this.height*(0.4 + this.sdY));
				ctx.lineTo(this.cx,this.y + this.height*(0.5 + this.sdY));
				ctx.lineTo(this.x + this.width*0.85,this.y + this.height*(0.4 + this.sdY));
				ctx.lineTo(this.cx,this.y + this.height*(0.75 + this.sdY));
				ctx.closePath();
				ctx.fill();	
				ctx.stroke();
			}
		}
	};
	
	this.setX = function(x){
		this.x = x;
		this.cx = x + this.width*0.5;
	};
	
	this.setY = function(y){
		this.y = y;
		this.cy = y + this.height*0.5;
	};
}

var bullets = new Array();
function bullet(x) {
	this.speed = cHeight/1.5;
	this.radius = cHeight/50;
	
	if (x<this.radius)
		x = this.radius;
	if (x>cWidth-this.radius)
		x = cWidth-this.radius-2;
	this.x = x;
	this.y = cHeight;
	
	this.draw = function(){
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
		ctx.fillStyle="#008000";
		ctx.fill();
		ctx.strokeStyle="#000";
		ctx.lineWidth = 2;
		ctx.stroke();
	};
}

var targets = new Array();
var targetsCount = 4;
function target(value, x) {
	this.description = "";
	this.value = value;
	this.speed = cWidth/(targetsCount*2);
	this.width = cWidth/targetsCount;
	this.height = cWidth/(targetsCount*2);
	this.x = x;
	this.y = 0;
	this.draw = function(){
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle="#fcfcfc";
		
		if (this.value==1) {
			this.description = "I";
			ctx.fillStyle="#1693A5";
		} else if (this.value==2) {
			this.description = "II";
			ctx.fillStyle="#FBB829";
		} else if (this.value==3) {
			this.description = "III";
			ctx.fillStyle="#F02311";
		}
		
		ctx.fill();
		
		ctx.strokeStyle="#000";
		ctx.lineWidth = 1;
		ctx.stroke();
		
		ctx.beginPath();
		ctx.font = 0.2*this.height + "px Arial";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		//ctx.strokeStyle = '#000';
		//ctx.lineWidth = 2;
		//ctx.strokeText(this.value, this.x+this.width*0.45, this.y+this.height*0.8);
		ctx.fillStyle = "#ffffff";
		ctx.fillText(this.description, this.x+this.width*0.5, this.y+this.height*0.8);
	};
}

var isLogin = false;

var direction = 1;
var score = 0;
var bulletsNumber = 8;
var gameStarted = false;
var slow = 0;
var maxBullets = 8;

var cWidth;	  //canvas width
var cHeight;  //canvas height
var ctx; 		  //canvas context
var canvas;
var then;
var appPaused = false;
var countToAds = 5;

function onDeviceReady(){
	if (!localStorage.isSound)
		localStorage.isSound = "on";
	
	var gpurl = getPhoneGapPath();
	if (typeof(Media) != 'undefined') {
		hitSound = new Media(gpurl + 'data/audio/hit.mp3');
		
		scoreSound = new Media(gpurl + 'data/audio/score.mp3');
		pu1Sound = new Media(gpurl + 'data/audio/pu1.mp3');
		pu2Sound = new Media(gpurl + 'data/audio/pu2.mp3');
		
		snd = new Media(gpurl + "data/audio/background.mp3", onSuccess, onError, onStatus);
		snd.setVolume('0.8');
		
		if (localStorage.sound == 'off') {
			//sound is off
			$('#volume .fa').removeClass('fa-volume-up').addClass('fa-volume-off');
			snd.stop();
		} else {
			//sound is on or default
			localStorage.sound == 'on';
			$('#volume .fa').removeClass('fa-volume-off').addClass('fa-volume-up');
			snd.play();
		}
	}

	if (!localStorage.highscore)
		localStorage.highscore = 0;
	$('#bestOf').html('Best: ' + localStorage.highscore);
		
	init(); 
	var clickHandler = ('ontouchstart' in document.documentElement ? "touchstart" : "click");
	$("#canvas").on(clickHandler, function(e) {
		var x = e.originalEvent.touches?e.originalEvent.touches[0].pageX:e.clientX;
		var y = e.originalEvent.touches?e.originalEvent.touches[0].pageY:e.clientY;
		
		if (bulletsNumber>0 && gameStarted) {
			bullets.push(new bullet(x));
			bulletsNumber--;
			if (bullets.length>25)
				bullets.shift();
		}
	});
	
	$("#canvas").parents("*").css("overflow", "visible");
	
	$('#start').on(clickHandler, function(e) {
		if (!bulletsNumber) {
			targets = new Array();
			for (i=0; i<targetsCount+1; i++) {
				targets.push(new target(i==targetsCount?2:1, i*cWidth/targetsCount));
			}
		}
		bulletsNumber = 8;
		score = 0;
		firstBullet = -1;
		direction = 1;
		slow = 0;
		maxBullets = 8;
		
		gameStarted = true;
		$('#menu').fadeOut();
	});
	
	$("#achievements").on(clickHandler, function(e) {
		window.plugins.playGamesServices.showAchievements();
	});
	
	$('#rate').on(clickHandler, function(e) {
		openBrowser("market://details?id=alurosu.games.activ8");
	});
	
	$('#share').on(clickHandler, function(e) {
		window.plugins.socialsharing.share("My best score in Activ8 is " + localStorage.highscore + "! Can you beat me? :D https://bit.ly/activ8game", null, null, 'https://bit.ly/activ8game');
	});
	
	$("#leaderboard").on(clickHandler, function(e) {
		var dt = {
			leaderboardId: "CgkI8eHDiO0fEAIQAA"
		};
		window.plugins.playGamesServices.showLeaderboard(dt);
	});
	
	$('#volume').on(clickHandler, function(e) {
		if (typeof Media != 'undefined') {
			if (localStorage.isSound == 'on') {
				//sound goes off
				localStorage.isSound = 'off';
				$('#volume .fa').removeClass('fa-volume-up').addClass('fa-volume-off');
				snd.pause();
			} else {
				//sound goes on
				localStorage.isSound = 'on';
				$('#volume .fa').removeClass('fa-volume-off').addClass('fa-volume-up');
				snd.play();
			}
		}
	});
	
	$("#help").on(clickHandler, function(e) {
		$("#helpWindow").fadeIn();
	});
	$("#helpWindow button").on(clickHandler, function(e) {
		$("#helpWindow").fadeOut();
	});
	
	window.plugins.playGamesServices.auth(function(){ isLogin = true; }, function(){alert("Can't connect to the internet. Your score will not be saved on our leaderboard.");});
}

function init() {
	canvas = $("#canvas").get(0);
	canvas.width = cWidth = $("body").width();
	canvas.height = cHeight = $("body").height();
	$('#canvas').height(cHeight);
	
	$('#menu').css('top', $('body').height()/2-$('#menu').height()/2 + "px");
	$('#menu').css('left', $('body').width()/2-$('#menu').width()/2 + "px");
	
	PU = new powerUp();
	
	ctx = canvas.getContext("2d");
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame || function(f){window.setTimeout(f,1000/60)};
	
	for (i=0; i<targetsCount+1; i++) {
		targets.push(new target(i==targetsCount?2:1, i*cWidth/targetsCount));
	}
	bulletsNumber = 8;
	
	then = Date.now();
	loop();
}

function loop() {
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, cWidth, cHeight);
	
	var now = Date.now();
	var delta = now - then;
	then = now;
	update(delta / 1000);

	if(appPaused == false)
		requestAnimationFrame(loop);
};

function draw() {
	if (gameStarted) {
		ctx.beginPath();
		ctx.fillStyle = "#ccc";
		ctx.font = cHeight/3 + "px Helvetica";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.fillText(score, cWidth/2, cHeight/2);
		
		ctx.beginPath();
		ctx.font = "16px Helvetica";
		ctx.fillStyle = "#666";
		if (score == 0) {
			if (bulletsNumber == 8 && score == 0)
				ctx.fillText("- tap to shoot -", cWidth/2, cHeight/2+cHeight/6+8);
			else
				ctx.fillText("- make the targets identical -", cWidth/2, cHeight/2+cHeight/6+8);
		}	else {
			ctx.fillText("Speed: " + (score-slow).toString(), cWidth/2, cHeight/2+cHeight/6+8);
		}
	} 
}

function drawBulletsCount() {
	this.radius = cHeight/50;
	ctx.beginPath();
	ctx.arc(2*this.radius, cHeight-3*this.radius, this.radius, 0, 2*Math.PI);
	ctx.fillStyle="#008000";
	ctx.fill();
	ctx.strokeStyle="#000";
	ctx.lineWidth = 2;
	ctx.stroke();
	
	ctx.beginPath();
	ctx.fillStyle = "#000";
	ctx.font = 2*this.radius + "px Helvetica";
	ctx.textAlign="left";
	ctx.textBaseline="middle";
	ctx.fillText(bulletsNumber + "/" + maxBullets, 3.5*this.radius, cHeight-3*this.radius+2);
}

var firstBullet = -1;
var line = true;
var d = 0;
function update(modifier) {
	draw();
	drawBulletsCount();
	
	for (i=0; i<bullets.length; i++) {
		if (bullets[i].y > cWidth/(targetsCount*2)-bullets[i].radius) {
			bullets[i].y -= bullets[i].speed*modifier;
			bullets[i].draw();
		} else {
			// disable bullet until deleted
			firstBullet=i;
			bullets[i].y = cHeight+2*bullets[i].radius;
			bullets[i].speed = 0;
		}
		
		d = Math.sqrt( (bullets[i].x-PU.cx)*(bullets[i].x-PU.cx) + (bullets[i].y-PU.cy)*(bullets[i].y-PU.cy) );
		if (d<bullets[i].radius+PU.width/2) {
			if (isLogin) {
				// achievement
				var dt = {
					achievementId: "CgkI8eHDiO0fEAIQBQ"
				};
				window.plugins.playGamesServices.unlockAchievement(dt);
				
			}
			PU.setX(-50);
			if (PU.type == 1) {
				//reload
				maxBullets++;
				if (typeof(Media) != 'undefined')
					if (localStorage.isSound == "on") {
						pu1Sound.stop();
						pu1Sound.play();
					}
			} else {
				//slow
				slow++;
				if (typeof(Media) != 'undefined')
					if (localStorage.isSound == "on") {
						pu2Sound.stop();
						pu2Sound.play();
					}
			}
		}
	}
	
	line = true;
	for (i=0; i<targets.length; i++) {
		if (firstBullet != -1 && 
				bullets[firstBullet].x < targets[i].width+targets[i].x && 
				targets[i].x < bullets[firstBullet].x) {
			if (typeof(Media) != 'undefined')
				if (localStorage.isSound == "on") {
					hitSound.stop();
					hitSound.play();
				}

			if (targets[i].value == 3)
				targets[i].value = 1;
				else
				targets[i].value++;
			firstBullet = -1;
		}
		
		if (i>0 && targets[i].value!=targets[i-1].value)
			line = false;
		
		targets[i].x += direction*targets[i].speed*modifier*((score-slow)/3+1);
		if (direction == 1) {
			if (targets[i].x > cWidth)
				targets[i].x = -targets[i].width+targets[i].x-cWidth;
		} else {
			if (targets[i].x < -targets[i].width)
				targets[i].x = cWidth+(targets[i].x+targets[i].width);
		}
		
		if (bulletsNumber == 0 && bullets[bullets.length-1].y > cHeight && line == false) {
			if (gameStarted) {
				$('#menu').fadeIn();
				gameStarted = false;
				$('#highscore > span').html('Score: ' + score);
				if (isLogin) {
					var dt = {
						score: score,
						leaderboardId: "CgkI8eHDiO0fEAIQAA"
					};
					window.plugins.playGamesServices.submitScore(dt);
				}
				if (countToAds == 1) {
					//show ads
					$('#fullAds').fadeIn();
					countToAds = 5;
				} else countToAds--;
			}
		}
			
		targets[i].draw();
	}
	
	if (line) {
		score++;
		if (score>3)
			setTimeout(setPU, 3000);
		
		if (isLogin) {
			// check achievements
			if (score == 5) {
				var dt = {
					achievementId: "CgkI8eHDiO0fEAIQAQ"
				};
				window.plugins.playGamesServices.unlockAchievement(dt);
			} else if (score == 10) {
				var dt = {
					achievementId: "CgkI8eHDiO0fEAIQAg"
				};
				window.plugins.playGamesServices.unlockAchievement(dt);
			} else if (score == 15) {
				var dt = {
					achievementId: "CgkI8eHDiO0fEAIQAw"
				};
				window.plugins.playGamesServices.unlockAchievement(dt);
			} else if (score == 20) {
				var dt = {
					achievementId: "CgkI8eHDiO0fEAIQBA"
				};
				window.plugins.playGamesServices.unlockAchievement(dt);
			}
		}
		
		if (localStorage.highscore < score) {
			localStorage.highscore = score;
			$('#bestOf').html('Best: ' + score);
		}
		bulletsNumber = maxBullets;	
		targets=new Array();
		for (i=0; i<targetsCount+1; i++) {
			targets.push(new target(Math.floor((Math.random() * 3) + 1), i*cWidth/targetsCount));
		}
		direction *= -1;
		
		if (typeof(Media) != 'undefined')
			if (localStorage.isSound == "on") {
				scoreSound.stop();
				scoreSound.play();
			}
	}
	
	PU.draw(modifier);
}

function openBrowser(url){
	var iab = cordova.InAppBrowser;
	iab.open(url, '_system');
	return false;
}

document.addEventListener("pause", onPause, false);
function onPause() {
	// Handle the pause event
	snd.pause();
	appPaused = true;
}

document.addEventListener("resume", onResume, false);
function onResume() {
	appPaused = false;
	// Handle the resume event
	if (typeof(Media) != 'undefined')
		if (localStorage.isSound == "on")
			snd.play();
	
	$('#highscore > span').html('Score: ' + score);
	$('#menu').fadeIn();
	gameStarted = false;
	targets=new Array();
	for (i=0; i<targetsCount+1; i++) {
		targets.push(new target(i==targetsCount?3:1, i*cWidth/targetsCount));
	}
	
	then = Date.now();
	loop();
}

document.addEventListener("deviceready", onDeviceReady, false);

var getPhoneGapPath = function() {
	var path = window.location.pathname;
	path = path.substr( path, path.length - 10 );
	return path;
};

var snd = null;
var hitSound = null;
var scoreSound = null;
var pu1Sound = null;
var pu2Sound = null;

// onSuccess Callback
function onSuccess() {
}
// onError Callback 
function onError(error) {
}
// onStatus Callback 
function onStatus(status) {
	if( status==Media.MEDIA_STOPPED ) {
		snd.play();
	}
}

function setPU() {
	if (PU.x < -PU.width || PU.x > cWidth+PU.width) {
		PU.setY(Math.floor((Math.random() * cHeight*0.5) + cHeight*0.2));
		PU.xDirection *= -1;
		PU.type = Math.floor((Math.random() * 2) + 1);
		
		if (PU.xDirection == 1)
			PU.setX(-PU.width);
			else
			PU.setX(cWidth+PU.width);
	}
}
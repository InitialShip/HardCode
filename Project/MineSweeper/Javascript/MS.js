// JavaScript Document
var win=new Audio();
win.src="Audio/Win.mp3";
win.preload='auto';
win.volume=0.5;

var dead=new Audio();
dead.src="Audio/Bomb.mp3";
dead.preload='auto';
dead.volume=0.5;
	
var mouse=new Audio();
mouse.src="Audio/MouseClick.wav";
mouse.preload='auto';
mouse.volume=0.5;

function Winning(){
	win.play();
}
function MineSound(){
	dead.play();
}
function MouseClick(){
	mouse.play();
}

function MakeGame(height, width, mines,fogmode){
	if(fogmode) $('#ms').addClass('fogMode');
	var table=$("#ms");
	table.html('');
	var trCounter=0;
	var fogClass = fogmode?'class="hidden"':'class=""';
	for(var i=0;i<height;i++){
		var tdCounter=0;
		var trString='<tr>';
		for(var j=0;j<width;j++){
			trString+='<td id="tile'+Pad(trCounter)+Pad(tdCounter)+'"><span '+fogClass+'> </span></td>';
			tdCounter++;
		}
		trString+='</tr>';
		table.append(trString);
		trCounter++;
	}
	AddMines(mines);
	AddAllNumbers();
	MakeClickAble();
}
function BorderingTiles(td){ 
	var borderingArray=[];
	var tileID=td.attr('id');
	var tileTR=parseInt(tileID.slice(4,6),10);
	var tileTD=parseInt(tileID.slice(6),10);
	
	for (var yOff = -1; yOff <= 1; yOff++)
	{
		var y = yOff + tileTR;
		for (var xOff = -1; xOff <= 1; xOff++)
		{
			if (yOff==0 && xOff==0) continue
			var x = xOff + tileTD;
			var tile = $('#tile'+Pad(y)+Pad(x))
			if ( tile.length > 0)	borderingArray.push($('#tile'+Pad(y)+Pad(x)));
		}
	}
	return borderingArray;
}
function RevealTile(td){
	if (td.hasClass('revealed')) return;
	if(!td.hasClass('flagged')){
		var amount = td.attr('class').slice(-1)
		td.addClass('revealed');
		if(td.hasClass('mine')){
			td.html('<img src="Images/mine.png" />');
			td.css("background-color","#f00");
			ValidateGame();
		}
		else if(amount == 0){
			var borderTiles = BorderingTiles(td);
			borderTiles.forEach(Element =>{
					RevealTile(Element);
			})
		}
		else
		{
			td.children().html(amount);
			td.css("color",ColorForNumber(amount));
		}
	}
}
function FlagTile(td){
	if(td.hasClass('flagged')){
		td.removeClass('flagged');
		td.children('img').remove();
	}
	else{
		if(!td.hasClass('revealed')){
			td.addClass('flagged');
			td.append('<img src="Images/flag.png" />');
		}
	}
}
function AddNumber(td){
	if(td.hasClass('notmine')){
		var numMines=0;
		var borderTiles=BorderingTiles(td);
		for(a in borderTiles){
			if(borderTiles[a].hasClass('mine')){
				numMines++;
			}
		}
		td.addClass('borders'+numMines);
	}
}
function AddAllNumbers(){
	$('td').each(function(index) {
        AddNumber($(this));
    });
}
function MakeClickAble(){
	if($('#ms').hasClass('fogMode')) {
		fogMode();
	}
	$('td').each(function(index) {
        $(this).mousedown(function(event) {
            if(!$("#ms").hasClass('gameOver')){
				switch(event.which){
					case 1:
					{
						if((!$(this).hasClass('revealed')&&!$(this).hasClass('mine'))||(!$(this).hasClass('revealed')&&$(this).hasClass('flagged'))){
							MouseClick();
						}
						RevealTile($(this));
					}
					break;
					case 3:
					{
						if(!$(this).hasClass('revealed')){
							MouseClick();
						}
						FlagTile($(this));
					}
					break;
				}
			}
        });
    });
}
function Pad(number){
	var str=''+number;
	while(str.length<2){
		str='0'+str;
	}
	return str;
}
function ColorForNumber(number){
	if(number==1){return '#0004FF';}
	else if(number==2){return '#007000';}
	else if(number==3){return '#FE0100';}
	else if(number==4){return '#05006C';}
	else if(number==5){return '#840800';}
	else if(number==6){return '#008284';}
	else if(number==7){return '#840084';}
	else{return '#000000';}
}
function AddMines(mines){
	var tds=$("td");
	var tilesLeft=tds.length;
	var minesLeft=mines;
	$('td').each(function(index) {
      var randomNum=Math.floor(Math.random()*tilesLeft);
		if(randomNum<minesLeft){
			$(this).addClass('mine');
			minesLeft--;
		}
		else{
			$(this).addClass('notmine');
		}
		tilesLeft--;
    });
}
function fogMode(){
	$('td').on('mouseover',function(){
		Show($(this));
		var neigbours = BorderingTiles($(this));
		neigbours.forEach(Element => {Show(Element);})
	}).on('mouseout',function(){
		Show($(this))
		var neigbours = BorderingTiles($(this));
		neigbours.forEach(Element => {Show(Element);})
	})
}
function Show(td){
	if (td.hasClass('mine')) return;
	td.children('span').toggleClass('show');
}
function CheatGame(){
	$('td').each(function(index) {
      if(!$(this).hasClass('mine')){
			RevealTile($(this));
		}
    });
}
function IsGameWon(){
	var returnVal=true;
	$('.notmine').each(function() {
        if(!$(this).hasClass('revealed')){
			returnVal=false;
		}
    });
	return returnVal;
}
function EndGameWin(){
	$('#header').text('You Win! Congratulations!');
	Winning();
	$('.mine').each(function() {
        $(this).html('<img src="Images/flag.png" />');
    });
	$("#ms").addClass('gameOver');
}
function EndGameLose(){
	$('#header').text('You Lose!');
	MineSound();
	$('.mine').each(function() {
    $(this).html('<img src="Images/mine.png" />');
		$(this).css("border","1px solid");
		$(this).css("border-color","#777");
		$(this).css("height","38px");
		$(this).css("width","38px");
		if($(this).css("background-color")=='rgb(187, 187, 187)'){
			$(this).css("background-color","#aaa");
		}
		});
	$('#cheat').html('Show');
	$("#ms").addClass('gameOver');
}
function ValidateGame(){
	if ($('#ms').hasClass('gameOver')) 
	{
		alert('The game is over!');
		return;
	}
	var gameWon=IsGameWon();
	if(gameWon){
		EndGameWin();
	}
	else{
		EndGameLose();
	}
}
function SaveGame(){
	if($('#ms').hasClass('gameOver')) {
		alert('The game is over!');
		return;
	}
	if(localStorage.getItem('minesweeperGames')){
		var games=JSON.parse(localStorage.getItem('minesweeperGames'));
	}
	else{
		var games=[];
	}
	var gameInfo = $("#ms").attr('class').split('.')
	for (var i = 0; i < gameInfo.length; i++)
	{
		gameInfo[i] = gameInfo[i].toUpperCase();
	}
	gameInfo.join(" ")
	var newGame=[new Date().getTime(),$("#holder").html(),gameInfo];
	games.push(newGame);
	localStorage.setItem('minesweeperGames',JSON.stringify(games));
	DisplaySavedGames();
}
function DisplaySavedGames(){
	if(localStorage.getItem('minesweeperGames')){
		$("#saved").html('');
		var games=JSON.parse(localStorage.getItem('minesweeperGames'));
		for(i in games){
			 var dt=new Date(games[i][0]);
			 var gameInfo = games[i][2];
			 var timeString=Pad(dt.getMonth()+1)+'/'+Pad(dt.getDate())+'/'+Pad(dt.getFullYear())+' '+Pad(dt.getHours())+':'+Pad(dt.getMinutes());
			 var loadLink='<a href="#" onclick="LoadGame(\''+games[i][0]+'\')">'+gameInfo+' | '+timeString+'</a>';
			 var deleteLink='<a href="#" onclick="DeleteGame(\''+games[i][0]+'\')">Delete</a>';
			 $("#saved").append('<div class="savedGame">'+loadLink+' ('+deleteLink+')</div>');
		}
	}
}
function LoadGame(time){
	var games=JSON.parse(localStorage.getItem('minesweeperGames'));
	for(i in games){
		if(games[i][0]==time){
			$("#holder").html(games[i][1]);
			$("#header").text("MineSweeper");
			$('#cheat').html("Cheat");
			if($('#ms').hasClass('fogMode'))
			{
				$('#fog').attr('checked',true);
			}
			else
			{
				$('#fog').attr('checked',false);
			}
			MakeClickAble();
		}
	}
}
function DeleteGame(time){
	var games=JSON.parse(localStorage.getItem('minesweeperGames'));
	var editedGames=[];
	for(i in games){
		if(games[i][0]!=time){
			editedGames.push(games[i]);
		}
	}
	localStorage.setItem('minesweeperGames',JSON.stringify(editedGames));
	DisplaySavedGames();
}
function MakeMineSweeper(){
	var height, width, mines;
	switch($('#level').val()){
		case "easy":
			height=8;
			width=8;
			mines=10;
			break;
		case "intermediate":
			height=12;
			width=12;
			mines=20;
			break;
		case "expert":
			height=16;
			width=16;
			mines=40;
			break;
		case "insane":
			height=30;
			width=30;
			mines=180;
			break;
		case "custom":
			height=$('#height').val();
			width=$('#width').val();
			mines=$('#mine').val();
			break;
	}
	$("#ms").attr('class',$('#level').val());
	$("#header").text("MineSweeper");
	$('#cheat').html("Cheat");
	MakeGame(height,width,mines,$('#fog').is(':checked'));		
}
$(document).ready(function() {
	$(document).contextmenu(function() {
		return false;
	});
	$('#customSection').css("display","none");
	$('#level').click(function() {
        switch($('#level').val()){
			case "easy":
			case "intermediate":
			case "expert":
			case "insane":
				$('#customSection').css("display","none");
				break;
			case "custom":
				$('#customSection').css("display","block");
				break;
		}
    });
	$('.custom').on('keydown', function(e){
		e.preventDefault();
	});
	$('.custom').on('click mousedown',function() {
        var text="";
		var height=$("#height").val();
		var width=$("#width").val()
		text+=Math.round(height*width)/2;
		if(Number(text)<$('#mine').attr('max')){
			$('#mine').val(text)
		}
		$('#mine').attr('max',text);
    });
    $('#new').click(function() {
        MakeMineSweeper();
    });
	$('#cheat').click(function() {
        CheatGame();
    });
	$('#validate').click(function() {
        ValidateGame();
    });
	$('#save').click(function() {
        SaveGame();
    });
	MakeMineSweeper();
	DisplaySavedGames();
});
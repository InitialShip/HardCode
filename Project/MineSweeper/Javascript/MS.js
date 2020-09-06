// JavaScript Document
function MakeGame(height, width, mines){
	var table=$("#ms");
	table.html('');
	var trCounter=0;
	for(var i=0;i<height;i++){
		var tdCounter=0;
		var trString='<tr>';
		for(var j=0;j<width;j++){
			trString+='<td id="tile'+Pad(trCounter)+Pad(tdCounter)+'"></td>';
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
	var right=$('#tile'+Pad(tileTR)+Pad(tileTD+1));
	if(right.length>0){
		borderingArray.push(right);
	}
	var left=$('#tile'+Pad(tileTR)+Pad(tileTD-1));
	if(left.length>0){
		borderingArray.push(left);
	}
	var downRight=$('#tile'+Pad(tileTR+1)+Pad(tileTD+1));
	if(downRight.length>0){
		borderingArray.push(downRight);
	}
	var down=$('#tile'+Pad(tileTR+1)+Pad(tileTD));
	if(down.length>0){
		borderingArray.push(down);
	}
	var downLeft=$('#tile'+Pad(tileTR+1)+Pad(tileTD-1));
	if(downLeft.length>0){
		borderingArray.push(downLeft);
	}
	var upRight=$('#tile'+Pad(tileTR-1)+Pad(tileTD+1));
	if(upRight.length>0){
		borderingArray.push(upRight);
	}
	var up=$('#tile'+Pad(tileTR-1)+Pad(tileTD));
	if(up.length>0){
		borderingArray.push(up);
	}
	var upLeft=$('#tile'+Pad(tileTR-1)+Pad(tileTD-1));
	if(upLeft.length>0){
		borderingArray.push(upLeft);
	}
	return borderingArray;
}
function RevealTile(td){
	if(!td.hasClass('flagged')){
		td.addClass('revealed');
		td.css("background-color","#aaa");
		if(td.hasClass('mine')){
			td.html('<img src="Images/mine.png" />');
			td.css("background-color","#f00");
			ValidateGame();
		}
		else if(td.hasClass('borders0')){
			var borderTiles=BorderingTiles(td);
			for(i in borderTiles){
				if(!borderTiles[i].hasClass('revealed')){
					RevealTile(borderTiles[i]);
				}
			}
		}
		else if(td.hasClass('borders1')){
			td.text('1');
			td.css("color",ColorForNumber(1));
		}
		else if(td.hasClass('borders2')){
			td.text('2');
			td.css("color",ColorForNumber(2));
		}
		else if(td.hasClass('borders3')){
			td.text('3');
			td.css("color",ColorForNumber(3));
		}
		else if(td.hasClass('borders4')){
			td.text('4');
			td.css("color",ColorForNumber(4));
		}
		else if(td.hasClass('borders5')){
			td.text('5');
			td.css("color",ColorForNumber(5));
		}
		else if(td.hasClass('borders6')){
			td.text('6');
			td.css("color",ColorForNumber(6));
		}
		else if(td.hasClass('borders7')){
			td.text('7');
			td.css("color",ColorForNumber(7));
		}
		else if(td.hasClass('borders8')){
			td.text('8');
			td.css("color",ColorForNumber(8));
		}
		td.css("border","1px solid");
		td.css("border-color","#777");
		td.css("height","38px");
		td.css("width","38px");
	}
}
function FlagTile(td){
	if(td.hasClass('flagged')){
		td.removeClass('flagged');
		td.text('');
	}
	else{
		if(!td.hasClass('revealed')){
			td.addClass('flagged');
			td.html('<img src="Images/flag.png" />');
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
	$('td').each(function(index) {
        $(this).mousedown(function(event) {
            if(!$("#ms").hasClass('gameOver')){
				switch(event.which){
					case 1:
						RevealTile($(this));
						break;
					case 3:
						FlagTile($(this));
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
	$('.mine').each(function() {
        $(this).html('<img src="Images/flag.png" />');
    });
	$("#ms").addClass('gameOver');
}
function EndGameLose(){
	$('#header').text('You Lose!');
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
	$("#ms").addClass('gameOver');
}
function ValidateGame(){
	var gameWon=IsGameWon();
	if(gameWon){
		EndGameWin();
	}
	else{
		EndGameLose();
	}
}
function SaveGame(){
	if($('#ms').hasClass('gameOver')) return
	if(localStorage.getItem('minesweeperGames')){
		var games=JSON.parse(localStorage.getItem('minesweeperGames'));
	}
	else{
		var games=[];
	}
	var newGame=[new Date().getTime(),$("#ms").html()];
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
			 var timeString=Pad(dt.getMonth()+1)+'/'+Pad(dt.getDate())+'/'+Pad(dt.getFullYear())+' '+Pad(dt.getHours())+':'+Pad(dt.getMinutes());
			 var loadLink='<a href="#" onclick="LoadGame(\''+games[i][0]+'\')">'+timeString+'</a>';
			 var deleteLink='<a href="#" onclick="DeleteGame(\''+games[i][0]+'\')">Delete</a>';
			 $("#saved").append('<div class="savedGame">'+loadLink+' ('+deleteLink+')</div>');
		}
	}
}
function LoadGame(time){
	var games=JSON.parse(localStorage.getItem('minesweeperGames'));
	for(i in games){
		if(games[i][0]==time){
			$("#ms").html(games[i][1]);
			$("#ms").removeClass('gameOver');
			$("#header").text("MineSweeper")
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
		case "custom":
			height=$('#height').val();
			width=$('#width').val();
			mines=$('#mine').val();
			break;
	}
	$("#ms").removeClass('gameOver');
	$("#header").text("MineSweeper");
	MakeGame(height,width,mines);		
}
$(document).ready(function() {
	$(document).contextmenu(function() {
		return false;
	});
	$('#customSection').css("display","none");
	$('#level').click(function() {
        switch($('#level').val()){
			case "easy":
				$('#customSection').css("display","none");
				break;
			case "intermediate":
				$('#customSection').css("display","none");
				break;
			case "expert":
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
	$('.custom').click(function() {
        var text="";
		var height=$("#height").val();
		var width=$("#width").val()
		text+=Math.round(height*width)/2;
		$("#mine").attr("max",text);
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
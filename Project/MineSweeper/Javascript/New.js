//Noob code 💩
function Make2DArray(rows,cols) // make 2D array 
{
  var Array = [rows]
  for (var i = 0; i < rows; i++)
  {
    Array[i] = [cols]
  }
  return Array
}
//#region Object
function Tile(i,j,height,width) // Bomb object
{
  this.i = i
  this.j = j
  this.bomb = false // 💣
  this.revealed = false
  this.h = height
  this.w = width
  this.bombAround = 0
  this.neighbors = []
}
Tile.prototype.GetNeighbors = function(){
  for (var ioff = -1; ioff <= 1; ioff++)
    {
      var x = (this.i + ioff).toString()
      if (x < 0|| x >= this.h) {continue}

      for (var joff = -1; joff <= 1; joff++)
      {
        if (ioff == 0 && joff == 0) {continue}
        var y = (this.j + joff).toString()
        if(y < 0 || y >= this.w) {continue}
        var neighbor = $('#'+x+'_'+y)
        this.neighbors.push(neighbor)
      }
    }
}
Tile.prototype.Show = function(){
  var tmp = this.bombAround
  var tile = $('#'+this.i+"_"+this.j)
  tile.addClass('onseen')
  if(tmp==0 || tmp==-1) return
  if (!tile.hasClass('revealed')) return
  tile.append('<span class="seen">'+tmp+'</span>').css("color",ColorForNumber(tmp))
}
Tile.prototype.ShowAround = function(){
    this.Show()
    this.neighbors.forEach(element =>{
      var id = element.attr('id').split("_")
      BombArray[id[0]][id[1]].Show()
    })
}
Tile.prototype.Hide = function(){
  $('#'+this.i+"_"+this.j).removeClass('onseen')
  $("span").remove('.seen')
}
Tile.prototype.HideAround = function(){
  this.Hide()
  this.neighbors.forEach(element => {
    var id = element.attr('id').split("_")
    BombArray[id[0]][id[1]].Hide()
  })
}
//#endregion
var BombArray // 💥💥Careful not to blow up💥💥
var gameMode = "easy"

//#region MakeGame(height,width,mines)
function MakeGame(height, width, mines){
  BombArray = Make2DArray(height,width)
  var table = $("#ms")
  table.html('')
  for (var i = 0; i < height; i++)
  {
    var trString = '<tr>'
    for (var j = 0; j < width; j++)
    {
      trString+='<td id="'+i+'_'+j+'"></td>'
      BombArray[i][j] = new Tile(i,j,height,width)
    }
    trString+='</tr>'
    table.append(trString)
  }
  for (var i = 0; i < height; i++)
  {
    for (var j = 0; j < width; j++)
    {
      BombArray[i][j].GetNeighbors()
    }
  }
  AddMines(mines)
  GetBombAround(height,width)
  MakeClickAble()
  if($("#level").val()=="insane") //provide a random tile to click
  {
    var tmp = []
    for (var i = 0; i < height; i++)
    {
      for (var j = 0; j < width; j++)
      {
        if(!BombArray[i][j].bomb && BombArray[i][j].bombAround==0)
        {
          tmp.push(BombArray[i][j])
        }
      }
    }
    var randomIndex = Math.floor(Math.random()*tmp.length)
    $('#'+tmp[randomIndex].i+'_'+tmp[randomIndex].j).addClass('clickhere').mousedown(function(){
      $(this).removeClass('clickhere')
    })
  }
}
//#endregion
//#region AddMines(minesAmount)
function AddMines(minesAmount) //Add mine at random tile
{
  var tilesLeft = BombArray.length * BombArray[0].length
  var minesLeft = minesAmount
  for (var i = 0; i < BombArray.length; i++)
  {
    for (var j = 0; j < BombArray[i].length;j++)
    {
      var randomNum=Math.floor(Math.random()*tilesLeft)
      if(randomNum<minesLeft)
      {
        BombArray[i][j].bomb = true
        minesLeft--
      }
      tilesLeft--
    }
  }
}
//#endregion
//#region GetBombAround(height,width)
function GetBombAround(height,width) // Count bomb
{
  for (var i = 0; i < height; i++)
  {
    for (var j = 0; j < width;j++)
    {
      if (BombArray[i][j].bomb)
      {
        BombArray[i][j].bombAround = -1
        continue
      }
      var total = 0
      for (var ioff = -1; ioff <= 1; ioff++)
      {
        var x = i + ioff
        if (x<0 || x>=height) {continue}

        for (var joff = -1; joff <= 1; joff++)
        {
          if(ioff == 0 && joff == 0)continue
          var y = j + joff
          if (y<0 || y>=width) {continue}
          var Tile = BombArray[x][y]
          if (Tile.bomb)
          {
            total++
          }
        }
      }
      BombArray[i][j].bombAround = total
    }
  }
}
//#endregion
//#region MakeClickAble()
function MakeClickAble()
{
  $('td').each(function(){
    $(this).mousedown(function(event)
    {
      if ($("#ms").hasClass('gameOver')) {return}
      switch(event.which){
        case 1:
          RevealTile($(this))
          break
        case 3:
          FlagTile($(this))
          break
      }
    })
    if(gameMode == "insane"){
      $(this).mouseover(function () { 
        var id = $(this).attr('id').split('_')
        BombArray[id[0]][id[1]].ShowAround()
      }).mouseout(function () {
        var id = $(this).attr('id').split("_")
        BombArray[id[0]][id[1]].HideAround()
      })
    }
  })
}
function RevealTile(tile)
{
  if (tile.hasClass('revealed')) {return}
  if(!tile.hasClass('flagged'))
  {
    tile.addClass('revealed notbomb')
    var id = tile.attr('id').split('_')
    var CurrentTile = BombArray[id[0]][id[1]]
    CurrentTile.revealed = true
    if(CurrentTile.bomb)
    {
      /* dead.play() */
      tile.html('<img src="Images/mine.png" />')
      tile.addClass('bomb')
      ValidateGame()
    }
    else
      if (CurrentTile.bombAround == 0)
      {
        var neighbors = CurrentTile.neighbors
        neighbors.forEach(element => {
          RevealTile(element)
        })
      }
      else
      {
        if (gameMode == "insane") return
        var text = CurrentTile.bombAround
        tile.text(text)
        tile.css("color",ColorForNumber(text)) 
      }
  }
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
function FlagTile(tile)
{
  if (tile.hasClass('flagged'))
  {
    tile.removeClass('flagged')
    tile.text('')
  }
  else
  {
    if(!tile.hasClass('revealed'))
    {
      tile.addClass('flagged')
      tile.html('<img src="Images/flag.png" />')
    }
  }
}
function ValidateGame(){
  IsGameWon()?EndGameWin():EndGameLose()
}
function IsGameWon()
{
  var returnVal = true
  for (var i = 0; i < BombArray.length; i++)
  {
    for (var j = 0; j < BombArray[0].length; j++)
    {
      var tmp = BombArray[i][j]
      if(tmp.bomb && $('#'+i+'_'+j).hasClass('flagged')) 
      {
        continue
      }
      if (!tmp.revealed && !tmp.bomb)
      {
        returnVal = false
        break
      }
    }
  }
  return returnVal
}
function EndGameWin(){
	$('#header').text('You Win! Congratulations!');
	$('.bomb').each(function() {
        $(this).html('<img src="Images/flag.png" />');
    });
	$("#ms").addClass('gameOver');
}
function EndGameLose(){
  $('#header').text('You Lose!');
	CheatGame()
	$("#ms").addClass('gameOver');
}
//#endregion
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
    case "insane":
      height=40
      width=40
      mines=320 // 20%
      break
	}
	$("#ms").removeClass('gameOver');
	$("#header").text("MineSweeper");
  MakeGame(height,width,mines);		
}
$(document).ready(function(){
  $(document).contextmenu(function(){
    return false
  })
  $('#customSection').css("display","none")
  $('#level').click(function()
  {
      gameMode = $(this).val()
      switch(gameMode)
    {
    case "custom":
      $('#customSection').css("display","block");
      break;
    case "insane":
      $('#cheat').css("display","none")
      break
    default:
      $('#customSection').css("display","none")
      $('#cheat').css("display","inline")
    }
  })
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
})
function CheatGame()
{
  for (var i = 0 ; i < BombArray.length;i++)
  {
    for (var j = 0; j < BombArray[0].length;j++)
    {
      if(BombArray[i][j].bomb)
      {
        var tile = $('#'+i+'_'+j).addClass('bomb')
        RevealTile(tile)
      }
    }
  }
}
function SaveGame()
{
  if ($('#ms').hasClass('gameOver')) return
  if(localStorage.getItem('minesweeperGames')){
		var games=JSON.parse(localStorage.getItem('minesweeperGames'));
	}
	else{
		var games=[];
	}
	var newGame=[new Date().getTime(),$("#ms").html(),BombArray];
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
			 var timeString=(dt.getMonth()+1)+'/'+(dt.getDate())+'/'+(dt.getFullYear())+' '+(dt.getHours())+':'+(dt.getMinutes());
			 var loadLink='<a href="#" onclick="LoadGame(\''+games[i][0]+'\')">'+timeString+'</a>';
			 var deleteLink='<a href="#" onclick="DeleteGame(\''+games[i][0]+'\')">Delete</a>';
			 $("#saved").append('<div class="savedGame">'+loadLink+' ('+deleteLink+')</div>');
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
function LoadGame(time){
	var games=JSON.parse(localStorage.getItem('minesweeperGames'));
	for(i in games){
		if(games[i][0]==time){
      $("#ms").html(games[i][1]);
      BombArray = games[i][2]
			$("#ms").removeClass('gameOver');
      $("#header").text("MineSweeper")
			MakeClickAble();
		}
	}
}

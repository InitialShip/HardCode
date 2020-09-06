
    var dead = document.createElement('audio')
    dead.setAttribute('src','Sound/dead.mp3')

    $('td').each(function(){
        $(this).click(function(){
            PlaySound($(this))
        })
    })
    function PlaySound(tile)
    {
        var id = tile.attr('id').split('_')
        if(BombArray[id[0]][id[1]].bomb)
        dead.play()
    }
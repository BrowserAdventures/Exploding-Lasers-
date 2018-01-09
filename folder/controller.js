const arrow = { // key-codes
    left:37,
    right:39,
    up:38,
    down:40,
    spacebar:32
};

const Controller = {

    /*__________________  ARROWKEYS  __________________*/
    PRESS: document.onkeydown = function(E)
    {
        if (E.keyCode == arrow.left) player.key.left = true;
        if (E.keyCode == arrow.right) player.key.right = true;
        if (E.keyCode == arrow.up) movedown(); // shoots
        if (E.keyCode == arrow.down) player.key.down = true; // null
        if (E.keyCode == arrow.spacebar )  movedown(); // shoots

        // prevents webpage scrolling
        if( [   arrow.left,
                arrow.right,
                arrow.up,
                arrow.down,
                arrow.spacebar
        ].indexOf(E.keyCode) > -1) E.preventDefault();
    },
    
    RELEASE: document.onkeyup = function(E)
    {
        if (E.keyCode == arrow.left) player.key.left = false;
        if (E.keyCode == arrow.right) player.key.right = false;
        if (E.keyCode == arrow.up) player.key.up = false;
        if (E.keyCode == arrow.down) player.key.down = false;
        if (E.keyCode == arrow.spacebar) ;
    },


    /*__________________  MOUSE  __________________*/
    MOVE: onmousemove = function(MOUSE) // mouse-move controls
    {
        MOUSE.preventDefault(); // stops webpage scrolling
    },

    CLICK: onclick = function(MOUSE) // mouse-click controls
    {
        MOUSE.preventDefault(); // stops webpage scrolling
    },

    TOUCH: ontouchstart = function(MOUSE) {
        MOUSE.preventDefault(); // stops webpage scrolling
    },
    TOUCH_MOVE: ontouchmove = function(MOUSE) {
        MOUSE.preventDefault(); // stops webpage scrolling
    }
}



// html buttons //
function stopMove() {
    player.key.left = false;
    player.key.right = false;
    player.key.spacebar = false;
}

function movedown(E) {
    if(main.time > 5) {
       main.laser.amount++;
       main.laser.fire = true;
       main.explosion.fire = true;
       main.time = 0;
    }
}

function moveleft() {
    player.key.left = true;
}

function moveright() {
    player.key.right = true;
}

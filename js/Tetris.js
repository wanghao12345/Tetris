/**
 * 方块类
 */
function Block(oTable, oTabelArr) {
    this.timer = null;
    this.color = null;
    this.oTable = oTable;
    this.routeArr = null;
    this.oTabelArr = oTabelArr;
    this.prevRouteArr = null;
    this.cellLen = parseInt(this.oTable.rows[0].cells.length/2) - 1;
    this.BlockArr = [
        [[0, this.cellLen],   [0, this.cellLen + 1], [0 + 1, this.cellLen + 1], [0 + 1, this.cellLen + 2]],
        [[0, this.cellLen+1], [0, this.cellLen + 2], [0 + 1, this.cellLen], [0 + 1, this.cellLen + 1]],
        [[0, this.cellLen],   [0, this.cellLen + 1], [0 + 1, this.cellLen], [0 + 1, this.cellLen + 1]],
        [[0, this.cellLen],   [0 + 1, this.cellLen], [0 + 2, this.cellLen], [0 + 2, this.cellLen + 1]],
        [[0, this.cellLen + 1], [0 + 1, this.cellLen + 1], [0 + 2, this.cellLen + 1], [0 + 2, this.cellLen]],
        [[0, this.cellLen - 1], [0, this.cellLen], [0, this.cellLen + 1], [0, this.cellLen + 2]],
        [[0, this.cellLen], [0 + 1, this.cellLen - 1], [0 + 1, this.cellLen], [0 + 1, this.cellLen + 1]]
    ];
    this.init();
}

Block.prototype.init = function () {
    //监听事件
    window.onkeydown = function (e) {
        // 上
        if (e.keyCode == 38) {
            this.rotateBlock();
        }
        // 下
        if (e.keyCode == 40) {
            clearInterval(this.timer);
            this.move(10);
        }
        // 左
        if (e.keyCode == 37) {
            this.moveToDirect('左');
        }
        // 右
        if (e.keyCode == 39) {
            this.moveToDirect('右');
        }
    }.bind(this)
}

/**
 * 获取随机方块并且设置随机方块的颜色
 * @return {[type]} [description]
 */
Block.prototype.getBlockPoint = function () {
    var type = Math.ceil(Math.random()*7);
    var colorArr = ['#4caf50', '#03a9f4', '#ff5722', '#009688', '#f44336', '#9c27b0', '#607d8b'];
    this.routeArr = this.BlockArr[type - 1];
    this.color = colorArr[Math.ceil(Math.random()*7) - 1];
    return this;
}
/**
 * 旋转方块
 * @return {[type]} [description]
 */
Block.prototype.rotateBlock = function () {
    var Cx = 0, Cy = 0;
    this.routeArr.forEach(function(arr, i){
        Cx += arr[0];
        Cy += arr[1];
    }.bind(this))
    Cx = Math.round(Cx / 4);
    Cy = Math.round(Cy / 4);
    this.remove();
    for (var i = 0; i < 4; i++) {
        var arr = new Array(2);
        arr[0] = Cx + Cy - this.routeArr[i][1];
        arr[1] = Cy - Cx + this.routeArr[i][0];
        this.routeArr[i] = arr;
    }
    this.draw();
}
/**
 * 绘制方块图
 * @return {[type]} [description]
 */
Block.prototype.draw = function () {
    this.routeArr.forEach(function(arr, i){
        this.oTable.rows[arr[0]].cells[arr[1]].style.background = this.color;
    }.bind(this));
    return this;
}
/**
 * 清除方块图
 * @return {[type]} [description]
 */
Block.prototype.remove = function () {
    this.routeArr.forEach(function(arr, i){
        this.oTable.rows[arr[0]].cells[arr[1]].style.background = 'white';
    }.bind(this));
    return this;
}
/**
 * 移动
 * @return {[type]} [description]
 */
Block.prototype.move = function (time=1000) {
    this.timer = setInterval(function(){
        this.moveToDirect();
    }.bind(this), time)
}

/**
 * 移动过程
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
Block.prototype.moveNext = function (arr) {
    this.remove();
    this.routeArr = arr;
    this.draw();
}
/**
 * 移动方向
 */
Block.prototype.moveToDirect= function (type="下") {
    var prevRouteArr = new Array(4);
    this.routeArr.forEach(function(arr, i){
        if (type == '左') {
            prevRouteArr[i] = [arr[0], arr[1] - 1];
        }
        if (type == '右') {
            prevRouteArr[i] = [arr[0], arr[1] + 1];
        }
        if (type == '下') {
            prevRouteArr[i] = [arr[0] + 1, arr[1]];
        }
    })
    if (this.check(prevRouteArr)) {
       this.moveNext(prevRouteArr);
    } else {
        if (type == '下') {
            this.nextBlock();            
        }
    }
}
/**
 * 创建下一个方块
 * @return {[type]} [description]
 */
Block.prototype.nextBlock = function () {
    clearInterval(this.timer);
    this.routeArr.forEach(function(arr, i){
        this.oTabelArr[arr[0]][arr[1]] = 1;
    }.bind(this))
    this.getCore();
    var block = new Block(this.oTable, this.oTabelArr);
    block.getBlockPoint().draw().move();        
}

/**
 * 获取分数
 * @return {[type]} [description]
 */
Block.prototype.getCore = function () {
    var len = this.oTable.rows[0].cells.length;
    this.routeArr.forEach(function(arr, i){
        for (var i = 0; i < len; i++) {
            if(this.oTabelArr[arr[0]][i]==0){
                break;
            }
            if (i == len -1 && this.oTabelArr[arr[0]][i] == 1) {
                this.oTable.deleteRow(arr[0]);
                this.getCoreNext(arr[0]);
            }
        }
    }.bind(this))
}

Block.prototype.getCoreNext = function (tableLen) {
    // table结构
    var row = this.oTable.insertRow(0);
    var len = this.oTable.rows[1].cells.length;
    for (var i = 0; i < len; i++) {
       row.insertCell(i); 
    }
    // table数组
    for (var j = tableLen; j > 0; j--) {
        this.oTabelArr[j] = this.oTabelArr[j - 1];
    }
    for (var k = 0; k < len; k++) {
        this.oTabelArr[0][k] = 0;
    }
}




/**
 * 判断是否可以继续移动
 * @return {[type]} [description]
 */
Block.prototype.check = function (checkArr) {
    var flag = true,
        minX = 0,
        minY = 0,
        maxX = this.oTable.rows[0].cells.length - 1,
        maxY = this.oTable.rows.length - 1;
    checkArr.forEach(function(arr, i){
        if (arr[0] < minY || arr[0] > maxY || arr[1] < minX || arr[1] > maxX || this.oTabelArr[arr[0]][arr[1]] == 1) {
            flag = false;
        }
    }.bind(this))
    return flag;
}




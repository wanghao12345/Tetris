/**
 * 方块类
 */
function Block(oTable) {
    this.color = null;
    this.oTable = oTable;
    this.routeArr = null;
    this.oTabelArr = null;
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
        if (e.keyCode == 38) {}
        // 下
        if (e.keyCode == 40) {}
        // 左
        if (e.keyCode == 37) {
            this.moveToDirect('左');
        }
        // 右
        if (e.keyCode == 39) {
            this.moveToDirect('右');
        }
    }.bind(this)
    //初始化界面二维数组
    this.oTabelArr = [];
    var lenX = this.oTable.rows[0].cells.length;
    var brr = new Array(lenX);
    for (var i = 0; i < lenX; i++) {
        brr[i] = 0;
    }
    var lenY = this.oTable.rows.length;
    for (var i = 0; i < lenY; i++) {
        this.oTabelArr[i] = brr;
    }
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
Block.prototype.move = function () {
    var timer = setInterval(function(){
        if(!this.moveToDirect()){
            clearInterval(timer);

            this.routeArr.forEach(function(arr, i){
                this.oTabelArr[arr[0]][arr[1]] = 1;
            }.bind(this))
            var block = new Block(oTable);
            block.getBlockPoint().draw().move();
        }
    }.bind(this), 1000)
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
        this.remove();
        this.routeArr = prevRouteArr;
        this.draw();
    } else {
        return false;
    }
    return true;
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
        // if (this.oTabelArr[arr[0]][arr[1]] == 1) {
        //     flag = false;
        // }
    }.bind(this))
    return flag;
}




$(function() {
  colorGenerator(4, 4);
})

var lerpHSL = function(colorA, colorB, alpha){
  var h1 = colorA.getHSL().h;
  var s1 = colorA.getHSL().s;
  var l1 = colorA.getHSL().l;
  
  var h2 = colorB.getHSL().h;
  var s2 = colorB.getHSL().s;
  var l2 = colorB.getHSL().l;

  var h = h1 + (h2 - h1)*alpha;
  var s = s1 + (s2 - s1)*alpha;
  var l = l1 + (l2 - l1)*alpha;
  
  var color = new THREE.Color().setHSL(h, s, l);
  return color;
}
// 颜色洗牌方法（从最后一个位置开始随机重置）
var shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
// 当还存在没被重置的元素
  while (0 !== currentIndex) {
// 选一个随机位置的元素
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
// 把它换在currentIndex上，即还没被洗牌过的最后一个位置
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// 生成颜色
var colorGenerator = function(total1, total2){
  var m = total1
  var n = total2;
  var colorArray = [];
  
  var colorA = new THREE.Color(Math.random(), Math.random(), Math.random());
  var colorAHue = colorA.getHSL().h;
  var colorASatuation = colorA.getHSL().s;
  var colorALightness = colorA.getHSL().l;
  var colorB = new THREE.Color();
  var colorBHue;
  if(colorAHue < 0.5) {
    colorBHue = colorAHue + 0.5;
  } else {
    colorBHue = colorAHue - 0.5;
  } 
  
  colorB.setHSL(colorBHue, colorASatuation, colorALightness);
  
  for(var i=0; i<m; i++){
    var newColor = lerpHSL(colorA, colorB, i/(m-1));
    colorArray.push(newColor);
  }
  
  var colorC = new THREE.Color();
  colorC.setHSL(colorBHue, colorASatuation, 0.9);
  for(var i=1; i<n; i++){
    var newColor = lerpHSL(colorB, colorC, i/(n-1));
    colorArray.push(newColor);
  } 
  
// 打乱颜色
  var randomColorArray = colorArray.slice();
  shuffle(randomColorArray);

// 生成色块，并获得颜色值
  for(i=0; i < randomColorArray.length; i++) {
    var newRec = $('<div></div>')
                  .css("background-color", randomColorArray[i].getStyle())
                  .attr("data", randomColorArray[i].getHex());
    $('#game').append(newRec);
  }
  
// 拖动
  $("#game").sortable({
    update: function( event, ui ) {
      checkwin(colorArray);
    }
  });
}
// 判断排序方法
var checkwin = function(colorArray) {
  var win = true;
  $('#game div').each(function(i){
    console.log($(this).attr('data'));
    console.log(colorArray[i].getHex());
    if ($(this).attr('data') != colorArray[i].getHex()) {
      win = false;
    }
  })
  var reversewin = true;
  $('#game div').each(function(i){
    console.log($(this).attr('data'));
    console.log(colorArray[i].getHex());
    var length = colorArray.length;
    var j = length - i - 1;
    if ($(this).attr('data') != colorArray[j].getHex()) {
      reversewin = false;
    }
  })
  if (win || reversewin){
    alert('You win!');
  }
}

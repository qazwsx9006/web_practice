var tmypx,tmypy,tmywidth,tmyheight;

function picload(input){
  var files = input.files; //取得檔案
  var picTop = files[0].name;
  if(files.length>1){
        alert('只能上傳一張喔!')
    }else{
        $('.preimg').remove();
        $('#imgDIV').remove();
        if (files[0].type == 'image/jpeg' || files[0].type == 'image/png' || files[0].type == 'image/gif') {
            if(files.size>5000000){
                alert('檔案大小超過');
                return;
            }
            //將圖片在頁面預覽
            var fr = new FileReader();
            fr.onload = openfile;
            fr.readAsDataURL(files[0]);
        }else{
            alert('圖片格式錯誤');
        }
    }
}

function dropUpload(){
    $('#updiv').on('drop',function(e){ // 綁定drop到指定DOM上
	    e.preventDefault(); //防止預設事件處理
	    var files = e.originalEvent.dataTransfer.files; //取得drop的檔案
      var picTop = files[0].name;
      if(files.length>1){
            alert('只能上傳一張喔!')
        }else{
            $('.preimg').remove();
            $('#imgDIV').remove();
            if (files[0].type == 'image/jpeg' || files[0].type == 'image/png' || files[0].type == 'image/gif') {
                if(files.size>5000000){
                    alert('檔案大小超過');
                    return;
                }
                //將圖片在頁面預覽
                var fr = new FileReader();
                fr.onload = openfile;
                fr.readAsDataURL(files[0]);
            }else{
                alert('圖片格式錯誤');
            }
        }
    })
    var updiv = document.getElementById('updiv');
    updiv.ondragover = function (){ this.className = 'hover'; return false; };
    updiv.ondragend = function (){ this.className = ''; return false; };
};
function openfile(e) {
  var src = e.target.result;
  var lightbox =  "<div id=\"tmymask\" onclick=\"closePic();\">"+
                  "</div>"+
                  "<div id=\"tmylightbox\">"+
                    "<span class='closeLb' onclick=\"closePic();\">X</span>"+
                    "<span class='okLb' onclick=\"okPic();\">O</span>"+
                    "<span class='loading'></span><span class='loading'></span><span class='loading'></span><span class='loading'></span><span class='loading'></span>"+//圖片讀取完畢前顯示
                    "<img id=\"idphoto\" ratio=\"\" style=\"display:none;\" src=\""+src+"\" />"+
                    "<div class=\"blockmask\"></div>"+
                    "<div class=\"crop\"><img id=\"showphoto\" src=\""+src+"\" /></div>"+
                    "<div id=\"forcrop\"></div>"+
                  "</div>";
  $('#tmymask').remove();
  $('#tmylightbox').remove();

  $('body').append(lightbox);
  $('#tmylightbox').fadeIn();
  $('#idphoto')[0].onload=function(){
    var width = $(this)[0].naturalWidth,
      height = $(this)[0].naturalHeight,ratio=1,
      sw=screen.width*.6,
      sh=screen.height*.6;
    if(width>=height){
      if(width>sw){
        ratio=sw/width;
      }
    }else{
      if(height>sh){
        ratio=sh/height;
      }
    }
    width=width*ratio
    height=height*ratio
    marginTop= -height/2,
    marginLeft= -width/2;
    $('#idphoto').attr('ratio',ratio);
    $('#idphoto').delay(1500).fadeIn(1200);
    $('.blockmask').delay(1500).fadeIn(1200);
    $('.crop').delay(1500).fadeIn(1200);
    tmypx=((width/2))-39;
    tmypy=((height/2))-50;
    tmywidth=78;
    tmyheight=100;

    $('#showphoto').css({
      'width':width,
      'height':height,
      'top':marginTop+50,
      'left':marginLeft+39
    });
    $('#idphoto').css({
      'margin-top':marginTop,
      'margin-left':marginLeft,
      'width':width,
      'height':height
    });
    $('#tmylightbox').animate({
      width: width,
      height: height,
      'margin-top':marginTop,
      'margin-left':marginLeft
    },800,function(){
      $('#header').removeClass();
      $('#header').addClass('part1');
      $('.closeLb').fadeIn(100);
      $('.okLb').fadeIn(100);
    });


    forcrop = document.getElementById('forcrop');
    forcrop.addEventListener("mousedown",function(e){//點擊刪除事件偵聽器
        $('.crop').css({
          'margin-left':0,
          'margin-top':0
        });
        var px = parseInt(e.pageX - $(this).offset().left);
        var py = parseInt(e.pageY - $(this).offset().top);
        $('#showphoto').css({
          'top':-py,
          'left':-px,
        });
        $('.crop').css({"width":0,"height":0});
        $(this).mousemove(function(e){
            var ww = parseInt((e.pageX - $(this).offset().left) - px);
            var wh = parseInt((e.pageY - $(this).offset().top) - py);
            var nh,nw;
            if(ww<0 || wh<0){nh=0,nw=0}else{
              if(ww>=wh){
                nh = wh; nw = wh*.78 
              }else{
                nh = wh/.78 ; nw = wh
              }
            }
            if(py+nh>height){
              nh = height-py;
              nw=nh*.78;
            }
            if(px+nw>width){
              nw = width-px;
              nh=nw/.78;
            }

            $('.crop').css({"width":nw,"height":nh});
            $('.crop').css({"left":px,"top":py});
            tmypx=px;
            tmypy=py;
            tmywidth=nw;
            tmyheight=nh;
            //console.log(tmypx+'/'+tmypy+'/'+tmywidth+'/'+tmyheight);
        });        
    }, false);
    forcrop.addEventListener("mouseup",function(e){//點擊刪除事件偵聽器
        $(this).unbind('mousemove');
    }, false);
  }
} 
function closePic(){
  $('#tmymask').fadeOut();
  $('#tmylightbox').fadeOut();
  $('#photo').fadeOut();
  $('#photo').css({
    top:"-100%"
  });
  $('#header').removeClass();
  $('#header').addClass('part0');
}
function clickload(){
  $('#updiv').click(function(){
    $('#filebtn').click();
  });
}

function okPic(){
  var ratio = $('#idphoto').attr('ratio');
  var compresspic = $('#idphoto');
  $('#header').removeClass();
  $('#header').addClass('part2');
  compress(compresspic[0],ratio);
  $('#photo').show();
  $('#flash').fadeIn(300,function(){
    $('#tmylightbox').remove();
  });
  $('#flash').fadeOut(300,function(){
    $('#photo').animate({
      top: "50%",
    },800,function(){
    });
  });
}


function compress(source_img_obj,ratio, output_format){
         
     var mime_type = "image/jpeg";
     if(output_format!=undefined && output_format=="png"){
        mime_type = "image/png";
     }

     var cvs = document.getElementById('myCanvas');
     cvs.width = 640;
     cvs.height = 960;
     var ctx = cvs.getContext("2d").fillStyle="#fff";
         ctx = cvs.getContext("2d").fillRect(0,0,640,960);
         ctx = cvs.getContext("2d").drawImage(source_img_obj, tmypx/ratio, tmypy/ratio, tmywidth/ratio, tmyheight/ratio, 10, 10, 242, 310);
         ctx = cvs.getContext("2d").drawImage(source_img_obj, tmypx/ratio, tmypy/ratio, tmywidth/ratio, tmyheight/ratio, 10, 325, 242, 310);
         ctx = cvs.getContext("2d").drawImage(source_img_obj, tmypx/ratio, tmypy/ratio, tmywidth/ratio, tmyheight/ratio, 10, 640, 242, 310);
         ctx = cvs.getContext("2d").drawImage(source_img_obj, tmypx/ratio, tmypy/ratio, tmywidth/ratio, tmyheight/ratio, 261, 10, 179.5, 230);
         ctx = cvs.getContext("2d").drawImage(source_img_obj, tmypx/ratio, tmypy/ratio, tmywidth/ratio, tmyheight/ratio, 261, 247, 179.5, 230);
         ctx = cvs.getContext("2d").drawImage(source_img_obj, tmypx/ratio, tmypy/ratio, tmywidth/ratio, tmyheight/ratio, 261, 484, 179.5, 230);
         ctx = cvs.getContext("2d").drawImage(source_img_obj, tmypx/ratio, tmypy/ratio, tmywidth/ratio, tmyheight/ratio, 261, 721, 179.5, 230);
         ctx = cvs.getContext("2d").drawImage(source_img_obj, tmypx/ratio, tmypy/ratio, tmywidth/ratio, tmyheight/ratio, 449.5, 10, 179.5, 230);
         ctx = cvs.getContext("2d").drawImage(source_img_obj, tmypx/ratio, tmypy/ratio, tmywidth/ratio, tmyheight/ratio, 449.5, 247, 179.5, 230);
         ctx = cvs.getContext("2d").drawImage(source_img_obj, tmypx/ratio, tmypy/ratio, tmywidth/ratio, tmyheight/ratio, 449.5, 484, 179.5, 230);
         ctx = cvs.getContext("2d").drawImage(source_img_obj, tmypx/ratio, tmypy/ratio, tmywidth/ratio, tmyheight/ratio, 449.5, 721, 179.5, 230);
     var newImageData = cvs.toDataURL(mime_type, 100/100);
     var result_image_obj = new Image();
     result_image_obj.src = newImageData;
     $('#DL').attr('href',cvs.toDataURL('image/jpeg'));
     console.log(tmypx)
    // return result_image_obj;
}
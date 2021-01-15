
var applicationKey    = "7f5df90e264bc7f11fe45fd193e14264ff916583016feaba14744ee05415c5a0";
var clientKey = "0c750c62927dd6ec0b3c9066800ebf846b1c2f6da62f62ca4a856bad33c7e74c";
var ncmb = new NCMB(applicationKey, clientKey);
var html="";
var w;
var f=true;   //新規 or 編集
var cate_switch="";
var textcolor=["black","red","blue","green"];
var memoobject;  //オブジェクト保存
var cate_text=[]; //カテゴリーデータ取得
var select_text=""; //カテゴリーHTML変数
var cate_set=0; //カテゴリーvalue取得変数
var set_num=0; //編集時カテゴリー取得

document.addEventListener("init", function(event) {
 	
  if (event.target.id == "list-page") {  //list.html
   
    cate_Set_2() // カテゴリーセット

    loaddata(); //list取得


    $("#conf").click(function(){
      document.getElementById("navi").pushPage("configuration.html")  //設定ページに移動
    })

    $(".plus").click(function(){  // 新規メモ作成
      f=false;
      document.getElementById("navi").pushPage("memo.html")  
    })

    $(".left").click(function(){  //削除ページに移動
      html="";
      var memotext = ncmb.DataStore("text");
      memotext.fetchAll()
      .then(function(results){
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
              
           dele(object,i);  // 削除メモリスト取得
        }
        $(".left").html("");
        $(".left").html("<ons-toolbar-button onclick='back()'>戻る</ons-toolbar-button>");  //ツールバー更新
        $(".right").html("");
        $(".right").html("<ons-toolbar-button onclick='memo_Delete()'>決定</ons-toolbar-button>"); 
      })
      .catch(function(err){
         console.log(err);
      });
          

      function dele(object,i){
        var text_split = object.text.split('\n');;
        var listtext = text_split[0];
        listtext = listtext.substr( 0, 20 );
        html+="<ons-list-item>"+listtext+"<div class='test'> <ons-checkbox value='"+i+"'></ons-checkbox></div></ons-list-item>";
        $("#list").html(html);            
      }
    })
  }else if(event.target.id == "memo-page"){  // memo.html
    cate_Set_1();
            
    if(f){ //編集
      memoset(); //既存のメモセット
    }
    if(f){  //編集処理
      $('.left').click(function() {
        var txt= $('#text').val();
        memoobject.delete()
        var text = ncmb.DataStore('text'); 
        var text = new text({cate: cate_text[cate_set-1],text: txt});
        text.save(); 
        window.setTimeout(function(){
          location.reload();
        }, 500);
      })
    }
    else{ //新規作成
      $('.left').click(function() {
        var txt= $('#text').val();

        if(txt!=""){ //空白でないとき保存
          var text = ncmb.DataStore('text'); 
          var text = new text({cate: cate_text[cate_set-1],text: txt});
          text.save(); 
          window.setTimeout(function(){
            location.reload();
          }, 500);
        }
        f=true;
      })
    }
    $("#conf_memo").click(function(){
      document.getElementById("navi").pushPage("configuration.html") // 設定ページに移動
    })
  }else if(event.target.id == "conf-page"){ //configuration.html

    $( 'ons-range' ).on( 'input', function () { //レンジ
      var size = $("ons-range").val();
      if(size>=50&&size<75){         
        $('textarea').css('font-size','16px');
      }
      else if(size>=75&&size<=100){
        $('textarea').css('font-size','26px');
      }
      else if(size<50&&size>=25){
        $('textarea').css('font-size','8px');
      }
      else if(size<25&&size>=0){
        $('textarea').css('font-size','4px');
      }
    });

    $('#choose-sel').change(function() { //色変え
      var select = $("#choose-sel").val();
      if(select === textcolor[0]){
        $('textarea').css('color','black');
      }
      else if(select === textcolor[1]){
        $('textarea').css('color','red');
      }
      else if(select === textcolor[2]){
        $('textarea').css('color','blue');
      }
      else{
        $('textarea').css('color','green');
      }
    });

    document.getElementById('switch').addEventListener('change', function(e) {
      cate_switch="";
      if(e.target.checked){
        
        var Category = ncmb.DataStore("category");
        Category.order("num").fetchAll()
        .then(function(results){
          for (var i = 0; i < 5; i++) {
            var object = results[i];
            cate_text[i] = object.Category;
          }
          cate_switch+="<ons-list-item><ons-input id='cate_1' modifier='underbar' value='"+cate_text[0]+"' float></ons-input><ons-input id='cate_2' modifier='underbar' value='"+cate_text[1]+"' float></ons-input><ons-input id='cate_3' modifier='underbar' value='"+cate_text[2]+"' float></ons-input><ons-input id='cate_4' modifier='underbar'value='"+cate_text[3]+"'  float></ons-input><ons-input id='cate_5' modifier='underbar' value='"+cate_text[4]+"' float></ons-input></ons-list-item><button onclick='Reg()'>登録</button>";
          $("#category").html(cate_switch); 
        })
        .catch(function(err){
          console.log(err);
        });
                
              
      }
      else{
        $("#category").html(cate_switch);
        $("#msg").html("");
      }
    });      
  }
});


function loaddata(){ //リスト作成
  var memotext = ncmb.DataStore("text");
  memotext.fetchAll()
  .then(function(results){
    for (var i = 0; i < results.length; i++) {
      var object = results[i];              
      listcreate(object,i);
    }
  })
  .catch(function(err){
    console.log(err);
  });          

  function listcreate(object,i){ //一覧リスト作成
    var text_split = object.text.split('\n');;
    var listtext = text_split[0];
    listtext = listtext.substr( 0, 20 );
    html+="<ons-list-item onclick='page("+i+")'>"+listtext+"</ons-list-item>";
    $("#list").html(html);
            
  }
}

function memoset(){  //メモセット
  var memotext = ncmb.DataStore("text");
  memotext.fetchAll()
  .then(function(results){
    var object = results[w];
    memoobject = object;
    $('#text').val(object.text);
    category_set(object.cate);
  })
  .catch(function(err){
    console.log(err);
  });
}

function page(i) {
  w=i;
  document.getElementById("navi").pushPage("memo.html")
}

function back(){ 
  location.reload();
}

function Reg(){ // カテゴリー登録
  var Category = ncmb.DataStore("category");
  Category.fetchAll()
  .then(function(results){
    var len = results.length;
    for (var i = 0; i < len; i++) {
      var object = results[i];
      object.delete()
    }
  });

  cate_text[0] = $("#cate_1").val();
  cate_text[1] = $("#cate_2").val();
  cate_text[2] = $("#cate_3").val();
  cate_text[3] = $("#cate_4").val();
  cate_text[4] = $("#cate_5").val();
  for(var i = 0; i < 5; i++) {
    if(cate_text[i] === ""){
      cate_text[i] = "(未設定)";
    }

    var Category = ncmb.DataStore('category'); 
    var Category = new Category({num:i+1,Category: cate_text[i]});
    Category.save();
  }  
   $("#msg").html("カテゴリーを登録しました");
}

function cate_Set_1(){  //メモ選択
  var Category = ncmb.DataStore("category");
  Category.order("num").fetchAll()
  .then(function(results){
    for (var i = 0; i < 5; i++) {
      var object = results[i];
      cate_text[i] = object.Category;                 
    }
    select_text="<ons-select id='choose-sel_1' onchange='change_1()'><option value='0' selected>カテゴリー選択</option><option value='1'>"+cate_text[0]+"</option><option value='2'>"+cate_text[1]+"</option><option value='3'>"+cate_text[2]+"</option><option value='4'>"+cate_text[3]+"</option><option value='5'>"+cate_text[4]+"</option></ons-select>"
    $("#sele").html(select_text); 
  })
  .catch(function(err){
    console.log(err);
  });          
}

function cate_Set_2(){ // カテゴリー別表示
  var Category = ncmb.DataStore("category");
  Category.order("num").fetchAll()
  .then(function(results){
    for (var i = 0; i < 5; i++) {
      var object = results[i];
      cate_text[i] = object.Category;                  
    }
    select_text="<ons-select id='choose-sel_2' onchange='change_2()'><option value='0' selected>カテゴリー選択</option><option value='1'>"+cate_text[0]+"</option><option value='2'>"+cate_text[1]+"</option><option value='3'>"+cate_text[2]+"</option><option value='4'>"+cate_text[3]+"</option><option value='5'>"+cate_text[4]+"</option></ons-select>"
    $("#sele_2").html(select_text); 
  })
  .catch(function(err){
    console.log(err);
  });          
}

function change_1(){ //保存時のカテゴリー取得
  cate_set = $("#choose-sel_1").val();
}

function change_2(){ // カテゴリーリスト作成
  $("#list").html("");
  html="";
  cate_set = $("#choose-sel_2").val();
  var memotext = ncmb.DataStore("text");
  memotext.equalTo("cate", cate_text[cate_set-1]).fetchAll()
  .then(function(results){
    for (var i = 0; i < results.length; i++) {
      var object = results[i];           
      listcreate(object,i);
    }
  })
  .catch(function(err){
    console.log(err);
  });

  function listcreate(object,i){
    var text_split = object.text.split('\n');;
    var listtext = text_split[0];
    listtext = listtext.substr( 0, 20 );
    html+="<ons-list-item onclick='page("+i+")'>"+listtext+"</ons-list-item>";
    $("#list").html(html);  
  }
}

function category_set(text_cate){ //編集時設定されているカテゴリーをセット
  var Category = ncmb.DataStore("category");
  Category.order("num").fetchAll()
  .then(function(results){
    for (var i = 0; i < 5; i++) {
      var object = results[i];
      cate_text[i] = object.Category;
      if(cate_text[i] === text_cate){
        set_num=i+1;
      }
    }
    switch (set_num){
      case 1:
        select_text="<ons-select id='choose-sel_1' onchange='change_1()'><option value='0'>カテゴリー選択</option><option value='1' selected>"+cate_text[0]+"</option><option value='2'>"+cate_text[1]+"</option><option value='3'>"+cate_text[2]+"</option><option value='4'>"+cate_text[3]+"</option><option value='5'>"+cate_text[4]+"</option></ons-select>"
        $("#sele").html(select_text); 
        break;
      case 2:
        select_text="<ons-select id='choose-sel_1' onchange='change_1()'><option value='0'>カテゴリー選択</option><option value='1'>"+cate_text[0]+"</option><option value='2' selected>"+cate_text[1]+"</option><option value='3'>"+cate_text[2]+"</option><option value='4'>"+cate_text[3]+"</option><option value='5'>"+cate_text[4]+"</option></ons-select>"
        $("#sele").html(select_text); 
        break;
      case 3:
        select_text="<ons-select id='choose-sel_1' onchange='change_1()'><option value='0'>カテゴリー選択</option><option value='1'>"+cate_text[0]+"</option><option value='2'>"+cate_text[1]+"</option><option value='3' selected>"+cate_text[2]+"</option><option value='4'>"+cate_text[3]+"</option><option value='5'>"+cate_text[4]+"</option></ons-select>"
        $("#sele").html(select_text); 
        break;
      case 4:
        select_text="<ons-select id='choose-sel_1' onchange='change_1()'><option value='0'>カテゴリー選択</option><option value='1'>"+cate_text[0]+"</option><option value='2'>"+cate_text[1]+"</option><option value='3'>"+cate_text[2]+"</option><option value='4' selected>"+cate_text[3]+"</option><option value='5'>"+cate_text[4]+"</option></ons-select>"
        $("#sele").html(select_text); 
        break;
      case 5:
        select_text="<ons-select id='choose-sel_1' onchange='change_1()'><option value='0'>カテゴリー選択</option><option value='1'>"+cate_text[0]+"</option><option value='2'>"+cate_text[1]+"</option><option value='3'>"+cate_text[2]+"</option><option value='4'>"+cate_text[3]+"</option><option value='5' selected>"+cate_text[4]+"</option></ons-select>"
        $("#sele").html(select_text); 
        break;
      default:
        select_text="<ons-select id='choose-sel_1' onchange='change_1()'><option value='0' selected>カテゴリー選択</option><option value='1'>"+cate_text[0]+"</option><option value='2'>"+cate_text[1]+"</option><option value='3'>"+cate_text[2]+"</option><option value='4'>"+cate_text[3]+"</option><option value='5'>"+cate_text[4]+"</option></ons-select>"
        $("#sele").html(select_text); 
        break;
    }               
  });           
}

function memo_Delete(){
  if(confirm("削除しますか？")){
    $('input:checked').each(function() {
      var r = $(this).val();
      var memotext = ncmb.DataStore("text");
      memotext.fetchAll()
      .then(function(results){
        var object = results[r];
        object.delete()        
      })
      .catch(function(err){
        console.log(err);
      });      
    })
    window.setTimeout(function(){
      location.reload();
    }, 500);
  }
}
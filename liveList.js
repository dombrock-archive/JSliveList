
var liveList = liveList || {};

liveList.state = {
    "isWriting":false,
    "isReading":false,
    "isDragging":false
};
liveList.data = {
  "list": ["item-5", "item-2", "item-4", "item-3", "item-1"],
  "load": ""
};

liveList.postm = function(save){
  liveList.state["isWriting"] = true;
  $.post( "BACK/write.php", {
    list: save
  },function(data){
      if(data=="database is locked"){
        alert("Server locked, will retry...");
        liveList.postm(save);
      }
      liveList.state["isWriting"] = false;
      return("wrote data");
    }
  );
};

liveList.sort = function(){
  liveList.state["isReading"] = true;
  $.post( "BACK/read.php",function(data){
    var old_load = liveList.data["load"];
    if(data !== null){
      liveList.data["load"] = data;
      liveList.data["list"] = JSON.parse(liveList.data["load"]);
    }
    var res="";
    for (i = 0; i < liveList.data["list"].length; i++) { 
      res += "<li id='"+liveList.data["list"][i]+"'>"+liveList.data["list"][i]+"</li>";
    }
    if(old_load!==liveList.data["load"]){
      $("#sortable").fadeOut(0, function(){
        $("#sortable").html(res);
        liveList.draw_box_content();
        $("#sortable").fadeIn(0); 
      }); 
    }
    else{
      //not redrawing
    }
    liveList.state["isReading"] = false;
  });
};

$(function() {
  //defines how the sortable list should act on the user end. 
  $( "#sortable" ).sortable({   
    placeholder: "ui-sortable-placeholder",
    start: function( event, ui ) {
      liveList.state["isDragging"] = true;
    },
    stop: function(event, ui) {
      var save = JSON.stringify($(this).sortable('toArray'));
      liveList.postm(save);
      liveList.state["isDragging"] =false;
    }
  });  
});

liveList.draw_box_content = function(){
  //I'm sure there is a more programmatic way to run this function
  var item_1 = "<div class='block_text'><h1>#1</h1>This software was written by Mathieu Dombrock</div>";
  var item_2 = "<div class='block_text'><h1>#2</h1>I am using jQuery, jQuery-UI and jqueryui-touch-punch(Mobile Support) for the front-end sorting.</div>";
  var item_3 = "<div class='block_text'><h1>#3</h1>When you drag and drop a block, an AJAX call is sent to our server which updates an SQLite database with the new list order as an array that has been stringified.</div>";
  var item_4 = "<div class='block_text'><h1>#4</h1>On a set interval (very quick) this page asks my server to send it the last state of our list from the database. It checks to see if anything has changed compared to the current state of the list and updates only if it detects a change. It does not make this request when we are currently dragging or holding onto a block.</div>";
  var item_5 = "<div class='block_text'><h1>#5</h1>These blocks are probablly out of order, try to put them back the right way before someone else messes you up.</div>";
  $("#item-1").html(item_1);
  $("#item-2").html(item_2);
  $("#item-3").html(item_3);
  $("#item-4").html(item_4);
  $("#item-5").html(item_5);
};

//checks for new data on the server on a set interval unless we are already working on the server or dragging a block. 
setInterval(function(){
  //if nothing is Happeneing
  if(liveList.state["isDragging"] === false && liveList.state["isReading"] === false && liveList.state["isWriting"] === false){
    //We should be good to request data and update the list now
    liveList.sort();
  }
}, 100);

//init sort
liveList.sort();

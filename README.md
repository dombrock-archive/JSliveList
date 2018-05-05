# JSliveList
## LIVE SYNC IS CURRENTLY BROKEN SOMETHING ABOUT PERMISSIONS
### THIS CODE IS ANCHIENT ANYWAYS
Creates a live asynchronous drag and drop-able list that syncs server side to show all clients the same arrangement in real time. 
 
This is more a proof of concept/ experiment in live data. 

A working demo can be found here:

http://mzero.space/hosted/JSliveList
 
This project uses jQuery UI's "Sortable" plugin to handle the actually re-arranging of the list. This is very handy because it allows us to do something like:

````javascript
$(this).sortable('toArray')
````

To retrieve an array based on the current state of out list. Every time that the user is done making a change to list the software will generate an array something like:

````
 ["item-5", "item-2", "item-4", "item-3", "item-1"]
````

As far as I am aware, jQueryUI does not have the ability to generate list order from an array like this. Only the ability to output the array. 

The code block in which the list is actually generated can be found in the ````liveList.sort()```` method. At the time of writing it looks like this:

````javascript
    for (i = 0; i < liveList.data["list"].length; i++) { 
      res += "<li id='"+liveList.data["list"][i]+"'>"+liveList.data["list"][i]+"</li>";
    }
````
 
The variable ````res```` is later used as the HTML content of the ````#sortable```` div. 

## the AJAX

The client page will run an AJAX call on the server at a set interval (by default 100ms). This happens as part of the ````liveList.sort()````method. The interval is initiated by a method which at the time of this writing starts on line 84 of ````liveList.js```` and looks like this:
 
````javascript
//checks for new data on the server on a set interval unless we are already working on the server or dragging a block. 
setInterval(function(){
  //if nothing is Happeneing
  if(liveList.state["isDragging"] === false && liveList.state["isReading"] === false && liveList.state["isWriting"] === false){
    //We should be good to request data and update the list now
    liveList.sort();
  }
}, 100);
````

(NOTE: The above 'if' conditional  could be more efficient but I kept it simple for examples sake. It also may be better to use a callback from the last AJAX request instead of launching these on an interval.)

The update is initiated by the If the response of this AJAX call. If the data does not match the previous state of the list a function is run to update out list. 

By using JQueryUI's ````stop:```` callback we can make sure that the list is updated every time the user stops dragging a list item. As you can see in the code below, every time the user stops dragging a list item we will call a method called ````liveList.post()```` which will send the current state of our list over to the server for syncing. 
 
This could be a good time to point out that the current state of the list is stored server-side in an SQLite database. This is great for the purposes of this example, but if you wanted to use this concept for something in a real production environment I think that some other form of SQL would be more manageable. 

##Great but where is the text in the list items coming into play?

To avoid mucking up the sorting function I have decided to draw the content of the list items separately from their order. 

````liveList.draw_box_content()```` is the function that draws the actual content of the list items. This function lets the user specify one string variable for each list item and then assigns each variable to the corresponding list item. It could have been more straightforward to avoid all of this and just draw the content directly but I think this looks nicer and is more efficiently abstracted from the logic.  

##More information on jQueryUI's 'Sortable' plugin

Can be found here:
http://api.jqueryui.com/sortable/

The original 'sortable' example I used can be found on CodePen.io at this link:
http://codepen.io/larrygeams/pen/udorw

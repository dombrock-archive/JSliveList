<?php
   class MyDB extends SQLite3
   {
      function __construct()
      {
         $this->open('list_handler.db');
      }
   }
   $db = new MyDB();
   $db->busyTimeout(5000);
   if(!$db){
      echo $db->lastErrorMsg();
   } else {
      //echo "Opened database successfully\n";
   }
   $sql ="UPDATE LIST SET STATE = '".$_POST['list']."' WHERE ID = 1;";
   $ret = $db->exec($sql);
   if(!$ret){
      echo $db->lastErrorMsg();
   } else {
      echo $db->changes(), " Record updated successfully\n";
   }

   $db->close();
?>
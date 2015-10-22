<?php

   class MyDB extends SQLite3
   {
      function __construct()
      {
         $this->open('list_handler.db');
      }
   }
   $db = new MyDB();
   if(!$db){
      echo $db->lastErrorMsg();
   } else {
      //echo "Opened database successfully\n";
   }

$sql =<<<EOF
      SELECT * from LIST;
EOF;

   $ret = $db->query($sql);
   while($row = $ret->fetchArray(SQLITE3_ASSOC) ){
      echo $row['STATE'];
   }
   //echo "Operation done successfully\n";
  $db->close();
?>
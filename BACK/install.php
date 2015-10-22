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
      echo "Opened database successfully\n";
   }
;
   $sql =<<<EOF
      CREATE TABLE IF NOT EXISTS LIST
      (ID INT PRIMARY KEY     NOT NULL,
      STATE           TEXT    NOT NULL);
EOF;

   $ret = $db->exec($sql);
   if(!$ret){
      echo $db->lastErrorMsg();
   } else {
      echo "Table created successfully\n";
   }
   
   $sql =<<<EOF
      INSERT INTO LIST (ID,STATE)
      VALUES (1, 'jeffx');
EOF;

   $ret = $db->exec($sql);
   if(!$ret){
      echo $db->lastErrorMsg();
   } else {
      echo "Records created successfully\n";
   }
   
   $db->close();

?>
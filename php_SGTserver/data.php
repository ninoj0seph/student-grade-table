<?php

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
print_r($_GET);

define('fromData',true);

if(empty($_GET['action'])){
	exit('no action specified');
}

require 'mysql_connect.php';
//require the mysql_connect.php file.  Make sure your properly configured it!


$output = [
	'success'=> false, //we assume we will fail
	'errors'=>[]
];

switch($_GET['action']){
	case 'readAll':
        include 'dataApi/read.php';
		//include the php file 'read.php'
		break;
	case 'insert':
	    include 'dataApi/insert.php';
		//include the php file insert.php
		break;
	case 'delete':
        include 'dataApi/delete.php';
		//include the php file delete.php
		break;
	case 'update':
        include 'dataApi/update.php';
		//include the update.php file
		break;
}
//convert the $output variable to json, store the result in $outputJSON
echo json_encode($output);
//print $outputJSON
//end

?>
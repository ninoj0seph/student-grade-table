<?php
$id = $_POST['id'];

$updateFields = [
    'name' => 'name',
    'course' => 'course_name',
    'grade' => 'grade'
];

if(empty($id)){
    $output['errors'][] = 'Missing ID';
} else {
    $query = 'UPDATE `student_data` SET';
    foreach ($updateFields as $externalField => $internalField){
        if(!empty($_POST[$externalField])){
            $query.="`$internalField`='{$_POST[$externalField]}', ";
        }
    }

    $query = substr($query,0,-2);
    $query.="WHERE id='$id'";
}

print $query;
$result = mysqli_query($conn,$query);
//print ($result)
////check if you have all the data you need from the client-side call.  This should include the fields being changed and the ID of the student to be changed
////if not, add an appropriate error to errors
//
//$query = "UPDATE `student_data` SET `id`='$id',`name`=[value-2],`grade`=[value-3],`course_name`=[value-4] WHERE 1"
////write a query that updates the data at the given student ID.
//$result = null;
//send the query to the database, store the result of the query into $result

if(empty($result)){
    $output['errors'][] = 'Database Error!';
} else {
    if(mysqli_affected_rows($conn) === 1){
        $output['success'] = true;
    } else {
        $output['errors'][] = 'insert error';
    }
}


//check if $result is empty.  
	//if it is, add 'database error' to errors
//else: 
	//check if the number of affected rows is 1.  Please note that if the data updated is EXCACTLY the same as the original data, it will show a result of 0
		//if it did, change output success to true
	//if not, add to the errors: 'update error'

?>
<?php
$name = $_GET['name'];
$grade = $_GET['grade'];
$course = $_GET['course'];
if(empty($name)){
    $output['errors'][] = 'invalid name';
} elseif (empty($grade)){
    $output['errors'][] = 'invalid grade';
} elseif (empty($course)){
    $output['errors'][] = 'invalid course';
}

//check if you have all the data you need from the client-side call.
//if not, add an appropriate error to errors
$query = "INSERT INTO `student_data`(`name`, `grade`, `course_name`) VALUES ('$name','$grade','$course')";
//write a query that inserts the data into the database.  remember that ID doesn't need to be set as it is auto incrementing
//send the query to the database, store the result of the query into $result
$result = mysqli_query($conn,$query);
var_dump($result);
if(empty($result)){
    $output['errors'][] = 'database error';
} else {
    if(mysqli_affected_rows($conn) === 1){
        $output['success'] = true;
        $insertID = mysqli_insert_id($conn);
        $new_id = mysqli_insert_id($conn);
        $output['$insertID'] = $insertID;
    } else {
        $output['errors'][] = 'insert error';
    }
}
?>
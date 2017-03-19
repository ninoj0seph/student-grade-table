/**
 * Define all global variables here
 */
var clicked = new clickedConstructor();
var student = new studentConstructor();
var update = new updateConstructor();
var display = new displayConstructor();
var server = new serverConstructor();

/**
 * Listen for the document to load and reset the data to the initial state
 *
 */
$(document).ready(function () {
    display.reset();
});

/**
 * addClicked - Event Handler when user clicks the add button
 */
/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 *
 */
function clickedConstructor() {
    this.addBtn = function () {
      student.addStudent();
    };

    this.cancelBtn = function () {
        display.clearAddStudentForm();
    };

    this.removeBtn = function (element) {
        student.remove(element);
    };

    this.serverBtn = function (){
        server.getData();
    }
}
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */

function studentConstructor() {
    this.array = [];
    this.inputIds = ['studentName', 'course', 'studentGrade'];
    this.addStudent = function () {
        var studentObj = {
            name : null,
            course : null,
            grade : null
        };
        var index = 0;
        for(var key in studentObj){
            studentObj[key] = $('#' + this.inputIds[index]).val() === "" ? 'Invalid Input!' : $('#' + this.inputIds[index]).val();
            index++;
        }
        console.log(studentObj);
        this.array.push(studentObj);
        update.data();
        return;
    };

    this.calculateAverage = function () {
        var total = 0;
        for(var i = 0; i  < this.array.length; i++){
            total += this.array[i].grade === "Invalid Input!" ? 100 : parseInt(this.array[i].grade);
        }
        return ~~(total / this.array.length);
    };

    this.remove = function (removeBtnElement) {
        student.array.splice(parseInt(removeBtnElement.getAttribute('index')),1);
        update.studentList();
    };
}

/**
 * updateData - centralized function to update the average and call student list update
 */

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */

function updateConstructor() {
    this.data = function () {
        display.gradeAverage(student.calculateAverage());
        this.studentList();
    };
    
    this.studentList = function () {
        $('.student-list tbody').html('');
        for(var i = 0; i  < student.array.length; i++){
            display.addStudentToDom(student.array[i],i);
        }
    }
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */

function displayConstructor() {
    this.addStudentToDom = function (passedStudentObj,index) {
        var element = {
            name : "<td>"+passedStudentObj.name +"</td>",
            course : "<td>"+passedStudentObj.course+"</td>",
            grade : "<td>"+passedStudentObj.grade+"</td>",
            removeButton : "<td><button type ='button' class ='btn btn-danger' index ='" + index + "' onclick ='clicked.removeBtn(this)'>Remove</button></td>"
        };
        $('.student-list tbody').append('<tr>'+ element.name + element.course + element.grade + element.removeButton + '</tr>');
        this.clearAddStudentForm();
    };

    this.reset = function () {
        student.array = [];
        this.clearAddStudentForm();
    };

    this.clearAddStudentForm = function () {
        for(var i = 0; i  < student.inputIds.length; i++){
            $('#' + student.inputIds[i]).val("");
        }
    };

    this.gradeAverage = function (value) {
        $('.avgGrade').text(value);
    };
}

function serverConstructor() {
    this.getData = function () {
        console.log('hang in there were pulling it from the cloud :)');
        $.ajax({
            'dataType' : 'json',
            'method' : 'post',
            'data' : {'api_key' : 'wgJ98cHF1h'},
            'url' : 'http://s-apis.learningfuze.com/sgt/get',
            "success" : function(serverObj) {
                student.array.push(...serverObj.data);
                update.data();
            },
            "error" : function () {
                console.log('better luck next time mate :(');
            }
        });
    };
}

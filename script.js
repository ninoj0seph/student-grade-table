/**
 * Define all global variables here
 */
var clicked = new clickedConstructor();
var student = new studentConstructor();
var update = new updateConstructor();
var display = new displayConstructor();
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
// go to line 55;
//var student_array = [];



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
        student.clearAddForm();
    };

    this.removeBtn = function () {
        student.remove();
    };
}
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
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */

function studentConstructor() {
    this.array = [];
    this.inputIds = ['studentName', 'course', 'studentGrade'];

    this.addStudent = function () {
        var studentObj = {};
        for(var i = 0; i  < this.inputIds.length; i++){
            studentObj[this.inputIds[i]] = $('#' + this.inputIds[i]).val();
        }
        console.log(studentObj);
        this.array.push(studentObj);
        update.data();
        display.addStudentToDom(studentObj)
        return;
    };

    this.clearAddForm = function () {
        for(var i = 0; i  < this.inputIds.length; i++){
            $('#' + this.inputIds[i]).val("");
        }
    };

    this.calculateAverage = function () {
        var total = 0;
        for(var i = 0; i  < this.array.length; i++){
            total += this.array[i].grade === undefined ? 100 : parseInt(this.array[i].grade);
        }
        return total/this.array.length;
    };

    this.remove = function () {
        console.log('remove coming soon!');
    }
}

/**
 * updateData - centralized function to update the average and call student list update
 */

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */

function updateConstructor() {
    this.data = function () {
        $('.avgGrade').text(student.calculateAverage());
    };
    
    this.studentList = function () {
        for(var x = 0; x < student.array.length; x++){
            display.addStudentToDom(student.array[x]);
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

function displayConstructor() {
    this.addStudentToDom = function (passedStudentObj) {
        var nameElement = '<td>'+passedStudentObj.studentName +'</td>';
        var courseElement = '<td>'+passedStudentObj.course+'</td>';
        var gradeElement = '<td>'+passedStudentObj.studentGrade+'</td>';
        var removeButton = '<td><button type="button" class="btn btn-danger" onclick="clicked.removeBtn()">Remove</button></td>'
        $('.student-list').find('tbody').append('<tr>'+ nameElement + courseElement + gradeElement + removeButton + '</tr>');
        student.clearAddForm();
    };

    this.reset = function () {
        student.array = [];
        student.clearAddForm();
    }
}


/**
 * Listen for the document to load and reset the data to the initial state
 *
 */
$(document).ready(function () {
   display.reset();
});
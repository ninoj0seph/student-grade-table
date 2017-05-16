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
    server.getData();
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
        this.studentObj = {
            student : {
                name : null,
                course : null,
                grade : null
            }
        };
        var index = 0;
        for(var key in this.studentObj.student){
            this.studentObj.student[key] = $('#' + this.inputIds[index]).val();
                // key !== "grade" ? $('#' + this.inputIds[index]).val() : $('#' + this.inputIds[index]).val() > 100 ? 100 : $('#' + this.inputIds[index]).val();
            if(this.studentObj[key] === ""){
                display.alertBoxShow('Invalid input: Student ' + key);
                return;
            }
            display.alertBoxHide();
            index++;
        }
        // this.array.unshift (this.studentObj);
        server.createData(this.studentObj);
    };

    this.calculateAverage = function () {
        var total = 0;
        for(var i = 0; i  < this.array.length; i++){
            total += parseInt(this.array[i].grade);
        }
        return ~~(total / this.array.length);
    };

    this.remove = function (removeBtnElement) {
        var removeIndex = parseInt(removeBtnElement.getAttribute('index'));
        var payload = {sid : student.array[removeIndex].id};
        server.deleteData(payload);
        student.array.splice(removeIndex,1);
        update.data();
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
    };



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
        display.alertBoxHide();
        student.array = [];
        this.clearAddStudentForm();
    };

    this.clearAddStudentForm = function () {
        for(var i = 0; i  < student.inputIds.length; i++){
            $('#' + student.inputIds[i]).val("");
        }
    };

    this.gradeAverage = function (value) {
        $('.avgGrade').removeClass('label-success label-warning label-danger label-default').addClass(value >= 80 ? 'label-success' : value >= 70 ? 'label-warning' : 'label-danger').text(value);
    };

    this.disableLetters = function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    };

    this.modal = function (messageToShow) {
        $('.modal-title').text("Please Wait");
        $("#message").text(messageToShow);
        $("#displayMsgModal").modal('toggle');
        $('.loader').show();
        $('.modalExit').hide();
    };

    this.errorModal = function (message) {
        $('.modal-title').text("Something went wrong");
        $('#message').text(message);
        $('.loader').hide();
        $('.modalExit').show();
    };

    this.alertBoxHide = function () {
        $('.alert').hide();
    };

    this.alertBoxShow = function (outputText) {
        $('.alert span').html('<strong>Error! </strong>' + outputText);
        $('.alert').show();
    };
}

function serverConstructor() {
    this.getData = function () {
        $.ajax({
            'dataType' : 'json',
            'url' : 'http://localhost:8888/api/read',
            "success" : function(serverObj) {
                if(serverObj.status === 200){
                    student.array = serverObj.students.slice().reverse();
                    update.data();
                } else {
                    display.modal();
                    display.errorModal(serverObj.status);
                }
            },
            error: function() {
                display.modal();
                display.errorModal("Response failed");
            }
        });
    };
    
    this.createData = function (payload) {
        display.modal("Posting Data to the Friendly Skies!");
        $.ajax({
            contentType :'application/json',
            type: "POST",
            url: 'http://localhost:8888/api/create',
            data: JSON.stringify(payload),
            dataType: "json",
            "success" : function(serverObj) {
                if(serverObj.status === 200){
                    setTimeout(function () {
                        payload.id = serverObj.studentId;
                        display.modal();
                        server.getData();
                    },1000)
                } else {
                    display.errorModal(serverObj.status);
                }
            },
            error: function(serverObj) {
                display.errorModal("Response failed");
            }
        });
    };

    this.deleteData = function (payload) {
        display.modal("Deleting Data From the Friendly Skies!");
        $.ajax({
            contentType :'application/json',
            'dataType' : 'json',
            'method' : 'POST',
            'data' : JSON.stringify(payload),
            'url' : 'http://localhost:8888/api/delete',
            "success" : function(serverObj) {
                if(serverObj.status === 200){
                    server.getData();
                    setTimeout(function () {
                        display.modal();
                    },1000);

                } else {
                    display.errorModal(serverObj.status);
                }
            },
            error: function() {
                display.errorModal("Response failed");
            }
        });
    };
}

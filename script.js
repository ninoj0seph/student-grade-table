var clicked = new clickedConstructor();
var student = new studentConstructor();
var update = new updateConstructor();
var display = new displayConstructor();
var server = new serverConstructor();

$(document).ready(function () {
    display.reset();
    server.getData();
});

function clickedConstructor() {
    this.addBtn = function () {
      student.addStudent();
    };

    this.cancelBtn = function () {
        display.clearAddStudentForm();
    };

    this.removeBtn = function (element) {
        display.removeModal(element);
    };

    this.updateBtn = function (element) {
        update.edit(element);
    };

    this.submitUpdateBtn = function(element){
        student.update(element);
    }
}

function studentConstructor() {
    this.array = [];
    this.inputIds = ['studentName', 'course', 'studentGrade'];
    this.addStudent = function () {
        let addStudentPayload = {student : {name : null, course : null, grade : null}}, inputBoxIndex = 0;
        for(let key in addStudentPayload.student){
            display.alertBoxHide();
            let inputValue = $('#' + this.inputIds[inputBoxIndex++]).val();
            if(this.validateInput(inputValue)){
                addStudentPayload.student[key] = inputValue;
            } else {
                display.alertBoxShow('Invalid input: Student ' + key);
                return
            }
        }
        server.createData(addStudentPayload);
    };

    this.update = function (updateBtnElement) {
        let updateIndex = parseInt(updateBtnElement.getAttribute('index')),
            updateStudentPayload = {student : {name : null, course : null, grade : null}},
            inputBoxIndex = 0;

        for(let key in updateStudentPayload.student){
            display.alertBoxHide();
            let inputValue = $("input[edit=" + this.inputIds[inputBoxIndex++] + updateIndex + "]").val();
            if(this.validateInput(inputValue)){
                updateStudentPayload.student[key] = inputValue;
            } else {
                display.alertBoxShow('Invalid edit input: Student ' + key);
                return
            }
        }
        updateStudentPayload.student.id = parseInt(student.array[updateIndex].id);
        server.updateData(updateStudentPayload);
    };

    this.remove = function (removeBtnElement) {
        let removeIndex = parseInt(removeBtnElement.getAttribute('index'));
        let payload = {sid : student.array[removeIndex].id};
        server.deleteData(payload);
        student.array.splice(removeIndex,1);
        update.data();
    };

    this.validateInput = function (elementValue) {
        return /^[a-zA-Z-,0-9]+(\s{0,1}[a-zA-Z-, 0-9])*$/.test(elementValue) ? true : false;
    };

    this.calculateAverage = function () {
        let total = 0;
        for(let i = 0; i  < this.array.length; i++){
            total += parseInt(this.array[i].grade);
        }
        return ~~(total / this.array.length);
    };

}

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

    this.edit = function (updateBtnElement) {
        var index = $(updateBtnElement).attr('index');
        student.inputIds.map(function (classN) {
            $('.' + classN + index).replaceWith(
                '<td>' +
                    '<input type="text" class="form-control" edit="' + classN + index + '" id="studentName" value="'+ $('.' + classN + index).text() +'">' +
                '</td>'
            );
        });
        $("button[index=" + index + "]").hide();
        $("input[edit=" + student.inputIds[2] + index + "]").change(function () {
            display.rangeNumber(this);
        }).keypress(function () {
            return display.disableLetters(event);
        }).attr({type : 'number', max : 100, min : 1});
        $(updateBtnElement).parent().append("<button index='" + index + "' type ='button' class ='btn btn-warning' onclick ='student.update(this)'>Submit</button>");
    };
}

function displayConstructor() {
    this.addStudentToDom = function (passedStudentObj,index) {
        var tdClassName = passedStudentObj.grade >= 80 ? 'active success' : passedStudentObj.grade >= 70 ? 'active warning' : 'active danger';
        var element = {
            name : "<td class='"+ student.inputIds[0]+ index +"'>"+passedStudentObj.name +"</td>",
            course : "<td class='"+ student.inputIds[1]+ index +"'>"+passedStudentObj.course +"</td>",
            grade : "<td class='"+ student.inputIds[2]+ index + ' ' + tdClassName + "'>"+passedStudentObj.grade +"</td>",
            removeButton :
            "<td>" +
            "   <div class='btn-group-horizontal'>" +
            "       <button type ='button' class ='btn btn-danger' index ='" + index + "' onclick ='clicked.removeBtn(this)'>Remove</button>" +
            "       <button type ='button' class ='btn btn-info' index ='" + index + "' onclick ='clicked.updateBtn(this)'>Update</button>" +
            "   </div>" +
            "</td>"
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
        $('.avgGrade').removeClass('label-success label-warning label-danger label-default').addClass(value >= 80 ? 'label-success' : value >= 70 ?
            'label-warning' : 'label-danger').text(value);
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
        $('.messageModalTitle').text("Please Wait");
        $("#message").text(messageToShow);
        $("#displayMsgModal").modal('toggle');
        $('.loader').show();
        $('.modalExit').hide();
    };

    this.errorModal = function (message) {
        $('.messageModalTitle').text("Something went wrong");
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

    this.removeModal = function (btnElement) {
        $('.deleteFooter').html('').append(
            '<button type="button" class="modalCancel btn btn-warning" data-dismiss="modal">Cancel</button>'
        );
        $(btnElement).clone().attr({
            onclick :'student.remove(this)',
            'data-dismiss' : 'modal'
        }).appendTo('.deleteFooter');
        $("#deleteConfirm").modal('toggle');
    };

    this.rangeNumber = function (element) {
        if(parseInt(element.value) > 100) element.value = 100;
    };
}

function serverConstructor() {
    this.getData = function () {
        $.ajax({
            'dataType' : 'json',
            'url' : 'https://ninojoseph.com/sgt/api/read',
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
            url: 'https://ninojoseph.com/sgt/api/create',
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
            error: function() {
                display.errorModal("Response failed");
            }
        });
    };

    this.updateData = function (payload) {
        $.ajax({
            contentType :'application/json',
            type: "POST",
            url: 'https://ninojoseph.com/sgt/api/update',
            data: JSON.stringify(payload),
            dataType: "json",
            "success" : function() {
                $(".student-list > tbody").html("");
                server.getData();
            },
            error: function() {
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
            'url' : 'https://ninojoseph.com/sgt/api/delete',
            "success" : function(serverObj) {
                if(serverObj.status === 200){
                    setTimeout(function () {
                        display.modal();
                    },1000);
                    server.getData();
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


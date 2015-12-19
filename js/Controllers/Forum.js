$(document).ready(function () {
    Parse.$ = jQuery;
    var classID = getParameterByName("class");
    var userName = isValidEmailAddress(Parse.User.current().attributes.username) ? Parse.User.current().attributes.username : Parse.User.current().attributes.email;
    
    var roleCheck = new Parse.Query("ApplicationUsers");
    roleCheck.equalTo("Email", userName);
    roleCheck.find({
        success: function (c) {
            if (c.length > 0) {
                if (c[0].attributes.Type !== "T") {
                    $("#myClassMenu").remove();
                    $("#allClassMenu").remove();
                    $("#menuContainer").prepend("<li id='allClassMenu'><a href='StudentsHome.html' style='cursor: pointer;text-decoration: none;'><strong>Home</strong></a></li>");
                }
            }
        }
    });


    function getParameterByName(name) {
        var url = window.location.href,
        vars = {};
        url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            key = decodeURIComponent(key);
            value = decodeURIComponent(value);
            vars[key] = value;
        });
        return vars["class"];
    }
    if (classID === "") {
        location.href = "/index.html";
    }
    var groupDescription = "";
    var classQuery = new Parse.Query("Groups");
    classQuery.equalTo("objectId", classID);
    classQuery.find({
        success: function (c) {
            $("#mainThought").text(c[0].attributes.GroupName);
            //$("#forumOwner").html("Share your comments with " + c[0].attributes.Owner + "");
            groupDescription = c[0].attributes.GroupDescription;
        }
    });

    var allQuery = new Parse.Query("GroupComments");
    //allQuery.equalTo("UserID", "Arun@gmail.com"); 
    allQuery.equalTo("ClassID", classID);
    allQuery.find({
        success: function (c) {
            debugger;
            var chatElement = "";
            $.each(c, function () {
                if (this.attributes.UserID === userName) {
                    chatElement = "<li class='clearfix'> <div class='message-data align-right'> <span class='message-data-time'>" + formatAMPM(this.createdAt) + ", " + this.createdAt.toLocaleDateString() + "</span> &nbsp; &nbsp; <span class='message-data-name'>" + this.attributes.UserID + "</span> <i class='fa fa-circle me'></i> </div> <div class='message other-message float-right'> " + this.attributes.Comment + " </div> </li>";
                    
                } else {
                    chatElement = "<li> <div class='message-data'> <span class='message-data-name'><i class='fa fa-circle online'></i> " + this.attributes.UserID + "</span> <span class='message-data-time'>" + formatAMPM(this.createdAt) + ", " + this.createdAt.toLocaleDateString() + "</span> </div> <div class='message my-message'> " + this.attributes.Comment + "</div> </li>";
                }
                $("#chatHistory").append(chatElement);
            });
            
            $('.chat-history')[0].scrollTop = $('.chat-history')[0].scrollHeight;
        }
    });

    $("#mainThought").click(function () {
        showDescription(groupDescription);
    });

    $("#btnSend").click(function (e) {
        saveComment();
    });

    $("#btnLike").click(function () {
        manageLikeUnlike();
    });

    function manageLikeUnlike() {
        var classQuery = new Parse.Query("Likes");
        classQuery.equalTo("classID", classID);
        classQuery.equalTo("userID", userName);
        classQuery.find({
            success: function (c) {
                if (c.length > 0) {
                    if (c.length > 0) {
                        debugger;
                        var buttontext = "";
                        if (c[0].attributes.like === "true") {
                            buttontext = "Like";
                            c[0].set("like", "false");
                        } else {
                            buttontext = "UnLike";
                            c[0].set("like", "true");
                        }
                        
                        c[0].save(null, {
                            success: function (contact) {
                                $("#btnLike").text(buttontext);
                            },
                            error: function (data, error) {
                                toastr.error("Error");
                            }
                        });
                    }
                } else {
                    addNewLike();
                }
            }
        });
    }
    setLikeButtonStatus();
    function setLikeButtonStatus() {
        var exApUsers = Parse.Object.extend("Likes");
        var classQuery = new Parse.Query(exApUsers);
        classQuery.equalTo("classID", classID);
        classQuery.equalTo("userID", userName);
        classQuery.find({
            success: function (c) {
                if (c.length > 0) {
                    if (c.length > 0) {
                        debugger;
                        var buttontext = "";
                        if (c[0].attributes.like === "true") {
                            $("#btnLike").text("UnLike");
                        } else {
                            $("#btnLike").text("Like");
                        }
                                               
                    }
                } 
            }
        });
    }

    function addNewLike() {
        var groupComment = new Parse.Object("Likes");
        groupComment.set("classID", classID);
        groupComment.set("userID", userName);
        groupComment.set("like", "true");
        groupComment.save(null, {
            success: function (data) {
                $("#btnLike").text("UnLike");
            },
            error: function (data, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                toastr.error('Failed to create new object, with error code: ' + error.message);
            }
        });
    }
    
    function showDescription(msg) {
        // initialize modal element
        var modalEl = document.createElement('div');
        modalEl.textContent = msg;
        modalEl.style.width = '700px';
        modalEl.style.width = '700px';
        modalEl.style.height = '400px';
        modalEl.style.margin = '100px auto';
        modalEl.style.backgroundColor = '#fff';
        modalEl.style.overflowX= "hidden";
        modalEl.style.overflowY= "scroll";
        modalEl.style.wordWrap= "break-word";
        modalEl.style.color= "black";
        modalEl.style.padding= "10px";
        mui.overlay('on', modalEl);
    }

    function saveComment() {
        if ($("#messageToSend").val() !== "") {
            var groupComment = new Parse.Object("GroupComments");
            groupComment.set("ClassID", classID);
            groupComment.set("UserID", userName);
            groupComment.set("Comment", $("#messageToSend").val());
            groupComment.save(null, {
                success: function (data) {
                    var uData = $("#messageToSend").val();
                    var currentDate = new Date();
                    var element = "<li class='clearfix'> <div class='message-data align-right'> <span class='message-data-time'>" + formatAMPM(currentDate) + ", " + currentDate.toLocaleDateString() + "</span> &nbsp; &nbsp; <span class='message-data-name'>" + userName + "</span> <i class='fa fa-circle me'></i> </div> <div class='message other-message float-right'> " + uData + " </div> </li>";
                    $("#chatHistory").append(element);
                    $('.chat-history')[0].scrollTop = $('.chat-history')[0].scrollHeight;
                    $("#messageToSend").val("").focus();
                },
                error: function (data, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    toastr.error('Failed to create new object, with error code: ' + error.message);
                }
            });
        }
    }

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'AM' : 'PM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
});
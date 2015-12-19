$(document).ready(function () {
    Parse.$ = jQuery;
    Parse.initialize("pkN9vyCFUt0vSrHpr6FuvUJht48RQBboZZ9hhcME", "H1uDONVucpBVvNTkfYfh7GnrcwPtEU1x2ynJfYJX");
    $("#btnSubmit").click(function () {
        if (validateForm()) {

            var apUsers = Parse.Object.extend("ApplicationUsers");
            var apUsersQuery = new Parse.Query(apUsers);
            apUsersQuery.equalTo("Email", $('#email').val());
            apUsersQuery.find({
                success: function (results) {
                    if (results !== null && results.length > 0) {
                        var user = new Parse.User();
                        user.set("username", $("#email").val());
                        user.set("firstName", $("#firstName").val());
                        user.set("lastName", $("#lastName").val());
                        user.set("password", $("#password").val());
                        user.signUp(null, {
                            success: function (user) {
                                if (results[0].attributes["Type"] === "T") {
                                    location.href = "/MyClasses.html";
                                } else if (results[0].attributes["Type"] === "A") {
                                    location.href = "/AdminHome.html";
                                }
                                else {
                                    location.href = "StudentsHome.html";
                                }

                                // Hooray! Let them use the app now.
                            },
                            error: function (user, error) {
                                switch (error.code) {
                                    case 202:
                                        toastr.error(error.message);
                                        break;
                                    default:
                                        toastr.error("Error: " + error.code + " " + error.message);
                                        break;
                                }
                            }
                        });
                    } else {
                        toastr.error("Invalid user id..!");
                    }
                }
            });
        }
    });

    function validateForm() {
        if ($("#firstName").val() === "" || $("#lastName").val() === "" || $("#email").val() === "" || $("#password").val() === "" || $("#confirmPassword").val() === "") {
            toastr.error("Missing mandatory fields..!");
            return false;
        }

        if ($("#confirmPassword").val() !== $("#password").val()) {
            toastr.error("Password does not match the confirm password..!");
            return false;
        }

        return true;
    }

    $("#btnReset").click(function () {
        $("input[type='text']").val("");
        $("input[type='email']").val("");
        $("input[type='password']").val("");
    });
});
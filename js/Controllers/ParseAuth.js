$(function () {

    Parse.$ = jQuery;

    // Initialize Parse with your Parse application javascript keys
    Parse.initialize("pkN9vyCFUt0vSrHpr6FuvUJht48RQBboZZ9hhcME", "H1uDONVucpBVvNTkfYfh7GnrcwPtEU1x2ynJfYJX");
    var currentUser = Parse.User.current();
    if (!currentUser) {
        location.href = "/index.html";
    }

    $("#btnSignOut").click(function () {
        Parse.User.logOut();
        location.href = "/index.html";
    });
});
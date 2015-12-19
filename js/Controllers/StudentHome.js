$(document).ready(function () {
    Parse.$ = jQuery;
    // Initialize Parse with your Parse application javascript keys
    //Parse.initialize("UIX2yWbJR0BBg4sUvxTkFracFjlaXt4q4Ee18whZ", "odtjY02VHcst6CVS2OPxEGSfwpQPmykHQeBFpACu");
    var $grid = null;

    var userName = isValidEmailAddress(Parse.User.current().attributes.username) ? Parse.User.current().attributes.username : Parse.User.current().attributes.email;
    function bindGrid() {
        var apUsers = Parse.Object.extend("Groups");
        var apUsersQuery = new Parse.Query(apUsers);
        apUsersQuery.find({
            success: function (results) {
                var data = [];
                $.each(results, function (i, v) {
                    data.push({ id: this.id, GroupName: this.attributes.GroupName, GroupDescription: this.attributes.GroupDescription });
                });
                var dataSource = new kendo.data.DataSource({
                    data: data,
                    pageSize: 10,
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                GroupName: { validation: { required: true } },
                                GroupName: { validation: { required: true } }
                            }
                        }
                    }
                });
                $("#studentGrid").data("kendoGrid").setDataSource(dataSource);
                $('#studentGrid tbody > tr').dblclick(function (e) {
                    var grid = $("#studentGrid").data("kendoGrid");
                    var gp = Parse.Object.extend("BlockedUsers");
                    var query = new Parse.Query(gp);
                    query.equalTo("classID", grid.dataItem(grid.select()).id);
                    query.equalTo("userID", userName);
                    query.find({
                        success: function (objAp) {
                            if (objAp.length > 0) {
                                toastr.error("You are blocked from this class.");

                            } else {
                                location.href = "/Forum.html?class=" + grid.dataItem(grid.select()).id.trim();
                            }
                        },
                        error: function (object, error) {
                            toastr.error("Error");
                        }
                    });
                });
            }
        });
    }

    bindGrid();


    $("#studentGrid").kendoGrid({
        selectable: "row",
        pageable: true,
        height: 550,
        columns: [
            { field: "GroupName", title: "Class Name", width: "120px" },
            { field: "GroupDescription", title: "Class Description" },
            ]
    });
});
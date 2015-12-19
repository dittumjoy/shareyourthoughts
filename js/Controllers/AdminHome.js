$(document).ready(function () {
    debugger;
    Parse.$ = jQuery;
    // Initialize Parse with your Parse application javascript keys
    Parse.initialize("pkN9vyCFUt0vSrHpr6FuvUJht48RQBboZZ9hhcME", "H1uDONVucpBVvNTkfYfh7GnrcwPtEU1x2ynJfYJX");
    var $grid = null;


    function bindGrid() {
        var apUsers = Parse.Object.extend("ApplicationUsers");
        var apUsersQuery = new Parse.Query(apUsers);
        apUsersQuery.notEqualTo("UserID", Parse.User.current().attributes.username);
        apUsersQuery.find({
            success: function (results) {
                var data = [];
                $.each(results, function (i, v) {
                    data.push({ id: this.id, Email: this.attributes.Email, Type: this.attributes.Type });
                });
               
                var dataSource = new kendo.data.DataSource({
                    data: data,
                    pageSize: 10,
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                Email: { validation: { required: true } },
                                Type: { validation: { required: true } }
                            }
                        }
                    }
                });
                $("#teacherGrid").data("kendoGrid").setDataSource(dataSource);
            }
        });
    }

    bindGrid();


    $("#teacherGrid").kendoGrid({
        selectable: "row",
        pageable: true,
        height: 550,
        toolbar: ["create"],
        columns: [
            { field: "Email", title: "Email", width: "300px" },
            {
                field: "Type", title: "User Type", validation: { required: true, maxlength: 1 },
                editor: function (container, options) {
                    var input = $("<input/>");
                    input.attr("name", options.field);
                    input.attr("placeholder", "User Role (T OR S)");
                    input.appendTo(container);
                }
            },
            {
                command: [{ name: "edit" }, {
                    name: "Delete", click: function (e) {
                        debugger;
                        var tr = $(e.target).closest("tr"); //get the row for deletion
                        var data = this.dataItem(tr); //get the row data so it can be referred later
                        var result = confirm("Want to delete?");
                        if (result) {
                            var gp = Parse.Object.extend("ApplicationUsers");
                            var query = new Parse.Query(gp);
                            query.equalTo("objectId", data.id);
                            query.find({
                                success: function (objAp) {
                                    if (objAp.length > 0) {
                                        // The object was retrieved successfully.
                                        objAp[0].destroy({
                                            success: function () {
                                                var grid = $("#teacherGrid").data("kendoGrid");
                                                grid.dataSource.remove(data)  //prepare a "destroy" request 
                                                grid.dataSource.sync()
                                                toastr.success("Deleted Successfully");
                                            },
                                            error: function (data, error) {
                                                toastr.error("Error");
                                            }
                                        });

                                    }
                                },
                                error: function (object, error) {
                                    // The object was not retrieved successfully.
                                    // error is a Parse.Error with an error code and description.
                                }
                            });
                        }
                    }
                }], title: "&nbsp;", width: "250px"
            }],
        editable: "popup",
        edit: function (e) {
            debugger;
            if (e.model.id === "") {
                handleInsert(e);
            } else {
                handleUpdate(e);
            }
        }
    });

    function handleUpdate(e) {
        e.container.find(".k-button.k-grid-update").click(function () {
            if (isValidAdminData()) {
                var query = new Parse.Query("ApplicationUsers");
                var grid = $("#teacherGrid").data("kendoGrid");
                var rowId = grid.dataItem($("#teacherGrid").data("kendoGrid").table.find("tr[data-uid=" + e.model.uid + "]")).id;
                query.equalTo("objectId", rowId);
                query.find({
                    success: function (Contact) {
                        if (Contact.length > 0) {
                            Contact[0].set("Email", $("[name='Email']").val());
                            Contact[0].set("Type", $("[name='Type']").val());
                            Contact[0].save(null, {
                                success: function (contact) {
                                    toastr.success("Updated Successfully");
                                },
                                error: function (data, error) {
                                    toastr.error("Error");
                                }
                            });
                        }
                    },
                    error: function (data, error) {
                        toastr.error("Error");
                    }
                });
            } else {
                toastr.error("Enter email OR Type");
            }
            });
    }

    function handleInsert(e) {
        e.container.find(".k-button.k-grid-update").click(function () {
            var email = $("[name='Email']").val();
            var type = $("[name='Type']").val();
            if (isValidAdminData()) {
                var apUsers = new Parse.Object("ApplicationUsers");
                apUsers.set("Email", email);
                apUsers.set("Type", type);
                apUsers.save(null, {
                    success: function (data) {
                        // Execute any logic that should take place after the object is saved.
                        toastr.success("Added Successfully");
                    },
                    error: function (data, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and message.
                        toastr.error("Error");
                    }
                });
            } else {
                toastr.error("Enter email OR Type");
            }
            
        });


    }

    function isValidAdminData() {
        var email = $("[name='Email']").val();
        var type = $("[name='Type']").val();
        if (email === "" || type === "") {
            return false;
        } else {
            return true;
        }
    }
});
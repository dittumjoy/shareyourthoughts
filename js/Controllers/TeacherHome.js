$(document).ready(function () {
    Parse.$ = jQuery;
    // Initialize Parse with your Parse application javascript keys
    //Parse.initialize("UIX2yWbJR0BBg4sUvxTkFracFjlaXt4q4Ee18whZ", "odtjY02VHcst6CVS2OPxEGSfwpQPmykHQeBFpACu");
    var $grid = null;
    var activeClassID = "";

    function bindGrid() {
        var apUsers = Parse.Object.extend("Groups");
        var apUsersQuery = new Parse.Query(apUsers);
        apUsersQuery.find({
            success: function (results) {
                var data = [];
                $.each(results, function (i, v) {
                    data.push({ id: this.id,Owner:this.attributes.Owner, GroupName: this.attributes.GroupName, GroupDescription: this.attributes.GroupDescription });
                });
                var dataSource = new kendo.data.DataSource({
                    data: data,
                    pageSize: 10,
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                GroupName: { validation: { required: true } },
                                GroupDescription: { validation: { required: true } }
                            }
                        }
                    }
                });
                $("#teacherGrid").data("kendoGrid").setDataSource(dataSource);
                $('#teacherGrid tbody > tr').dblclick(function (e) {
                    var grid = $("#teacherGrid").data("kendoGrid");
                    location.href = "/Forum.html?class=" + grid.dataItem(grid.select()).id.trim();
                });
            }
        });
    }
    bindGrid();
    $("#teacherGrid").kendoGrid({
        selectable: "row",
        pageable: true,
        height: 550,
        columns: [
            { field: "GroupName", title: "Class Name", width: "200px" },
            //{ field: "Owner", title: "Owner", width: "200px" },
            { field: "GroupDescription", title: "Class Description", width: "350px" }]    
    });
});
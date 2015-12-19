function getSelectedRowData(id) {
    var grid = $(id).data("kendoGrid");
    var selectedItem = grid.dataItem(grid.select());
    return selectedItem;
}
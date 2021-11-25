sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType"
], function(Controller,Sorter,Filter,FilterOperator,FilterType) {
	"use strict";
	return Controller.extend("felece.challengeuserapp.controller.routes.UsersTable", {
		navToCreatePage:function(oEvent,path){
			var comp = this.getOwnerComponent();
			var router = comp.getRouter();
			if (path===undefined){
				router.navTo("create",{path:null});
			}
			else{
				router.navTo("create",{path:path});
			}
			
		},
		updateRow:function(oEvent){
			var oButton = oEvent.getSource();
   		    var path = oButton.getBindingContext("userModel").getPath();
		    this.navToCreatePage(oEvent,path.split("/")[2]);
		    
		},
		deleteSelectedItems:function(){
			 var oTable = this.getView().byId("table1");
			 var tableModel = oTable.getModel("userModel");
			 var tableData = tableModel.getData();
			
			 var selectedIndices = oTable.getSelectedIndices(); // filtre olduğu durumlarda bu indice değerleri sadece ekranda var olan satırlara göre geliyor.
			 // bizde burda tablodan bu indice'lere göre datanın model içerisindeki asıl indexini öğrenmek için context'i alıyoruz.
			 var constantIndexes=[];
			 for (var i=0;i<selectedIndices.length;i++){
			 	var path = oTable.getContextByIndex(selectedIndices[i]).getPath();
			 	var path_index = path.split("/")[2];
			 	constantIndexes.push(path_index);
			 }
			 constantIndexes = constantIndexes.sort(function (a, b) {  return a - b;  });//sort
			 
			 // elimizde silinmesi hedeflenen bütün satırların indexi var. En büyük indexten başlayıp küçüğe doğru siliyoruz.
			for (i = constantIndexes.length -1; i >= 0; i--){
				oTable.getContextByIndex(0).getPath();
				 tableData.users.splice(constantIndexes[i],1);
			}
			tableModel.refresh();
		},
		liveChange:function(oEvent) {
			var view= this.getView();
    		var newValue = view.byId("searchField").getValue();
    		var filterType = view.byId("filterType").getSelectedItem().getText();
    		var oFilter = new Filter(filterType, FilterOperator.Contains, newValue);
    		view.byId("table1").getBinding().filter(oFilter, FilterType.Application);
		}					
	});
	
});
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
		'sap/ui/model/json/JSONModel'
], function(Controller,MessageBox,JSONModel) {
	"use strict";
	return Controller.extend("felece.challengeuserapp.controller.routes.CreatePage", {
		// Bu kısımda yeni bir user oluşturmak için veya var olan bir user'ı güncellemek için form oluşturuluyor.
		// Not: Standartta tablo içerisindeki verileri Label tagı yerine Input tagı ile görüntülesem twoWay binding olduğu için direkt olarak
		// güncellenebileceğini biliyorum ancak farklı bir şey olsun istedim bu yüzden update işini burada yaptırıyorum.
		_onObjectMatched: function (oEvent) {
			var view = this.getView();
			var i18nBundle = this.getView().getModel("i18n").getResourceBundle();
			var pickedUser;
			var button;
			var path = oEvent.getParameter("arguments").path;//update işlemi için bir parametre geliyor. Eğer update değilde yeni bir user oluşturulacak ise gönderilmiyor.
			if (path!==undefined){
				// eğer path undefined değilse tableModel içerisinden bu path'e sahip olan user bilgisi çekiliyor.
				pickedUser=view.getModel("userModel").getProperty("/users/"+path);
				view.getModel("formModel").setProperty("/pickedUser",Object.assign({},pickedUser));
				switch(pickedUser.gender) {
				  case i18nBundle.getText("genderMale"):
				    button = view.byId("maleRadioButton");
				    break;
				  case i18nBundle.getText("genderFemale"):
				    button = view.byId("femaleRadioButton");
				    break;
				}
				view.byId("genderRadio").setSelectedButton(button);
			}
			else {
				pickedUser={gender:i18nBundle.getText("genderMale"),country:"TR"};// set defaults
				var formModel = view.getModel("formModel");
				var data = formModel.getData();
				formModel.setProperty("/pickedUser",Object.assign({},pickedUser));
				formModel.setProperty("/shownCities",Object.assign({},data.countries[0].cities));
				button = view.byId("maleRadioButton"); //find the button
				view.byId("genderRadio").setSelectedButton(button);
			}
		},
		onInit: function(){
			var data = {
				"pickedUser":{},
				"countries": [
				    {"name": "TURKEY","key":"TR",
				    	cities:[
				    		{"name":"TRABZON"},{"name":"ISTANBUL"},{"name":"ANKARA"}
				    		]},
				    
				    {"name": "USA","key":"US",
				    	cities:[{"name":"NEW YORK"},{"name":"LOS ANGELES"}]
				    }
				  ],
				  shownCities:{}
			};
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("create").attachPatternMatched(this._onObjectMatched, this);
		
			// set defaults
			var i18nBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			data.pickedUser.gender=i18nBundle.getText("genderMale");
			data.pickedUser.country="TR";
			data.shownCities=Object.assign({},data.countries[0].cities);
			var oModel = new JSONModel(data);
			this.getView().setModel(oModel,"formModel");
		},
		
		navToUserTable:function(oEvent){
			var comp = this.getOwnerComponent();
			var router = comp.getRouter();
			router.navTo("users");
		},
		save:function(oEvent){
			//standartda burada bir endpoint'e post gönderiliyor ancak şu anda mock data üzerinde çalışıyoruz.
			var tableModel = this.getView().getModel("userModel");
			var formModel = this.getView().getModel("formModel");
			var newUser = Object.assign({}, formModel.getData().pickedUser);
			var userList = tableModel.getData().users;
			for (var index=0 ; index < userList.length ; index++){
				if (newUser.tck === userList[index].tck){
					MessageBox.confirm("user already exist! Do you want to update it?", {
					    initialFocus : sap.m.MessageBox.Action.OK,
					    onClose : function(sButton) {
					        if (sButton === MessageBox.Action.OK) {
					            tableModel.setProperty("/users/"+index, newUser);
					        } else if (sButton === MessageBox.Action.CANCEL) {
					            return;
					        } 
					    }
					});
					return;
				}
			}
			tableModel.setProperty("/users/"+userList.length, newUser);
			MessageBox.success("User successfully saved!");
		},
		changeCities :  function(oEvent) {
		    var select = oEvent.getSource();
		    var selectedItem = select.getSelectedItem();
		    var context = selectedItem.getBindingContext("formModel");
		    var path = context.getPath();
			var model = this.getView().getModel("formModel");
			model.setProperty("/shownCities",Object.assign({}, model.getProperty(path).cities));
		},
		radioButtonHandler:function(oEvent){
			var index = oEvent.getSource().getSelectedIndex();
			var i18nBundle = this.getView().getModel("i18n").getResourceBundle();
			switch(index) {
			  case 0:
			    this.getView().getModel("formModel").setProperty("/pickedUser/gender",i18nBundle.getText("genderMale"));
			    break;
			  case 1:
			    this.getView().getModel("formModel").setProperty("/pickedUser/gender",i18nBundle.getText("genderFemale"));
			    break;
			}
		}
	});
	
});
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel'
], function(Controller,JSONModel) {
	"use strict";
	return Controller.extend("felece.challengeuserapp.controller.Main", {
		onInit: function (oEvent) {
			var i18nBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var data = {
				users : [{
				name:"İbrahim Eyyüp",
				surname:"İNAN",
				tck:44444444444,
				phone:"5062624264",
				address:"Gazipaşa Mah. Nemlioğlu Konak Sok. No:14 daire:6",
				email:"eyupinan0@gmail.com",
				country:"TR",
				city:"TRABZON",
				gender:i18nBundle.getText("genderMale"),
				birthDate:"1997-05-10"
				
			}]
			};
			var oModel = new JSONModel(data);
			this.getView().setModel(oModel,"userModel");
			
		}
	});
	
});
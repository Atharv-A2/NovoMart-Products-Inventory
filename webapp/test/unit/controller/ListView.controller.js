/*global QUnit*/

sap.ui.define([
	"piomtestportal/controller/ListView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ListView Controller");

	QUnit.test("I should test the ListView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});

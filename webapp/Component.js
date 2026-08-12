sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/f/library",
	"sap/f/FlexibleColumnLayoutSemanticHelper"
], function (UIComponent, JSONModel, library, FlexibleColumnLayoutSemanticHelper) {
	"use strict";

	var LayoutType = library.LayoutType;

	var Component = UIComponent.extend("piomtestportal.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);

			var oModel = this.getModel();

			var sSavedProducts = localStorage.getItem("products");

			oModel.attachRequestCompleted(function () {

				if (sSavedProducts) {

					try {

						var aProducts = JSON.parse(sSavedProducts);

						oModel.setProperty("/products", aProducts);

					} catch (error) {

						console.error(
							"Failed to parse products from localStorage",
							error
						);
					}

				} else {

					oModel.attachRequestCompleted(function () {

						var aProducts = oModel.getProperty("/products");

						if (aProducts) {

							localStorage.setItem(
								"products",
								JSON.stringify(aProducts)
							);
						}

					});
				}
			}, this);

			this.oRouter = this.getRouter();
			this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
			this.oRouter.initialize();
		},

		onBeforeRouteMatched: function(oEvent) {

			var oModel = this.getModel();

			var sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
			if (!sLayout) {
				sLayout = LayoutType.OneColumn;
			}

			// Update the layout of the FlexibleColumnLayout
			oModel.setProperty("/layout", sLayout);
		},

		/**
		 * Returns an instance of the semantic helper
		 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
		 */
		getHelper: function () {
			var oFCL = this.getRootControl().byId("fcl"),
				oParams = new URLSearchParams(window.location.search),
				oSettings = {
					defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: LayoutType.ThreeColumnsMidExpanded,
					maxColumnsCount: oParams.get("max")
				};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		}
	});
	return Component;
});

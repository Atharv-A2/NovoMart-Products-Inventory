sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "../model/formatter"
], function (JSONModel, Controller, Fragment, MessageToast, formatter) {
	"use strict";

	return Controller.extend("piomtestportal.controller.Detail", {

		formatter: formatter,

		onInit: function () {
			var oExitButton = this.getView().byId("exitFullScreenBtn"),
				oEnterButton = this.getView().byId("enterFullScreenBtn");

			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();

			this.oRouter.getRoute("RouteDetailView").attachPatternMatched(this._onProductMatched, this);

			[oExitButton, oEnterButton].forEach(function (oButton) {
				oButton.addEventDelegate({
					onAfterRendering: function () {
						if (this.bFocusFullScreenButton) {
							this.bFocusFullScreenButton = false;
							oButton.focus();
						}
					}.bind(this)
				});
			}, this);
		},

		handleFullScreen: function () {
			this.bFocusFullScreenButton = true;
			this.oRouter.navTo("RouteDetailView", {layout: "MidColumnFullScreen", product: this._product});
		},
		handleExitFullScreen: function () {
			this.bFocusFullScreenButton = true;
			this.oRouter.navTo("RouteDetailView", {layout: "TwoColumnsMidExpanded", product: this._product});
		},
		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("RouteListView", {layout: sNextLayout});
		},
		_onProductMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");

			this._product = oArgs.product || this._product || "0";

			this.getOwnerComponent()
				.getModel()
				.setProperty("/layout", oArgs.layout);
				
			this.getView().bindElement({
				path: "/products/" + this._product
			});
		},

		onEdit: function () {
			var sCurrentPath = this.getView().getBindingContext().getPath();
			
			var oCurrentProductData = jQuery.extend(true, {}, this.getView().getModel().getProperty(sCurrentPath));

			var oNewProductModel = new sap.ui.model.json.JSONModel(oCurrentProductData);

			if (!this._oAddDialog) {
				this._oAddDialog = sap.ui.core.Fragment.load({
					id: this.getView().getId(),
					name: "piomtestportal.fragment.AddProduct",
					controller: this
				}).then(function (oDialog) {
					this.getView().addDependent(oDialog);
					oDialog.setModel(oNewProductModel, "newProduct");
					return oDialog;
				}.bind(this));
			}

			this._oAddDialog.then(function (oDialog) {
				oDialog.getModel("newProduct").setData(oCurrentProductData);
				oDialog.open();
			});

        },

        onCancelProduct: function () {
            this.byId("addProductDialog").close();
        },

        onSaveProduct: function () {
            var oDialog = this.byId("addProductDialog");
            var oNewProduct = oDialog.getModel("newProduct").getData();

            if (!oNewProduct.productId || !oNewProduct.name) {
                sap.m.MessageToast.show("Please fill mandatory fields.");
                return;
            }

            var oMainModel = this.getView().getModel();
            var aProducts = oMainModel.getProperty("/products");

            var oUpdatedProduct = {
                productId: oNewProduct.productId,
                name: oNewProduct.name,
                category: oNewProduct.category,
                sku: oNewProduct.sku,
                price: Number(oNewProduct.price || 0),
                currency: oNewProduct.currency,
                stock: Number(oNewProduct.stock || 0),
                reorderThreshold: Number(oNewProduct.reorderThreshold || 0),
                supplier: oNewProduct.supplier,
                warehouse: oNewProduct.warehouse,
                description: oNewProduct.description,
                imageUrl: oNewProduct.imageUrl,
                lastUpdated: new Date().toLocaleDateString()
            };

            var iExistingIndex = aProducts.findIndex(function (p) {
                return p.productId === oUpdatedProduct.productId;
            });

            if (iExistingIndex > -1) {
                aProducts[iExistingIndex] = oUpdatedProduct;
            } else {
                aProducts.push(oUpdatedProduct);
            }

            localStorage.setItem("products", JSON.stringify(aProducts));
            oMainModel.setProperty("/products", aProducts);
            oMainModel.refresh(true);

            oDialog.close();
            sap.m.MessageToast.show("Product saved successfully.");
        },

		onReorderProduct: function () {

			var oProduct = this.getView()
				.getBindingContext()
				.getObject();

			if (!this._oReorderDialog) {

				Fragment.load({
					id: this.getView().getId(),
					name: "piomtestportal.fragment.Reorder",
					controller: this
				}).then(function(oDialog){

					this._oReorderDialog = oDialog;

					this.getView().addDependent(oDialog);

					var oReorderModel = new JSONModel({
						name: oProduct.name,
						stock: oProduct.stock
					});

					oDialog.setModel(oReorderModel, "reorder");

					oDialog.open();

				}.bind(this));

			} else {

				this._oReorderDialog
					.getModel("reorder")
					.setData({
						name: oProduct.name,
						stock: oProduct.stock
					});

				this._oReorderDialog.open();
			}

		},

		onSaveReorder: function () {

			var iQuantity = Number(
				this.byId("reorderInput").getValue()
			);


			if (!iQuantity || iQuantity <= 0) {

				MessageToast.show(
					"Enter a valid quantity"
				);

				return;
			}


			var oContext = this.getView().getBindingContext();

			var iCurrentStock = oContext.getProperty("stock");


			oContext.getModel().setProperty(
				oContext.getPath() + "/stock",
				iCurrentStock + iQuantity
			);


			oContext.getModel().refresh(true);


			this.byId("reorderDialog").close();


			MessageToast.show(
				"Stock updated successfully"
			);

		},
		onCancelReorder: function () {

			this.byId("reorderDialog").close();

		}

	});
});

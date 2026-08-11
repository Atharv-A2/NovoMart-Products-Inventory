sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	'sap/ui/model/Sorter',
	'sap/m/MessageToast',
	'../model/formatter'
], function (JSONModel, Controller, Fragment, Filter, FilterOperator, FilterType, Sorter, MessageToast, formatter) {
	"use strict";

	return Controller.extend("piomtestportal.controller.ListView", {

		formatter: formatter,

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this._bDescendingSort = false;
			this._oSearchFilter = null;
			this._oCategoryFilter = null;

			// ViewSettings filters
			this._oStockFilter = null;
			this._oPriceFilter = null;

			// Current sort/group
			this._sSortPath = "name";
			this._bSortDescending = false;

			this._sGroupPath = null;
		},

		onListItemPress: function (oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				productPath = oEvent.getSource().getSelectedItem().getBindingContext().getPath(),
				product = productPath.split("/").slice(-1).pop();

			this.oRouter.navTo("RouteDetailView", {layout: oNextUIState.layout, product: product});
		},

		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("query") || "";
			sQuery = sQuery.trim();

			if (sQuery) {

				// Search BOTH name and category
				var oNameFilter = new Filter(
					"name",
					FilterOperator.Contains,
					sQuery
				);

				var oCategoryFilter = new Filter(
					"category",
					FilterOperator.Contains,
					sQuery
				);

				// OR between name and category
				this._oSearchFilter = new Filter({
					filters: [
						oNameFilter,
						oCategoryFilter
					],
					and: false
				});

			} else {
				this._oSearchFilter = null;
			}

			this._applyCombinedFilters();
		},

		onFilter: function (oEvent) {
			// Evaluates select items or comboboxes accurately
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var sSelectedCategory = oSelectedItem ? oSelectedItem.getKey() : oEvent.getParameter("newValue");
			
			if (sSelectedCategory && sSelectedCategory.length > 0 && sSelectedCategory !== "All") { 
				this._oCategoryFilter = new Filter("category", FilterOperator.EQ, sSelectedCategory);
			} else {
				this._oCategoryFilter = null;
			}

			this._applyCombinedFilters();
		},

		onOpenViewSettings: function () {

			if (!this._oViewSettingsDialog) {

				this._oViewSettingsDialog = Fragment.load({
					id: this.getView().getId(),
					name: "piomtestportal.fragment.ViewSettings",
					controller: this
				}).then(function (oDialog) {

					this.getView().addDependent(oDialog);

					return oDialog;

				}.bind(this));
			}

			this._oViewSettingsDialog.then(function (oDialog) {
				oDialog.open();
			});
		},

		onViewSettingsConfirm: function (oEvent) {

			var oSortItem = oEvent.getParameter("sortItem");
			var bSortDescending = oEvent.getParameter("sortDescending");

			var aFilterItems = oEvent.getParameter("filterItems") || [];

			if (oSortItem) {

				var sSortKey = oSortItem.getKey();

				this._sSortPath = sSortKey;
				this._bSortDescending = bSortDescending;

				this._applySorting();
			}


			this._oStockFilter = null;
			this._oPriceFilter = null;

			aFilterItems.forEach(function (oFilterItem) {

				var sKey = oFilterItem.getKey();

	
				switch (sKey) {

					case "stockIn":
						this._oStockFilter = new Filter({
							test: function (oProduct) {

								var iStock = Number(oProduct.stock);
								var iThreshold = Number(
									oProduct.reorderThreshold
								);

								return (
									iStock > iThreshold
								);
							}
						});
						break;

					case "stockLow":
						this._oStockFilter = new Filter({
							test: function (oProduct) {

								var iStock = Number(oProduct.stock);
								var iThreshold = Number(
									oProduct.reorderThreshold
								);

								return (
									iStock > 0 &&
									iStock <= iThreshold
								);
							}
						});
						break;

					case "stockOut":
						this._oStockFilter = new Filter({
							path: "stock",
							test: function (iStock) {
								return Number(iStock) === 0;
							}
						});
						break;
				}

				switch (sKey) {

					case "price0to100":
						this._oPriceFilter = new Filter({
							path: "price",
							test: function (iPrice) {
								iPrice = Number(iPrice);

								return iPrice >= 0 && iPrice < 100;
							}
						});
						break;

					case "price100to300":
						this._oPriceFilter = new Filter({
							path: "price",
							test: function (iPrice) {
								iPrice = Number(iPrice);

								return iPrice >= 100 && iPrice < 300;
							}
						});
						break;

					case "price300plus":
						this._oPriceFilter = new Filter({
							path: "price",
							test: function (iPrice) {
								return Number(iPrice) >= 300;
							}
						});
						break;
				}

			}.bind(this));

			this._applyCombinedFilters();
		},

		_applySorting: function () {

			var oTable = this.byId("productsTable");

			if (!oTable) {
				return;
			}

			var oBinding = oTable.getBinding("items");

			if (!oBinding) {
				return;
			}

			var oSorter = new Sorter(
				this._sSortPath,
				this._bSortDescending
			);

			oBinding.sort(oSorter);
		},

		_applyCombinedFilters: function () {

			var aCombinedFilters = [];

			if (this._oSearchFilter) {
				aCombinedFilters.push(this._oSearchFilter);
			}

			if (this._oCategoryFilter) {
				aCombinedFilters.push(this._oCategoryFilter);
			}

			if (this._oStockFilter) {
				aCombinedFilters.push(this._oStockFilter);
			}

			if (this._oPriceFilter) {
				aCombinedFilters.push(this._oPriceFilter);
			}

			var oTable = this.byId("productsTable");

			if (!oTable) {
				return;
			}

			var oBinding = oTable.getBinding("items");

			if (!oBinding) {
				return;
			}

			if (aCombinedFilters.length > 0) {

				var oFinalFilter = new Filter({
					filters: aCombinedFilters,
					and: true
				});

				oBinding.filter(
					[oFinalFilter],
					FilterType.Application
				);

			} else {

				oBinding.filter(
					[],
					FilterType.Application
				);
			}
		},

		onAdd: function () {

			if (!this._oAddDialog) {

                this._oAddDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "piomtestportal.fragment.AddProduct",
                    controller: this
                }).then(function (oDialog) {

                    this.getView().addDependent(oDialog);

					
                    return oDialog;
					
                }.bind(this));
            }
			
            this._oAddDialog.then(function (oDialog) {
				
				var oNewProductModel = new JSONModel({
					productId: "",
					name: "",
					category: "",
					sku: "",
					price: 0,
					currency: "USD",
					stock: 0,
					reorderThreshold: 0,
					supplier: "",
					warehouse: "",
					description: "",
					imageUrl: "",
					lastUpdated: ""
				});

				oDialog.setModel(oNewProductModel,"newProduct");

                oDialog.open();

            });

        },

        onCancelProduct: function () {
            this.byId("addProductDialog").close();
        },

        onSaveProduct: function () {

            var oNewProduct =
                this.byId("addProductDialog")
                    .getModel("newProduct")
                    .getData();

            if (!oNewProduct.productId || !oNewProduct.name) {
                MessageToast.show("Please fill mandatory fields.");
                return;
            }

            var oMainModel = this.getView().getModel();

            var aProducts = oMainModel.getProperty("/products");

            aProducts.push({
                productId: oNewProduct.productId,
                name: oNewProduct.name,
				category: oNewProduct.category,
				sku: oNewProduct.sku,
                price: Number(oNewProduct.price),
                currency: oNewProduct.currency,
                stock: Number(oNewProduct.stock),
                reorderThreshold: Number(oNewProduct.reorderThreshold),
				supplier: oNewProduct.supplier,
				warehouse: oNewProduct.warehouse,
				description: oNewProduct.description,
				imageUrl: oNewProduct.imageUrl,
				lastUpdated: oNewProduct.lastUpdated
            });

			localStorage.setItem(
				"products",
				JSON.stringify(aProducts)
			);

			oMainModel.setProperty("/products", aProducts);

            oMainModel.refresh(true);

            this.byId("addProductDialog").close();

            MessageToast.show("Product added successfully.");

        },

	});
});

sap.ui.define([], function () {
    "use strict";

    return {

        getStockStatus: function (iStock, iThreshold, oResourceBundle) {
            
            if (iStock > iThreshold) {
                return "Available";
            } else if (iStock > 0) {
                return "Low Stock";
            }

            return "Out of Stock";
        },

        getStockState: function (iStock, iThreshold) {
            if (iStock > iThreshold) {
                return "Success";
            } else if (iStock > 0) {
                return "Warning";
            }

            return "Error";
        },

        getCurrency: function (iPrice, sCurrency) {
            if (sCurrency === "USD") {
                return "$ " + iPrice;
            } else if (sCurrency === "INR") {
                return "₹ " + iPrice;
            } else if (sCurrency === "YEN") {
                return "¥ " + iPrice;
            } else if (sCurrency === "EUR") {
                return "€ " + iPrice;
            } else {
                return sCurrency + " " + iPrice;
            }
        },

        getLastUpdatedTime: function (sLastUpdatedTime) {
            const date = new Date(sLastUpdatedTime);

            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const pad = (num) => String(num).padStart(2, "0");

            return `Last Updated - ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
        }

    };
});
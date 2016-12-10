(function ($, location) {

    /* Delete item AJAX handler */
    var deleteForm = $("#deleteForm");
    var itemId = $("#itemId");

    deleteForm.submit(function (event) {
        event.preventDefault();

        var item = itemId.val();

        if (item) {

            if (confirm("Are you sure you want to delete this item?")) {
                var requestConfig = {
                    method: "DELETE",
                    url: "/items/" + item,
                    xhrFields: {
                        withCredentials: true
                    }
                };

                $.ajax(requestConfig).then(function (responseMessage) {
                    location.href = responseMessage.redirect;
                }, function (responseMessage) {
                    alert("Delete Unsuccessful");
                });
            }
        }

    })

    /* Delete account AJAX handler */
    var deleteAccountForm = $("#deleteAccount");
    var userId = $("#userId");

    deleteAccountForm.submit(function (event) {
        event.preventDefault();

        var uid = userId.val();
        if (uid) {

            if (confirm("Are you sure you want to delete your account and associated items?")) {
                var requestConfig = {
                    method: "DELETE",
                    url: "/account/" + uid,
                    xhrFields: {
                        withCredentials: true
                    }
                };

                $.ajax(requestConfig).then(function (responseMessage) {
                    location.href = responseMessage.redirect;
                }, function (responseMessage) {
                    alert("Delete Unsuccessful");
                });
            }
        }

    })

    /* Add rental AJAX handler */
    var rentalForm = $("#rentalForm");
    var startDate = $("#startDate");
    var endDate = $("#endDate");
    var rentalUserId = $("#rentalUserId");
    var rentalItemId = $("#rentalItemId");

    var errorContainer = $("#error-container");
    var resultContainer = $("#result-container");

    rentalForm.submit(function (event) {
        event.preventDefault();

        errorContainer.addClass("hidden");
        resultContainer.addClass("hidden");

        var startDateVal = startDate.val();
        var endDateVal = endDate.val();
        var rentalUserIdVal = rentalUserId.val();
        var rentalItemIdVal = rentalItemId.val();

        var requestConfig = {
            method: "POST",
            url: "/items/" + rentalItemIdVal + "/rent",
            contentType: 'application/json',
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({
                startDate: startDateVal,
                endDate: endDateVal,
                userId: rentalUserIdVal
            })
        }
        $.ajax(requestConfig).then(function (responseMessage) {
            resultContainer.removeClass("hidden");
            resultContainer.html(responseMessage);
        }, function (responseMessage) {
            errorContainer.removeClass("hidden");
            errorContainer.html(responseMessage.responseText);
        });
    })
})(window.jQuery, window.location);
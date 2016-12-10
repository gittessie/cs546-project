(function($, location) {

    var deleteForm = $("#deleteForm");
    var itemId = $("#itemId");

    deleteForm.submit(function(event) {
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

                $.ajax(requestConfig).then(function(responseMessage) {
                    location.href = responseMessage.redirect;
                }, function(responseMessage) {
                    alert("Delete Unsuccessful");
                });
            }
        }

    })

    var deleteAccountForm = $("#deleteAccount");
    var userId = $("#userId");

    deleteAccountForm.submit(function(event) {
        event.preventDefault();

        var  uid = userId.val();
        console.log(userId);
        if (uid) {

            if (confirm("Are you sure you want to delete your account and associated items?")) {
                var requestConfig = {
                    method: "DELETE",
                    url: "/account/" + uid,
                    xhrFields: {
                        withCredentials: true
                    }
                };

                $.ajax(requestConfig).then(function(responseMessage) {
                    location.href = responseMessage.redirect;
                }, function(responseMessage) {
                    alert("Delete Unsuccessful");
                });
            }
        }

    })
})(window.jQuery, window.location);
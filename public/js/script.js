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
})(window.jQuery, window.location);
var index = 0;

$(function() {
    $("#setup, #voting, #votes-container, #agreement-container").hide();
    refreshTips();

    $("#getTip").click(
        function() {
            $("#setup, #voting, #votes-container, #agreement-container").show();

            $.get("/tips",function(data){
                $("#setup").html(data.setup);

                index = data._id;

                if (data.votes === undefined) {
                    $("#votes").html(0);
                } else {
                    $("#votes").html(data.votes);
                }

                changeVoteColor(data.votes);
				
				if (data.agreement === undefined) {
					$("#agreement").html(0);
				} else {
					$("#agreement").html(data.agreement);
				}

				changeAgreementColor(data.agreement);
				
            },"json")
        }
    );

    $("#upvote").on("click", function() {
        $.ajax({
            url: '/upvote',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ id: index }),

            success: function(data, status, xhr) {
                $("#votes").html(data.votes);

                changeVoteColor(data.votes);
            }
        });
    });

    $("#downvote").on("click", function() {
        $.ajax({
            url: '/downvote',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ id: index }),

            success: function(data, status, xhr) {
                $("#votes").html(data.votes);

                changeVoteColor(data.votes);
            }
        });
    });

    $("#createTip").submit(function(event) {
        event.preventDefault();

        var setup = $('#createTipSetup').val();

        $.ajax({
            url: '/createTip',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    "setup": setup,
                    "votes": 0
                }
            ),
            success: function(data, status, xhr) {
                $('#createTipSetup').val("");
                $('#createTipSuccess').text("Tip created successfully. {setup: " + setup + "}");
                refreshTips();
            }
        });
    });

    $("#refreshTips").on('click', function() {
        refreshTips();
    });

    $("#deleteTip").on('click', function() {
       $.ajax({
           url: 'deleteTip',
           type: 'DELETE',
           contentType: 'application/json',
           data: JSON.stringify(
               {
                    id: $('#allTips').val()
               }
           ),
            success: function(data, status, xhr) {
                $('#deleteTipSuccess').text("Tip deleted successfully. {setup: " + $('#allTips option:selected').text() + "}");
                refreshJokes();
            }
       })
    });

    function changeVoteColor(numVotes) {
        if (numVotes < 0) {
            $("#votes").css('color', 'red');
        } else if (numVotes > 0) {
            $("#votes").css('color', 'lightgreen');
        } else {
            $("#votes").css('color', 'white');
        }
    }
	
	    function changeAgreementColor(numAgreement) {
        if (numAgreement < 0) {
            $("#Agreement").css('color', 'red');
        } else if (numAgreement > 0) {
            $("#Agreement").css('color', 'lightgreen');
        } else {
            $("#Agreement").css('color', 'white');
        }
    }

    function refreshTips() {
        $.get("/allTips", function(data) {
            var optionsHTML = "";
            $('#allTips').empty();
            data.forEach(function(element, index, array) {
                $('#allTips')
                    .append($("<option></option>")
                    .attr("value",element._id)
                    .text(element.setup + " "));
            });
        });
    }
});

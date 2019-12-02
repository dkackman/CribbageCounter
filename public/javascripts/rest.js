function getScore()
{
    $("#score").html("");
    
    var url =  "api/score?hand=" + $("#handInputText").val();
    url += "&isCrib=" + $("#isCribCheckBox").is(':checked');

    $("#restArgs").text(document.baseURI + url);
    $.ajax({
        url: "/" + url,
        type: "GET",
        success: function(data) {
            $("#score").text(data);            
        },
        error: function(data) {
            console.log(data.status);
            if (data.status == "400") {
                $("#score").text(data.responseText);
            }
            else {
                $("#score").text(data.statusText);
            }
        }
    });
}

function explainScore()
{
    $("#score").html("");
    
    var url =  "api/explain?hand=" + $("#handInputText").val();
    url += "&isCrib=" + $("#isCribCheckBox").is(':checked');

    $("#restArgs").text(document.baseURI + url);
    $.ajax({
        url: "/" + url,
        type: "GET",
        success: function(data) {
            $("#score").append("<p>" + data.score + "</p>");
            data.points.forEach(function(item) {
                var div = $("<div></div>");
                var name = $("<span>" + item.name + " (</span>");
                var cards = $("<span></span>");
                item.cards.forEach(function(card) {
                    cards.append("<span> " + card + " </span>");
                })
                var points = $("<span>) for " + item.points + "</span>");    
                div.append(name, cards, points);
                $("#score").append(div);
            });
        },
        error: function(data) {
            console.log(data.status);
            if (data.status == "400") {
                $("#score").text(data.responseText);
            }
            else {
                $("#score").text(data.statusText);
            }
        }
    });
}
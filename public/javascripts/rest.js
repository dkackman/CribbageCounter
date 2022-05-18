function getScore() {
    $("#score").html("");

    let url = "api/score?hand=" + $("#handInputText").val();
    url += "&isCrib=" + $("#isCribCheckBox").is(':checked');

    $("#restArgs").text(document.baseURI + url);
    $("#restArgs").attr("href", document.baseURI + url);
    $.ajax({
        url: "/" + url,
        type: "GET",
        success: function (data) {
            $("#score").text(data);
        },
        error: function (data) {
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

function explainScore() {
    $("#score").html("");

    let url = "api/explain?hand=" + $("#handInputText").val();
    url += "&isCrib=" + $("#isCribCheckBox").is(':checked');

    $("#restArgs").text(document.baseURI + url);
    $("#restArgs").attr("href", document.baseURI + url);
    $.ajax({
        url: "/" + url,
        type: "GET",
        success: function (data) {
            $("#score").append("<p>" + data.score + "</p>");
            data.points.forEach(function (item) {
                const div = $("<div></div>");
                const name = $("<span>" + item.name + " (</span>");
                const cards = $("<span></span>");
                item.cards.forEach(function (card) {
                    cards.append("<span> " + card + " </span>");
                })
                const points = $("<span>) for " + item.points + "</span>");
                div.append(name, cards, points);
                $("#score").append(div);
            });
        },
        error: function (data) {
            console.log(data.status);
            if (data.status == "500") {
                $("#score").text(data.responseText);
            }
            else {
                $("#score").text(data.statusText);
            }
        }
    });
}
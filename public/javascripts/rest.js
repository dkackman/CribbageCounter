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
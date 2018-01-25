$(document).ready(function() {

    // This function grabs scores from the database and updates the view
    function getScores(category) {
      var categoryString = category || "";
      if (categoryString) {
        categoryString = "/category/" + categoryString;
      }
      $.get("/api/scores" + categoryString, function(data) {
        $(".scores").append(JSON.stringify(data, null, 2));
      });
    }

    getScores();

});
  
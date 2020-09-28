function changedRadio (){ 
  $.post('/catalogue/', {
    category: $('input[name="categoryRadio"]:checked').val(), 
    sort: $('input[name="sortRadio"]:checked').val()
  }, function(result){
    $(".display-items").html(result);
  });
}

$(function(){
  $("#noFilterRadio").prop("checked", true);
  $("#nameRadio").prop("checked", true);

  $(".categoryRadio").on("change", changedRadio);
  $(".sortRadio").on("change", changedRadio);
});
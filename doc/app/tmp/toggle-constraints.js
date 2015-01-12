$(function() {
	$(".snap-drawer-left").on("click", "a#toggle-constraints", function() {
		$("#facets").toggle();
		$("#btn-back").toggle();
		$("#constraints").toggle();
		
		if($("a#toggle-constraints").html().charAt(0) == 'C'){
			$("a#toggle-constraints").html('Facets <span class="glyphicon glyphicon-th-large"></span>');
		}
		else{
			$("a#toggle-constraints").html('Constraints <span class="glyphicon glyphicon-align-justify"></span>');
		}
    });
});
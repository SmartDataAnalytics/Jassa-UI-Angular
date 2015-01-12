$(function() {
	var scope = angular.element($('html')).scope();
	
	$('#search').keydown(function(event) {
        if (event.keyCode == 13) {
            applyFilter($("#search").val());
        }
    });
	
	$('#clear').on('click', function() {
        applyFilter('');
		$('#search').css("display", 'block');
		$('#search').val('');
		$('#search').attr('placeholder', 'Filter');
		$('#clear').css("display", 'none');
    });
	
	$('#search').on('click', function(){
		$('#search').attr('placeholder', 'Select from list or type, then press Enter to filter');
		$('#search-box #results').css('display','block');
		$('#search-box #results').html('');
		
		$.each(screenItems, function(key, feature){
			if(feature.shortLabel) // skip features without labels
				$('#search-box #results').append('<li><a href="#">' + feature.shortLabel.displayLabel + '</a></li>');
		});

	});
	
    $('#filter').on('click', function(){
		applyFilter($("#search").val());
	});
	
	$("#results").on("click", "li a", function() {
		applyFilter(this.text);
	});
	
	function applyFilter(text){
		scope.filterClicked(text);
		if(!scope.$root.$$phase) {
		 // scope.$apply() clears the featureLayer and prevents fitting the map bounds to feature cluster
			scope.$apply();
		}
		//map.fitBounds(group.getBounds());
		$('#search').blur();
		$('#search-box').height("inherit");
		$('#search-box #results').html('');
		$('#search-box #results').css('display','none');
		
		$('#clear-text').html("Clear filter: " + text);

		// have to sleep for a short while before calling fitBounds(),
		// since the items watcher calls clearItems(), rendering featureLayer empty
		setTimeout(function(){
			map.fitBounds(featureLayer.getBounds());
			$(".ui-element").css("opacity","0.5");
		}, 2000);
	}
});
$(function(){
	var compass = $('#compass');
	if(window.DeviceOrientationEvent) {

	  window.addEventListener('deviceorientation', function(event) {
			var alpha;
			
			//Check for iOS property
			if(event.webkitCompassHeading) {
			  alpha = event.webkitCompassHeading;
			}
			//non iOS
			else {
			  alpha = event.alpha;
			  webkitAlpha = alpha;  
			}
			
			//Rotation appears to be reversed for both Android & iOS, so we go negative
			compass[0].style.Transform = 'rotate(-' + alpha + 'deg)';
			compass[0].style.WebkitTransform = 'rotate(-'+ webkitAlpha + 'deg)';
			//Rotation is reversed for FF
			//compass[0].style.MozTransform = 'rotate(-' + alpha + 'deg)'; 
		  }, false);
	}
});
define(['jquery'], function($){

	return {
		hasTouchSupport: function(){
			var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
			return supportsTouch;
		},
		getTransitionDuration: function($element, withDelay){
			var el       = $element;
			var prefixes = 'moz webkit ms o khtml'.split( ' ' );
			var result   = 0;
			for (var i = 0; i < prefixes.length; i++){
				var duration = el.css( '-' + prefixes[i] + '-transition-duration');
				if (duration){
					duration = (duration.indexOf( 'ms' ) >- 1) ? parseFloat(duration) : parseFloat(duration) * 1000;
					if (withDelay){
						var delay = el.css('-' + prefixes[i] + '-transition-delay');
                        if (delay) {
                            duration += ( delay.indexOf( 'ms' ) >- 1 ) ? parseFloat(delay) : parseFloat(delay) * 1000;
                        }
					}
					result = duration;
					break;
				}
			}
			return result;
		}
	};

})
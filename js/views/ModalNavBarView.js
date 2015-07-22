define([
	'jquery',
	'AppView',
	'views/ui/NavBarView'
	], function(
		$,
		AppView,
		NavBarView
		) {

		var ModalNavBarView = NavBarView.extend({
			collapsed: true,
			modal: null,
			rightButtons: [{
				iconClass:'icon-x-white',
				action: function(){
					if(this.modal){
						this.modal.remove();
					}else{
						AppView.getInstance().router.navigate('dashboard', {trigger: true});
					}
				}
			}],
			setSelected: function(){
				this.$('.icon').addClass('selected');
			}
		});

		return ModalNavBarView;
	}
);
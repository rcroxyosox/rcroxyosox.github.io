define([
        'underscore',
        'jquery',
        'backbone',
        'handlebars',
        'Utils',
        'text!/html/ui/MintModalView.html',
        'css!/css/ui/MintModalView.css'
    ],
    function(
        _,
        $,
        Backbone,
        Handlebars,
        mintUtils,
        html
    ) {

        var hasBlur = (document.body.style.webkitFilter !== undefined || document.body.style.filter !== undefined);
        var modals = [];
        var MintModalView = Backbone.View.extend({

            tagName:"div",
            className:"mint-modal-wrap mint-modal-view",
            attributes:{
                role:"dialog"
            },
            _history:[],
            _timeouts: [],
            template: Handlebars.compile(html),
            extraClass: "",
            isFullScreenModal: false,
            contentHTML: null, // String: Use in place of contentView
            contentView: null, // Backbone.View (INSTANCE): Use in place of contentHTML
            ModalFooterView: null, // Bacbone.View (CLASS): Add a MintModalFooterView
            esc: true, // Bool: use the esacape key to kill the modal
            x: true, // Bool: show an x in the top right corner to close the modal
            width: null, // for simple width setting without needing to add a custom css class
            modalBgClose: true, // Bool: click on the background of the modal to close. Note that this can be set on a per-subview level as well (this.contentView.modalBgClose).
            bg: $('body'),

            // modalOptions.onSwitchContentView - Add this to the contentView as a callback for when the transition completes
            onBeforeClose: function(){},
            onClose: function(){},
            onOpen: function(){},

            events: {
                "click":"removeByBgClick"
            },

            initialize: function(options){
                var that = this;
                modals.push(this);
                _.extend(this, options);
                this._history = [];

                // init a listener on the document
                $(document).off("keydown.removeMintModal").on("keydown.removeMintModal", function(event){
                    (that.esc && event.keyCode == 27) && (that.remove())
                });

                // Allow for generic calling of methods via the $el
                this.$el.on('MintModalView:remove', function(){
                    that.remove();
                });

                this.bg = typeof(this.bg) == "function"?this.bg():this.bg;

                this.bg.addClass('mint-modal-bg');
                this.isFullScreenModal && this.bg.addClass('blur');
            },

            removeByBgClick: function(event){
                var $o = $(event.target);

                if($o.closest('.mint-modal-x').length){
                    this.remove();
                    return;
                }

                if(!$o.is(this.$el)){
                    return;
                }

                if(!this.modalBgClose || (this.contentView && typeof this.contentView.modalOptions.modalBgClose != "undefined" && this.contentView.modalOptions.modalBgClose === false)){
                    return;
                }

                this.remove();
            },

            remove: function(){
                var that = this;
                if (this.removed) return $.when(this);

                return $.Deferred(function(dfd) {
                    that.removed = true;
                    that.$('.mint-modal-x').removeClass('in');
                    that.$el.removeClass('in');
                    var delay = mintUtils.getTransitionDuration(that.$modal.addClass('animate'));
                    that.onBeforeClose();
                    that.currentNav && that.currentNav.$el.addClass('hide');
                    setTimeout(function(){
                        that.contentView && that.contentView.remove();
                        that.bg.removeClass('mint-modal-bg blur');
                        that.onClose();
                        that.contentView && that.contentView.remove();
                        that.footerView && that.footerView.remove();
                        that.undelegateEvents();
                        that.$el.remove();
                        that.$el.detach();
                        Backbone.View.prototype.remove.call(that);
                        dfd.resolve();
                    }, delay);

                    if(that._timeouts.length > 0){
                        $.each(that._timeouts, function(){
                            clearTimeout(this);
                        });
                    }

                    $(document).off("keydown.removeMintModal");
                    $("body").removeClass("mint-modal-freeze");

                }).promise();
            },

            setContentHTML: function(){
                typeof(this.contentHTML) == "function" && (this.contentHTML = this.contentHTML());
                this.$modalpage.append(this.contentHTML);
                this.setFooterView();
                this.setAccessible();
                // this.setModalWidth(this.width);
            },

            toggleX: function(){

                var shouldShowX = this.x;

                if(this.contentView){

                    if(!this.contentView.modalOptions){
                        this.contentView.modalOptions = {};
                    }

                    if(typeof(this.contentView.modalOptions.x) == "function"){
                        this.contentView.modalOptions.x = this.contentView.modalOptions.x();
                    }
                    shouldShowX = (typeof(this.contentView.modalOptions.x) !== "undefined")?this.contentView.modalOptions.x:this.x;
                }

                if(this.contentView.Nav){
                    shouldShowX = false;
                }

                this.$('.mint-modal-x').toggleClass('in', shouldShowX);
            },

            setModalWidth: function(w){
                this.$modal.addClass('animate');
            },

            setAccessible: function(){
                var ariaLabel = (this.contentView)?'heading-'+this.contentView.cid:this.cid;
                this.$el.attr('aria-labelledby', ariaLabel);
                var h1 = this.$('h1:first');
                h1.length && h1.attr('id', ariaLabel).focus();
            },

            setContentView: function(options){
                var that = this;
                var settings = $.extend({view:null},options);
                this.previousView = this.contentView;
                this.contentView = settings.view;
                !this.contentView.modalOptions && (this.contentView.modalOptions = {});
                typeof(this.contentView.modalOptions) == "function" && (this.contentView.modalOptions = this.contentView.modalOptions());
                this.$modalcont.find('.mint-modal-view').remove();
                settings.view.modal = this;
                this.$modalpage = $("<div></div>")
                    .addClass("mint-modal-view")
                    .append(this.contentView.render().$el)
                    .appendTo(this.$modalcont);

                if(this.contentView.Nav){
                    this.currentNav = new this.contentView.Nav({
                        modal: this
                    });
                    this.currentNav.$el.addClass('hide');
                    this.contentView.$el.addClass((this.currentNav.collapsed)?'withNavBarViewCollapsed':'withNavBarView');
                    this.$modalpage.prepend(this.currentNav.render().$el);
                    setTimeout(function(){
                        that.currentNav.$el.removeClass('hide');
                    },100);
                }

                this.contentView.delegateEvents();
                this.setFooterView((options.view.modalOptions && options.view.modalOptions.ModalFooterView)?options.view.modalOptions.ModalFooterView:null);
                this.setModalWidth(this.contentView.modalOptions.width || this.width);
                this.setAccessible();
                this._history.push(settings.view);
                this.toggleX();
            },

            hideOpenFooterView: function(){
                this.footerView && this.footerView.$el.addClass('out');
            },
			setHeaderView: function(ModalHeaderView) {
				if (ModalHeaderView) {
					this.headerView && this.headerView.remove();
					this.headerView = new ModalHeaderView({modal: this});
					this.$modal.prepend(this.headerView.render().$el);
				}
			},
            setFooterView: function(ModalFooterView){

                var footerView = null;
                var ModalFooterView = (ModalFooterView)?ModalFooterView:this.ModalFooterView;

                if(ModalFooterView){
                    footerView = new ModalFooterView({modal: this});

                    if(footerView.hasPrimaryButton()){
                        this.$modal.removeClass('footerless');
                    }else{
                        this.$modal.addClass('footerless');
                    }

                    (this._history.length > 1) && footerView.$el.addClass('out');
                    this.footerView && this.footerView.remove();
                    this.$modal.prepend(footerView.render().$el);
                    setTimeout(function(){
                        footerView.$el.removeClass('out');
                    },300);
                    this.footerView = footerView;

                }else{
                    this.$modal.addClass('footerless');
                }
            },

            isOnHistoryIndex: function(){

                if(!this.contentView){
                    return;
                }

                if(!this.contentView.className){
                    console.warn("No className set on the contentView. History functions are limited");
                    return;
                }

                if(!this._history[0]){
                    console.error("No history");
                    return;
                }

                return this.contentView.className == this._history[0].className;
            },

            switchContentView: function(options){
                var that = this;
                var settings = $.extend({
                    view: null,
                    direction: "left" // left | right
                },options);

                if(!this._history.length){
                    this.setContentView(settings);
                }else{
                    this._history.push(settings.view);

                    settings.view.modal = this;
                    var $newView = settings.view.render().$el;
                    var $modalpage = $("<div></div>").addClass("mint-modal-view out").append($newView);

                    this.$modalcont.append($modalpage);
                    $modalpage.addClass(settings.direction);

                    setTimeout(function(){
                        $modalpage.removeClass("animate out");
                        that.$modalpage.addClass("animate");
                    },7);

                    this.$modalcont.addClass("animate "+settings.direction);
                    var delay = mintUtils.getTransitionDuration(this.$modalcont);

                    this.hideOpenFooterView();

                    that.setModalWidth((settings.view.modalOptions && settings.view.modalOptions.width)?settings.view.modalOptions.width:this.width);

                    this.$modal.css({'overflow':'hidden'});

                    var t1 = setTimeout(function(){

                        that.$modalcont.removeClass("animate left right");
                        $modalpage.removeClass("left right");
                        that.contentView && that.contentView.remove();
                        that.$modalpage.remove();
                        that.$modal.css({'overflow':'visible'});
                        that.contentView = settings.view;
                        that.contentView.delegateEvents();
                        that.$modalpage = $modalpage;

                        if(settings.view.modalOptions){
                            that.setFooterView((settings.view.modalOptions.ModalFooterView)?settings.view.modalOptions.ModalFooterView:null);
                            settings.view.modalOptions.onSwitchContentView && settings.view.modalOptions.onSwitchContentView.call(settings.view);
                        }

                        that.toggleX();
                        that.setAccessible();

                    }, delay);

                    this._timeouts.push(t1);
                }

            },

            render: function(){
                var that = this;

                this.$el.addClass(this.extraClass);

                !hasBlur && this.$el.addClass('mint-modal-wrap-noblur');

                $("body").addClass("mint-modal-freeze");

                this.isFullScreenModal && this.$el.addClass('mint-modal-fullscreen');

                this.$el.html(this.template(this)).appendTo(".AppView");

                this.$modal = this.$('.mint-modal');
                this.$modalcont = this.$('.mint-modal-cont');
                this.$modalpage = this.$(".mint-modal-view");

                if(this.width){
                    this.$modal.css({width: this.width});
                }else{
                    this.width = this.$modal.outerWidth();
                }

                // Set the content from the view
                if(this.contentView){
                    this.setContentView({view:this.contentView});
                }

                // Set content from html
                else{
                    this.setContentHTML();
                }

                that.$el.addClass("in");
                that.$modal.addClass("animate in");
                var delay = mintUtils.getTransitionDuration(that.$modal);
                setTimeout(function(){
                    that.$modal.removeClass("animate");
                }, delay);
                that.onOpen();
                that.toggleX();

                setTimeout(function(){
                    that.bg.addClass('in');
                },200);

                return this;
            }
        },{
            isOpen: function(){
                return ($('.mint-modal.in').length > 0);
            },
            closeAnyOpenModals: function(){
                var _modals = modals;
                modals = [];
                return $.when.apply($,_.map(_modals,function(modal){return modal.remove();}));
            }
        });

        return MintModalView;

    });
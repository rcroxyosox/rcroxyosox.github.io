define([
    'jquery', 
    'handlebars',
    'backbone', 
    'text!/html/ui/MintChartBarView.html',
    'css!/css/ui/MintChartBarView.css'
    ],
    function($, HandleBars, Backbone, html) {

        var _dataTotal = 0;
        var _dataMax = null;
        var transitionend = "webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd";

        var MintChartBarView = Backbone.View.extend({

            tagName: "div",
            template: HandleBars.compile(html),
            className: "MintChartBarView",
            topPadding: 20, // A percentage of space from the top of the bar chart
            extraClass: "",
            lines: 5,
            data: [],
            labels:[],
            toolTipTemplate: "{{t}}",
            showToolTips: true,
            // onBarClick:function(val, $o, index){},

            events:{
                "click .mint-chart-bar-bars li":"barClick",
                "mouseenter .mint-chart-bar-bars li":"barHover",
                "mouseleave .mint-chart-bar-bars li":"barHover"
            },

            initialize: function(options){

                options && _.extend(this, options);

                for(var i=0; i<this.data.length; i++){
                    _dataTotal+= this.data[i];
                }

                _dataMax = Math.max.apply(null, this.data);

                if(!this.onBarClick && !this.showToolTips){
                    this.$el.addClass("nonClickable");
                }

                this.linesArr = []; this.linesArr.length = this.lines;
            },

            barHover: function(event){

                var $li = $(event.target).closest('li');
                var index = $li.index();
                var $i = $li.find('i');
                var $aside = $i.find('aside');
                var data = this.data[index];
                var label = this.labels[index];

                if(!this.showToolTips || !data){
                    return;
                }

                if(event.type == "mouseenter"){
                    $aside.remove();
                    var $aside = $('<aside></aside>').html(HandleBars.compile(this.toolTipTemplate)({d:data, l:label})).appendTo($i);
                    $aside.css({'margin-left': ($aside.outerWidth()/2)*-1, 'margin-top': ($aside.outerHeight()+15)*-1});
                    setTimeout(function(){
                        $aside.addClass('in');
                    },1);
                }else{
                    if($aside.length){
                        setTimeout(function(){
                            $i.find('aside').on(transitionend, function(){
                                $(this).remove();
                            }).removeClass('in');
                        },900);
                    }
                }
            },

            barClick: function(event){
                
                if(!this.onBarClick){
                    return;
                }

                var $o = $(event.target).closest("li");
                var val = $o.data("val");
                var i = this.$(".mint-chart-bar-bars li").index($o);
                this.setSelected(i);
                this.onBarClick(val, $o, i);
            },

            setBarHeights: function(){
                var that = this;
                for(var i=0; i<this.data.length; i++){
                    var h = (parseFloat(that.data[i]) / (_dataMax+that.topPadding)) * 100;
                    h = (h > 100)?100:h;
                    that.$(".mint-chart-bar-bars li:eq("+i+") i").css({height:h+"%"});
                }
            },

            setSelected: function(dataIndex){
                this.$(".selected").removeClass("selected");
                this.$(".mint-chart-bar-bars li").eq(dataIndex).addClass("selected");
            },

            render: function(){
                var that = this;
                this.$el.addClass(this.extraClass).html(this.template(this));
                setTimeout(function(){
                    that.setBarHeights();
                }, 100);
                return this;
            }

        });

        return MintChartBarView;

    }
);
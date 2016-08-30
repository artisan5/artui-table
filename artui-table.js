(function ($) {

    //PRIVATE FUNCTIONS	

    var rules = {
        txt: function (v) {
            var elem = $('<input type="text"/>').val(v);
            elem.attr("style", "border:0px solid #fff;background:url(0) no-repeat;");
            elem.click(function () {
                elem.attr("style", 'border:1px solid #aaa');
                elem.select();
            });
            elem.blur(function () {
                elem.attr("style", "border:0px solid #fff;background:url(0) no-repeat;");
            });
            return elem;
        }
    }


    var bindgv = function (elem,obj) {
                    
            var pageurl = obj.url + "?pagesize=" + obj.pagesize + "&page=" + obj.pageindex;
            elem.children().eq(0).hide();
            elem.children().eq(0).siblings().remove();
         
            $.getJSON(pageurl, obj.param, function (data) {
              
                $.fn.mytable1.defaultVal.total = data.total;
                obj.total  = data.total;             
                $.each(data.rows, function (k, n) {
                    var row = elem.children().eq(0).clone().show();
                    var td = null;
                    var count = row.children().length;
                    for (var i = 0; i < count; i++) {
                        td = row.children().eq(i);
                        if (td.attr("name").toString() == obj.keyval) {
                            td.children().val(n[td.attr("name").toString()]);
                        } else if (obj.fields != null) {                         
                            var name = td.attr("name").toString();
                            $.each(obj.fields, function (j, y) {                              
                                if (y.id == name) {                                  
                                    td.append(rules[y.rule](n[name]));
                                }
                            })
                        } else {
                            td.text(n[td.attr("name").toString()]);
                        }
                    }

                    row.hover(function () { $(this).addClass(obj.hoverclass); }, function () { $(this).removeClass(obj.hoverclass); })
                    elem.append(row);

                    if (obj.onCreate != null) {
                        obj.onCreate(n, row,data);
                    }
                });

                if (obj.container != null)
                {
                    $('#paginationDiv').myPager({
                        total: obj.total,
                        pageSize: obj.pagesize,
                        onSelectPage: function (pageIndex1) {
                        //    alert(pageIndex1);
                            $('#gvData tbody').mytable1({
                                pageindex: pageIndex1,
                                container: null
                            });
                        }
                    })
                }
               
                if (obj.pager != null){
                  //  obj.pager(obj.total, obj.pagesize,data);  
                }

            });        
 
        };

   
 

    // PUBLIC FUNCTIONS
     var methods = {
         init: function (options) {

             return this.each(function () {

                 var elem = $(this);
                 var obj = $.extend(false, $.fn.mytable1.defaultVal, options);
                 var data = $(this).data(elem.context.parentNode.id);
                 if (data) {
                     obj = $.extend(data.options, options);
                 }

                 $(this).data(elem.context.parentNode.id, {
                     options: obj
                 });

                 //                 var elem = $(this);
                 //                 var obj = $.data(elem,elem.context.parentNode.id);//$.extend($.fn.mytable1.defaultVal, options);
                 //                 if (obj == null) {
                 //                     obj = $.extend(false,$.fn.mytable1.defaultVal, options);                    
                 //                 } else {
                 //                     obj = $.extend(obj, options);
                 //                 }
                 //                $.data(elem,elem.context.parentNode.id, obj);

                 bindgv(elem, obj);
             })
         },
         reload: function () {
             return this.each(function () {
                 var elem = $(this);
                 var obj = $(this).data(elem.context.parentNode.id)['options'];//$.data(elem,elem.context.parentNode.id);                 
                 bindgv(elem, obj);
             })
         }

     }


    $.fn.mytable1 = function (options) {
         // Decides what to do
        if (methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof this == 'object' || !options) {
            return methods.init.apply(this, arguments);
        } else {          
            return methods.init.apply(this, {});
        }       
    };

    $.fn.mytable1.defaultVal = {
        url: '/Dept/DepJson1',
        param: null,
        keyval: 'ApplicationID',
        fields:null,
        pagesize: 2,
        total: 6,
        pageindex: 1,
        container: null,
        hoverclass: 'ui-state-hover',
        pager: function(){},
        onCreate: null
    };

})(jQuery);
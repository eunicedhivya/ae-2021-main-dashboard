function seatShare(stname, dataSource, selector, keyElem) {
    stname = typeof stname !== 'undefined' ? stname : 'kl';
    stname_fixed = stname;
    var kl_share = null;
    var content = "";
    var legends = "";
	$(selector).html('Loading...'); 
    var tot_percent = (function () {
        $.ajax({
        'async': false,
        'global': false, 
        'url': dataSource,
        'dataType' : 'json',
        'success': function (data) {
            var datafil = stname + "_share"
            kl_seatshare = data[datafil][keyElem]; 
            for(var i in data[datafil]) {
                var seat_percent = parseInt(data[datafil][i][keyElem])
                var party_name = data[datafil][i]["Party"]

                if(seat_percent > 5) {
                    html = '<span class="block" data-chart="'+selector+'" title="'+party_name +'" style="width: '+ seat_percent +'%">'
                    html += '<span class="value">'+ seat_percent +'% </span>'
                    html += '<span class="label" data="'+seat_percent +'">'+ party_name +'</span>'
                    html += '</span>'
                } else {
                    html = '<span class="block" title="'+party_name +'" style="width: '+ seat_percent +'%">'
                    html += '<span class="value">'+ seat_percent +'% </span>'
                    html += '</span>'
                }
                content += html
            } 
            
            $(selector).html(content);
                        
        }
        });
        return kl_seatshare;
		$(selector).html('Loaded');
    })();


}
    

$(document).on('mouseover','.block', function(e) {  
    // console.log("block", this.title)
    // console.log("block", this.style.width)
    var x = $(this).position();
    var wide = $(this).width();
    var getId = $(this).data();
    
    if(getId.chart === "#voteSharechart"){
        console.log("block", "test")
        $(".tooltip2").css("display", "block")
        $(".tooltip2").css("top", x.top - 25)
        $(".tooltip2").css("left", x.left + (wide/2))
        $(".tooltip2").html("<p>"+this.title+": "+ this.style.width +"</p>")
    }else{
        console.log("block", "test2")
        $(".tooltip").css("display", "block")
        $(".tooltip").css("top", x.top - 25)
        $(".tooltip").css("left", x.left + (wide/2))
        $(".tooltip").html("<p>"+this.title+": "+ this.style.width +"</p>")
    }
    
});
$(document).on('mouseout','.block', function(e) {  
    $(".tooltip").css("display", "none")
    $(".tooltip2").css("display", "none")
});
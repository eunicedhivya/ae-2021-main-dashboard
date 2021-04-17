function seatShare(stname, dataSource, selector, keyElem) {
    stname = typeof stname !== 'undefined' ? stname : 'kl';
    stname_fixed = stname;
    var kl_share = null;
    var content = "";
    var legends = "";
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

                html = '<span class="block" title="'+party_name +'" style="width: '+ seat_percent +'%">'
                html += '<span class="value">'+ seat_percent +'% </span>'
                html += '</span>'
                content += html
            } 
            
            $(selector).html(content);
            
            for(var j in data[datafil]) {
                var party_name = data[datafil][j]["Party"]
                
                html =  '<li>'+party_name +'</li>'
                
                legends += html
            }
            $(".legend").html(legends);
            
        }
        });
        return kl_seatshare;
    })();
}
    

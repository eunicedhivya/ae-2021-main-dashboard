function carouselWidget(datasource, selector){

    $("#owl-demo").owlCarousel({
        itemsDesktop : [1199,4],
        itemsDesktopSmall : [980,3],
        itemsTablet: [768,2],
        itemsTabletSmall: false,
        itemsMobile : [479,1],
        pagination: true,
        navigation : true,
        navigationText : ['<i class="arrow left"></i>','<i class="arrow right"></i>'],
        jsonPath : datasource,
        jsonSuccess : customDataSuccess
    });
    
    function customDataSuccess(data){
        var content = "";
        for(var i in data["constituencywise"]){
            
            var constituencyname = data["constituencywise"][i].Constituency;
            var leadingname = data["constituencywise"][i]["Leading Candidate"];
            var leadingparty = data["constituencywise"][i]["Leading Party"];
            var leadingmargin = data["constituencywise"][i]["Margin"];
            var trailingname = data["constituencywise"][i]["Trailing Candidate"];
            var trailingparty = data["constituencywise"][i]["Trailing Party"];
            var trailingmargin = data["constituencywise"][i]["Margin"];
    
            html = '<div class="contituency-items">'
            html += '<h3> Tamil Nadu | <span>'+constituencyname+'</span> </h3>'
            html += '<span class="leadingindicator">Leading</span>'
            html += '<div class="leadingcand">'
            html += '<h4>'+leadingname+'<span>'+leadingparty+'</span></h4>'
            html += '<p>'+leadingmargin.toLocaleString('en-IN')+'</p>'
            html += '</div>'
            html += '<span class="trailingindicator">Leading</span>'        
            html += '<div class="trailingcand">'
            html += '<h4>'+trailingname+' <span>'+trailingparty+'</span></h4>'
            html += '<p>'+trailingmargin.toLocaleString('en-IN')+'</p>'
            html += '</div>'
            html += '</div>'
    
            
            content += html
        }
        $(selector).html(content);
    }


    $("#owl-demo2").owlCarousel({
        itemsDesktop : [1199,4],
        itemsDesktopSmall : [980,3],
        itemsTablet: [768,2],
        itemsTabletSmall: false,
        itemsMobile : [479,1],
        pagination: true,
        navigation : true,
        navigationText : ['<i class="arrow left"></i>','<i class="arrow right"></i>'],
        jsonPath : 'data.json',
        jsonSuccess : customDataSuccess1
    });

    function customDataSuccess1(data) {
            var cand = "";
            for(var j in data["keycandidate"]){
                
                // var img = data["keycandidate"][j].["img/profile.png"];
                var keycandidatename = data["keycandidate"][j].candidatename;
                var keycandidateplace = data["keycandidate"][j].constname;
                var keycandidateparty = data["keycandidate"][j].party;
                var keycandidateleading = data["keycandidate"][j].leadortrail;
                var keycandidatevotes = data["keycandidate"][j].votes
                
                html = '<div class="candidate-items">'
                html += '<img src="img/profile.png" alt="">'
                html += '<div class="cand-info">'
                html += '<h4>'+ keycandidatename +'<span>'+ keycandidateparty +'</span></h4>'
                html += '<p class="cand-cont">'+ keycandidateplace +'</p>'
                html += '<p class="cand-votes"><span>'+keycandidateleading +'</span> '+keycandidatevotes.toLocaleString('en-IN') +'</p>'
                html += '</div>'
                html += '</div>'
                cand += html
            }
            $("#owl-demo2").html(cand);
        }
}

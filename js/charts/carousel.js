function carouselWidget(datasource, selector, statename, filter) {
    statename = typeof statename !== 'undefined' ? statename : 'all';
	statename_fixed = statename;
    
    var filter_const = filter;

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
        var matchingletter;
        var statn = statename+"_constituencywise"; 
        console.log(statn);
        for(var i in data[statn]){
            
            var constituencyname = data[statn][i].Constituency;
            var leadingname = data[statn][i]["Leading Candidate"];
            var leadingparty = data[statn][i]["Leading Party"];
            var leadingmargin = data[statn][i]["Margin"];
            var trailingname = data[statn][i]["Trailing Candidate"];
            var trailingparty = data[statn][i]["Trailing Party"];
            var trailingmargin = data[statn][i]["Margin"];
            
            console.log(filter_const);
            if(filter_const != statn && filter_const != '') { console.log('here');
				var matchingletter = constname.charAt(0).toUpperCase();
				if(matchingletter != filter_const) {
					continue;
				}
			}

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

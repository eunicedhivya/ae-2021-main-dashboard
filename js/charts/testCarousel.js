function pollcarouselWidget(datasource, selector){

    $("#poll-carous1").owlCarousel({
        itemsDesktop : [1199,3],
        itemsDesktopSmall : [980,3],
        itemsTablet: [768,2],
        itemsTabletSmall: false,
        itemsMobile : [479,1],
        pagination: true,
        navigation : true,
        margin: 0,
        navigationText : ['<i class="arrow left"></i>','<i class="arrow right"></i>'],
        jsonPath : datasource,
        jsonSuccess : customDataSuccess
    });
    
    function customDataSuccess(data){

        var myColor = d3.scaleSequential()
            .domain([0, 100])
            .interpolator(d3.interpolateYlGn);


        var content = "";
        for(var i in data["wb-polling-day"]){
            
            var constname = data["wb-polling-day"][i]["constname"];
            var turnout2021 = data["wb-polling-day"][i]["turnout2021"];
            var turnout2016 = data["wb-polling-day"][i]["turnout2016"];
            var totalElectorate = data["wb-polling-day"][i]["totalElectorate"];

            html = '<div class="turnout-items">'
            html += '<h3> '+constname+'  <span class="turnout-update">Updated 11.20pm</span> </h3>'
            html += '<div class="turnout-content">'
            html += '<div class="battery-chart turnout-2021">'
            html += '<div class="bar">'
            html +=  '<div class="barlevel" style="width:'+turnout2021+'%;background-color: '+myColor(turnout2021)+';"></div>'
            html +=  '</div>'
            html +=  '<div class="level" style="color: '+myColor(turnout2021)+';">'+turnout2021+'%</div>'
            html +=  '</div>'        
            html +=  '<div class="split-2">'
            html +=  '<div>'
            html +=  'Total electorate' 
            html +=  ' <span>'+totalElectorate.toLocaleString('en-IN')+'</span>'
            html +=  '</div>'
            html +=  '<div>'
            html +=  '<h4>Turnout 2016</h4>'
            html +=  '<div class="battery-chart turnout-2016">'
            html +=  '<div class="bar">'
            html +=  '<div class="barlevel" style="width:'+turnout2016+'%;background-color: red;"></div>'
            html +=  '</div>'
            html +=  '<div class="level">'+turnout2016+'%</div>'
            html +=  '</div>'
            html +=  '</div>'
            html +=  '</div>'
            html +=  '</div>'
            html +=  '</div>'

            content += html
        }
        $("#poll-carous1").html(content);
    }


    $("#poll-carous2").owlCarousel({
        itemsDesktop : [1199,3],
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
                for(var j in data["wb-keycandidate"]){
                    
                    var phase = data["wb-keycandidate"][j].phase;
                    var keyconstno = data["wb-keycandidate"][j].constno;
                    var keyconstname = data["wb-keycandidate"][j].constname;
                    var keycandidatename = data["wb-keycandidate"][j].candidatename;
                    var keycandidateparty = data["wb-keycandidate"][j].candidateparty
                    var keycandidateage = data["wb-keycandidate"][j].age
                    var keycandidateedu = data["wb-keycandidate"][j].education
                    var keycandidatenet2016 = data["wb-keycandidate"][j].networth2016
                    var keycandidatenet2021 = data["wb-keycandidate"][j].networth2021
                    var keyliabilities = data["wb-keycandidate"][j].liabilities
                    var keycriminals = data["wb-keycandidate"][j].criminalcases

                    html = '<div class="poll-candidate-items">'
                    html += '<img src="img/profile.png" alt="">'
                    html += '<div class="cand-info">'
                    html += '<h4>'+keycandidatename+'<span class="keycand-age"> ('+keycandidateage+') </span>'+'<span>'+keycandidateparty+'</span></h4>'
                    html += '<p class="cand-cont">'+keyconstname+'</p>'
                    html += '<hr>'
                    html += '<ul class="cand-meta">'
                    html += '<li>Education <span>'+keycandidateedu+'</span></li>'
                    html += '<li>Networth <span>'+keycandidatenet2021+'</span></li>'
                    html += '<li>Networth (2016) <span>'+keycandidatenet2016+'</span></li>'
                    html += '</ul>'
                    html += '<hr>'
                    html += '<ul class="cand-meta" >'
                    html += '<li>liabilities <span>'+keyliabilities+'</span></li>'
                    html += '<li>Criminal cases <span>'+keycriminals+'</span></li>'
                    html += '</ul>'
                    html += '</div>'
                    html += '</div>'

                    
                    cand += html
            }
            $("#poll-carous2").html(cand);
        }
}

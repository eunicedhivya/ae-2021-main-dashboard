function drawParliamentaryChart(selector, year, data){


    var parliament = d3.parliament().width(375).innerRadiusCoef(0.4);
    
    var tool_tip = d3.tip()
    .attr("class", "map-tooltip")
    .offset([-15, 0])
    .html(function(d) { 
        var html = "<p> "+d.party.party+" </p> "
        return html; 
    });

    // parliament.call(tool_tip);
    
    parliament.enter.fromCenter(true).smallToBig(true);
    
    parliament.exit.toCenter(true).bigToSmall(true);
    
    parliament.on("click", function(e) { 
        //console.log(e); 
    });

    // parliament.on("mouseover", function(d) { console.log(d.party.party); });
    // parliament.on("mouseout", function(d) { console.log(d.party.party); });

    
    
    d3.select(selector).datum(data).call(parliament);
    d3.select(selector).call(tool_tip);

    parliament.on('mouseover', tool_tip.show)
    parliament.on('mouseout', tool_tip.hide)

    d3.select(".parliamentseats").attr("class", "parliamentseats "+btn_data+" y"+year)

}
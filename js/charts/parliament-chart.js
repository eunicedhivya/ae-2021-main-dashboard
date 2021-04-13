function drawParliamentaryChart(selector, year, data){


    var parliament = d3.parliament().width(375).innerRadiusCoef(0.4);
    
    parliament.enter.fromCenter(true).smallToBig(true);
    
    parliament.exit.toCenter(true).bigToSmall(true);
    
    parliament.on("click", function(e) { console.log(e); });
    
    d3.select(selector).datum(data).call(parliament);

 

}
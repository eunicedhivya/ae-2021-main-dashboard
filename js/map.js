function drawAssemblyMap(selector, settings){
    var width = 430, height = 550, scale = 2000, center = [83, 23]; 
    var state = settings.statecode;
    var source = settings.mapsource;

    d3.select(selector).html(null)

    

    var svg = d3.select(selector)
    .append("svg")
    .attr("class", settings.vhcode+"map")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMin")
    .append("g")

    var tool_tip = d3.tip()
        .attr("class", "map-tooltip")
        .offset([-15, 0])
        .html(function(d) { 
            var html = "<p>"+d.properties.AC_NAME+"</p> "
            return html; 
        });
    svg.call(tool_tip);

    var projection = d3.geoMercator()
    .scale(settings.scale)
    .center(settings.center)
    .translate([width / 2, height / 2])

    var geoPath = d3.geoPath()
        .projection(projection)


    
        d3.json(source, function(error, stateShape){

            var stateconst = topojson.feature(stateShape, stateShape.objects.collection).features;

            svg.selectAll(".state")
                        .data(stateconst).enter().append("path")
                        .attr("d", geoPath)
                        .attr("class", "state")
                        .attr('stroke', "#ffffff")
                        .attr('stroke-width', "0.5")
                        .attr('fill', function(d,i){
                           
                            var fd;
                            var filterdatastatewise;
                            
                            if(state === "S22"){
                                filterdatastatewise = "tn_conswise";
                            }else if(state === "S03"){
                                filterdatastatewise = "as_conswise";
                            }else if(state === "S11"){
                                filterdatastatewise = "kl_conswise";
                            }else if(state === "U07"){
                                filterdatastatewise = "pd_conswise";
                            }else if(state === "S25"){
                                filterdatastatewise = "wb_conswise";
                            }
                            
                            
                            if($("#conts-2016").hasClass("active")) {
                                fd = constWiseData2016.filter(function(obj){
                                    return obj["Const. No."] === d.properties.AC_NO;
                                })

                                if(fd[0] !== undefined){
                                    if(fd[0]["Const. No."] === 101){
                                        console.log(fd[0]["Leading Party"], partycolors[fd[0]["Leading Party"]]);
                                        console.log(fd[0]);

                                    }
                                    return partycolors[fd[0]["Leading Party"]];
                                }else{
                                    return "#FFFFFF";
                                }

                            } else {
                                fd = constWiseData2021[filterdatastatewise].filter(function(obj){
                                    // console.log(obj)
                                    return obj["constNo"] === d.properties.AC_NO;
                                })

                                if(fd[0] !== undefined){
                                    if(state === "S22"){
                                        return partycolors_tn[fd[0]["leadingParty"]];
                                    }else if(state === "S03"){
                                        return partycolors_as[fd[0]["leadingParty"]];
                                    }else if(state === "S11"){
                                        return partycolors_kl[fd[0]["leadingParty"]];
                                    }else if(state === "U07"){
                                        return partycolors_pd[fd[0]["leadingParty"]];
                                    }else if(state === "S25"){
                                        return partycolors_wb[fd[0]["leadingParty"]];
                                    }
                                }else{
                                    return "#FFFFFF";
                                }
                            }
                            
                            // console.log(fd[0]["leadingParty"])
                            
                            
                        })
                        .attr('stroke-opacity', "1")
						.attr("data-constcode", function(d,i){
                            return d.properties.AC_NO;
                        })
                        .attr("data-statecode", function(d,i){
                            return d['properties']['ST_CODE'];
                        })
                        .on('mouseover', tool_tip.show)
                        .on('mouseout', tool_tip.hide)
                        .on("click", function(d, i){ 
                            
                            if($("#conts-2016").hasClass("active")) {
                                constFilter(d.properties.AC_NO, "data/const2016data.json");
                            } else {
                                constFilter(d.properties.AC_NO, "data/const2021data.json");
                            }
                            $('#const-list').val(d.properties.AC_NO).trigger('change')
                        })

        }) // Statelevel Source
 

}
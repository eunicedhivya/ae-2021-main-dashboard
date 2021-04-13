var selectedState;
var selectedPccode;
function drawCustomMap(selector, boundary, years, device){
    var width = 430, height = 480, scale = 800, center = [83, 23];
    var source = 'map/india.json'

    var svg = d3.select(selector)
                .append("svg")
                .attr("class", "map")
                .attr("viewBox", "0 0 " + width + " " + height)
                .attr("preserveAspectRatio", "xMinYMin")
                .append("g")

    var tooltip = d3.select("div.tooltip");


    var projection = d3.geoMercator()
                .scale(scale)
                .center(center)
                .translate([width / 2, height / 2])
            
    var geoPath = d3.geoPath()
                .projection(projection)

    function centroids(boundarydata){
        return boundarydata.map(function (d){
            return projection(d3.geoCentroid(d))
        });
    }

    d3.json(source, function (error, pathshape) {

        var pcboundary = topojson.feature(pathshape, pathshape.objects.pcboundary).features;
        var pcCentroid = centroids(pcboundary);
        // console.log("pcCentroid", pcCentroid);
        
        var constituenciesByState = {};
        
        pcboundary.forEach(function(pc){
            var code = pc.properties.ST_CODE;
            if (!constituenciesByState[code]) {
            	constituenciesByState[code] = [];
            }
            constituenciesByState[code].push(pc);
        });

        // console.log('constituenciesByStateGE', constituenciesByState);
        
        var stateboundary = topojson.feature(pathshape, pathshape.objects.stateboundary).features;
        var stateCentroid = centroids(stateboundary);

        var stateCounts = pcboundary.map(function(pc){
                return pc.properties.ST_CODE
            }).reduce(function (counts, code) { 
                counts[code] = (counts[code] || 0) + 1;
                return counts;
            }, {});

        // console.log("stateCounts", stateCounts);

        if(device === 'Desktop'){
        
            svg.selectAll(".state")
                .data(stateboundary).enter().append("path")
                .attr("d", geoPath)
                .attr("class", "state")
                .attr('stroke', "#ffffff")
                .attr('stroke-width', "0.5")
                .attr('fill', "#dad9d9")
                .attr('stroke-opacity', "1")
                .attr("data-statecode", function(d,i){
                    // console.log(d['properties']['ST_CODE'],d['properties']['PC_CODE']);
                    return d['properties']['ST_CODE'];
                })
                .on("click", function(d, i){
                    // jQuery(".loadingbuttons").show();

                    d3.select("#constleveldata").style("display", "none");
                    d3.select("#stateleveldata").style("display", "block");

                    jQuery("#statelevelbtn button").removeClass("active");
                    d3.select("#stateBtn2019").classed("active", true);

                    console.log("d.properties.ST_CODE", d.properties.ST_CODE);
                    

                    fetchStateData("2019", d.properties.ST_CODE);

                    // d3.select("#load2019").attr("class", "active");
                    // d3.select(".data-map").style("background-color", "#e6272c");
                    
                    // var fd2019 = _.filter(partywise_2019.parties, function(obj){
                    //     return obj.stateCode === d.properties.ST_CODE; 
                    // })
                    
                    
                    // var fd2014 = _.filter(partywise_2014.parties, function(obj){
                    //     return obj.stateCode === d.properties.ST_CODE; 
                    // });
                    
                    // var fdStatewiseVoteshare2014 = _.filter(StatewiseVoteShare2014, function(obj){
                    //     return obj.stateCode === d.properties.ST_CODE; 
                    // });

                    // // console.log("fd2019", fd2019);
                    // // console.log("fd2014", fd2014);
                    // // console.log("fd2014", fd2014);
                    

                    // // d3.select(".data-map").html(
                    // //     "<img src='img/white/" +d.properties.ST_CODE+ ".png'/>"
                    // //     // "<img src='img/white/" +d.properties.ST_CODE+ ".png'/><div id='voterturnout'><p style='float: left;color:#fff;font-size: 12px;line-height: 11px;'>voter<br>turnout</p><div style='float: right;line-height: 20px;padding-left: 0px;font-size: 0.8em;color:#fff;'>88.8%</div></div>"
                    // // )
                    
                    // d3.select("#stateleveldata").html(feedStateLevelData(fd2019));
                    // // d3.select("#stateleveldata").html(feedStateLevelData(fd2019[0]));
                    // // d3.select("#stateleveldata").html(feedStateLevelData(fd2014[0]));

                    // drawHorizontalStackChart("#stateleveldata #state-voteshare", fdStatewiseVoteshare2014, {
                    //     width: 800,
                    //     height: 60,
                    //     margin: { top: 25, bottom: 25, left: 0, right: 0 },
                    //     cutoff: 20,
                    //     type: "votesharechart",
                    //     textLabel: 'party',
                    //     numberLabel: 'voteshare',
                    //     totalLabel: 'voteshare'
                    // });
                    
                })                          

            var statePC = svg.selectAll(".statewise-seats").data(stateCentroid)
                .enter().append("svg")
                .attr("class", function(d,i){
                    return "statewise-seats " + stateboundary[i]['properties']['ST_CODE'];
                })

            var eachConstRect = statePC.selectAll("rect")
                .data(function(d, index) { 
                    var stateCode = stateboundary[index]['properties']['ST_CODE'];

                    
                    var constituencies = constituenciesByState[stateCode];
                    
                    var rowLength = Math.ceil(Math.sqrt(constituencies.length));  // rectangles per row
                    var offset = 4;  // spacing between start of each rectangle
                
                    var numCols = Math.min(constituencies.length, rowLength);
                    var numRows = Math.ceil(constituencies.length/rowLength);
                
                    var initialX = d[0] - (numCols * offset)/2;
                    var initialY = d[1] - (numRows * offset)/2;
                
                    var allconst = constituencies
                    .map(function(c, i) {
                    return {
                        x : initialX + ((i % rowLength) * offset),
                        y : initialY + Math.floor(i / rowLength) * offset,
                        pccode: c.properties.PC_CODE,
                        statecode: stateCode
                    }
                    }); 
                    
                    return allconst;
                })
                .enter()
                .append("rect")
                .attr("x", function(d){ return d.x })
                .attr("y", function (d){ return d.y })
                .attr("width", "3.3")
                .attr("height", "3.3")
                .attr("class", "constituency")
                .attr("fill", function(d,i){
                    
                    var fd = _.filter(constituency_2019, function(obj){

                            // return obj.stateCode === d.statecode && obj.pcno === d.pccode; 
                            return obj.stateCode === d.statecode && obj.pcno === d.pccode; 
                        });


                        if(fd[0] !== undefined){
                            
                            return colorCodesList2019[fd[0].leadingParty];
                        }else{
                            // console.log(fd[0]);
                            return "lightgreen";
                        }
                    
                })
                .attr("data-pccode", function(d,i){
                    // console.log(d['properties']['ST_CODE'],d['properties']['PC_CODE']);
                    return d['pccode'];
                })
                .attr("data-statecode", function(d,i){
                    // console.log(d['properties']['ST_CODE'],d['properties']['PC_CODE']);
                    return d['statecode'];
                })
                .on("click", function(d, i){
                    d3.select("#constBtn2019").classed("active", true);
                    d3.select("#constBtn2014").classed("active", false);
                    // fetchdataBox("2019",d.statecode,d.pccode);
                    d3.select("#constleveldata").style("display", "block");
                    d3.select("#stateleveldata").style("display", "none");

                    var fd = _.filter(candidate_2019, function(obj){
                        // console.log(d);
                        return obj.stateCode === d.statecode && obj.pcno === d.pccode;
                        }); 

                        console.log("fdcandidate_2019", fd);
                        
                    fetchConstituencyData("2019", d.statecode, d.pccode);           
                })
                .on("mouseover",function(d) { 
                    // console.log(constituency_2014);
                    var fd = _.filter(constituency_2014, function(obj){
                                               // console.log(d);
                        return obj.stateCode === d.statecode && obj.pcno === d.pccode;
                    }); 
                    d3.select(".tipp").style("display","block"); 
                    d3.select(".tippBox").style("display","block");
                    d3.select(".tipp").style("y",(this.attributes.y.value-25)+"px");
                    d3.select(".tipp").style("x",(this.attributes.x.value+10)+"px");
                    d3.select(".tippBox").style("y",(this.attributes.y.value-5)+"px");
                    d3.select(".tippBox").style("x",(this.attributes.x.value+2)+"px");
                    
                    d3.select(".tipp").html(fd[0].constituencyName);
                   })
                   .on("mouseout",function(d) {
                   d3.select(".tipp").style("display","none");
                   d3.select(".tippBox").style("display","none");
                   })

                   var tool =svg.append("foreignObject");
                   tool.attr("class", "tipp");
                   tool.attr("id", "tipp");
                   var tool =	svg.append("foreignObject");
                   tool.attr("class", "tippBox");
                   tool.attr("id", "tippBox");

                
        }else{
            // d3.select(selector).html("Mobile Map")

            ///Mobile Map

            // jQuery(".constlevelbtn").css("display", "block")

            svg.selectAll(".state")
                .data(stateboundary).enter().append("path")
                .attr("d", geoPath)
                .attr("class", "mobileState")
                .attr('stroke', "#ffffff")
                .attr('stroke-width', "0.5")
                .attr('fill', "#dad9d9")
                .attr('stroke-opacity', "1")
                .attr("data-statecode", function(d,i){
                    return d['properties']['ST_CODE'];
                })
                .on("click", function(d, i){
                    console.log(d["properties"]["ST_CODE"]);

                    d3.select(".data-map").style("display", "none")
                    
                    // var showData = "<img src='img/grey/"+d['properties']['ST_CODE']+".png' />";
                    // showData += "<div id='contituencydisplay'></div>";

                    var fdSortedData = _.filter(sortedData, function(D){
                        return D.stateCode === d['properties']['ST_CODE']
                    })

                    // d3.select(".showShape").style("display", "block")
                    //     .html(showData)
                    d3.select(".showShape").style("display", "block")

                    d3.select(".showShape .stateshow")
                        .html("<p>"+d['properties']['ST_NAME']+"</p><img src='img/grey/"+d['properties']['ST_CODE']+".png' />")

                    d3.select(".showShape .constshow")
                        .html("<div id='contituencydisplay' class='clearfixsol'></div> <p>Click on the box to see constituency data</p>")

                    drawseatssquare("#contituencydisplay", fdSortedData)
                    

                })   
            }

        


        
    }); // d3.json

    

}

d3.select("#constBtn2014").on("click", function(test){
    jQuery("#constlevelbtn button").removeClass("active")
    // d3.select("#constBtn2019").classed("active", false)
    d3.select("#constBtn2014").classed("active", true)

    var stateCode = d3.select(this).attr("data-statecode")
    var pcCode = d3.select(this).attr("data-pccode");

    // console.log(pcCode);
    fetchConstituencyData("2014", stateCode, parseInt(pcCode));  
    
})

d3.select("#constBtn2019").on("click", function(test){
    jQuery("#constlevelbtn button").removeClass("active")
    // d3.select("#constBtn2019").classed("active", false)
    d3.select("#constBtn2019").classed("active", true)

    var stateCode = d3.select(this).attr("data-statecode")
    var pcCode = d3.select(this).attr("data-pccode");

    // console.log(pcCode);
    fetchConstituencyData("2019", stateCode, parseInt(pcCode));  
    
})



d3.select("#stateBtn2014").on("click", function(test){
    jQuery("#statelevelbtn button").removeClass("active")
    // d3.select("#constBtn2019").classed("active", false)
    d3.select("#stateBtn2014").classed("active", true)

    var stateCode = d3.select(this).attr("data-statecode")

    // console.log(pcCode);
    fetchStateData("2014", stateCode)  
    
})

d3.select("#stateBtn2019").on("click", function(test){
    jQuery("#statelevelbtn button").removeClass("active")
    // d3.select("#constBtn2019").classed("active", false)
    d3.select("#stateBtn2019").classed("active", true)

    var stateCode = d3.select(this).attr("data-statecode")

    // console.log(pcCode);
    fetchStateData("2019", stateCode)
    
})

function fetchStateData(year, stateCodeValue){

    d3.selectAll("#statelevelbtn button").attr("data-statecode", function(d){
        return stateCodeValue;
    })

   d3.select(".data-map").style("background-color", "#e6272c")
    d3.select(".data-map img").attr("src", "img/white/"+stateCodeValue+".png")



    if(year === "2014"){

        var fd2014 = _.filter(partywise_2014.parties, function(obj){
            return obj.stateCode === stateCodeValue; 
        })
    
        var fdStatewiseVoteshare2014 = _.filter(StatewiseVoteShare2014, function(obj){
            return obj.stateCode === stateCodeValue; 
        });
        
    
        d3.select("#st-name").text(fd2014[0]['stateName'])
        d3.select("#noofseats").text("Test")
        d3.select("#stateleadingparty").text(fd2014[0]['party'])
        d3.select("#statetrailingingparty").text(fd2014[1]['party'])
    
        drawHorizontalStackChart("#state-voteshare", fdStatewiseVoteshare2014, {
            width: 800,
            height: 60,
            margin: { top: 25, bottom: 25, left: 0, right: 0 },
            cutoff: 20,
            type: "votesharechart",
            textLabel: 'party',
            numberLabel: 'voteshare',
            totalLabel: 'voteshare'
        });


    }else if(year === "2019"){


        var fd2019 = _.filter(partywise_2019.parties, function(obj){
            return obj.stateCode === stateCodeValue; 
        })
    
        var fdStatewiseVoteshare2019 = _.filter(StatewiseVoteShare2019, function(obj){
            return obj.stateCode === stateCodeValue; 
        });
        
    
        d3.select("#st-name").text(fd2019[0]['stateName'])
        d3.select("#noofseats").text("Test")
        d3.select("#stateleadingparty").text(fd2019[0]['party'])
        d3.select("#statetrailingingparty").text(fd2019[1]['party'])
    
        drawHorizontalStackChart("#state-voteshare", fdStatewiseVoteshare2019, {
            width: 800,
            height: 60,
            margin: { top: 25, bottom: 25, left: 0, right: 0 },
            cutoff: 20,
            type: "votesharechart",
            textLabel: 'party',
            numberLabel: 'voteshare',
            totalLabel: 'voteshare'
        });

    }

    

    // console.log("statevote2019", fdStatewiseVoteshare2019);
    


}

function fetchConstituencyData(year, stateCodeValue, pcCodeValue){

    // console.log(year, stateCodeValue, pcCodeValue);

    d3.selectAll("#constlevelbtn button").attr("data-statecode", function(d){
        return stateCodeValue;
    })

    d3.selectAll("#constlevelbtn button").attr("data-pccode", function(d){
        return pcCodeValue;
    })

    d3.select(".data-map").style("background-color", "#FFFFFF")
    d3.select(".data-map img").attr("src", "img/black/"+stateCodeValue+".png")

    jQuery('#stateselect2019 option[value="'+stateCodeValue+'"]').attr("selected","selected");
    showconstituencylist();
    jQuery('#constituencyselect2019 option[value="'+pcCodeValue+'"]').attr("selected","selected");

    if(year === "2014"){

        var fd2014 = _.filter(constituency_2014, function(obj){
            return obj.stateCode === stateCodeValue && obj.pcno === pcCodeValue; 
        });
    
        var pullconstdata2014 = _.filter(candidate_2014, function(obj){
            return obj.stateCode === stateCodeValue && obj.pcno === pcCodeValue;
        })

        // console.log("fd2014", fd2014);

        d3.select("#const-name").html(fd2014[0]['constituencyName'] + " <small>Result Declared</small>")
        d3.select("#state-name").text(fd2014[0]['stateName'])
        d3.select("#leadingparty").text(fd2014[0]['leadingParty'])
        d3.select("#leadingcandidate").text(fd2014[0]['leadingCandidate'])
        d3.select("#margin").text(fd2014[0]['margin'])
        d3.select("#trailingparty").text(fd2014[0]['trailingParty'])
        d3.select("#trailingcandidate").text(fd2014[0]['trailingCandidate'])

        //  drawHorizontalStackChart(selection, stackdata, props)
        drawHorizontalStackChart("#constleveldata #const-voteshare", pullconstdata2014, {
            width: 800,
            height: 60,
            margin: { top: 25, bottom: 25, left: 0, right: 0 },
            cutoff: 20,
            type: "votesharechart",
            textLabel: 'party',
            numberLabel: 'votes%',
            totalLabel: 'votes%'
        });
        

    }else if(year === "2019"){

        var fd2019 = _.filter(constituency_2019, function(obj){
            return obj.stateCode === stateCodeValue && obj.pcno === pcCodeValue; 
        });
    
        var pullconstdata2019 = _.filter(candidate_2019, function(obj){
            return obj.stateCode === stateCodeValue && obj.pcno === pcCodeValue;
        })



        d3.select("#const-name").html(fd2019[0]['constituencyName'] + " <small>Result Declared</small>")
        d3.select("#state-name").text(fd2019[0]['stateName'])
        d3.select("#leadingparty").text(fd2019[0]['leadingParty'])
        d3.select("#leadingcandidate").text(fd2019[0]['leadingCandidate'])
        d3.select("#margin").text(fd2019[0]['margin'])
        d3.select("#trailingparty").text(fd2019[0]['trailingParty'])
        d3.select("#trailingcandidate").text(fd2019[0]['trailingCandidate'])

        //  drawHorizontalStackChart(selection, stackdata, props)
        drawHorizontalStackChart("#constleveldata #const-voteshare", pullconstdata2019, {
            width: 800,
            height: 60,
            margin: { top: 25, bottom: 25, left: 0, right: 0 },
            cutoff: 20,
            type: "votesharechart",
            textLabel: 'party',
            numberLabel: 'votes%',
            totalLabel: 'votes%'
        });

    }   

} //fetchConstituencyData






// d3.select("#constBtn2019").on("click", function(test){
//     d3.select("#constBtn2014").classed("active", false)
//     d3.select(this).classed("active", true)
    
// })




// function fetchdataBox(year,stateCode,pcCode) { 

// console.log("triggered "+ year);

// }


// jQuery('#load2014').click(function(){ 
//     fetchdataBox("2014");

// });
// jQuery('#load2019').click(function(){
//     fetchdataBox("2019");
// });
// function fetchdataBox(year,stateCode,pcCode) { 
//    // var stateCodeValue = jQuery('#constituencyselect2019 option:selected').attr('data-statecode');
//    // var pcCodeValue = jQuery('#constituencyselect2019 option:selected').attr('data-pcno');
//    if(typeof(stateCode) == 'undefined') {
//     var stateCodeValue = selectedState;
//     var pcCodeValue = selectedPccode;
//    } else {
//     var stateCodeValue = stateCode;
//     var pcCodeValue = pcCode;
//     selectedState = stateCodeValue;
//     selectedPccode = pcCodeValue;

//    }

//    jQuery('#load2014').removeClass('active');
//    jQuery('#load2019').removeClass('active');
//    jQuery('#load'+year).addClass('active');
//    jQuery('#stateselect2019 option[value="'+stateCodeValue+'"]').attr("selected","selected");
//    showconstituencylist();
//    jQuery('#constituencyselect2019 option[value="'+pcCodeValue+'"]').attr("selected","selected");

//    var insertBtn = "<div>"
//    insertBtn += "<button> 2014 </button>"
//    insertBtn += "<button> 2019 </button>"
//    insertBtn += "</div>"
//    d3.select("#constleveldata").html(insertBtn);


//     jQuery('.loadingbuttons').show();
//     // d3.select("#constleveldata").html("")
//     d3.select("#constleveldata").style("display", "block");
//                     d3.select("#stateleveldata").style("display", "none");
//                     d3.select(".data-map").style("display", "block")
//                     d3.select(".data-map").style("background-color", "#ffffff");
//                     d3.select(".data-map #voterturnout div").style("color", "#ffffff");
//                     d3.select(".data-map #voterturnout p").style("color", "#ffffff");
                    
//                     var fd2014 = _.filter(constituency_2014, function(obj){
//                         pcCodeValue = parseInt(pcCodeValue);
//                         return obj.stateCode === stateCodeValue && obj.pcno === pcCodeValue; 
//                     });
               
//                     var fd2019 = _.filter(constituency_2019, function(obj){
//                         return obj.stateCode === stateCodeValue && obj.pcno === pcCodeValue; 
//                     });

//                     //console.log("fd2014", fd2014);
//                     //console.log("fd2019", fd2019);
                    
                    

//                     d3.select(".data-map").html(
//                         // "<img src='img/mobile-map/" +d.statecode+ ".jpg'/><p>"+fdTurnout[0]["voterTurnout"]+"</p>"
//                         "<img src='img/black/" +stateCodeValue+ ".png'/>"
//                         // "<img src='img/black/" +stateCodeValue+ ".png'/><div id='voterturnout'><p style='float: left;font-size: 12px;line-height: 11px;'>voter<br>turnout</p><div style='float: right;line-height: 20px;padding-left: 0px;font-size: 0.8em;'>88.8%</div></div>"
//                     )
//                     if(year=="2014") {
//                         d3.select("#constleveldata").html(feedConstLevelData(fd2014[0]));
//                     } else {
//                         d3.select("#constleveldata").html(feedConstLevelData(fd2019[0]));
//                     }
                    

//                     var pullconstdata2014 = _.filter(candidate_2019, function(obj){
//                         return obj.stateCode === stateCodeValue && obj.pcno === pcCodeValue;
//                     })
                    
//                     var pullconstdata2019 = _.filter(candidate_2019, function(obj){
//                         return obj.stateCode === stateCodeValue && obj.pcno === pcCodeValue;
//                     })
                    
                    
                    
//                    // console.log(pullconstdata2014);
                    

//                     //  drawHorizontalStackChart(selection, stackdata, props)
//                     drawHorizontalStackChart("#constleveldata #const-voteshare", pullconstdata2014, {
//                         width: 800,
//                         height: 60,
//                         margin: { top: 25, bottom: 25, left: 0, right: 0 },
//                         cutoff: 20,
//                         type: "votesharechart",
//                         textLabel: 'party',
//                         numberLabel: 'votes%',
//                         totalLabel: 'votes%'
//                     }); 
                    

// }

jQuery('#constituencyselect2019').change(function(){
    d3.select("#constBtn2019").classed("active", true);
    d3.select("#constBtn2014").classed("active", false);

    d3.select("#constleveldata").style("display", "block");
    d3.select("#stateleveldata").style("display", "none");

    var stateCodeValue = jQuery('#constituencyselect2019 option:selected').attr('data-statecode');
    var pcCodeValue = jQuery('#constituencyselect2019 option:selected').attr('data-pcno');
    
    fetchConstituencyData("2019",stateCodeValue, parseInt(pcCodeValue));
});


jQuery('#stateselect2019').change(function() {
    var constituencyselect2019Val =  jQuery('#constituencyselect2019').val();
    if(constituencyselect2019Val) {
        jQuery('#constituencyselect2019').trigger('change');
    }
});
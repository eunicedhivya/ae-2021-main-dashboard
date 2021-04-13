var selectWonLeadSeatChart = d3.select('#all-lk-seats')

d3.select('#all-lk-seats').append("div").attr("class", "seattooltip")
    .style("display", "none")

selectWonLeadSeatChart.selectAll(".clusterbox")
    .data(sortedData).enter().append("div")
    .attr("class", "clusterbox")
    .style("width", "11px")
    .style("height", "11px")
    .style("float", "left")
    .style("margin", "2px")
    .attr("data-pccode", function(d){
        return d.pcno;
    })
    .attr("data-statecode", function(d){
        return d.stateCode;  
    })
    .style("background-color", function(d){
        return d.colors;
    })
    .on("mousemove", function(d){

        var position = $(this).position() 
        var html;
        // console.log("seats", d)
        var fd = _.filter(constituency_2019, function(obj){
            return obj.stateCode === d.stateCode && obj.pcno === d.pcno;
        });

        if(fd[0] !== undefined){

           html = '<p>' + fd[0]['constituencyName']+ ', ' +fd[0]['stateName'] +'</p>' 
           html += '<p> <b>Won: </b>' + fd[0]['leadingCandidate']+ '<br> (' +fd[0]['leadingParty']+ ')' +'</p>'
       
        }else{
            html = '<p>No Data</p>'
        }
           //d3.select(".seattooltip").html(fd[0]['constituencyName']+ ' (' +fd[0]['stateName']+ ')' )
        var tooltip = d3.select(".seattooltip").html(html)
            .style("position", "absolute")
            .style("display", "block")
            .style("background-color", "black")
            .style("font-size", "12px")
            .style("padding", "5px 10px")
            .style("color", "white")
            if(position.left >= 150) {
                tooltip.style("left", (position.left - 200)+ "px")
                .style("top", (position.top - 80) + "px")
            } else {
                tooltip.style("left", (position.left + 2)+ "px")
                .style("top", (position.top - 80) + "px")
            }
           
    })
    .on("mouseout", function(d){
        d3.select(".seattooltip")
            .style("display", "none")
    })
    .on("click", function(d, i){
        // var fd = _.filter(constituency_2019, function(obj){
        //     return obj.stateCode === d.stateCode && obj.pcno === d.pcno;
        // });

        fetchConstituencyData("2019",d.stateCode , d.pcno);
        // fetchdataBox("2019",d.stateCode,d.pcno);
        // selectWonLeadSeatChart.selectAll(".clusterbox")
        // d3.select(this)
        // .style("background-color", "black")
    })



    function drawseatssquare(selector, data){
        var selectWonLeadSeatChart = d3.select(selector)
        // d3.select(selector).append("div").attr("class", "seattooltip")
        selectWonLeadSeatChart.selectAll(".wl-seats")
            .data(data).enter().append("div")
            .attr("class", "wl-seats")
            .style("width", "11px")
            .style("height", "11px")
            .style("float", "left")
            .style("margin", "2px")
            .attr("data-pccode", function(d){
                return d.pcno;
            })
            .attr("data-statecode", function(d){
                return d.stateCode;  
            })
            .style("background-color", function(d){
                return d.colors;
            })
            .on("click", function(d, i){
                // var fd = _.filter(constituency_2019, function(obj){
                //     return obj.stateCode === d.stateCode && obj.pcno === d.pcno;
                // });

                d3.select("#constleveldata").style("display", "block");
                d3.select("#stateleveldata").style("display", "none");

                // console.log("clicked mobile");
                

                // console.log(fd);
                fetchConstituencyData("2019", d.stateCode, d.pcno);
                // fetchdataBox("2019",d.stateCode,d.pcno);
        
            })



    }

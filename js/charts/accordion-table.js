function drawAccTable(data, selector){

  var stateKey = "party", districtKey = "districtData";
   
    var labels = ["district", "confirmed"];
    var sublabels = ["district", "confirmed"];


    var table = d3.select(selector).append('table')
    var thead = table.append('thead')
    var	tbody = table.append('tbody')

    // // // append the header row
		thead.append('tr')
        .selectAll('th')
        .data(labels).enter()
        .append('th')
          .text(function (column) { return column; });

    
    data.forEach(function(obj){

      var stateLevelData = []

      var stateData = obj[stateKey]
      var districtData = obj[districtKey]

      var sum = d3.sum(districtData, function(d) {
        return d.confirmed;
      })
      
      var sumDelta = d3.sum(districtData, function(d) {
        return d.delta.confirmed;
      })

      stateLevelData.push({
        "district": stateData,
        "confirmed": sum,
        "delta": sumDelta
      });


      var rowsState = tbody.selectAll('districtRow')
        .data(stateLevelData)
        .enter()
        .append('tr')
        .attr("class", "stateRow");

        var stateCells = rowsState.selectAll('td')
        .data(function (row) {
          return labels.map(function (column) {
            // console.log(column)
            return {column: column, value: row[column], delta: row["delta"]};
          });
        })
        .enter()
        .append('td')
          .html(function (d) { 
            if(d.delta > 0){
              if(d.column === "confirmed"){
                return " <span>+"+d.delta+"</span> " + d.value;
              }else{
                return d.value;
              }
              
            }else{
              return d.value;
            }
          });


        var rows = tbody.selectAll('districtRow')
          .data(districtData)
          .enter()
          .append('tr')
          .attr("class", "districtRow");
  
        // create a cell in each row for each column
        var cells = rows.selectAll('td')
          .data(function (row) {
            return labels.map(function (column) {
              return {column: column, value: row[column], delta:row['delta']};
            });
          })
          .enter()
          .append('td')
            .html(function (d) { 
              
              
              if(d.column === "confirmed"){
                if(d.delta.confirmed > 0){
                  // console.log("tabled", d);
                  return " <span>+"+d.delta.confirmed+"</span> " + d.value;
                }else{
                  return d.value;
                }
              }else{
                
                return d.value ;
              }

              // return d.value; 
            });


     


      
    })

    

    return table;

    
    
    
}



$(document).ready(function(){

  $(".districtRow").hide();

  $('.stateRow').click(function(){
            $(this).nextUntil('tr.stateRow').slideToggle(200);
            this.classList.toggle("active");
        })

});
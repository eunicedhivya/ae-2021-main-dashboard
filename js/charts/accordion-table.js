function drawAccTable(data, selector, labels){

    var table = d3.select(selector).append('table')
    var thead = table.append('thead')
    var	tbody = table.append('tbody')

    // append the header row
		thead.append('tr')
        .selectAll('th')
        .data(labels).enter()
        .append('th')
          .text(function (column) { return column; });

    partyRow = tbody.selectAll('.partyRow')
      .data(data)
      .enter()
      .append('tr')
      .attr("class", "partyRow");

      var partyCell = partyRow.selectAll('td')
          .data(function (row) {
            return labels.map(function (column) {
              // console.log(column)
              return {column: column, value: row[column]};
            });
          })
          .enter()
          .append('td')
          .html(function (d) { 
              console.log(d.column === "party")

              if(d.column === "party"){
                return d.value + "<button class='alliance-list' data-party='"+d.value.toLowerCase()+"'> + </button>";
              }else{
                return d.value;
              }
          });
    
    return table;

    
    
    
}



$(document).ready(function(){

  // $(".districtRow").hide();
  // $(".alliance-list").hide();

  $('.alliance-list').click(function(){
    var selectedparty = $(this).data();
    console.log(selectedparty['party']);
  })
  // $('.stateRow').click(function(){
  //           $(this).nextUntil('tr.stateRow').slideToggle(200);
  //           this.classList.toggle("active");
  //       })

});
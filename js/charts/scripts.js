var btn_data  = "tn", btn_Value = "Tamil Nadu";
seatShare(btn_data, 'data/seat_share.json', "#seatSharechart", "seat%")
seatShare(btn_data, 'data/vote_share.json', "#voteSharechart", "leading%")
var consName = $('#const-list').find(":selected").text();
constFilter(consName);

// State button filter
jQuery("nav button.dashfilters").click(function() {
    $('nav button').removeClass('active');
    $('#letters-listing li').removeClass('active');
    $(this).addClass('active');
    btn_data = $(this).attr("data");
    btn_Value = $(this).attr("value");
    $(".section-block header h3 span.state_name").text(btn_Value + " |")
    seatShare(btn_data, 'data/seat_share.json', "#seatSharechart", "seat%")
    seatShare(btn_data, 'data/vote_share.json', "#voteSharechart", "leading%")
    searchFilter(btn_data)
    //console.log(const_list)
    $("#owl-demo").html('Loading...');
    carouselWidget('data/data.json', "#owl-demo", btn_data, "", "", btn_Value)
    
    var mapData = 'maps/tamilnadu.json'
    if(btn_data  === "pd") {
        drawAssemblyMap("#state_map", {
            statecode: 'U07',
            vhcode: 'pd',
            mapsource: 'maps/puducherry.json',
            scale: 21500,
            center: [79.8, 11.5]
        })
    } else if(btn_data  === "kl") {
        drawAssemblyMap("#state_map", {
            statecode: 'S11',
            vhcode: 'kl',
            mapsource: 'maps/kerala.json',
            scale: 5100,
            center: [76.3, 10.8]
        })
    } else if(btn_data  === "as") {
        drawAssemblyMap("#state_map", {
            statecode: 'S03',
            vhcode: 'as',
            mapsource: 'maps/assam.json',
            scale: 3500,
            center: [92.9, 26.2]
        })
    } else if(btn_data  === "wb") {
        drawAssemblyMap("#state_map", {
            statecode: 'S25',
            vhcode: 'wb',
            mapsource: 'maps/west-bengal.json',
            scale: 4400,
            center: [87.8, 24]
          })
    } else {
        drawAssemblyMap("#state_map", {
            statecode: 'S22',
            vhcode: 'tn',
            mapsource: 'maps/tamilnadu.json',
            scale: 5100,
            center: [78.3, 10.8]
        })
    }

    createDropDowns("#const-list", const_list)
    consName = $('#const-list').find(":selected").text();
    constFilter(consName)
})

// Reset button function
jQuery(".reset-filter").click(function() {
    $('#letters-listing li').removeClass('active');
    $("#owl-demo").html('Loading...');
    carouselWidget('data/data.json', "#owl-demo", btn_data, "", "", btn_Value)
})
// Alphabetic filter
jQuery("#letters-listing li.clickable").click(function() {
    $('#letters-listing li').removeClass('active');
    $(this).addClass('active');

    find_let = $(this).text();
    $("#owl-demo").html('Loading...');
    carouselWidget('data/data.json', "#owl-demo", btn_data, find_let, "", btn_Value)
})
// Carousel initial call
carouselWidget('data/data.json', "#owl-demo", "all", "", "", btn_Value)

// Search button filter
jQuery("#searchBtn").click(function(){
    var searchTxt = jQuery(".searchField").val();
    //console.log(searchTxt)
    searchFilter(btn_data)
    $("#owl-demo").html('Loading...');
    carouselWidget('data/data.json', "#owl-demo", btn_data, "", searchTxt, btn_Value)
})
var const_list = [];
searchFilter(btn_data)
// Autocomplete function
function searchFilter(statename) {
    statename = typeof statename !== 'undefined' ? statename : 'all';
	statename_fixed = statename;
    var statn = statename+"_constituencywise"; 
    var tot_data = (function () {
        $.ajax({
        'async': false,
        'global': false, 
        'url': 'data/data.json',
        'dataType' : 'json',
        'success': function (data) {
            var dataList = data[statn]
            const_list= [];
            dataList.forEach(function(key, value) {
                const_list.push(key["Constituency"]);
            });
        }
    });
        return const_list;
    })();

    // console.log(const_list);
    
    $( "#automplete-6" ).autocomplete({
        source: const_list
    });
    

    $.ui.autocomplete.filter = function (array, term) {
        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
        return $.grep(array, function (value) {
            return matcher.test(value.label || value.value || value);
        });               
    };                
}
var test_txt = $(".ui-helper-hidden-accessible").text;
//console.log(test_txt)
$( "document" ).on('click', '#automplete-6', function() {
    //console.log(test_txt)
})

createDropDowns("#const-list", const_list)
function createDropDowns(selector, dropdowndata){

    var select = d3.select(selector)
    select.html(null);
      var options = select.selectAll('option')
            .data(dropdowndata).enter()
            .append('option')
            .attr("value", function (d) { 
                return d; 
            })
			.attr("data-id", function (d) { 
                return d; 
            })
            .text(function (d) { return d; });  

        // document.querySelector(selector).selectedIndex = "24";
    $('#const-list option')
    .filter(function() {
        return !this.value || this.value == 'NULL' || $.trim(this.value).length == 0;
    })
   .remove();
   
}

$('#const-list').on('change', function() {
    filValue = $(this).val()
    constFilter(filValue)
})

function constFilter(filter_const2) {
    var stname  = btn_data, btn_Value = "Tamil Nadu";
    var constWise = (function () {
        $.ajax({
        'async': false,
        'global': false, 
        'url': "data/data.json",
        'dataType' : 'json',
        'success': function (data) {
            var datafil = stname + "_constituencywise"
            for(var i in data[datafil]) {
                var constituencyname = data[datafil][i].Constituency;
                var leadingname = data[datafil][i]["Leading Candidate"];
                var leadingparty = data[datafil][i]["Leading Party"];
                var leadingmargin = data[datafil][i]["Margin"];
                var trailingname = data[datafil][i]["Trailing Candidate"];
                var trailingparty = data[datafil][i]["Trailing Party"];
                var trailingmargin = data[datafil][i]["Margin"];
                var resultStatus = data[datafil][i]["status"];
    
                if(filter_const2 !=  'wb-polling-day' && filter_const2 != '') { 
                    //console.log('here', data[datafil]);
                    var matchingletter = constituencyname;
                    if(matchingletter != filter_const2) {
                        continue;
                    }
                }

                $(".const-box h1 .const_name").html(constituencyname);
                $(".const-box h1 .resStatus").html(resultStatus);
                $(".const-box .candName").html(leadingname);
                $(".const-box .trailingcandName").html(trailingname);
                $(".const-box .winParty").html(leadingparty);
                $(".const-box .trailParty").html(trailingparty);
                $(".const-box .winMargin").html(leadingmargin);
                
            } 
        }
        });
        return kl_seatshare;
    })();
}

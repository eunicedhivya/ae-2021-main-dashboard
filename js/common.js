var btn_data  = "tn", btn_Value = "Tamil Nadu";
var defaultYear = '2021';
var const_list = [], const_no= [];

var partycolors_tn = {
            "AIADMK": "#006837",
            "BJP": "#006837",
            "PMK": "#006837",
            "DMK": "#b71c24",
            "VCK": "#b71c24",
            "INC": "#b71c24",
            "CPI": "#797979",
            "CPIM": "#797979",
        }

	// TMC: #006837, BJP+: #ffaa2e, Left: #b71c24, Others: 797979
	var partycolors_wb = {
		"AITC": "#006837",
		"BJP": "#ffaa2e",
		"IND": "#797979",
		"RSMP": "#797979"
	}
	// Neda: #ffaa2e, Congress: #b71c24, AJP: #00a2ab , Others: 797979
	var partycolors_as = {
		"AITC": "#006837",
		"INC": "#b71c24",
		"BPF": "#b71c24",
		"AIUDF": "#b71c24",
		"CPIM": "#b71c24",
		"BJP": "#ffaa2e",
		"AGP": "#ffaa2e",
		"UPPL": "#ffaa2e",
		"IND": "#797979"
	}
	// UDF: #006837, LDF: #b71c24, NDA: #ffaa2e , Others: 797979
var partycolors_kl = {
            "CPI": "#b71c24",
            "CPIM": "#b71c24",
            "KCM": "#b71c24",
            "NCP": "#b71c24",
            "LJD": "#b71c24",
            "KCB": "#b71c24",
            "JDS": "#b71c24",
            "BJP": "#ffaa2e",
            "INC": "#006837",
            "KCJ": "#006837",
            "RMPI": "#006837",
            "IUML": "#006837",
            "IND": "#797979",
            "KC": "#797979"
        }

	// UPA: #006837,  NDA: #ffaa2e , Others: 797979
var partycolors_pd = {
            "DMK": "#006837",
            "AINRC": "#ffaa2e",
            "BJP": "#ffaa2e",
            "IND": "#797979",
            "CS": "#797979",
        }
		
var partycolors = {
            "AIADMK": "#006837",
            "BJP": "#006837",
            "PMK": "#006837",
            "DMK": "#b71c24",
            "VCK": "#b71c24",
            "INC": "#b71c24",
            "CPI": "#797979",
            "CPIM": "#797979",
        }
//initial call
loadAllData();
candidatesCarousal();
jQuery("nav button.dashfilters").click(function() {
	$('nav button').removeClass('active');
    $('#letters-listing li').removeClass('active');
    $(this).addClass('active');
    btn_data = $(this).attr("data");
    btn_Value = $(this).attr("value");
    $(".section-block header h3 span.state_name").text(btn_Value + " |")
	$('#letters-listing li').removeClass('active');
	constFilter(1, "data/const2021data.json")
	loadAllData();
});
// Alphabetic filter
jQuery("#letters-listing li.clickable").click(function() {
    $('#letters-listing li').removeClass('active');
    $(this).addClass('active');
    find_char = $(this).text();
    $("#owl-demo").html('Loading...');
	loadConstituencyCarousal(btn_data,btn_Value,find_char,'');
});
$(".yearBtn").on("click", function(){
	$('#letters-listing li').removeClass('active');
	$('.yearBtn').removeClass('active');
    $(this).addClass('active');
    defaultYear = $(this).html();
	// console.log("defaultYear", defaultYear);
	constFilter(1, "data/const"+defaultYear+"data.json")
	loadAllData();
});
// Search button filter
jQuery("#searchBtn").click(function(){
    var searchTxt = jQuery(".searchField").val(); 
    searchFilter(btn_data);
    loadConstituencyCarousal(btn_data,btn_Value,'',searchTxt);
    if($("#conts-2016").hasClass("active")) {
        constFilter(searchTxt, "data/data.json");
    } else {
        constFilter(searchTxt, "data/data2021.json");
    }
})
function loadAllData() { 
	loadConstituencyCarousal(btn_data,btn_Value,'',''); 
	searchFilter(btn_data);
	candidatesCarousal();
	var seatsource = getYearData('seat_share');  
	var votesource = getYearData('vote_share');  
	seatShare(btn_data, seatsource, "#seatSharechart", "seat%")
	seatShare(btn_data, votesource, "#voteSharechart", "leading%")
	var partysource = getYearData('partywise_seats');  
	jQuery.ajax({
			'async': false,
			'global': false,
			'cache': false,
			'dataType': 'json',
			'url': partysource,
			'success': function(data) {
				drawParliamentaryChart(".parliamentseats", defaultYear, data[btn_data+'_conswise']);
			}
	});
	$("#partywise-table").html('Loading...');
	$("#map-table").html('Loading...');
	var tablesource = getYearData('table');
	jQuery.ajax({
			'async': false,
			'global': false,
			'dataType': 'json',
			'cache': false,
			'url': tablesource,
			'success': function(data) {
				drawAccTable(data[btn_data + "_share"], "#partywise-table", ["party", "won","leading","total"]);
				drawAccTable(data[btn_data + "_share"], "#map-table", ["party", "won","leading","total"]);
			}
	});

    var indiaDistrictData = (function() {
		var indiaDistrictData = null;
		jQuery.ajax({
			'async': false,
			'global': false,
			'dataType': 'json',
			'cache': false,
			'url': 'data/data.json',
			'success': function(data) {
				indiaDistrictData = data["tabledata"];
				constWiseData2016 = data["all_constituencywise"]
			}
		});
		return indiaDistrictData;
    })();
    
	loadMap();	
	createDropDown();
    consName = $('#const-list').find(":selected").val();
	constFilter(consName, "data/data.json");
}
function loadMap() {
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
}
function getYearData(module) {
	var yearData; 
	switch(module) {
		case 'constituency':
			switch(defaultYear) {
			  case '2016':
					yearData = "data/const2016data.json";
				break;
			  case '2021':
					yearData = "data/const2021data.json";
				break;
			} 
		break;
		case 'partywise_seats':
			switch(defaultYear) {
			  case '2016':
					yearData = "data/partywise_seats2016.json";
				break;
			  case '2021':
					yearData = "data/partywise_seats2021.json";
				break;
			}
		break;
		case 'seat_share':
			switch(defaultYear) {
			  case '2016':
					yearData = "data/seat_share2016.json";
				break;
			  case '2021':
					yearData = "data/seat_share2021.json";
				break;
			}
		break;
		case 'vote_share':
			switch(defaultYear) {
			  case '2016':
					yearData = "data/vote_share2016.json";
				break;
			  case '2021':
					yearData = "data/vote_share2021.json";
				break;
			}
		break;
		case 'table':
			switch(defaultYear) {
			  case '2016':
					yearData = "data/vote_sharetable2016.json";
				break;
			  case '2021':
					yearData = "data/vote_sharetable2021.json";
				break;
			} 
		break;
		case 'voteshare':
			switch(defaultYear) {
			  case '2016':
					yearData = "data/const2016data.json";
				break;
			  case '2021':
					yearData = "data/const2021data.json";
				break;
			} 
		break;
		case 'seatshare':
			switch(defaultYear) {
			  case '2016':
					yearData = "data/const2016data.json";
				break;
			  case '2021':
					yearData = "data/const2021data.json";
				break;
			} 
		break;
	}
	return yearData;
}
function candidatesCarousal(btn_data,btn_Value,find_char='',find_let='') {
	$("#owl-demo").html('Loading...');
	carouselWidgetKeyCandidate('data/keycandidates-2021.json', "#owl-demo", btn_data,find_char,find_let,btn_Value,'')
}
function loadConstituencyCarousal(btn_data,btn_Value,find_char='',find_let='') {
	carousalData = getYearData('constituency');
	$("#owl-demo").html('Loading...');
	carouselWidget(carousalData, "#owl-demo", btn_data,find_char,find_let,btn_Value,'')
}
// Autocomplete function
function searchFilter(statename) {
    statename = typeof statename !== 'undefined' ? statename : 'tn';
	statename_fixed = statename;
	var datasource = getYearData('constituency'); 
    var statn = statename+"_conswise"; 
   var tot_data = (function () {
        $.ajax({
        'async': false,
        'global': false, 
        'url': datasource,
		'cache': false,
        'dataType' : 'json',
        'success': function (data) { 
            var dataList = data[statn]; 
            const_list= [];
            const_no= [];
            dataList.forEach(function(key, value) {
                const_list.push(key["constituency"]);
                const_no.push(key["constNo"]);
            });
        }
    });
        return const_list;
    })();    
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
function constFilter(filter_const2, dataSource) {
    var stname  = btn_data;
    var constWise = (function () {
        $.ajax({
        'async': false,
        'global': false, 
        'url': dataSource,
        'dataType' : 'json',
		'cache': false,
        'success': function (data) {
            var datafil = stname + "_conswise"; 
            for(var i in data[datafil]) {
                var constituencyname = data[datafil][i].constituency;
                var leadingname = data[datafil][i]["leadingCandidate"];
				var leadingparty = data[datafil][i]["leadingParty"];
				var leadingmargin = data[datafil][i]["margin"];
				var trailingname = data[datafil][i]["trailingCandidate"];
				var trailingparty = data[datafil][i]["trailingParty"];
				var trailingmargin = data[datafil][i]["margin"];
                var trailingmargin = data[datafil][i]["margin"];
                var resultStatus = data[datafil][i]["status"];
                var constNo = data[datafil][i]["constNo"];
				//alert(constNo);
                if(filter_const2 !=  'wb-polling-day' && filter_const2 != '') { 
                    //console.log('here', data[datafil]);
                    var matchingletter = constNo; //console.log('Element letter:'+constNo+'  Filter letter:'+filter_const2);
                    if(matchingletter != filter_const2) {
                        continue;
                    }
                }
				d3.selectAll('.state').classed("focused", false);
				d3.selectAll(".state").filter(function() { 
					if(d3.select(this).attr("data-constcode") == constNo) { //alert("CONST"+constNo);
						d3.select(this).classed("focused", true);
					}
				});
                $(".const-box h1 .const_name").html(constituencyname);
				if(resultStatus == 'Result Declared') {
					$(".const-box h1 .resStatus").removeClass('leading');
					$(".const-box h1 .resStatus").addClass('declared');
					$(".const-box .winningCand .ct").html('winningCandidate');
					$(".const-box .winningCand .ctm").html('margin');
				} else {
					$(".const-box h1 .resStatus").addClass('leading');
					$(".const-box h1 .resStatus").removeClass('declared');
					$(".const-box .winParty").html(leadingparty);
					$(".const-box .winningCand .ct").html('leadingCandidateCandidate');
					$(".const-box .winningCand .ctm").html('marign');
					resultStatus =  'Counting';
				}
                $(".const-box h1 .resStatus").html(resultStatus);
                $(".const-box .candName").html(leadingname);
                $(".const-box .trailingcandName").html(trailingname);
                $(".const-box .winParty").html(leadingparty);
                $(".const-box .trailParty").html(trailingparty);
                $(".const-box .winMargin").html(parseInt(leadingmargin).toLocaleString('en-IN'));
            } 
        }
        });
       
    })();
}

// Default selection of TN on load
constFilter(1, "data/const2021data.json")

function createDropDown() {
    var stname  = btn_data;
    var  const_list1= [], const_no1= [];
    var datafil = stname + "_conswise"
    var dataList;
	var datasource = getYearData('constituency'); 
    var tot_data = (function () {
        $.ajax({
        'async': false,
        'global': false, 
        'url': datasource,
        'dataType' : 'json',
		'cache': false,
        'success': function (data) {
            dataList = data[datafil]
            const_list1= [];
            const_no1= [];
            dataList.forEach(function(key, value) {
                const_list1.push(key["constituency"]);
                const_no1.push(key["constNo"]);
            });
        }
    });
        return const_list1, const_no1;
    })();
    var select = d3.select("#const-list")
    select.html(null);
        var options = select.selectAll('option')
        .data(dataList).enter()
        .append('option')
        .attr("value", function (d) { 
            return d.constNo; 
        })
        .attr("data-id", function (d) { 
            return d.constNo; 
        })
        .text(function (d) { return d.constituency; });  
}
$('#const-list').on('change', function() {
	var datasource = getYearData('constituency'); 
    filValue = $(this).val();
	constFilter(filValue, datasource);
})
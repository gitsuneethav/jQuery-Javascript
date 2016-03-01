<div id="reportbyDeptPieDiv"></div>
<div id="reportbyDeptBarDiv"></div>

<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script type='text/javascript'>
var listName = "Support Requests";
var webUrl = "https://sbxcollaborate.gilead.com/corp/DSPH/EPI";
var depts = new Array();
var deptCount = new Array();
var altDept = [];
var altDeptCnt = [];
_spBodyOnLoadFunctionNames.push("getItems");


function getItems() {
    jQuery.ajax({
        url: webUrl + "/_api/lists/GetByTitle('Support Requests')/Items",
        headers: { "accept": "application/json;odata=verbose" },
        success: displayItems,
        error: handleException
    });
}
function handleException(err){
    alert("error occurred" + err);
}
function displayItems(data){	
    var results = data.d.results;
    var actualCnt = 0;
    for(var i=0; i<results.length; i++)
    {
    	var currDept = results[i].Department_x0020_of_x0020_Reques;
    	if(depts.indexOf(currDept) < 0)
    	{
    		depts[actualCnt] = currDept;
    		deptCount[actualCnt] = 1;
    		actualCnt++;
    		altDept.push(currDept);
    		altDeptCnt.push(1);
    	}
    	else
    	{    		
    		var index = depts.indexOf(currDept);
    		var cnt = deptCount[index];
    		cnt++;
    		deptCount[index] = cnt;
    		altDeptCnt[index] = cnt;
    	}
    } 
    
    $('#reportbyDeptPieDiv').highcharts({
        chart: {
            type: 'pie',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
        },
        title: {
            text: 'Requests by Department'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        xAxis: {
        	categories: altDept
        },            
        yAxis: {                
        	title: {                    
        		text: 'Total Number of Requests'                
        	},                
        	plotLines: [{                    
        		value: 0,                    
        		width: 1,                    
        		color: '#808080'                
        	}]            
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{series.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        legend: {                
        	layout: 'vertical',                
        	align: 'right',                
        	verticalAlign: 'top',                
        	x: -10,                
        	y: 100,                
        	borderWidth: 0            
        },
        series: [{
            name: 'Number of Requests',
            colorByPoint: true,
            data: altDeptCnt
        }]
    });
    
       $('#reportbyDeptBarDiv').highcharts({
        chart: {
            type: 'bar',
        },
        title: {
            text: 'Requests by Department'
        },
        xAxis: {
        	categories: altDept
        },            
        yAxis: {   
        	min: 0,             
        	title: {                    
        		text: 'Total Number of Requests'                
        	}
        },
        legend: {                
        	reversed: true            
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'Number of Requests',
            data: altDeptCnt
        }]
    });

}
</script>

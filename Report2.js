<div id="piechart" style="width: 900px; height: 500px;"></div>

<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script type="text/javascript">
var listName = "Support Requests";
var webUrl = "https://sbxcollaborate.gilead.com/corp/DSPH/EPI";
var depts = new Array();
var deptCount = new Array();
var altDept = new Array();
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
    altDept[actualCnt] = ["Dept","No of Requests"];
    for(var i=0; i<results.length; i++)
    {
    	var currDept = results[i].Department_x0020_of_x0020_Reques;
    	if(depts.indexOf(currDept) < 0)
    	{
    		depts[actualCnt] = currDept;
    		deptCount[actualCnt] = 1;
    		actualCnt++;
    		altDept[actualCnt] = [currDept, 1];    		
    	}
    	else
    	{    		
    		var index = depts.indexOf(currDept);
    		var cnt = deptCount[index];
    		cnt++;    		
    		altDept[index + 1][1] = cnt;
    	}    	
    }     
    google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);	
}

function drawChart() {
		/*var data = google.visualization.arrayToDataTable([
	          ['Task', 'Hours per Day'],
	          ['Work',     11],
	          ['Eat',      2],
	          ['Commute',  2],
	          ['Watch TV', 2],
	          ['Sleep',    7]
	        ]);*/

	    var data = google.visualization.arrayToDataTable(altDept);

		var options = {
	          title: 'Requests by Department'
	        };
	
		var chart = new google.visualization.PieChart(document.getElementById('piechart'));
		chart.draw(data, options);
	}
</script>
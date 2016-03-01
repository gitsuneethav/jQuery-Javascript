<table>
	<tr><td>
		<input type="button" value="Refresh Coding/SAE Studies" id="btnRefresh" onclick="GetUpdate()" />
	</td><td style="padding-left:100px;">
		<a href="../Pages/Reconciliation.aspx">View All Reconciliation Tasks</a>
	</td><td style="padding-left:20px;">
		<a href="../Lists/Recon%20Tasks/General.aspx#InplviewHash7b7a9a56-79e0-423b-b369-2afd66fb631d=ShowInGrid%3DTrue">Assign Studies</a>
	</td></tr>
</table>

<script src='/SiteAssets/date.format.js' type='text/javascript'></script>
<script type='text/javascript'>

var listName = "Recon Tasks";
var webUrl = "https://collaborate.gilead.com/devops/DSPH/Projects/Demo";
var arrayList = new Array();
var existDict = new Array();
var tempIdArray = {};
var cnt = 0;

function GetUpdate()
{
	ExecuteOrDelayUntilScriptLoaded(getItems, "sp.js");	
}
function getItems() {
	$("#btnRefresh").prop('disabled', true);
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var date = date.getDate() - 1;
	var newDate = year + "-" + month + "-" + date + "T00:00:00";
    jQuery.ajax({
        url: "https://collaborate.gilead.com/devops/biometrics/DataManagement/_api/lists/GetByTitle('Coding/SAE')/Items?$filter=(Modified ge datetime'"+newDate+"') and (Purpose eq 'SAE Reconciliation')&$orderby=Modified desc&$select=*,DSPH_x0020_Lead/Name,DSPH_x0020_Lead/Id,DSPH_x0020_Lead/FirstName,DSPH_x0020_Lead/LastName,Editor/Id,Editor/Name&$expand=DSPH_x0020_Lead/Id,Editor/Id",
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
    arrayList = new Array(results.length);
    alert("Please wait...");    
    for(var i=0; i<results.length; i++)
    {
    	var dsphLead, origModified;
    	if(results[i].DSPH_x0020_Lead.Id != undefined)
    		dsphLead = results[i].DSPH_x0020_Lead.Id + ";#" + results[i].DSPH_x0020_Lead.Name;
    	origModified = results[i].Editor.Id + ";#" + results[i].Editor.Name;
    	arrayList[i] = new Array(results[i].ID, results[i].Comments, results[i].Transfer_x0020_Date, results[i].Deadline_x0020_Date, dsphLead, results[i].Study_x0020_No, results[i].Priority, origModified, results[i].Modified);
    	
    	tempIdArray[results[i].ID] = new Array(results[i].ID, results[i].Comments, results[i].Transfer_x0020_Date, results[i].Deadline_x0020_Date, dsphLead, results[i].Study_x0020_No, results[i].Priority, origModified, results[i].Modified);
    	jQuery.ajax({
	        url: "https://collaborate.gilead.com/devops/DSPH/Projects/Demo/_api/lists/GetByTitle('Recon%20Tasks')/Items?$filter=OrigID eq '"+results[i].ID+"'",
	        headers: { "accept": "application/json;odata=verbose" },
	        async: false,
	        success: function(filterObj){	        
	        	if(filterObj.d.results.length > 0)
	        	{
	        		AddtoDict(filterObj.d.results[0]);
	        	}
	        },
	        error: handleException
	    });    	
    }            
    AddtoReconTasks(arrayList);    
}
function AddtoDict(listItem)
{
	existDict["dest" + listItem.OrigID] = new Array(listItem.ID, listItem.Title, listItem.Transfer_x0020_Date, listItem.Deadline_x0020_Date, listItem.DSPH_x0020_Lead, listItem.Study_x0020_No, listItem.Priority);
}
function AddtoReconTasks(arrayList)
{
	var clientContext = SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle('Recon Tasks');
    
	for(var j = 0; j< arrayList.length; j++)
	{		
		var key = "dest" + arrayList[j][0];
		if(existDict[key] == undefined){
			var itemCreateInfo = new SP.ListItemCreationInformation();
		    this.oListItem = oList.addItem(itemCreateInfo);

		    oListItem.set_item('OrigID', arrayList[j][0]);		    
		    oListItem.set_item('Title', arrayList[j][1]);
		    oListItem.set_item('Transfer_x0020_Date', arrayList[j][2]);
		    oListItem.set_item('Deadline_x0020_Date', arrayList[j][3]);
		    if(!(arrayList[j][4] == undefined || arrayList[j][4] == null)){
			    oListItem.set_item('DSPH_x0020_Lead', arrayList[j][4]);
		    }
		    oListItem.set_item('Study_x0020_No', arrayList[j][5]);
		    oListItem.set_item('Priority', arrayList[j][6]);
		    oListItem.set_item('OrigModified', arrayList[j][7]);
		    oListItem.set_item('LastModified', arrayList[j][8]);
		    
		    oListItem.update();	
		    clientContext.load(oListItem);
	    }	
	    else{	 
	       	var isChanged = false;
	       	var changedField = "";
			if(!(existDict[key][1] == arrayList[j][1]))
			{
				changedField = "Comments";				
			} 	
			if(!(existDict[key][2] == arrayList[j][2]))
			{
				changedField = changedField + ", Transfer Date";
			}
			if(!(existDict[key][3] == arrayList[j][3]))
			{
				changedField = changedField + ", Deadline Date";
			}
			if(changedField.length > 0) isChanged = true;
	    	if(isChanged)
	    	{
	    		var itemType = "SP.Data.Recon_x0020_TasksListItem";
			    var item = {
			        "__metadata": { "type": itemType },
			        "Title": arrayList[j][1],
			        "Transfer_x0020_Date" : arrayList[j][2],
			        "Deadline_x0020_Date" : arrayList[j][3],
			        "ChangedField" : changedField,
			        "Study_x0020_No" : arrayList[j][5]
			    };
	    		jQuery.ajax({
			        url: "https://collaborate.gilead.com/devops/DSPH/Projects/Demo/_api/lists/GetByTitle('Recon%20Tasks')/Items('"+existDict[key][0]+"')",
			        type: "POST",
			        contentType: "application/json;odata=verbose",
			        data: JSON.stringify(item),
			        headers: {
			            "Accept": "application/json;odata=verbose",
			            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
			            "IF-MATCH": "*",
    					"X-Http-Method": "PATCH"
			        },
			        success: function (data2) {
			            alert("Updated");
			        },
			        error: function (jqXHR, textStatus, errorThrown) {
			            alert("Error");
			        }
			    });

	    	}
	    }    
	}
    
    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQueryAddSucceeded), Function.createDelegate(this, this.onQueryAddFailed));    
}

function onQueryAddSucceeded() {

    //alert('Rows Created: ' + oListItem.get_id() + ', Updated Recon Tasks');    
    alert("The studies were refreshed");
}

function onQueryAddFailed(sender, args) {
    //alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace()); 
    alert("The studies were refreshed");
}
</script>

<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min.js"></script>   
<script>   
    function RequestsCtrl($scope) {   
   
        $scope.request = { TA: "", Dept: "", Type: "" };   
        $scope.addRequest = function ($event) {   
            var x = $scope.request;   
            $event.preventDefault();   
   
            var clientContext = new SP.ClientContext.get_current();   
            var web = clientContext.get_web();   
            var list = web.get_lists().getByTitle('Support Requests');   
   
            // create the ListItemInformational object   
            var listItemInfo = new SP.ListItemCreationInformation();   
            // add the item to the list   
            var listItem = list.addItem(listItemInfo);   
            // Assign Values for fields   
            listItem.set_item('TA', x.TA);   
            listItem.set_item('Department_x0020_of_x0020_Reques', x.Dept);   
            listItem.set_item('Type_x0020_of_x0020_Request', x.Type);   
   
            listItem.update();   
   
            clientContext.executeQueryAsync(   
                Function.createDelegate(this, onQuerySucceeded),   
                Function.createDelegate(this, onQueryFailed)   
            );   
   
        };   
   
        onQuerySucceeded = function () {   
            alert('Successfully updated the request');   
        }   
   
        onQueryFailed = function (sender, args) {   
            alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());   
        }   
    }   
</script>   
   
   
<h1>Contact Information:</h1>   
<br />   
<div ng-app="">   
    <div ng-controller="RequestsCtrl">   
        <strong>Therapeutic Area</strong>   
        <input type="text" ng-model="request.TA" /><br />   
        <br />   
        <strong>Department of Requestor</strong>    
        <input type="text" ng-model="request.Dept" /><br />   
        <br />   
        <strong>Type of Request</strong> <input type="text" ng-model="request.Type" /><br />   
        <br />   
        <input type="submit" value="Submit" ng-click="addRequest($event)" />   
    </div>   
</div> 
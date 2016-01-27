/*******************************************************************
 File:          siebelhub.js
 Author(s):     alex@siebelhub.com
 Date:          Dec 2015
 Description:   Educational/Phenomenal/Inspirational/Comprehensive (EPIC) JavaScript library for Siebel Open UI.
 GitHub:        https://github.com/siebelhub/siebelhub.js

 See individual functions for details.
 For localization options, scroll down.

 Installation:  Copy this file to siebel/custom folder and register in the Manifest using Application/Common
                Copy content of siebelhub.css to a custom style or register it as new custom style sheet
                Import BS_Siebel_Hub_Service.sif and compile
                Add Siebel Hub Service to your application(s) using ClientBusinessServiceN user prop and compile

 for(i=should,i=understand,i=read)
 {
    FOR EDUCATIONAL PURPOSES ONLY!!!
    DO NOT USE IN PRODUCTION!!!
 }

 History:

 13-DEC-2015    v0.1    ahansal     File created, first draft
 13-DEC-2015    v0.2    ahansal     added MakeAppletCollapsible method
 13-DEC-2015    v0.3    ahansal     added AlignViewToTop method
 14-DEC-2015    v0.4    ahansal     added ValidateContext to support applet, PM or PR as context
 14-DEC-2015    v0.5    ahansal     enhanced ErrorHandler with more cowbell
 15-DEC-2015    v0.5    ahansal     published on GitHub
 17-DEC-2015    v0.6    ahansal     added GetRecordSet method
 18-DEC-2015    v0.7    ahansal     added GetAppletType method
 20-DEC-2015    v0.8    ahansal     added postload event listner (as demo)
 20-DEC-2015    v0.8    ahansal     optimized MakeAppletCollapsible method to accept "ALL" keyword
 20-DEC-2015    v0.9    ahansal     added GetFieldValue method, optimized GetRecordSet
 20-DEC-2015    v1.0    ahansal     added GetAppletsByBCName method
 20-DEC-2015    v1.0    ahansal     added GenerateDOMElement method, used in ErrorHandler
 20-DEC-2015    v1.1    ahansal     feeling stable, added lots of comments and revisited some functions
 21-DEC-2015    v1.1    ahansal     minor updates
 22-DEC-2015    v1.1    ahansal     added GetActivePR method
 24-DEC-2015    v1.2    ahansal     added DataRetriever method (requires Siebel Hub Service BS)
 26-DEC-2015    v1.3    ahansal     added 'Tramp Stamp' and SelfDiagnostics
 27-DEC-2015    v1.3    ahansal     several fixes, mostly cosmetic
 27-DEC-2015    v1.4    ahansal     verified use cases, enhanced installation notes
 29-DEC-2015    v1.4    ahansal     added GetAppletElem and GetLabelElem methods
 01-JAN-2016    v1.5    ahansal     added SIEBEL_BUILD exploit ;-); enhanced timer for DataRetriever
 01-JAN-2016    v1.5    ahansal     enhanced DataRetriever with output option and added ps2json method
 02-JAN-2016    v1.5    ahansal     found a better way to get version number
 03-JAN-2016    v1.5    ahansal     added Manifesto
 04-JAN-2016    v1.6    ahansal     enhanced ps2json method (recursive call, arbitrary PS support)
 05-JAN-2016    v1.6    ahansal     added MakeAppletResizable, GetUserPref, SetUserPref methods
 06-JAN-2016    v1.6    ahansal     minor updates and comments
 08-JAN-2016    v1.7    ahansal     Added GetFullRecordSet method and enhanced DataRetriever
 09-JAN-2016    v1.7    ahansal     Continued work on GetFullRecordSet
 10-JAN-2016    v1.7    ahansal     GetFullRecordset, Server-side BS improved, enough for educational code
 12-JAN-2016    v1.7    ahansal     fixed issues with view mode in GetFullRecordSet
 14-JAN-2016    v1.8    jburgers    added swemessage_<lang> override function

 TODO:
 optimize siebelhub.js for list applets
 check for PW compatibility
 use cases in GitHub Wiki (started)
 document on Siebel Hub (started)
 ebook documentation (wip)
 cross browser testing (currently testing on FF and Chrome)
 Get number of populated/empty controls/cells for an applet (use case: progress bar)
 enable drag and drop in list programmatically (like collapsible)
 conditional formatting
 GetRecordCount function (same as GetFullRecordSet)
 GetAppletObjByName
 SiebelHub PM for list applets (to get and update PM propset in Setup)

The siebelhub.js Manifesto

siebelhub.js is an educational, phenomenal, inspirational, comprehensive (epic) JavaScript library for Siebel Open UI.
Its main purpose is to serve as an example how to create a custom Siebel Open UI library of utility functions.
siebelhub.js provides wrapper functions that allow Siebel Open UI developers to focus on implementing functionality rather than solving common problems.
For example, instead of spending valuable productive time to figure out how to securely access the label/header for any given Applet Control or List Column,
developers can use the siebelhub.GetLabelElem function. Another goal of siebelhub.js is to provide examples how to use generic code in Siebel Open UI.
This means that the code should work in any 'context', be it called from a Presentation Model, Physical Renderer,
Plug-in Wrapper, Event Listener or any other Open UI code file.
Finally, code in siebelhub.js supports the principle of language independency by providing a simplistic way of keeping
translatable strings separate from the code.

siebelhub.js is open source and is provided 'as-is' without any liability or support. Being a purely educational exercise,
no parts of siebelhub.js are intended for use in production systems (however, we do hope it inspires you to write your own library).
The Siebel community is hereby invited to contribute, comment and improve the library on GitHub.
 *******************************************************************/

siebelhub = function(){ //not sure if we ever need this
    return true;
};

/*
 Function SetControlValue: Sets the value of an applet control
 Inputs: context (applet object, PM or PR), control object, new value
 */
siebelhub.SetControlValue = function (context,control,value){
    try{
        //get the PM
        var pm = siebelhub.ValidateContext(context);
        if (pm){
            //check for valid control object
            if (typeof(control.GetInputName) !== "function"){
                throw(shMsg["NOCTRL_1"]);
            }

            //now call PM events...
            pm.OnControlEvent(consts.get("PHYEVENT_CONTROL_FOCUS"), control);
            pm.OnControlEvent(consts.get("PHYEVENT_CONTROL_BLUR"), control, value.toString());
        }
    }
    catch(e){
        siebelhub.ErrorHandler(e.toString() + " siebelhub.js:SetControlValue");
    }
};

/*
 Function GetControlValue: Gets the current value of an applet control
 Inputs: context (Applet, PM or PR), control object
 Returns: current value
 */
siebelhub.GetControlValue = function (context,control){
    var value = null;
    //get the PM
    var pm = siebelhub.ValidateContext(context);
    if (pm){
        //now get the field value
        value = pm.ExecuteMethod("GetFieldValue", control);
    }
    return value;
};

/*
 Function GetFieldValue: Gets a BC field value from the context record set
 Inputs: BC.Field or Field as string, context optional (uses BC or active PM if context is not provided)
 Returns: current control value
 */
siebelhub.GetFieldValue = function (field, context){
    var bcname = null;
    var pm = null;
    var value = null;
    var field = field;
    //check for dot notation in field argument
    //if a dot is present, split into BC and field name
    //yes, this is risky since there are BCs and Fields that have a dot in the name
    //TODO: we have to figure this out in a future version
    //maybe replace the dot with another character would be easiest (but the dot is so cool :-(
    var tmp = field.split(".");
    if (tmp[1]){
        field = tmp[1];
        bcname = tmp[0];
    }
    //get the PM
    if (context){
        pm = siebelhub.ValidateContext(context);
    }
    else if (bcname){ //if a BC was provided...
        //try to find applets that use the BC
        var applets = siebelhub.GetAppletsByBCName(bcname);
        if (applets){ //if there is at least one
            //get the first applet's PM
            pm = siebelhub.ValidateContext(applets[0]);
        }
        else{ //no applet uses the BC, get the active PM anyway
            pm = siebelhub.GetActivePM();
        }
    }
    else{
        //no context provided, get the active PM
        pm = siebelhub.GetActivePM();
    }

    //verify input BC name against applet BC
    if (bcname && bcname != pm.Get("GetBusComp").GetName()){
        //applet does not use BC; this is an error...
        siebelhub.ErrorHandler(shMsg["NOBC_1"] + "siebelhub.js:GetFieldValue");
        return null;
    }
    //we should be safe now, let's get the record set
    var recordset = siebelhub.GetRecordSet(true,pm);
    //get the index of the selected/active record
    var index = pm.Get("GetSelection");
    //get the field value
    value = recordset[index][field];
    return value;
};

/*
 Function GetAppletsByBCName: Gets an array of applets that use the BC (in current view)
 Inputs: Name of BC as string
 Returns: array of applets found or null
 */
siebelhub.GetAppletsByBCName = function (bcname){
    //applet map is an array of all applets in current view
    var appletmap = SiebelApp.S_App.GetActiveView().GetAppletMap();
    var applets = [];
    for (applet in appletmap){
        //all applets that use the BC go into the output array
        if (appletmap[applet].GetBusComp().GetName() == bcname){
            applets.push(appletmap[applet]);
        }
    }
    if (applets.length == 0){
        return null;
    }
    else{
        return applets;
    }
};

/*
 Function GetActivePM: Gets the PM of the active applet
 Inputs: nothing
 Returns: PM instance of active applet
 */
siebelhub.GetActivePM = function(){
    var activeApplet = siebelhub.GetActiveApplet();
    var activePM = activeApplet.GetPModel();
    return activePM;
};

/*
 Function GetActivePR: Gets the PR of the active applet
 Inputs: nothing
 Returns: PR instance of active applet
 */
siebelhub.GetActivePR = function(){
    var activeApplet = siebelhub.GetActiveApplet();
    var activePR = activeApplet.GetPModel().GetRenderer();
    return activePR;
};

/*
 Function GetActiveApplet: Gets the active applet
 Inputs: nothing
 Returns: active applet object instance
 */
siebelhub.GetActiveApplet = function(){
    var activeView = SiebelApp.S_App.GetActiveView();
    var activeApplet = activeView.GetActiveApplet();
    return activeApplet;
};

/*
 Function GetLabelElem: Gets a DOM element for a label/column header
 Inputs: applet object, PM or PR and control object
 Returns: label/column header DOM element
 */
siebelhub.GetLabelElem = function(context,control){
    //get the PM
    var pm = siebelhub.ValidateContext(context);
    var labelElem = null;
    var appletType = null;
    if(pm){
        appletType = siebelhub.GetAppletType(pm);
        switch (appletType){
            case shMsg["TYPE_LIST"]:
                //in list applets, we can find the column header using th, placeholder and field name
                var appletPH = pm.Get("GetPlaceholder");
                var fieldName = control.GetFieldName();
                labelElem = $("th#" + appletPH + "_" + fieldName);
                break;
            case shMsg["TYPE_FORM"]:
                //in form applets, we can use the GetInputName method
                //this is backward compatible with IP 2013 or earlier
                var controlElem = $("[name='"+ control.GetInputName() + "']");
                //the id of the label element is 'hidden' in the control input element
                var labelId = controlElem.attr("aria-labelledby");
                labelElem = $("span#" + labelId);
                break;
            default: break;
        }
    }
    return labelElem;
};


/*
 Function GetAppletElem: Gets a DOM element for an applet
 Inputs: applet object, PM or PR
 Returns: applet DOM element
 */
siebelhub.GetAppletElem = function(context){
    //get the PM
    var pm = siebelhub.ValidateContext(context);
    var appletElem = null;
    if(pm){
        var appletElemId = pm.Get("GetFullId");
        //we better use some constants, one never knows...
        appletElem = $("#" + shMsg["AP_PREFIX"] +  appletElemId + shMsg["AP_POSTFIX"]);
    }
    return appletElem;
};

/*
 Function GetControlElemByLabel: Gets a control DOM element using the label text
 Inputs: applet object, PM or PR, label text
 Returns: control DOM element
 */
siebelhub.GetControlElemByLabel = function(context,label){
    //get the PM
    var pm = siebelhub.ValidateContext(context);
    var controlElem = null;
    if (pm){
        //get the DOM element of the applet
        var appletElem = siebelhub.GetAppletElem(pm);
        //find the control within the applet
        controlElem = $(appletElem).find("[aria-label='" + label + "']");
    }
    return controlElem;
};

/*
 Function GetControlObjByLabel: Gets a control object using the label text
 Inputs: applet object, PM or PR, label text
 Returns: control object instance
 */
siebelhub.GetControlObjByLabel = function(context,label){
    //get the PM
    var pm = siebelhub.ValidateContext(context);
    var controlObj = null;
    if (pm){
        //get control element
        var controlElem = siebelhub.GetControlElemByLabel(pm,label);
        //get the label name
        var labelName = controlElem.attr("aria-labelledby");
        //first part of label is (hopefully) the control name
        var controlName = labelName.split("_")[0];
        //now we can get the control by name
        controlObj = pm.Get("GetControls")[controlName];
    }
    return controlObj;
};

/*
 Function DataRetriever: Calls the Siebel Hub Service (server eScript BS) to run any query on any BO/BC
 Inputs: BO, BC, Search Expression, Sort Spec, Field list as object (see use case below)
 Returns: Property set with records returned
 */
//use case 1: Get some info on the active applet from the repository
// var fields = {"Name":"","Business Component":"","Comments":""};
// siebelhub.DataRetriever("Repository Applet","Repository Applet","[Name]='" + siebelhub.GetActiveApplet().GetName() + "'","",fields,{"output":"JSON"});
// use case 2: Get info about a BC field
// siebelhub.DataRetriever("Repository Details","Repository Field","[Name]='First Name' AND [Parent Name]='Contact'","",{"Join":"","Column":"","Comments":""})
// use case 3: Run full query on Opportunities (no search spec);
// siebelhub.DataRetriever("Opportunity","Opportunity","","",{"Name":""},{"output":"json"});

siebelhub.DataRetriever = function(busobj,buscomp,searchspec,sortspec,fields,options){
    //Timer
    //View Modes: SalesRepView,ManagerView,PersonalView,AllView,OrganizationView,GroupView,CatalogView,SubOrganizationView
    var ts_start;
    var ts_end;
    var log = true;
    var viewmode;
    var pbc;
    var rowid;
    var output = null;
    //check for options
    if (options){
        output = options.output ? options.output.toLowerCase() : "";
        if (output != "json" && output != "propset"){
            output = "propset";
        }
        log = options.log ? options.log : true;
        viewmode = options.viewmode ? options.viewmode : "";
        pbc = options.pbc ? options.pbc : "";
        rowid = options.rowid ? options.rowid : "";
    }
    var resultset = null;
    //first, get the service instance
    // of course you need to import the Siebel Hub Service (from sif),
    // register (ClientBusinessServiceN applet user prop ya know)
    // and compile (BS and Application) first
    var service = SiebelApp.S_App.GetService("Siebel Hub Service");
    //some property sets
    var iPS = SiebelApp.S_App.NewPropertySet();
    var oPS;
    var fPS = SiebelApp.S_App.NewPropertySet();
    //prepare input PS
    iPS.SetProperty("Business Object", busobj);
    iPS.SetProperty("Business Component", buscomp);
    iPS.SetProperty("Search Specification", searchspec);
    iPS.SetProperty("Sort Specification", sortspec);
    iPS.SetProperty("View Mode", viewmode);
    iPS.SetProperty("Primary Business Component", pbc);
    iPS.SetProperty("Primary Row Id", rowid);
    //field list must be passed as child PS
    for (field in fields){
       fPS.SetProperty(field,"");
    }
    iPS.AddChild(fPS);
    //invoke the service method, this executes a query, so watch your search and sort specs!
    ts_start = Date.now();
    oPS = service.InvokeMethod("GetData", iPS);
    ts_end = Date.now();
    //hooray, we've got data:
    resultset = oPS.GetChildByType("ResultSet");
    var temp = resultset.Clone();
    var te = ts_end - ts_start;
    if (resultset){
        resultset.SetProperty("Time Elapsed",te);
        switch (output){
            case "json" : resultset = siebelhub.ps2json({},resultset);
                break;
            default: break;
        }
    }
    if (log){
        console.log(shMsg["DR_LOG_HDR"]);
        console.log(shMsg["DR_LOG_BO"] + temp.GetProperty("Business Object"));
        console.log(shMsg["DR_LOG_BC"] + temp.GetProperty("Business Component"));
        console.log(shMsg["DR_LOG_SRCH"] + temp.GetProperty("Search Specification"));
        console.log(shMsg["DR_LOG_SORT"] + temp.GetProperty("Sort Specification"));
        console.log(shMsg["DR_VIEW_MODE"] + viewmodes[parseInt(temp.GetProperty("View Mode"))]);
        console.log(shMsg["DR_LOG_TIME"] + parseInt(te) + shMsg["DIAG_DR_2"]);
        console.log(shMsg["DR_LOG_COUNT"] + temp.GetProperty("Record Count"));
    }
    return resultset;
};
/*Function GetFullRecordSet: retrieves complete record set for an applet/BC
  Record set will be based on current search and sort spec. Field list is the same as of
  raw record set.
  Input: context (optional), ie PM, PR  or Applet instance
  Output: record set as array of objects (similar to GetRecordSet)
 */
siebelhub.GetFullRecordSet = function(context){
    var bc;
    var bcName;
    var pbc; //primary BC
    var rowid; //primary ROW_ID
    var applet = null;
    var rs = new Array();
    var i = 0;
    var boName = SiebelApp.S_App.GetActiveBusObj().GetName();
    var temp = siebelhub.DataRetriever("Repository Business Object","Repository Business Object","[Name] LIKE '" + boName + "'","Id",{"Primary Business Component":""},{"output":"json","viewmode":"3"});
    pbc = temp["childArray"]["Repository Business Object_1"]["Primary Business Component"];
    if (context){
        var pm = siebelhub.ValidateContext(context);
    }
    if (pm){
        var appletName = pm.GetObjName();
        var activeView = SiebelApp.S_App.GetActiveView();
        var appletmap = activeView.GetAppletMap();
        for (a in appletmap){
            if (a == appletName){
                applet = appletmap[a];
            }
        }
    }
    else{
        applet = siebelhub.GetActiveApplet();
    }

    var bc = applet.GetBusComp();
    var bcName = bc.GetName();
    var searchspec = bc.GetSearchSpec() ? bc.GetSearchSpec() : "";
    var sortspec = bc.GetSortSpec() ? bc.GetSortSpec() : "";
    var rs_temp = siebelhub.GetRecordSet(true)[0];
    var fields = {};
    var result = null;
    for (field in rs_temp){
        fields[field] = "";
    }
    if (bcName != pbc){  //query on child BC using active BO
        boName = "";
        rowid = siebelhub.GetFieldValue("Id",siebelhub.GetAppletsByBCName(pbc)[0]);
    }
    result = siebelhub.DataRetriever(boName,bcName,searchspec,sortspec,fields,{"output":"json","log": true,"pbc":pbc,"rowid":rowid});
    for (record in result.childArray){
            if (record != "childArray"){
            rs[i] = result.childArray[record];
            i++;
            }
    }
    return rs;
};

/*
Function ps2json: converts a property set to a JSON object
Input: json object (e.g. {}), property set, counter (optional)
Output: json object
 */
siebelhub.ps2json = function(json,ps,counter){
    var json = json;
    var data = {};  //temp data set
    var key; //property name
    var val; //property value
    var type; //propset type

    var c = 0; //counter is needed when type of input ps is not set
    if (counter){
        c = counter;
    }
    //take care of the parent PS
    //iterate through properties
    type = ps.GetType() ? ps.GetType() : c;
    key = ps.GetFirstProperty();
    do{
         data[key] = ps.GetProperty(key);
    }while(key = ps.GetNextProperty());
    json[type] = data;
    json[type]["value"] = ps.GetValue();
    //take care of children
    //create childArray object if it doesn't already exist
    if (!json["childArray"]){
        json["childArray"] = {};
    }
    //iterate through child array and populate object
    for (var i = 0; i < ps.GetChildCount(); i++){
        var child = ps.GetChild(i);
        //recursive call for each child
        siebelhub.ps2json(json["childArray"],child,i+1);
    }
    //all done (hopefully)
    return json;
};
/*
 Function MakeAppletCollapsible: overrides the defaultAppletDisplayMode property
 and enables Siebel OOB collapsibility
 Inputs: applet object, PM or PR. optional mode ("expanded" or "collapsed")
 Special treat: input "ALL" calls self for each applet in active view
 Kudos: Jan Peterson
 */
siebelhub.MakeAppletCollapsible = function(context,mode){
    switch (context.toString().toLowerCase()){
        //magic keyword has been passed instead of context...
        case "all":
            //call self for all applets in view
            var activeView = SiebelApp.S_App.GetActiveView();
            var appletmap = activeView.GetAppletMap();
            for (applet in appletmap){
                siebelhub.MakeAppletCollapsible(appletmap[applet],mode);
            }
            break;
        default:
            //get the PM
            var pm = siebelhub.ValidateContext(context);
            if (pm){
                //check if PM property is not already set
                if (!pm.Get("defaultAppletDisplayMode")) {
                    //set property
                    if (mode == "expanded" || mode == "collapsed"){
                        pm.SetProperty("defaultAppletDisplayMode",mode);
                    }
                    else{ //default to "expanded"
                        pm.SetProperty("defaultAppletDisplayMode","expanded");
                    }
                    //get the PR
                    var pr = pm.GetRenderer();
                    //check and execute ShowCollapseExpand to trigger immediate display
                    if (pr && typeof(pr.ShowCollapseExpand) === 'function'){
                        pr.ShowCollapseExpand();
                    }
                }
            }
            break;
    }
};
/*
 Function MakeAppletResizable: applies the jQuery resizable method to an applet
 Inputs: applet object, PM or PR, optional true or false to resize applet from stored user preference
 Special treat: input "ALL" calls self for each applet in active view
 Retrieves and saves applet size from/to user preferences
 */
siebelhub.MakeAppletResizable = function(context,resize){
    switch (context.toString().toLowerCase()){
        //magic keyword has been passed instead of context...
        case "all":
            //call self for all applets in view
            var activeView = SiebelApp.S_App.GetActiveView();
            var appletmap = activeView.GetAppletMap();
            for (applet in appletmap){
                siebelhub.MakeAppletResizable(appletmap[applet],resize);
            }
            break;
        default:
            //get pm
            var pm = siebelhub.ValidateContext(context);
            if (pm){
                //some variables we will need
                var appletElem = siebelhub.GetAppletElem(context);
                var viewName = SiebelApp.S_App.GetActiveView().GetName();
                var key = viewName + shMsg["A_SIZE"];
                //try to retrieve user preference from PM
                var newSize = siebelhub.GetUserPref(context,key);
                if (newSize && resize){
                    //set applet size from stored values
                    appletElem.width(newSize.split("x")[0]);
                    appletElem.height(newSize.split("x")[1]);
                }
                //make applet resizable
                appletElem.resizable();
                //define what happens when user resizes the applet
                appletElem.on("resizestop", function (event,ui) {
                    var size = ui.size.width + "x" + ui.size.height;
                    //store new size in user preferences
                    siebelhub.SetUserPref(context,key,size);
                });
            }
            break;
    }
};

/*
Function SetUserPref: sets a user preference within a PM
Input: PM,PR or Applet; name(key) of the UP; new value
Output: returns true or false depending on success
 */
siebelhub.SetUserPref = function(context,key,value){
    //get PM
    var pm = siebelhub.ValidateContext(context);
    var ret = null;
    if (pm){
        //do it by the book...
        var prefPS = SiebelApp.S_App.NewPropertySet();
        prefPS.SetProperty(shMsg["UP_KEY"],key);
        prefPS.SetProperty(key,value);
        pm.OnControlEvent(consts.get("PHYEVENT_INVOKE_CONTROL"), pm.Get(consts.get("SWE_MTHD_UPDATE_USER_PREF")), prefPS);
        pm.SetProperty(key,value);
        ret = true;
    }
    else{
        ret = false;
    }
    return ret;
};

/*
 Function GetUserPref: gets a user preference from a PM
 Input: PM,PR or Applet; name(key) of the UP
 Output: returns the value or null if not found
 */
siebelhub.GetUserPref = function(context,key){
    var val = null;
    //get the PM
    var pm = siebelhub.ValidateContext(context);
    if (pm){
        //get the user preference
        val = pm.Get(key);
    }
    return val;
};

/*
 Function AlignViewToTop: scrolls to top of the view
 Inputs: true = try to activate top applet (emulates click)
 */
siebelhub.AlignViewToTop = function(activateTopApplet){
    //scroll to top of view
    $("#_sweview").scrollTop(0);
    if (activateTopApplet){ //try to 'click' (activate) the first applet
        $("#_sweview").find(".siebui-applet").first().click();
    }
};

/*
 Function GenerateDOMElement: Generates HTML element
 Inputs: Element type (e.g. "DIV"), attributes as object (e.g. {class: "myClass"})
 Returns: HTML element
 */
siebelhub.GenerateDOMElement = function(type, attributes){
    //create new element using jQuery
    var elem = $("<" + type + ">");
    if (attributes){ //set attributes
        elem.attr(attributes);
    }
    return elem;
};
/*
 Function GetAppletType: Returns the type (list, form, tree, chart) of applet
 Inputs: "context" (applet, PM or PR)
 Returns: type of applet as null or string
 */
siebelhub.GetAppletType = function(context){
    var type = null;
    var pm = null;
    var id = null;
    //if we got an applet instance, it could be a list applet...
    if(typeof(context.GetListOfColumns) === "function"){
        return shMsg["TYPE_LIST"];
    }
    //if we got a PM, we can try get the list of columns too...
    else if (typeof(context.Get) === "function"){
        if(context.Get("GetListOfColumns")){
            return shMsg["TYPE_LIST"];
        }
    }
    //if we got a PR, get the PM and try again...
    else if (typeof(context.GetPM) === "function"){
        if(context.GetPM().Get("GetListOfColumns")){
            return shMsg["TYPE_LIST"];
        }
    }
    //we got this far, so it isn't a list applet
    //let's get the PM of that thang...
    pm = siebelhub.ValidateContext(context);
    //could be a tree or chart, let's see...
    //using CSS classes was all I could muster here, maybe there's a better way...
    if (pm){
        id = pm.Get("GetFullId");
        if ($("#" + id).find(".siebui-tree").length != 0){ //it's a tree!
            return shMsg["TYPE_TREE"];
        }
        else if (!type){  //finding out whether it's a chart applet is tricky...
            id = pm.Get("GetFullId").split("_")[1]; //chart applets have weird Ids
            id = id.toLowerCase().charAt(0) + "_" + id.charAt(1);  //did I mention that they have weird Ids
            if ($("#" + id).find(".siebui-charts-container").length != 0){
                return shMsg["TYPE_CHART"]; //It's a Bingo! -- Do you say it like that? -- No, you just say 'Bingo!'.
            }
            else{ //no list,tree or chart. 99% sure it's a form applet
                return shMsg["TYPE_FORM"];
            }
        }
    }
    else{//not of this world...
        return shMsg["TYPE_UNKNOWN"];
    }
};
/*
 Function GetRecordSet: returns record set (raw, not raw) of active applet or context object (PM,PR,applet)
 Inputs: bool for raw or not, optional context
 Returns: record set instance
 */
siebelhub.GetRecordSet = function(raw,context){
    var recordset = null;
    var pm = null;
    //if context has been passed, get the PM
    if (context){
        pm = siebelhub.ValidateContext(context);
    }
    else //get the active PM
    {
        pm = siebelhub.GetActivePM();
    }
    if(raw){ //we want it raw...
        recordset = pm.Get("GetRawRecordSet");
    }
    else{ //I like my record set well-done...
        recordset = pm.Get("GetRecordSet");
    }
    return recordset;
};
/*
 Function ValidateContext: returns a valid PM instance for Applet, PW or PR
 Inputs: Applet object, PM, PW or PR instance
 Returns: PM instance for valid input, null for invalid input
 */
siebelhub.ValidateContext = function(object){
    try{
        var pm = null;
        //context might be an applet instance
        //the GetPModel function gives it away
        if(typeof(object.GetPModel) === "function"){
            pm = object.GetPModel();
        }
        //or it is a PM already...
        else if (typeof(object.OnControlEvent) === "function") {
            pm = object;
        }
        //... or a PR, then we can get the PM easily:
        else if (typeof(object.GetPM) === "function"){
            pm = object.GetPM();
        }
        //context is neither an applet, PM nor PR...
        else{
            throw(shMsg["NOPM_1"]);
        }
    }
    catch(e){
        siebelhub.ErrorHandler(e.toString() + "siebelhub.js:ValidateContext");
    }
    return pm;
};
/*
 Function ErrorHandler: For centralized error display
 Inputs: exception object
 */
siebelhub.ErrorHandler = function(e){
    //alert(e.toString());  //maybe too simple
    //console.log(e.toString()); //too daring
    //$("<div>" + e.toString() + "</div>").dialog(); //now we're talking
    //example of a modal error dialog with style
    var dlg = siebelhub.GenerateDOMElement("div");
    dlg.html(e.toString());
    dlg.dialog({
        buttons: [
            {
                text: shMsg["OK"],
                click: function() {
                    $(this).dialog("close");
                }
            }
        ],
        modal: true,
        dialogClass: "siebelhub_error_dlg",
        title: shMsg["ERROR_DLG_TITLE"]
    });
};

/*
 Just Hello World
 */
siebelhub.HelloWorld = function (msg) {
    if (typeof(msg) === "string" && msg != "") {
        alert(shMsg["HELLO"] + " " + msg);
    }
    else
    {
        alert(shMsg["HELLO_WORLD"]);
    }
};

/*
 Simple postload event listner ;-)
 */
SiebelApp.EventManager.addListner("postload", SiebelHubPL);
function SiebelHubPL(){
    SiebelJS.Log(shMsg["SH_PL"]);
    //let's call a few cool siebelhub methods:
    siebelhub.AlignViewToTop(true);
    siebelhub.MakeAppletCollapsible("ALL");
    siebelhub.MakeAppletResizable("ALL",false);
    //the Siebel Hub Tramp Stamp, show that we are here.
    var stamp = siebelhub.CreateSiebelHubTrampStamp(true);
    if ($(".siebelhub_trampstamp").length == 0){
        $("#_swecontent").append(stamp);
    }

}

/*
Function CreateSiebelHubTrampStamp: Generates the 'Tramp Stamp'
Requires CSS! See the GitHub repo for CSS example file
 */
siebelhub.CreateSiebelHubTrampStamp = function(options){
    var stamp = siebelhub.GenerateDOMElement("div", {
        class:"siebelhub_trampstamp",
        title:shMsg["SH_STAMP"]
    });

    stamp.click(function() {
        var dlg = siebelhub.GenerateDOMElement("div");
        dlg.html(shMsg["SH_DET_BODY"]);
        dlg.dialog({
            buttons: [
                {
                    text: shMsg["DIAG_BTN"],
                    click: function() {
                        siebelhub.SelfDiagnostics({display:"textarea"});
                    }
                },
                {
                    text: shMsg["CLOSE"],
                    click: function() {
                        $("#selfdiag_output").remove();
                        $(this).dialog("destroy");
                    }
                }
             ],
            width: 600,
            modal: true,
            dialogClass: "siebelhub_details",
            title:shMsg["SH_DET_TITLE"]
        });
    });
    return stamp;
};

/*
Function SelfDiagnostics: retrieves and displays feedback on environment and siebelhub.js functionality
 */
siebelhub.SelfDiagnostics = function(options){
    var display = options.display.toLowerCase();
    var out;
    //var selfdiag;
    if ($("#selfdiag_output").length == 0 && display == "textarea"){
        out = siebelhub.GenerateDOMElement("textarea",{id:"selfdiag_output"});
        $(".siebelhub_details").append(out);
    }
    function selfdiag(msg) {
        msg = Date.now() + " > " + msg;
        console.log(msg);
        if (display == "textarea"){
            out.text(out.text() + "\n" + msg);
        }
    }
    selfdiag(shMsg["DIAG_START"]);
    //now run diagnostics
    //check environment
    selfdiag(shMsg["DIAG_BUILD"] + SiebelApp.S_App.GetAppPropertySet().GetChildByType("api").GetProperty("vs"));
    //check 'GetActive' methods
    selfdiag(shMsg["DIAG_VIEW"] + SiebelApp.S_App.GetActiveView().GetName());
    selfdiag(shMsg["DIAG_APPLET"] + siebelhub.GetActiveApplet().GetName());
    selfdiag(shMsg["DIAG_PM"] + siebelhub.GetActivePM().constructor.name);
    selfdiag(shMsg["DIAG_PR"] + siebelhub.GetActivePR().constructor.name);

    //check other functions
    selfdiag(shMsg["DIAG_ATYPE"] + siebelhub.GetAppletType(siebelhub.GetActivePM()));

    //check DataRetriever
    //lookup SADMIN's ROW_ID and take query time as we go
    try{
        var resultset = siebelhub.DataRetriever("Employee","Employee","[Login Name]='SADMIN'","Id",{"Id":""},{"pbc":"Employee","viewmode":"3"});
        var row_id = resultset.GetChild(0).GetProperty("Id");
        if (row_id == "0-1"){
            var time_elapsed = resultset.GetProperty("Time Elapsed");
            selfdiag(shMsg["DIAG_DR_1"] + time_elapsed + shMsg["DIAG_DR_2"]);
        }
        else{
            throw(shMsg["DIAG_FAIL_DR"]);
        }
    }
    catch(e){
        selfdiag(e.toString());
    }

    //check GetRecordSet
    selfdiag(shMsg["DIAG_RS"] + siebelhub.GetRecordSet(true).length);

};
/*
 Fun-ctions
 */
siebelhub.GoToTheHub = function(){
    window.open("http://www.siebelhub.com");
};

siebelhub.swemessageOverride = function (strId, strTranslation) {
    //overrides a siebel default translation from /scripts/siebel/swemessage_<lang>.js
    SiebelApp.S_App.LocaleObject.AddLocalString(strId, strTranslation);
}

/*
 Localization happens here
 For a localized version, copy this file to a language directory and translate the array values below
 */
var shMsg = [];

shMsg["HELLO"]          = "Hello";
shMsg["HELLO_WORLD"]    = "Hello World";
shMsg["OK"]             = "OK";
shMsg["CLOSE"]          = "Close";
shMsg["ERROR_DLG_TITLE"]= "whoopsy-daisy...";
shMsg["NOPM_1"]         = "This function requires valid context (Applet, PM or PR).";
shMsg["NOCTRL_1"]       = "This function requires a valid control reference.";
shMsg["NOBC_1"]         = "Current applet does not use the BC provided";
shMsg["TYPE_UNKNOWN"]   = "It's a Bingo!";
shMsg["SH_PL"]          = "siebelhub.js: Running SiebelHubPL postload event listner...";
shMsg["SH_STAMP"]       = "The Siebel Hub JavaScript Library for Siebel Open UI is available. Click for details.";
shMsg["SH_DET_TITLE"]   = "About the Siebel Hub Library";
shMsg["CUR_YEAR"]       = new Date().getFullYear();  //don't translate this ;-)
shMsg["SH_DET_BODY"]    = "<p>The <a href='https://github.com/siebelhub/siebelhub.js' target='_blank'>Siebel Hub (siebelhub.js) library</a> is an educational example how to create a reusable custom JavaScript library for Siebel Open UI" +
                          "<p>This is an initiative of the <a href='http://siebelhub.com' target='_blank'>Siebel Hub</a>, the authoritative Siebel community site." +
                          "<hr><h3>Options</h3>" +
                          "<ul><li><a href='https://github.com/siebelhub/siebelhub.js' target='_blank'>Download and Contribute to the siebelhub.js library on GitHub</a></li>" +
                          "<li></li><a href='http://siebelhub.com' target='_blank'>Visit the Siebel Hub</a>" +
                          "</ul>" +
                          "<blockquote>Please note that the siebelhub.js library is of an educational, phenomenal, inspirational, completely unsupported (epic) nature." +
                          "Usage of the library for any other than recreational purpose is at your own peril.</blockquote>" +
                          "<hr><span id='siebelhub_detail_footer'><p align='right'>&#9400;&nbsp;2015 - " + shMsg["CUR_YEAR"] + "</p></span>";
shMsg["DIAG_BTN"]       = "Run Self Diagnostics";
shMsg["DIAG_START"]     = "Running siebelhub.js self-diagnostics...";
shMsg["DIAG_BUILD"]     = "Siebel Version: ";
shMsg["DIAG_VIEW"]      = "Active View: ";
shMsg["DIAG_APPLET"]    = "Active Applet: ";
shMsg["DIAG_PM"]        = "Active PM: ";
shMsg["DIAG_PR"]        = "Active PR: ";
shMsg["DIAG_ATYPE"]     = "Type of active applet: ";
shMsg["DIAG_DR_1"]      = "DataRetriever found SADMIN in ";
shMsg["DIAG_DR_2"]      = " milliseconds";
shMsg["DIAG_FAIL"]      = "!!!FAIL: ";
shMsg["DIAG_FAIL_DR"]   = "DataRetriever out of order.";
shMsg["DIAG_RS"]        = "Current size of record set: ";
shMsg["DR_LOG_HDR"]     = "siebelhub.DataRetriever Log: ";
shMsg["DR_LOG_BO"]      = "Business Object: ";
shMsg["DR_LOG_BC"]      = "Business Component: ";
shMsg["DR_LOG_SRCH"]    = "Search Specification: ";
shMsg["DR_LOG_SORT"]    = "Sort Specification: ";
shMsg["DR_LOG_TIME"]    = "Time Elapsed: ";
shMsg["DR_LOG_COUNT"]   = "Record Count: ";
shMsg["DR_VIEW_MODE"]   = "View Mode: ";

//these might not need translation since they are more like Constance ;-)
var viewmodes = ["SalesRepView","ManagerView","PersonalView","AllView","","OrganizationView","","GroupView","CatalogView","SubOrganizationView"];
shMsg["TYPE_LIST"]      = "list";
shMsg["TYPE_FORM"]      = "form";
shMsg["TYPE_CHART"]     = "chart";
shMsg["TYPE_TREE"]      = "tree";
shMsg["AP_PREFIX"]      = "s_";
shMsg["AP_POSTFIX"]     = "_div";
shMsg["INNO_PACK"]      = "IP";
shMsg["A_SIZE"]         = "__size";
shMsg["UP_KEY"]         = "Key";
//shMsg["SIEBEL_VER"]     = SiebelApp.S_App.GetAppPropertySet().GetChildByType("api").GetProperty("vs");
shMsg["SIEBEL_BUILD"]   = SIEBEL_BUILD.split("/")[0];

/*******************************************************************
 File:          siebelhub.js
 Author(s):     alex@siebelhub.com
 Date:          Dec 2015
 Description:   Educational/Phenomenal/Inspirational/Comprehensive (EPIC) JavaScript library for Siebel Open UI.
 See individual functions for details.
 For localization options, scroll down.
 Installation:  Copy this file to siebel/custom folder and
 register in the Manifest using Application/Common

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

 TODO:
 optimize siebelhub.js for list applets
 check for PW compatibility
 Data Retriever (maybe use PRM ANI Utility Service)
 Get Applet DOM element
 conditional formatting
 Get Active PR
 Get Label DOM elem for a control / column header DOM elem for a list column
 test a lot!
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
        siebelhub.ErrorHandler(e);
    }
};

/*
 Function GetControlValue: Gets the current value of an applet control
 Inputs: context (Applet, PM or PR), control object
 Returns: current value
 */
siebelhub.GetControlValue = function (context,control){
    //get the PM
    var pm = siebelhub.ValidateContext(context);
    if (pm){
        //now get the field value
        var value = pm.ExecuteMethod("GetFieldValue", control);
        return value;
    }
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
    //check for dot notation in field argument
    //if a dot is present, split into BC and field name
    //yes, this is risky since there are BCs and Fields that have a dot in the name
    //we have to figure this out...
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
        siebelhub.ErrorHandler(shMsg["NOBC_1"]);
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
    var appletmap = SiebelApp.S_App.GetActiveView().GetAppletMap();
    var applets = [];
    for (applet in appletmap){
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
}
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
 Function GetControlElemByLabel: Gets a control DOM element using the label text
 Inputs: applet object, PM or PR, label text
 Returns: control DOM element
 */
siebelhub.GetControlElemByLabel = function(context,label){
    //get the PM
    var pm = siebelhub.ValidateContext(context);
    var controlElem = null;
    if (pm){
        //get the applet's full id
        var appletElemId = pm.Get("GetFullId");
        //get the DOM element of the applet
        var appletElem = $("#" + appletElemId);
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
 Function MakeAppletCollapsible: overrides the defaultAppletDisplayMode property
 and enables Siebel OOB collapsibility
 Inputs: applet object, PM or PR. optional mode ("expanded" or "collapsed")
 Special treat: input "ALL" calls self for each applet in active view
 Kudos: Jan Peterson
 */
siebelhub.MakeAppletCollapsible = function(context,mode){
    switch (context){
        //magic keyword has been passed instead of context...
        case "ALL":
        case "all":
        case "All":
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
 Function AlignViewToTop: scrolls to top of the view
 Inputs: true = try to activate top applet (emulates click)
 */
siebelhub.AlignViewToTop = function(activateTopApplet){
    //scroll to top of view
    $("#_sweview").scrollTop(0);
    if (activateTopApplet){ //try to 'click' the first applet
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
        siebelhub.ErrorHandler(e);
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
    SiebelJS.Log("siebelhub.js: Running SiebelHubPL postload event listner...");
    //let's call a few cool siebelhub methods:
    siebelhub.AlignViewToTop(true);
    siebelhub.MakeAppletCollapsible("ALL");
}

/*
 Fun-ctions
 */
siebelhub.GoToTheHub = function(){
    window.open("http://www.siebelhub.com");
};

/*
 Localization happens here
 For a localized version, copy this file to a language directory and translate the array values below
 */
var shMsg = [];
shMsg["HELLO"]          = "Hello";
shMsg["HELLO_WORLD"]    = "Hello World";
shMsg["OK"]             = "OK";
shMsg["ERROR_DLG_TITLE"]= "whoopsy-daisy..."
shMsg["NOPM_1"]         = "This function requires valid context (Applet, PM or PR).";
shMsg["NOCTRL_1"]       = "This function requires a valid control reference.";
shMsg["NOBC_1"]         = "Current applet does not use the BC provided";
shMsg["TYPE_UNKNOWN"]   = "It's a Bingo!";

//these might not need translation since they are more like Constance ;-)
shMsg["TYPE_LIST"]      = "list";
shMsg["TYPE_FORM"]      = "form";
shMsg["TYPE_CHART"]     = "chart";
shMsg["TYPE_TREE"]      = "tree";

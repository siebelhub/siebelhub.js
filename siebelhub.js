/*******************************************************************
 File:          siebelhub.js
 Author(s):     alex@siebelhub.com
 Date:          Dec 2015
 Description:   Siebel Hub library for Siebel Open UI.
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
 *******************************************************************/

siebelhub = function(){
    return true;
};

/*
 Function SetControlValue: Sets the value of an applet control
 Inputs: context (applet object, PM or PR), control object, new value
 */
siebelhub.SetControlValue = function (context,control,value){
    try{
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
    var pm = siebelhub.ValidateContext(context);
    if (pm){
        var value = pm.ExecuteMethod("GetFieldValue", control);
        return value;
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
    var pm = siebelhub.ValidateContext(context);
    if (pm){
        var appletElemId = pm.Get("GetFullId");
        var appletElem = $("#" + appletElemId);
        var controlElem = $(appletElem).find("[aria-label='" + label + "']");
        return controlElem;
    }
    else
    {
        return null;
    }

};

/*
 Function GetControlObjByLabel: Gets a control object using the label text
 Inputs: applet object, PM or PR, label text
 Returns: control object instance
 */
siebelhub.GetControlObjByLabel = function(context,label){
    var pm = siebelhub.ValidateContext(context);
    if (pm){
        var controlElem = siebelhub.GetControlElemByLabel(pm,label);
        var labelName = controlElem.attr("aria-labelledby");
        var controlName = labelName.split("_")[0];
        var controlObj = pm.Get("GetControls")[controlName];
        return controlObj;
    }
    else
    {
        return null;
    }
};

/*
 Function MakeAppletCollapsible: overrides the defaultAppletDisplayMode property
 and enables Siebel OOB collapsibility
 Inputs: applet object, PM or PR
 Kudos: Jan Peterson
 */
siebelhub.MakeAppletCollapsible = function(context){
    var pm = siebelhub.ValidateContext(context);
    if (pm){
        if (!pm.Get("defaultAppletDisplayMode")) {
            pm.SetProperty("defaultAppletDisplayMode","expanded"); //or "collapsed"
            var pr = pm.GetRenderer();
            if (pr && typeof(pr.ShowCollapseExpand) === 'function'){
                pm.GetRenderer().ShowCollapseExpand();
            }
        }
    }
};

/*
 Function AlignViewToTop: scrolls to top of the view
 Inputs: true = try to activate top applet (emulates click)
 */
siebelhub.AlignViewToTop = function(activateTopApplet){
    $("#_sweview").scrollTop(0);
    if (activateTopApplet){
        $("#_sweview").find(".siebui-applet").first().click();
    }
};

/*ideas, tbc*/
//optimize siebelhub.js for list applets
//get value by BC field name


/*
 Function GetAppletType: Returns the type (list, form, tree, chart) of applet
 Inputs: "context" (applet, PM or PR)
 Returns: type of applet as null or string
 */
siebelhub.GetAppletType = function(context){
    debugger;
    var type = null;
    var pm = null;
    var id = null;
    //if we got an applet instance, it could be a list applet...
    if(typeof(context.GetListOfColumns) === "function"){
        type = shMsg["TYPE_LIST"];
    }
    //if we got a PM, we can try get the list of columns
    else if (typeof(context.Get) === "function"){
        if(context.Get("GetListOfColumns")){
            type = shMsg["TYPE_LIST"];
        }
    }
    //if we got a PR, get the PM and try again
    else if (typeof(context.GetPM) === "function"){
        if(context.GetPM().Get("GetListOfColumns")){
            type = shMsg["TYPE_LIST"];
        }
    }

    pm = siebelhub.ValidateContext(context);
    //could be a tree or chart, let's see...

    if (pm){
        id = pm.Get("GetFullId");
        if ($("#" + id).find(".siebui-tree").length != 0){
            type =  shMsg["TYPE_TREE"];
        }
        else if (!type){
            id = pm.Get("GetFullId").split("_")[1];
            id = id.toLowerCase().charAt(0) + "_" + id.charAt(1);
            if ($("#" + id).find(".siebui-charts-container").length != 0){
                type = shMsg["TYPE_CHART"];
            }
            else{
                type = shMsg["TYPE_FORM"];
            }
        }

    }
    return type;
};

siebelhub.GetRecordSet = function(raw){
    var recordset;
    if(raw){
        recordset = siebelhub.GetActivePM().Get("GetRawRecordSet");
    }
    else{
        recordset = siebelhub.GetActivePM().Get("GetRecordSet");
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
        //context = applet instance
        if(typeof(object.GetPModel) === "function"){
            pm = object.GetPModel();
        }
        //context = PM
        else if (typeof(object.OnControlEvent) === "function") {
            pm = object;
        }
        //context = PR
        else if (typeof(object.GetPM) === "function"){
            pm = object.GetPM();
        }
        //context is neither an applet, PM nor PR...
        else{
            throw(shMsg["NOPM_1"]);
        }
        return pm;
    }
    catch(e){
        siebelhub.ErrorHandler(e);
    }
};
/*
 Function ErrorHandler: For centralized error display
 Inputs: exception object
 */
siebelhub.ErrorHandler = function(e){
    //alert(e.toString());
    //$("<div>" + e.toString() + "</div>").dialog();
    $("<div>" + e.toString() + "</div>").dialog({
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
shMsg["TYPE_LIST"]      = "list";
shMsg["TYPE_FORM"]      = "form";
shMsg["TYPE_CHART"]     = "chart";
shMsg["TYPE_TREE"]      = "tree";

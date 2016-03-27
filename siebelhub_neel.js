/*******************************************************************
 File:          siebelhub.js
 Author(s):     alex@siebelhub.com, ngautam (http://siebelunleashed.com)
 Start Date:    Dec 2015
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
 03-FEB-2016    v1.7    ahansal     Created experimental HandlePendingCommits method
 05-FEB-2016    v1.8    ahansal     Replaced HandlePendingCommits with EndLife override and SavePendingChanges method
 06-FEB-2016    v1.8    ahansal     Enhanced OverDrive method
 07-FEB-2016    v1.9    ahansal     Added notification for unsaved changes via tramp stamp icon
 13-FEB 2016    v2.0    ahansal     Added GetEditableField method
 15-FEB 2016    v2.0    ahansal     Added progress bar functionality
 22-FEB-2016    v2.0    ahansal     added string override for query placeholder text
 23-FEB-2016    v2.1    ahansal     enhanced MakeAppletCollapsible method to retrieve and store applet state in user preferences
 20-MAR-2016    v3.0    ngautam     reworked siebelhub.js to extend SiebelApp.S_App http://siebelunleashed.com/siebelhub-javascript-library-reworked-solution/
 26-MAR-2016    v3.1    ahansal     implemented ngautam's rework for entire library
 28-MAR-2016    v3.1    ahansal     applied minor fixes (this and that...), added GetshMsg function

 TODO:

 ebook documentation (ebook on Amazon and PDF on Siebel Hub Shop)
 cross browser testing (currently testing on FF and Chrome)
 conditional formatting for list applets
 GetRecordCount function (same as GetFullRecordSet)
 GetAppletObjByName
 "Applet Whitelist/Blacklist" (limit functionality for some applets)
 More test cases for Self Diagnostics

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
if (typeof(SiebelApp.S_App.siebelHub) === "undefined") {

    SiebelJS.Namespace("SiebelApp.S_App.siebelHub");
    SiebelApp.S_App.siebelHub = (function(){
        console.log("Siebel Hub Init Started");
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
        shMsg["SH_STAMP_PEND"]  = "You have unsaved changes! Click to save now.";
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
        shMsg["COMMIT_PENDING"] = "Detected pending commit. Trying to write record.";

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

        console.log("Init 1");

        /* Function GetshMsg: gets a message from the library of translatable strings
           Inputs: message key
           Outputs: message text
         */
        sHub.prototype.GetshMsg = function(key){
             return shMsg[key];
        };
        //end of localization

        /*Main function*/
        function sHub(){
            //var a = "DD";
            //var k = "EE";
        };//end of sHub


        sHub.prototype.GoToTheHub = function(){
            window.open("http://www.siebelhub.com");
        };

        sHub.prototype.swemessageOverride = function (strId, strTranslation) {
            //overrides a siebel default translation from /scripts/siebel/swemessage_<lang>.js
            SiebelApp.S_App.LocaleObject.AddLocalString(strId, strTranslation);
        };

        /*
         Function SetControlValue: Sets the value of an applet control
         Inputs: context (applet object, PM or PR), control object, new value
         */
        sHub.prototype.SetControlValue = function (context,control,value){
            try{
                //get the PM
                var pm = this.ValidateContext(context);
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
                this.ErrorHandler(e.toString() + " siebelhub.js:SetControlValue");
            }
        };

        /*
         Function GetFieldValue: Gets a BC field value from the context record set
         Inputs: BC.Field or Field as string, context optional (uses BC or active PM if context is not provided)
         Returns: current control value
         */
        sHub.prototype.GetFieldValue = function (field, context){
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
                pm = this.ValidateContext(context);
            }
            else if (bcname){ //if a BC was provided...
                //try to find applets that use the BC
                var applets = this.GetAppletsByBCName(bcname);
                if (applets){ //if there is at least one
                    //get the first applet's PM
                    pm = this.ValidateContext(applets[0]);
                }
                else{ //no applet uses the BC, get the active PM anyway
                    pm = this.GetActivePM();
                }
            }
            else{
                //no context provided, get the active PM
                pm = this.GetActivePM();
            }

            //verify input BC name against applet BC
            if (bcname && bcname != pm.Get("GetBusComp").GetName()){
                //applet does not use BC; this is an error...
                this.ErrorHandler(shMsg["NOBC_1"] + " siebelhub.js:GetFieldValue");
                return null;
            }
            //we should be safe now, let's get the record set
            var recordset = this.GetRecordSet(true,pm);
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
        sHub.prototype.GetAppletsByBCName = function (bcname){
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
        sHub.prototype.GetActivePM = function(){
            var activeApplet = this.GetActiveApplet();
            var activePM = activeApplet.GetPModel();
            return activePM;
        };

        /*
         Function GetActivePR: Gets the PR of the active applet
         Inputs: nothing
         Returns: PR instance of active applet
         */
        sHub.prototype.GetActivePR = function(){
            var activeApplet = this.GetActiveApplet();
            var activePR = activeApplet.GetPModel().GetRenderer();
            return activePR;
        };

        /*
         Function GetActiveApplet: Gets the active applet
         Inputs: nothing
         Returns: active applet object instance
         */
        sHub.prototype.GetActiveApplet = function(){
            var activeView = SiebelApp.S_App.GetActiveView();
            var activeApplet = activeView.GetActiveApplet();
            return activeApplet;
        };
        /*
         Function GetControlValue: Gets the current value of an applet control
         Inputs: context (Applet, PM or PR), control object
         Returns: current value
         */
        sHub.prototype.GetControlValue = function (context,control){
            var value = null;
            //get the PM
            var pm = this.ValidateContext(context);
            if (pm){
                //now get the field value
                value = pm.ExecuteMethod("GetFieldValue", control);
            }
            return value;
        };

        /*
         Function GetLabelElem: Gets a DOM element for a label/column header
         Inputs: applet object, PM or PR and control object
         Returns: label/column header DOM element
         */
        sHub.prototype.GetLabelElem = function(context,control){
            //get the PM
            var pm = this.ValidateContext(context);
            var labelElem = null;
            var appletType = null;
            if(pm){
                appletType = this.GetAppletType(pm);
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
        sHub.prototype.GetAppletElem = function(context){
            //get the PM
            var pm = this.ValidateContext(context);
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
        sHub.prototype.GetControlElemByLabel = function(context,label){
            //get the PM
            var pm = this.ValidateContext(context);
            var controlElem = null;
            if (pm){
                //get the DOM element of the applet
                var appletElem = this.GetAppletElem(pm);
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
        sHub.prototype.GetControlObjByLabel = function(context,label){
            //get the PM
            var pm = this.ValidateContext(context);
            var controlObj = null;
            if (pm){
                //get control element
                var controlElem = this.GetControlElemByLabel(pm,label);
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

        sHub.prototype.DataRetriever = function(busobj,buscomp,searchspec,sortspec,fields,options){
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
                    case "json" : resultset = this.ps2json({},resultset);
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
        sHub.prototype.GetFullRecordSet = function(context){
            var bc;
            var bcName;
            var pbc; //primary BC
            var rowid; //primary ROW_ID
            var applet = null;
            var rs = new Array();
            var i = 0;
            var boName = SiebelApp.S_App.GetActiveBusObj().GetName();
            var temp = this.DataRetriever("Repository Business Object","Repository Business Object","[Name] LIKE '" + boName + "'","Id",{"Primary Business Component":""},{"output":"json","viewmode":"3"});
            pbc = temp["childArray"]["Repository Business Object_1"]["Primary Business Component"];
            if (context){
                var pm = this.ValidateContext(context);
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
                applet = this.GetActiveApplet();
            }

            var bc = applet.GetBusComp();
            var bcName = bc.GetName();
            var searchspec = bc.GetSearchSpec() ? bc.GetSearchSpec() : "";
            var sortspec = bc.GetSortSpec() ? bc.GetSortSpec() : "";
            var rs_temp = this.GetRecordSet(true)[0];
            var fields = {};
            var result = null;
            for (field in rs_temp){
                fields[field] = "";
            }
            if (bcName != pbc){  //query on child BC using active BO
                boName = "";
                rowid = this.GetFieldValue("Id",this.GetAppletsByBCName(pbc)[0]);
            }
            result = this.DataRetriever(boName,bcName,searchspec,sortspec,fields,{"output":"json","log": true,"pbc":pbc,"rowid":rowid});
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
        sHub.prototype.ps2json = function(json,ps,counter){
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
                this.ps2json(json["childArray"],child,i+1);
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
        sHub.prototype.MakeAppletCollapsible = function(context,mode){
            switch (context.toString().toLowerCase()){
                //magic keyword has been passed instead of context...
                case "all":
                    //call self for all applets in view
                    var activeView = SiebelApp.S_App.GetActiveView();
                    var appletmap = activeView.GetAppletMap();
                    for (applet in appletmap){
                        this.MakeAppletCollapsible(appletmap[applet],mode);
                    }
                    break;
                default:
                    //get the PM
                    var pm = this.ValidateContext(context);
                    var viewname = SiebelApp.S_App.GetActiveView().GetName();
                    if (pm){
                        //check for stored state in user pref
                        var key = viewname + shMsg["A_STATE"];
                        var state = this.GetUserPref(pm,key);
                        if (state == "expanded" || state == "collapsed"){ //we got a user pref already...
                            //override mode argument
                            mode = state;
                        }
                        //check if PM property is not already set in repository
                        var repstate = pm.Get("defaultAppletDisplayMode");
                        if (!repstate) { //not set
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
                        //get the collapse/expand buttons
                        var appletElem = this.GetAppletElem(pm);
                        var cb = appletElem.find(".siebui-btn-icon-collapsed");
                        var eb = appletElem.find(".siebui-btn-icon-expanded");
                        if (repstate){ //PM user prop was defined in repository
                            if (repstate != state && state == "collapsed") {
                                //we need to expand so press the right button
                                eb.click();
                            }
                            else if (repstate != state && state == "expanded"){
                                //we need to collapse so press the right button
                                cb.click();
                            }
                        }
                        var that = this;
                        //establish click event handlers to capture state as user preference
                        cb.click(function(e){
                            that.SetUserPref(pm,key,"collapsed");
                        });
                        eb.click(function(e){
                            that.SetUserPref(pm,key,"expanded");
                        });
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
        sHub.prototype.MakeAppletResizable = function(context,resize){
            debugger;
            switch (context.toString().toLowerCase()){
                //magic keyword has been passed instead of context...
                case "all":
                    //call self for all applets in view
                    var activeView = SiebelApp.S_App.GetActiveView();
                    var appletmap = activeView.GetAppletMap();
                    for (applet in appletmap){
                        this.MakeAppletResizable(appletmap[applet],resize);
                    }
                    break;
                default:
                    //get pm
                    var pm = this.ValidateContext(context);
                    if (pm){
                        //some variables we will need
                        var appletElem = this.GetAppletElem(context);
                        var viewName = SiebelApp.S_App.GetActiveView().GetName();
                        var key = viewName + shMsg["A_SIZE"];
                        //try to retrieve user preference from PM
                        var newSize = this.GetUserPref(context,key);
                        if (newSize && resize){
                            //set applet size from stored values
                            appletElem.width(newSize.split("x")[0]);
                            appletElem.height(newSize.split("x")[1]);
                        }
                        //make applet resizable
                        appletElem.resizable();
                        var that = this;
                        //define what happens when user resizes the applet
                        appletElem.on("resizestop", function (event,ui) {
                            debugger;
                            var size = ui.size.width + "x" + ui.size.height;
                            //store new size in user preferences
                            that.SetUserPref(context,key,size);
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
        sHub.prototype.SetUserPref = function(context,key,value){
            //get PM
            var pm = this.ValidateContext(context);
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
         Function GetAppletType: Returns the type (list, form, tree, chart) of applet
         Inputs: "context" (applet, PM or PR)
         Returns: type of applet as null or string
         */
        sHub.prototype.GetAppletType = function(context){
            var type = null;
            var pm = null;
            var id = null;

            //if we got an applet instance, it could be a list applet...
            if(typeof(context.GetListOfColumns) === "function"){
                //return "list";
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
            pm = this.ValidateContext(context);
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
         Function GetUserPref: gets a user preference from a PM
         Input: PM,PR or Applet; name(key) of the UP
         Output: returns the value or null if not found
         */
        sHub.prototype.GetUserPref = function(context,key){
            var val = null;
            //get the PM
            var pm = this.ValidateContext(context);
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
        sHub.prototype.AlignViewToTop = function(activateTopApplet){
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
        sHub.prototype.GenerateDOMElement = function(type, attributes){
            //create new element using jQuery
            var elem = $("<" + type + ">");
            if (attributes){ //set attributes
                elem.attr(attributes);
            }
            return elem;
        };
        /*
         Function GetRecordSet: returns record set (raw, not raw) of active applet or context object (PM,PR,applet)
         Inputs: bool for raw or not, optional context
         Returns: record set instance
         */
        sHub.prototype.GetRecordSet = function(raw,context){
            var recordset = null;
            var pm = null;
            //if context has been passed, get the PM
            if (context){
                pm = this.ValidateContext(context);
            }
            else //get the active PM
            {
                pm = this.GetActivePM();
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
        sHub.prototype.ValidateContext = function(object){
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
                this.ErrorHandler(e.toString() + " siebelhub.js:ValidateContext");
            }
            return pm;
        };


        /*
         Function ErrorHandler: For centralized error display
         Inputs: exception object
         */
        sHub.prototype.ErrorHandler = function(e){
            //alert(e.toString());  //maybe too simple
            //console.log(e.toString()); //too daring
            //$("<div>" + e.toString() + "</div>").dialog(); //now we're talking
            //example of a modal error dialog with style
            var dlg = this.GenerateDOMElement("div");
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
         Function Overdrive: experimental method to override a method at runtime
         Inputs: context (pm, pr or applet), (prototype) method to override, method to act as override
         */
        sHub.prototype.Overdrive = function(context,proto,method){
            var pm = this.ValidateContext(context);
            if (pm){
                switch(proto){
                    //override EndLife of the PR at runtime
                    case "EndLife"    : pm.GetRenderer().constructor.prototype.EndLife = method;
                        break;
                    //register PM bindings at runtime
                    case "FieldChange":
                    case "ShowSelection": pm.AttachPMBinding(proto,method);
                        break;
                    default           : break;
                }
            }
        };

        /*Function SavePendingChanges: implements a potential solution to the "browser back button" problem (data loss)
         Inputs: optional: context (pm,pr or applet). When no context is passed, we try current this object.
         */
        sHub.prototype.SavePendingChanges = function(context){
            var pm = null;
            if (context){
                pm = this.ValidateContext(context);
            }
            else{
                pm = this.ValidateContext(this);
            }
            if (pm){
                if(this.IsCommitPending(pm)){  //unsaved changes exist
                    var applet = SiebelApp.S_App.GetActiveView().GetApplet(pm.GetObjName());
                    console.log(shMsg["COMMIT_PENDING"]);
                    //call applet(!) method to force WriteRecord
                    applet.InvokeMethod("WriteRecord");
                }
            }
        };
        /*
         Function IsCommitPending: Wrapper for undocumented framework BC function
         Inputs: context (pm,pr or applet)
         Output: returns true if unsaved changes exist, false if not
         */
        sHub.prototype.IsCommitPending = function(context){
            var pm = this.ValidateContext(context);
            var retvalue = false;
            if (pm){
                //get applet instance
                var applet = SiebelApp.S_App.GetActiveView().GetApplet(pm.GetObjName());
                //get BC instance
                var bc = pm.Get("GetBusComp");
                //call IsCommitPending (kudos to Jeroen Burgers) - this is undocumented!
                var retvalue = bc.IsCommitPending();
            }
            return retvalue;
        };

        /*
         Function NotifyPendingChanges: Notify user of unsaved changes by modifying the tramp stamp
         Requires CSS, see GitHub repo for siebelhub.css.
         */
        sHub.prototype.NotifyPendingChanges = function(){
            var stamp = $("#sh_trampstamp");
            var pm = SiebelApp.S_App.siebelHub.prototype.ValidateContext(this);
            if (pm){
                if(SiebelApp.S_App.siebelHub.prototype.IsCommitPending(pm)){  //unsaved changes exist
                    stamp.removeClass("siebelhub_trampstamp");
                    stamp.addClass("siebelhub_trampstamp_pending");
                    stamp.attr("title",shMsg["SH_STAMP_PEND"]);
                    $(".siebelhub_trampstamp_pending").click(function(){
                        this.SavePendingChanges(pm);
                    });
                }
                else{
                    stamp.removeClass("siebelhub_trampstamp_pending");
                    stamp.addClass("siebelhub_trampstamp");
                    stamp.attr("title",shMsg["SH_STAMP"]);
                }
            }
        };

        /*
         Function GetEditableFields: Returns object with BC field names and values for all editable and MVG fields
         Input: context (PM, PR or applet instance)
         Output: JSON object
         */
        sHub.prototype.GetEditableFields = function(context){
            var pm = null;
            var retvalue = {};
            pm = this.ValidateContext(context);
            if (pm){
                var controlSet = pm.Get("GetControls");
                var bc = pm.Get("GetBusComp"); //get BC instance
                var fieldmap = bc.GetFieldMap(); //get field map of BC instance
                var field;
                var fieldname = "";
                var isReadOnly = false;
                var popupType = "";
                var controlElem;
                for (c in controlSet){ //for each control
                    fieldname = controlSet[c].GetFieldName(); //get BC field name
                    popupType = controlSet[c].GetPopupType(); //get popup type (e.g "Mvg")
                    field = fieldmap[fieldname];  //get BC field instance
                    if (field){ //only applies to controls that expose a BC field (excludes buttons etc)
                        controlElem = $("[name='" + controlSet[c].GetInputName() + "']");  //get DOM element
                        //figure out if control is read only
                        isReadOnly = field.IsReadOnly() == "1" || controlElem.attr("aria-readonly") == "true" ? true : false;
                        if (!isReadOnly || popupType == "Mvg"){  //if not read only or an MVG field
                            //add field name and current value to output
                            retvalue[controlSet[c].GetFieldName()] = pm.ExecuteMethod("GetFieldValue",controlSet[c]);
                        }
                    }
                }
            }
            return retvalue;
        };

        /*
         Function ComputeProgress: Calculates the ratio of populated vs. total editable controls
         Input: context (PM, PR or applet instance)
         Output: object with statistics
         */
        sHub.prototype.ComputeProgress = function(context){
            var pm = null;
            var progress = 0;
            var nFull = 0;
            var nEmpty = 0;
            var nTotal = 0;
            var retval = {};
            pm = this.ValidateContext(context);
            if (pm){
                //call helper function
                var fields = this.GetEditableFields(pm);
                nTotal = Object.keys(fields).length; //get total # of editable controls
                for (f in fields){ //iterate
                    if (fields[f] == ""){  //control is currently empty
                        nEmpty++;
                    }
                    else{   //control has a value
                        nFull++;
                    }
                }
                retval["t"] = nTotal;
                retval["f"] = nFull;
                retval["e"] = nEmpty;
                retval["i"] = nFull/nTotal; //calculate ratio of full vs. total
                retval["p"] = 100*(nFull/nTotal); //ratio in percent
            }
            return retval;
        };

        /*
         Function ShowProgressBar: paints a progress bar on the applet header
         Requires CSS: see siebelhub.css on GitHub for details
         Input: context (PM, PR or applet instance)
         */
        sHub.prototype.ShowProgressBar = function(context){
            var pm = null;
            pm = this.ValidateContext(context);
            if (pm){
                var appletElem = this.GetAppletElem(pm);
                var appletId = pm.Get("GetFullId");
                //we need a unique id, let's use the applet id
                var pb_id = "sh_pb_" + appletId;
                //now let's get the applet header
                var appletHeader = appletElem.find($(".siebui-applet-header"));

                if ($("#" + pb_id).length == 0){ //avoid deja vu
                    //create a div
                    var pb = this.GenerateDOMElement("div",{"id":pb_id, "class":"sh_progressbar"});
                    //paint the progress bar
                    appletHeader.after(pb.progressbar());
                }
                //call helper function to update the progress bar
                this.UpdateProgressBar(pm);
                //EXPERIMENTAL: attach to PM events
                this.Overdrive(pm,"FieldChange",this.UpdateProgressBar);
                //ShowSelection caused some problems, downgraded to 'veery experimental'
                //this.Overdrive(pm,"ShowSelection",this.UpdateProgressBar);
            }
        };

        /*
         Function UpdateProgressBar: locates and updates (value, color) of a progress bar on the given applet
         Input: context(optional): PM, PR or applet instance
         */
        sHub.prototype.UpdateProgressBar = function(context){
            var pm = null;
            if (context.constructor.name != "AppletControl"){ //avoid issues when called from FieldChange event
                pm = SiebelApp.S_App.siebelHub.prototype.ValidateContext(context);
            }
            else if (!pm){ //use current object context (this) if we still haven't got a PM
                pm = SiebelApp.S_App.siebelHub.prototype.ValidateContext(this);
            }
            if (pm){
                var appletElem = SiebelApp.S_App.siebelHub.prototype.GetAppletElem(pm);
                var pb = appletElem.find(".sh_progressbar"); //try to locate progress bar
                if (pb.length > 0){ //we got one...
                    var stats = SiebelApp.S_App.siebelHub.prototype.ComputeProgress(pm);  //get current stats from helper function
                    var val = stats.p; //value in percent
                    pb.progressbar("value", val);  //set value
                    //set the title, so we have a decent tooltip
                    pb.attr("title",stats.f + shMsg["OF_FIELDS"] + stats.t + shMsg["POP_FIELDS_1"] + parseInt(val) + shMsg["POP_FIELDS_2"]);
                    //get color for value bar
                    var color = SiebelApp.S_App.siebelHub.prototype.GetColor(val);
                    //set color
                    pb.find(".ui-progressbar-value").css("background",color);
                }
            }
        };

        /*
         Function GetColor: returns a red-amber-green color tone depending on input value
         Input: value (Number)
         Output: rgb encoded color string
         */
        sHub.prototype.GetColor = function(val){
            var g = val <= 50 ? val*2 : 100; //if val <= 50, then green will be 0-100, above green will be 100
            var r = val > 50 ? 200 - (val*2) : 100; //if val > 50, red will be 100, above, red will be 100 - 0
            return "rgb(" + r + "%," + g + "%,0%)"; //color in rgb % style e.g. "rgb(40%,100%,0%)"
        };


        /*
         Function CreateSiebelHubTrampStamp: Generates the 'Tramp Stamp'
         Requires CSS! See the GitHub repo for siebelhub.css
         */
        sHub.prototype.CreateSiebelHubTrampStamp = function(options){
            var stamp = this.GenerateDOMElement("div", {
                class:"siebelhub_trampstamp",
                title:shMsg["SH_STAMP"],
                id:"sh_trampstamp"   //ahansal 07-FEB-2016: added id for better isolation
            });
            var that = this;
            stamp.click(function() {
                if ($(".siebelhub_trampstamp").length > 0){  //ahansal 07-FEB-2016: added if block to avoid issues with notification
                    var dlg = that.GenerateDOMElement("div");
                    dlg.html(shMsg["SH_DET_BODY"]);
                    dlg.dialog({
                        buttons: [
                            {
                                text: shMsg["DIAG_BTN"],
                                click: function() {
                                    that.SelfDiagnostics({display:"textarea"});
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
                }
            });
            return stamp;
        };
        /*
         Function SelfDiagnostics: retrieves and displays feedback on environment and siebelhub.js functionality
         */
        sHub.prototype.SelfDiagnostics = function(options){
            var display = options.display.toLowerCase();
            var out;
            //var selfdiag;
            if ($("#selfdiag_output").length == 0 && display == "textarea"){
                out = this.GenerateDOMElement("textarea",{id:"selfdiag_output"});
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
            selfdiag(shMsg["DIAG_APPLET"] + this.GetActiveApplet().GetName());
            selfdiag(shMsg["DIAG_PM"] + this.GetActivePM().constructor.name);
            selfdiag(shMsg["DIAG_PR"] + this.GetActivePR().constructor.name);

            //check other functions
            selfdiag(shMsg["DIAG_ATYPE"] + this.GetAppletType(this.GetActivePM()));

            //check DataRetriever
            //lookup SADMIN's ROW_ID and take query time as we go
            try{
                var resultset = this.DataRetriever("Employee","Employee","[Login Name]='SADMIN'","Id",{"Id":""},{"pbc":"Employee","viewmode":"3"});
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
            selfdiag(shMsg["DIAG_RS"] + this.GetRecordSet(true).length);

        };

        return sHub;
    }())//end of function as object
};//end of if

/*
 Simple postload event listner ;-)
 */
SiebelApp.EventManager.addListner("postload", SiebelHubPL);
function SiebelHubPL(){
    var sHub = new SiebelApp.S_App.siebelHub(this);
    console.log(sHub.GetshMsg("SH_PL"));
    //let's call a few cool siebelhub methods:
    sHub.AlignViewToTop(true);
    sHub.MakeAppletCollapsible("ALL");
    sHub.MakeAppletResizable("ALL",false);
    //the Siebel Hub Tramp Stamp, show that we are here.
    var stamp = sHub.CreateSiebelHubTrampStamp(true);
    if ($(".siebelhub_trampstamp").length == 0){
        $("#_swecontent").append(stamp);
    }
    //experimental stuff comes here:
    //get applet map. we're going to experiment with all applets in the view
    var appletmap = SiebelApp.S_App.GetActiveView().GetAppletMap();
    for (a in appletmap){
        //override EndLife for each applet to implement save pending changes
        //might not go down well with some views, hence commented it
        //uncomment next line if you want to test the "save pending changes" implementation
        //sHub.Overdrive(appletmap[a],"EndLife",sHub.SavePendingChanges);

        //attach PM bindings to all applets just because we can...
        sHub.Overdrive(appletmap[a],"FieldChange",sHub.NotifyPendingChanges);
        sHub.Overdrive(appletmap[a],"ShowSelection",sHub.NotifyPendingChanges);
    }
    sHub.ShowProgressBar(sHub.GetActiveApplet());
}

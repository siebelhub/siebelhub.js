//Regenerate using:http://duncanford.github.io/prpm-code-generator/?prpm=PM&object=DesktopList&name=SiebelHubList&userprops=&comments=Yes&logging=Yes
/*******************************************************************
 File:          SiebelHubListPM.js
 Author(s):     alex@siebelhub.com
 Date:          Jan 2016
 Description:   Educational/Phenomenal/Inspirational/Comprehensive (EPIC) List Applet Presentation Model Extension.
 GitHub:        https://github.com/siebelhub/siebelhub.js

 Installation:  Copy this file to siebel/custom folder and register in the Manifest using Presentation Model/DEFAULT LIST APPLET

 for(i=should,i=understand,i=read)
 {
    FOR EDUCATIONAL PURPOSES ONLY!!!
    DO NOT USE IN PRODUCTION!!!
 }

 History:

 15-JAN-2016    v0.1    ahansal     File created, first draft
 15-JAN-2016    v0.2    ahansal     Setup: Overriding enableDragAndDropInList property because we can (do not try this at home)
 *********************************************************************/
if (typeof(SiebelAppFacade.SiebelHubListPM) === "undefined") {

    SiebelJS.Namespace("SiebelAppFacade.SiebelHubListPM");
    define("siebel/custom/SiebelHubListPM", ["siebel/listpmodel"],
        function () {
            SiebelAppFacade.SiebelHubListPM = (function () {

                function SiebelHubListPM(pm) {
                    SiebelAppFacade.SiebelHubListPM.superclass.constructor.apply(this, arguments);
                }

                SiebelJS.Extend(SiebelHubListPM, SiebelAppFacade.ListPresentationModel);

                SiebelHubListPM.prototype.Init = function () {
                    // Init is called each time the object is initialised.
                    // Add code here that should happen before default processing
                    SiebelAppFacade.SiebelHubListPM.superclass.Init.apply(this, arguments);
                    SiebelJS.Log(this.Get("GetName")+": SiebelHubListPM:      Init method reached.");
                    // Add code here that should happen after default processing
                }

                SiebelHubListPM.prototype.Setup = function (propSet) {
                    // Setup is called each time the object is initialised.
                    // Add code here that should happen before default processing
                    SiebelJS.Log(this.Get("GetName")+": SiebelHubListPM:      Setup method reached.");
                    SiebelAppFacade.SiebelHubListPM.superclass.Setup.apply(this, arguments);
                    // Add code here that should happen after default processing

                    //Enable D&D for all list applets (you daredevil, you)
                    this.SetProperty("enableDragAndDropInList",true);
                }

                return SiebelHubListPM;
            }()
                );
            return "SiebelAppFacade.SiebelHubListPM";
        })
}

// Photoshop script that generates app icons for iMessage apps and sticker packs 
// to use in iOS 10 and Xcode 8.
//
// This script accepts any image ratio and outputs to many aspect ratios. The 
// default background color is white.
//
// WARNING!!! In the rare case that there are name collisions, this script will
// overwrite (delete perminently) files in the same folder in which the selected
// iTunesArtwork file is located. Therefore, to be safe, before running the
// script, it's best to make sure the selected iTuensArtwork file is the only
// file in its containing folder.
//
// Original, Copyright (c) 2010 Matt Di Pasquale
// Added tweaks, Copyright (c) 2012 by Josh Jones http://www.appsbynight.com
// Updated for iMessage Apps, Copyright (c) 2016 by Ben Morrow http://benmorrow.info
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// Prerequisite:
// First, create at least a 1024x1024 PNG file 
//
// Install:
// Save .jsx to /Applications/Adobe Photoshop/Presets/Scripts
//
// Run:
// * With Photoshop open, select Fil e > Scripts > Create Icons
// * When prompted select the prepared iTunesArtwork file for your app.
// * The icons will get saved to the same folder.
//
// Adobe Photoshop JavaScript Reference
// http://www.adobe.com/devnet/photoshop/scripting.html

try {
  // Prompt user to select iTunesArtwork file. Clicking "Cancel" returns null.
  var iTunesArtwork = File.openDialog("Select a PNG file that is at least 1024x1024.", "*.png", false);

  if (iTunesArtwork !== null) { 
    var doc = open(iTunesArtwork, OpenDocumentType.PNG);
    
    if (doc == null) {
      throw "Something is wrong with the file.  Make sure it's a valid PNG file.";
    }

    var startState = doc.activeHistoryState;       // save for undo
    var initialPrefs = app.preferences.rulerUnits; // will restore at end
    app.preferences.rulerUnits = Units.PIXELS;     // use pixels

    if (doc.width < 1024 || doc.height < 1024) {
      throw "Image is too small!  Must be at least 1024x1024 pixels. Any aspect ratio is allowed.";
    }
    
    // Folder selection dialog
    var destFolder = Folder.selectDialog( "Choose an output folder");

    if (destFolder == null) {
      // User canceled, just exit
      throw "";
    }

    // Save icons in PNG using Save for Web.
    var sfw = new ExportOptionsSaveForWeb();
    sfw.format = SaveDocumentType.PNG;
    sfw.PNG8 = false; // use PNG-24
    sfw.transparency = true;
    doc.info = null;  // delete metadata
    
    var icons = [
      {"name": "Icon-27x20", 	"width": 27, "height": 20},
      {"name": "Icon-27x20@2x", "width": 54, "height": 40},
      {"name": "Icon-27x20@3x", "width": 81, "height": 60},
      
      {"name": "Icon-29",       "size": 29},
      {"name": "Icon-29@2x",    "size": 58},
      {"name": "Icon-29@3x",    "size": 87},
      
      {"name": "Icon-32x24", 	"width": 32, "height": 24},
      {"name": "Icon-32x24@2x", "width": 64, "height": 48},
      {"name": "Icon-32x24@3x", "width": 96, "height": 72},
      
      {"name": "Icon-60x45@2x", "width": 120, "height": 90},
      {"name": "Icon-60x45@3x", "width": 180, "height": 135},

      {"name": "Icon-67x50", 	"width": 67, "height": 50},
      {"name": "Icon-67x50@2x", "width": 134, "height": 100},
      
      {"name": "Icon-74x55@2x", "width": 148, "height": 110},
      
      {"name": "Icon-1024x768", "width": 1024, "height": 768}
    ];

    var icon;
    for (i = 0; i < icons.length; i++) 
    {
      icon = icons[i];
      var height = icon.height ? icon.height : icon.size
      var width = icon.width ? icon.width : icon.size
      
      // Resize the image respecting a larger width or height
      if (doc.height > doc.width) {
        doc.resizeImage(null,UnitValue(height,"px"),null,ResampleMethod.BICUBICSHARPER);
      } else {
        doc.resizeImage(UnitValue(width,"px"),null,null,ResampleMethod.BICUBICSHARPER);
      }
      
      // Crop the canvas to the final width and height
      app.activeDocument.resizeCanvas(UnitValue(width,"px"),UnitValue(height,"px"));
      
      // Make the default background white
      var bgColor = new SolidColor(); 
      bgColor.rgb.hexValue = "FFFFFF";
      app.backgroundColor = bgColor;

      var destFileName = icon.name + ".png";

      if ((icon.name == "iTunesArtwork@2x") || (icon.name == "iTunesArtwork"))
      {
        // iTunesArtwork files don't have an extension
        destFileName = icon.name;
      }

      doc.exportDocument(new File(destFolder + "/" + destFileName), ExportType.SAVEFORWEB, sfw);
      doc.activeHistoryState = startState; // undo resize
    }

    alert("iMessage app icons created!");
  }
}
catch (exception) {
  // Show degbug message and then quit
	if ((exception != null) && (exception != ""))
    alert(exception);
 }
finally {
    if (doc != null)
        doc.close(SaveOptions.DONOTSAVECHANGES);
  
    app.preferences.rulerUnits = initialPrefs; // restore prefs
}
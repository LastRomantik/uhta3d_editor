Link to video tutorial: https://youtu.be/yvcT7J5ahXA

### Preparing the editor for work

1. Unzip the archive and move uhta3d_editor to the plugins folder;
2. Let's plug in the editor:
`<include url="plugins/uhta3d_editor/includer.xml" />`
3. Next, you need to put all the <scene> tags into a separate file named scenes.xml;

![](https://krpano.com/forum/wbb/core/index.php?attachment/3730-image-png/)

> [!NOTE]
> This is required to save our changes to the tour during the editing process. Putting anything else in this file is not recommended, as the file will be completely overwritten.

4. Add all necessary styles to the main tour file.

That's the end of the preparations.

Launch our tour in a browser and open the developer's console (at the moment the output of technical information about the progress of editing is made there, in the Console section).

![](https://krpano.com/forum/wbb/core/index.php?attachment/3731-image-png/)

After starting, in the center of the viewer will show crosshairs and in the console the editor hotkey hint:

```
Editor help:
    Q - link start
    E - link stop
    R - remove start
    T - remove stop
    F - styling start
    G - styling stop
    H - select style hs
    C - save all to xml
```

### Creating a connection between panoramas (key "Q" and "E")

1. Aim the crosshairs at the location where the hotspot will be placed or where the scene to be connected will be shot;
   
3. Press the "Q" key to start the connection;
4. In the field that appears, enter the name of the scene to be connected.
   You can enter part of the name of the scene you are looking for, then the list will be filtered and only suitable scene names will remain.
   Use the up/down arrows or mouse to select the desired scene and press the "Enter" key;
5. The selected scene will be loaded, in which it is necessary to indicate with a crosshair the place of shooting the first scene or the location of the hotspot for transition in the opposite direction.

   The more precise the location of two positions relative to each other, the more accurate the transition will be visually.
7. Press the "E" key to complete the connection process.

### Removing hotspot (key "R")

1. Press the "R" key to start the delete mode;
   
3. Click on the desired hotspot with the mouse;
   
5. Repeat from step 1 if necessary.

### Change hotspot style (key "F", "G", "H")

1. First, you must select the desired style by pressing the "H" key;
   
3. Select the desired style in the input field that appears and confirm by pressing the "Enter" key;
4. Press the "F" key to start the hotspot style change;
5. Select the desired hotspot with the mouse;
6. Repeat from step 1 (if you need to change the style) or step 3.

### Saving changes (key "C")

1. Press the "C" key to save all changes;
2. In the window that opens, select the file named scenes.xml (where all our scenes are recorded).
   
   Just in case, create a copy of the scene.xml file. )))
4. Reboot the tour to verify.
<br><br>
> [!NOTE]
> There may be bugs and errors in the plugin. If any such bugs are found, please report them here for correction.<br>
> I'd be happy to get feedback on the work and suggestions (https://krpano.com/forum/wbb/index.php?thread/19910-editor-for-web-uhta3d-editor/ or https://t.me/lastromantik)


Enjoy your work!

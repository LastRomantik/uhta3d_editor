Link to video tutorial: https://youtu.be/yvcT7J5ahXA

### Preparing the editor for work

1. Unzip the archive and move uhta3d_editor to the plugins folder;
2. Let's plug in the editor:
`<include url="plugins/uhta3d_editor/includer.xml" />`
3. Next, you need to put all the <scene> tags into a separate file named scenes.xml;

![image](https://github.com/LastRomantik/uhta3d_editor/assets/40997453/ab2b2471-cf13-44d5-8704-4be3ca111c21)


> [!NOTE]
> This is required to save our changes to the tour during the editing process. Putting anything else in this file is not recommended, as the file will be completely overwritten.

4. Add all necessary styles to the main tour file.

That's the end of the preparations.

Launch our tour in a browser and open the developer's console (at the moment the output of technical information about the progress of editing is made there, in the Console section).

![image](https://github.com/LastRomantik/uhta3d_editor/assets/40997453/dbed2488-38f3-4d53-88d5-cd016dc08227)


After starting, in the center of the viewer will show crosshairs and in the console the editor hotkey hint:

```
Editor's help:
    Vertical alignment:
        Digit 1/2 - Architectural view: On/Off
        A/D - panorama rotation -/+ in degrees
        S - save panorama rotation for current scene
    Hotspot editor:
        Q - link start
        Е - link stop
        R - remove start
        T - remove stop
        F - styling start
        G - styling stop
        H - select style hs
    Save all changes:
        C - save all to xml
```

### Vertical alignment on the panorama (key "1", "2", "A", "S", "D")
1. Switch to architectural mode using the "1" key above the letter keys. (To turn off the mode, press the "2" key);
2. Using "A/D" and crosshair keys rotate the panorama so that vertical lines on the panorama become vertical in the viewing window. (rotation of the panorama is performed relative to the center of the crosshair on the screen);
3. Press the "S" key to save the changes. (Architectural mode will be automatically deactivated).
A video of the alignment process can be seen at the [link](https://www.youtube.com/watch?v=DSKX48hDrwY).

### Creating a connection between panoramas (key "Q", "E")

1. Aim the crosshairs at the location where the hotspot will be placed or where the scene to be connected will be shot;
2. Press the "Q" key to start the connection;
3. In the field that appears, enter the name of the scene to be connected.
   You can enter part of the name of the scene you are looking for, then the list will be filtered and only suitable scene names will remain.
   Use the up/down arrows or mouse to select the desired scene and press the "Enter" key;
4. The selected scene will be loaded, in which it is necessary to indicate with a crosshair the place of shooting the first scene or the location of the hotspot for transition in the opposite direction.

   The more precise the location of two positions relative to each other, the more accurate the transition will be visually.
5. Press the "E" key to complete the connection process.

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

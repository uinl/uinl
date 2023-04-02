# UINL (User Interface object-Notation Language)

<img src="https://uinl.github.io/img/icon.png" width=250 align=right>
UINL (User Interface object-Notation Language) is a machine-readable format for specifying user-interface changes.

Main focus of UINL is in providing a functionally-equivalent task experience for human and computational users alike.
In its focus to make human software usable by machine agents, UINL aims to eliminate non-task-essential design choices (e.g. font type/size may be irrelevant for many task types), leaving those to be optionally specified via customizable templates (e.g. CSS).

UINL messages adhere to JSON formatting, and can be deserialized with any standard JSON library.

Deploying a UINL application is similar to deploying a web application, where UINL takes place of HTML as the language for UI description.
Much like HTML, UINL is a means for serializing task interface display and interactions.
Unlike HTML documents, UINL messages are incremental updates to the display.
Whereas HTML is focused on hypertext look and feel, UINL is focused on function, structure, and affordances of UI elements (though it enables style-sheets for detailed look&feel specification).

Benefits of task development with UINL:
- less code, more GUI
- cross-platform, web-friendly
- millisecond precision time-stamps and timers
- consistent cross-task API, allowing computational agents to interact with the same sw that that human users interact with

Benefits of agent development for UINL-compliant tasks:
- consistent cross-task API, allowing computational agents to interact with the same sw that that human users interact with
- millisecond precision user-time (with faster-than-real-time and slower-than-real-time capabilities)
- cross-platform, web-friendly
- low bar of entry (i.e., core API for text-and-button tasks is minimal, additional UI feature handlers can be added to agent framework on a per-task basis)

Below are brief descriptions of UINL widgets and features.

Check out the full UINL spec with examples:
- [google spreadsheet](https://docs.google.com/spreadsheets/d/1OkwYU2Wq-ysESvEwfeu7J0NrEw2qGadOCmkjEe0JKc4/edit?usp=sharing)
- [tab-separated values](uinl.tsv)


----

## Sample Interaction

| Message Type    | Message Content    | Description    |
| -------- | -------- | -------- |
| **UI->APP** | `{"t":0}`    | user-agent announces that it has loaded, and requests the initial display; `"t":0` indicates that UI clock **t**ime is at 0ms |
| **APP->UI** | `{"v":["Hello World!",{"class":"btn","id":"click me"}]}` | text "Hello World!" and button "click me" are added to user display    |
| **UI->APP** | `{"t":3450,"u":"click me","v":true}`    | user clicks the button "click me" (3.45s after the UI loaded); `"u":"click me"` indicates that the **u**nique id of the target item of current user-event is `"click me"`; `"v":true` indicates that the **v**alue of target item was toggled from its default state (`false`) to `true` -- i.e., button was clicked    |
| **APP->UI** | `{"v":["Goodbye."],"state":0}`    | display is cleared, text "Goodbye." is added to the display; `"state":0` indicates that app is closing    |


----

## UINL Component Classes (i.e., GUI widget types)

- The first 5 classes below (in bold) are part of core-UINL
- Every other widget is part of extended UINL
  - use the "require" command to require additional component classes beyond the 4 core classes

| Component Class | Component Type    | Child Component Class    | Short Description    |
| -------- | -------- | -------- | -------- |
| **root**    | container (list)    | any, except "grg", "gr", and "dp" | root container refers to the entire UI display; it is a special "bin" that has no id and cannot be deleted    |
| **"bin"**    | container (list)    | any, except "grg", "gr", and "dp" | generic container (functionally equivalent to HTML div)    |
| **"txt"**    | text (str)    |    | generic UTF8 text or text input    |
| **"num"**    | number (float)    |    | numeric item or numeric input; may have options for range, step-size, and unit type    |
| **"btn"**    | toggle (bool)    |    | clickable button    |
| "hold"    | toggle (bool)    |    | hold-down button (different from "btn" in that it sends events both when it is down and when it is released)    |
| "opt"    | toggle (bool)    |    | option; this is a selectable and deselectable item (e.g., checkbox, radio button, selection)    |
| "time"    | number (float)    |    | amount of time (in seconds)    |
| "dt"    | number (float)    |    | date-time field; specifies date and/or time of day; this item's value represents number of seconds since epoch    |
| "math"    | text (str)    |    | mathematical value or formula; a special text item that follows AsciiMath syntax; Note: use "i" or ⅈ to denote imaginary number (i.e., square root of -1)    |
| "doc"    | text (str)    |    | embedded document -- text with markup syntax; default markup language is HTML (use "fmt" property to change markup language; e.g., use "fmt":"md" for markdown syntax)   |
| "rgb"    | text (str)    |    | color; a special text item whose value is a 6-character hexadecimal value, representing RGB color    |
| "win"    | container (list)    | any, except "grg", "gr", and "dp" | floating window or modal popup or toast    |
| "one"    | container (list)    | "bin"    | a container with one child whose content is visible and other children whose content is hidden (usually represented to humans as tabs, accordion, or a carousel)    |
| "grid"    | container (list)    | "bin"    | grid (i.e., table); each child of this container is a "bin" which represents a table row, and each of its children are row cells    |
| "<"    | none    |    | grid cell merged with a cell to its left -- a special blank item inside a table row, indicating that an item directly to its left spans rightward into this cell's space |
| "^"    | none    |    | grid cell merged with a cell above it -- a special blank item inside a table row, indicating that an item directly above it spans downward into this cell's space    |
| "url"    | url (special str)    |    | inline frame displaying external resources    |
| "media"    | url (special str)    |    | embedded playable media (e.g., audio, video, slideshow)    |
| "plot"    | container (list)    | "data"    | 2d plot chart    |
| "data"    | container (list)    | "dp"    | data series (displayed as a standalone 2d plot, or overlapping with other data series inside a "plot" item)    |
| "dp"    | number (float)    |    | data point inside a "data" item    |
| "2d"    | container (list)    | "gr" or "grg"    | 2d graphical viewport    |
| "3d"    | container (list)    | "gr" or "grg"    | 3d graphical viewport    |
| "grg"    | container (list)    | "gr" or "grg"    | a group of "gr" items    |
| "gr"    | container (list)    | "l"    | graphical node or shape, potentially with lines/arrows connecting to other graphical nodes    |
| "l"    | uid (str, int, list) |    | line/link connecting its parent "gr" item to another item in current viewport    |

----

## UINL Properties and Commands in APP->UI messages

- The first 8 of the properties/commands below (in bold) are core-UINL
- Every other property/command below is a part of extended UINL
  - use the "require" command to require any extended features

| Property or Command | Short name | Restricted to    | Short Description    |
| -------- | -------- | -------- | -------- |
| **require**    | **require**    | root    | specify required UI functionality    |
| **state**    | **S**    | root    | Session state    |
| **queue**    | **Q**    | any    | Queue multiple UI updates    |
| **update**    | **U**    | container    | Update item on display    |
| **add**    | **A**    | container    | Add to current value    |
| **class**    | **c**    | any, except root    | component class (i.e., widget type)    |
| **id**    | **id**    | any, except root    | set item id    |
| **value**    | **v**    | any    | set item value    |
| error    | error    | root    | send error message    |
| style    | style    | root    | load stylesheet    |
| open    | open    | root    | open or download external resource (without closing UI)    |
| save    | save    | root    | save text/data to user's storage device    |
| time    | T    | root    | Time scheduling for current declaration or update    |
| trigger    | Tr    | root    | Trigger rule for current declaration or update    |
| timeDelay    | Td    | any    | Timed delay (i.e., timeout) prior to current declaration or update    |
| timeInterval    | Ti    | any    | Time interval for current declaration or update    |
| timingName    | Tn    | any    | Timing or trigger name    |
| timingCancel    | Tc    | root    | Timing or trigger cancelation    |
| request    | R    | any    | Request info about current item    |
| updateChildren    | U\*    | container    | Update multiple matching child items in current container    |
| updateDeep    | U\*\*    | container    | Update multiple matching descendant items in current container    |
| move    | M    | any    | Move item to another container    |
| addTags    | Atag    | any    | Add tags to item's "tag" property    |
| <-    | <-    | container    | assign property values in a series    |
| async    | @    | root    | time since the handshake from user agent was received by the application (for asynchronous tasks)    |
| task    | task    | root    | task instructions    |
| templates    | tl    | root    | templates (i.e., named sets of property updates that may be used by Q, df, ctx, and fs properties)    |
| caption    | cap    | any    | caption/title    |
| contextMenu    | ctx    | any    | context menu    |
| scrollX    | sx    | any    | horizontal scrolling    |
| scrollY    | sy    | any    | vertical scrolling    |
| index    | i    | any, except root    | item index (i.e., order) within its parent container    |
| effect    | ef    | any, except root    | effect/strength    |
| affect    | af    | any, except root    | affect/sentiment    |
| tag    | tag    | any, except root    | item tags (for indicating semantic categories and emphasis)    |
| tip    | tip    | any, except root    | tooltip text    |
| reference    | ref    | any, except root    | references to other items (e.g., footnotes, citations)    |
| input    | in    | any    | interaction flag (e.g., to enable/disable buttons, inputs)    |
| onEvent    | on    | any    | state-change event listeners    |
| throttle    | throt    | any    | throttle event processing    |
| focus    | fcs    | any    | focus or remove focus from current item    |
| keyShortcuts    | keys    | any, except root    | keyboard shortcuts for focusing or toggling current item    |
| movable    | mv    | any, except root    | enable user to move (e.g. drag and drop) current item into other containers    |
| movableDeep    | mv\*    | any, except root    | enable user to move (e.g. drag and drop) current item into other containers, or into any of their descendant containers    |
| deletable    | del    | any, except container    | delete functionality (i.e., enable user to remove item from display)    |
| closeable    | cls    | container    | close functionality (i.e., enable user to close/remove container from display)    |
| reorderable    | ro    | container    | re-order functionality (i.e., enable user to reorder items in current container)    |
| goButton    | go    | text, number    | go button (i.e., adds "Go" action to text and numeric inputs)    |
| hash    | hash    | text, number    | salt and hash input prior to sending    |
| encrypt    | enc    | text, number    | encrypt input prior to sending    |
| markText    | mark    | text    | mark text region selection (i.e., select part or all of current text)    |
| foldable    | fold    | "bin", "win", "grid", "one", "plot", "2d", "3d"    | mark container as foldable/minimizable    |
| size    | wh    | "bin", "win", "grid", "one", "plot", "2d", "3d"    | container size    |
| defaults    | df    | container    | default template for descendant items    |
| min    | min    | number    | minimum displayable value    |
| max    | max    | number    | maximum displayable value    |
| step    | step    | number    | step size for current item's numeric value (interacts with "min")    |
| unit    | unit    | number    | unit of measurement (e.g. "\$", "\%", "kg", "€ million", "\$ k")    |
| logScale    | log    | number    | log-scale for current item's numeric value (interacts with "min" and "step")    |
| length    | len    | "txt"    | maximum number of displayable characters    |
| optionGroup    | grp    | "opt"    | group options, such that only one among them can be selected at a time (i.e., like radio buttons or pull-down menu)    |
| holdGroup    | hgrp    | "hold"    | group hold-down buttons, such that after one button is pushed down and prior to release, hovering over any other button in this group releases the prior pushed down button and pushes down the hovered-over button |
| modal    | mod    | "win"    | window modality    |
| location    | xy    | "win"    | location of "win" item relative to its parent top-left corner    |
| rows    | rows    | "grid"    | minimum number of rows in current grid    |
| columns    | cols    | "grid"    | minimum number of columns in current grid    |
| headerRow    | head    | "grid"    | mark first row in this grid as a header row with special functionality (e.g., "df" property for a cell in header row creates default templates for all cells in its column)    |
| hexGrid    | hex    | "grid"    | offset every other row in the grid, such that each non-peripheral cell has 6 adjacent cells (left, right, above+left, above+right, below+left, below+right) rather than 4 (left, right, above, below)    |
| format    | fmt    | "doc", "url", "media", plus "Open" and "Save" commands | format type for "url", "media", and "doc" components, as well as for root-level commands "Open" and "Save"    |
| play    | play    | "media"    | pause/play media    |
| at    | at    | "media"    | audio/video time position (in seconds)    |
| axisx    | axisx    | "plot", "data"    | x-axis labels/markers    |
| axisy    | axisy    | "plot", "data"    | y-axis labels/markers    |
| plotType    | plt    | "data"    | plot type (i.e., chart type)    |
| errorBar    | err    | "dp"    | top error-bar length for a data-point    |
| errorBarBottom    | err2    | "dp"    | bottom error-bar length for a data-point    |
| width    | w    | "2d", "3d", "gr"    | width of graphical item or viewport    |
| height    | h    | "2d", "3d", "gr"    | height of graphical item or viewport    |
| x    | x    | "grg", "gr", "dp"    | location of item along the x-axis    |
| y    | y    | "grg", "gr"    | location of item along the y-axis    |
| rotation    | rot    | "grg", "gr"    | rotation of graphical item or group    |
| shape    | shp    | "gr"    | shape of this graphical item    |
| opaque    | opq    | "gr"    | set item as opaque or transparent    |
| scaleX    | x^    | "grg"    | scale group of graphical items along the x-axis    |
| scaleY    | y^    | "grg"    | scale group of graphical items along the y-axis    |
| direction    | dir    | "l"    | direction of line/link (e.g., signified via an arrow)    |
| z    | z    | "grg", "gr"    | location of item along the z-axis    |
| depth    | d    | "gr"    | depth of graphical item    |
| rotationX    | rx    | "grg", "gr"    | rotate item or group of items along the x-axis    |
| rotationY    | ry    | "grg", "gr"    | rotate item or group of items along the y-axis    |
| scaleZ    | z^    | "grg"    | scale group of graphical items along the z-axis    |
| overlap    | ovr    | "grg", "gr"    | overlap event options (i.e., collision detection)    |
| frameset    | fs    | any    | frame-set for updating current item    |
| frame    | f    | any    | current frame index    |
| +frame    | +f    | any    | set velocity for "f" property (i.e., animate through the frameset specified via "fs")    |
| +value    | +v    | number    | animate the "v" property    |
| +scrollX    | +sx    | any    | animate the "sx" property    |
| +scrollY    | +sy    | any    | animate the "sy" property    |
| +x    | +x    | "dp", "grg", "gr"    | animate the "x" property    |
| +y    | +y    | "dp", "grg", "gr"    | animate the "y" property    |
| +width    | +w    | "gr"    | animate the "w" property    |
| +height    | +h    | "gr"    | animate the "h" property    |
| +rotation    | +rot    | "grg", "gr"    | animate the "rot" property    |
| +scaleX    | +x^    | "grg"    | animate the "x^" property    |
| +scaleY    | +y^    | "grg"    | animate the "y^" property    |
| +frameOptions    | +f\|    | any    | set velocity for "f" property (i.e., animate through the frameset specified via "fs")    |
| +valueOptions    | +v\|    | number    | animation options for the "v" animation    |
| +scrollXOptions    | +sx\|    | any    | animation options for the "sx" animation    |
| +scrollYOptions    | +sy\|    | any    | animation options for the "sy" animation    |
| +xOptions    | +x\|    | "dp", "grg", "gr"    | animation options for the "x" animation    |
| +yOptions    | +y\|    | "dp", "grg", "gr"    | animation options for the "y" animation    |
| +widthOptions    | +w\|    | "gr"    | animation options for the "w" animation    |
| +heightOptions    | +h\|    | "gr"    | animation options for the "h" animation    |
| +rotationOptions    | +rot\|    | "grg", "gr"    | animation options for the "rot" animation    |
| +scaleXOptions    | +x^\|    | "grg"    | animation options for the "x^" animation    |
| +scaleYOptions    | +y^\|    | "grg"    | animation options for the "y^" animation    |
| +depth    | +d    | "gr"    | animate the "d" property    |
| +z    | +z    | "grg", "gr"    | animate the "z" property    |
| +rotationX    | +rx    | "grg", "gr"    | animate the "rx" property    |
| +rotationY    | +ry    | "grg", "gr"    | animate the "ry" property    |
| +scaleZ    | +z^    | "grg"    | animate the "z^" property    |
| +depthOptions    | +d\|    | "gr"    | animation options for the "d" animation    |
| +zOptions    | +z\|    | "grg", "gr"    | animation options for the "z" animation    |
| +rotationXOptions   | +rx\|    | "grg", "gr"    | animation options for the "rx" animation    |
| +rotationYOptions   | +ry\|    | "grg", "gr"    | animation options for the "ry" animation    |
| +scaleZOptions    | +z^\|    | "grg"    | animation options for the "z^" animation    |

----

## UINL properties in user-event messages (UI->APP messages)

User event messages (i.e., UI->APP messages) are sent from UI software to the application software when task begins (i.e., handshake), whenever user input occurs, when there is an error, whenever information is requested via the "request" or "require" commands, or when some event is fired that application software has subscribed to via "onEvent" property or via some animation properties
- properties in bold are part of core-UINL
- italicized properties are optionally included in the handshake (i.e., the very first message passed from UI to application software)


| UI->APP property | Short Description    |
| -------- | -------- |
| **requirable**    | specifies all requirable UI functionality    |
| **s**    | session state (this is echoed from the session state specified via the APP->UI "state" command)    |
| **t**    | timestamp (number of milliseconds after handshake) indicating when user event has occurred; must be 0 for handshake and greater than 0 for all other messages    |
| **u**    | unique id (or id-path) for item being toggled/changed in the UI    |
| **v**    | value indicating user input    |
| **error**    | error message to be dumped into app-side error stream    |
| *userAgent*    | information about UI software (i.e., user-agent name, version)    |
| *wh*    | available width/height of application window (in pixels)    |
| *ip*    | user-agent ip address    |
| *url*    | url (if any) employed by UI to connect to the app    |
| *time*    | full user local time, including milliseconds and timezone offset, in ISO8601 format (e.g. "2020-04-27T11:26:43.967-04:00")    |
| *platform*    | information about where UI software is running (i.e., OS, framework)    |
| *system*    | any user-system information available (e.g., memory available, type of GPU, type of CPU)    |
| *screen*    | user screen information (e.g. {"availWidth":1168,"availHeight":692,"width":1229,"height":692,"colorDepth":24,"pixelDepth":24,"availLeft":0,"availTop":0,"orientation":{"angle":0,"type":"landscape-primary"}}); at a minimum, if this information is available, returned object should include "width":<<number>> and "height":<<number>> |
| r    | information returned to application software, as requested via the "R" command or via animation or overlap/collision options    |
| i    | user has moved current item within current container    |
| m    | user has moved current item into another container    |
| xy    | item location changed    |
| wh    | item size changed    |
| whc    | size of item content changed    |
| fold    | item folded or unfolded (i.e., minimized or restored)    |
| fcs    | item got or lost focused (i.e., focus/blur)    |
| sx    | scrollX event    |
| sy    | scrollY event    |
| mark    | text selected by user    |
| copy    | copy event    |
| cut    | cut event    |
| paste    | paste event    |
| k    | keydown event    |
| ku    | keyup event    |
| kc    | keydown event with keycode    |
| kcu    | keyup event with keycode    |
| sw    | scrollwheel event    |
| swh    | horizontal scrollwheel event    |
| pd    | pointer down event (or primary mouse button down event)    |
| pu    | pointer up event (or primary mouse button up event)    |
| pc    | pointer click event (or primary mouse button click event)    |
| pcc    | pointer double-click event (or primary mouse button double-click event)    |
| md    | mouse-button down event for non-primary mouse buttons    |
| mu    | mouse-button up event for non-primary mouse buttons    |
| p    | pointer movement event    |
| pe    | pointer movement end event    |
| po    | pointer over or pointer out event    |
| pp    | pointer pressure or hover distance event    |
| p2d    | 2nd pointer down event    |
| p2u    | 2nd pointer up event    |
| p2c    | 2nd pointer click event    |
| p2cc    | 2nd pointer double-click event    |
| p2    | 2nd pointer movement event    |
| p2e    | 2nd pointer movement end event    |
| p2o    | 2nd pointer over or pointer out event    |
| p2p    | 2nd pointer pressure or hover distance event    |
| p3d    | 3rd pointer down event    |
| p3u    | 3rd pointer up event    |
| p3c    | 3rd pointer click event    |
| p3cc    | 3rd pointer double-click event    |
| p3    | 3rd pointer movement event    |
| p3e    | 3rd pointer movement end event    |
| p3o    | 3rd pointer over or pointer out event    |
| p3p    | 3rd pointer pressure or hover distance event    |
| p4d    | 4th pointer down event    |
| p4u    | 4th pointer up event    |
| p4c    | 4th pointer click event    |
| p4cc    | 4th pointer double-click event    |
| p4    | 4th pointer movement event    |
| p4e    | 4th pointer movement end event    |
| p4o    | 4th pointer over or pointer out event    |
| p4p    | 4th pointer pressure or hover distance event    |
| g    | gamepad state-changed event (i.e., gamepad button or axis-state has changed)    |
| g2    | 2nd gamepad state-changed event (i.e., gamepad button or axis-state has changed)    |
| g3    | 3rd gamepad state-changed event (i.e., gamepad button or axis-state has changed)    |
| g4    | 4th gamepad state-changed event (i.e., gamepad button or axis-state has changed)    |
| play    | media play/pause event listener; fires whenever user hits play/pause    |
| at    | media position event listener; fires whenever playback position changes    |
| av    | audio/video settings    |
| o    | overlap start event    |
| r2    | information returned to application software, as requested via overlap/collision options    |
| e    | overlap end event    |
| b    | before-overlap (i.e., collision) event    |
| +f    | frame animation finished    |
| +v    | value animation finished    |
| +sx    | scrollX animation finished    |
| +sy    | scrollY animation finished    |
| +x    | x animation finished    |
| +y    | y animation finished    |
| +w    | width animation finished    |
| +h    | height animation finished    |
| +rot    | rotation animation finished    |
| +x^    | scaleX animation finished    |
| +y^    | scaleY animation finished    |
| +d    | depth animation finished    |
| +z    | z animation finished    |
| +rx    | rotationX animation finished    |
| +ry    | rotationY animation finished    |
| +z^    | scaleZ animation finished    |
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

Check out u1js UINL library and demo:
- [u1js](https://uinl.github.io/u1js/)
- [demo](https://uinl.github.io/u1js/demo.html)


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
| "file"    | text (str)    |    | file chooser   |
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

Check out the full UINL spec with widget all properties and examples:
- [google spreadsheet](https://docs.google.com/spreadsheets/d/1OkwYU2Wq-ysESvEwfeu7J0NrEw2qGadOCmkjEe0JKc4/edit?usp=sharing)
- [tab-separated values](uinl.tsv)

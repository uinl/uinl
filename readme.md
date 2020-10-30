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


***


***

Sample Interactions:

    <-     Message received by task software from user software
    ->     Message sent from task software to user software

    Sample Interaction:
        // add text "Hello World" and a "Click Me" button to the display
        -> ["Hello World",{"id":"Click Me","v":false}]
        // user clicks the button (3.45s into the task)
        <- {"_":"Click Me","v":true,"u":3450}
        // remove "Click Me" button
        -> {"_":"Click Me","v":null}
  

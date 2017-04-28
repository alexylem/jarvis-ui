<!---
IMPORTANT
=========
This README.md is displayed in the WebStore as well as within Jarvis app
Please do not change the structure of this file
Fill-in Description, Usage & Author sections
Make sure to rename the [en] folder into the language code your plugin is written in (ex: fr, es, de, it...)
For multi-language plugin:
- clone the language directory and translate commands/functions.sh
- optionally write the Description / Usage sections in several languages
-->
## Description
This plugin embeds a lightweight web server to control Jarvis from a user interface.
The HTTP Server is based on Python, so no dependency to install.
There is no configuration needed, just install the plugin and start Jarvis normally.
Speech recognition button only works on Chrome for Desktop and Android.

## Dependencies

This plugins needs [Jarvis-API plugin](http://domotiquefacile.fr/jarvis/plugins/jarvis-api) to be installed.

## Screenshot

![Client](https://cdn.rawgit.com/alexylem/jarvis-ui/master/screenshots/client.png)

![Config](https://cloud.githubusercontent.com/assets/11017174/20649162/b9ef199c-b4b8-11e6-8534-584de684c51b.png)

![Commands](https://cloud.githubusercontent.com/assets/11017174/20580175/22bcb74e-b1d1-11e6-9bbd-bbb84343dd95.png)

![Events](https://cloud.githubusercontent.com/assets/11017174/20899691/c1420d0c-bb2b-11e6-9893-0cfd4240a67c.png)

https://youtu.be/xV3RfVNwzwc

What you can do:
* Start the user interface from any modern browser
* Use on smartphone (responsive)
* Type commands to execute
* Make Jarvis say something
* Manage user commands
* Manage Events
* Configure Jarvis
* Use in mute / verbose modes
* Choose from Light / Dark themes
* Speak commands to execute (only Chrome)

New features to come soon:
* Manage plugins
* Install Jarvis remotely

## Usage
```
$> ./jarvis.sh
Starting User Interface on http://192.168.1.20:8081
...
```
Now open the above URL in a modern web browser.
You can also ask Jarvis (needs a graphical environment):
```
$> ./jarvis.sh
You: open the interface
Jarvis: Ok
```

## Author
[Alex](https://github.com/alexylem)

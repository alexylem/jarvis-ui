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

## Dependencies

This plugins needs [Jarvis-API plugin](http://domotiquefacile.fr/jarvis/plugins/jarvis-api) to be installed.

## Screenshot

![Client](https://cdn.rawgit.com/alexylem/jarvis-ui/master/screenshots/client.png)
![Config](https://cloud.githubusercontent.com/assets/11017174/20649162/b9ef199c-b4b8-11e6-8534-584de684c51b.png)
![Commands](https://cloud.githubusercontent.com/assets/11017174/20580175/22bcb74e-b1d1-11e6-9bbd-bbb84343dd95.png)
![Events](https://cloud.githubusercontent.com/assets/11017174/20898581/2e81c2cc-bb27-11e6-9897-8e7e0643ef40.png)

## Usage
```
$> ./jarvis.sh
Starting User Interface on http://192.168.1.20:8081
...
```
Now open the above URL in a modern web browser.

## Author
[Alex](https://github.com/alexylem)

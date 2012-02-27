Getting Started
===============

In 6 steps, you'll have chef-client-mobile up and running in your browser from scratch.

Linux / Mac OS X
================

## 1 - [Installing Git](http://book.git-scm.com/2_installing_git.html)

## 2 - [Installing node.js and NPM](https://github.com/joyent/node/wiki/Installation)

## 3 - Get the code

    > git clone git://github.com/peterwmwong/starbox-client-web.git
    > cd starbox-client-web

## 4 - Run Stylus/CoffeeScript compilers

    > make stylus
    > make coffee

This will compile `.styl` *to* `.css` and `.coffee` *to* `.js`.  
File changes will **automatically** be recompiled.

## 5 - Run development server

    > make server

In a browser, visit `http://localhost:3000/index-dev.html?usemockdata=true`.  

### Why a server?

**The development server is JUST for live.js/livereload and Chrome**. live.js/livereload uses XHR to automatically reload JavaScript and CSS, Chrome does not allow XHR over the `file://` protocol ([issue 41024](http://code.google.com/p/chromium/issues/detail?id=41024)).


## 6 - Pimp your editor for Stylus and CoffeeScript

* [Sublime Text 2](http://www.sublimetext.com/2) *Sublime Rocks!*
  * [CoffeeScript TextMate Bundle](https://github.com/jashkenas/coffee-script-tmbundle)
  * [Stylus TextMate Bundle](https://github.com/LearnBoost/stylus/blob/master/docs/textmate.md)
    * After running `npm install`, the `Stylus.tmbundle` directory can be found in starbox-client-web here: `{starbox-client-web Project Directory}/node_modules/stylus/editors`
* [Vim](http://www.vim.org/) or [MacVim](http://code.google.com/p/macvim/)
  * [vim-stylus](https://github.com/wavded/vim-stylus)
  * [vim-coffee-script](https://github.com/kchmck/vim-coffee-script)
* [TextMate](http://macromates.com/)
  * [Stylus TextMate Bundle](https://github.com/LearnBoost/stylus/blob/master/docs/textmate.md)
    * After running `npm install`, the `Stylus.tmbundle` directory can be found in starbox-client-web here: `{starbox-client-web Project Directory}/node_modules/stylus/editors`
  * [CoffeeScript TextMate Bundle](https://github.com/jashkenas/coffee-script-tmbundle)

## Get coding!


Deploying Checklist
===================

## 1 - Compile Stylus/CoffeeScript

    > make stylus
    > make coffee

## 2 - Rebuild bootstrap.js and bootstrap.css

    > make clean; make

## 3 - Automated Browser Test

    > make specs

In a browser, go to [http://localhost:3000/spec-runner].


## 4 - Manual Browser Test

    > make server

In a browser, go to [http://localhost:3000] and spotcheck functionality hasn't regressed.


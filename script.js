// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-08-20
// @description  A script to enhance page appearance and structure
// @author       You
// @match        file://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //Creating the container
    const container = document.createElement('div');
    container.classList.add('container');
    //creating the sidebar
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');
    //creating preview panel;
    const main = document.createElement('div');
    main.classList.add('main');
    //selecting table from document
    const table = document.querySelector('table');
    table.classList.add('table');

    // Create and add the style tag
    const style = document.createElement('style');
    const css = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            margin: 0;
            height: 100vh;
            width: 100vw;
            background: #151515;
            overflow: hidden; /* Prevents scrolling if content is larger than viewport */
        }
        .container {
            position: absolute;
            height: calc(100% - 20px);
            width: calc(100% - 20px);
            background: #202020;
            border-radius: 5px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 10px;
            overflow: auto; /* Allows scrolling within the container if necessary */
        }
        .container h1{
            font-family: 'JetBrainsMono Nerd Font';
            font-size: 1.3em;
            background: #303030;
            border-radius: 5px;
            border: none;
            padding: 5px 20px;
        }
        .sidebar{
            position: absolute;
            width: 200px;
            background: #303030;
            height: calc(100% - 70px);
            border-radius: 5px;
            overflow: hidden;
        }
        #parentDirLinkBox{
            position: relative;
            width: 100%;
            height: 30px;
            background: #404040;
            border-radius:5px;
        }
        #parentDirLinkBox a{
            position: absolute;
            width: 100%;
            height: 100%;
            text-align: center;
            padding: 5px;
            color: white;
        }
        #parentDirLinkBox a span{
            font-family: 'JetBrainsMono Nerd Font';
        }
        .table{
           width: 300px;
        }
        .table thead{
            display: none;
        }
        .detailsColumn{
            display: none;
        }
        .table tbody tr{
            padding: 5px 0px;
            height: 30px;
        }
        .table tbody tr td:has(a){
            position: absolute;
            display: block;
            overflow: hidden;
            padding: 5px;
            height: 30px;
            width: 180px;
            left: 10px;
            border-radius: 5px;
            -webkit-mask-image: linear-gradient(90deg, #000 80%, transparent);
        }
        .table tbody tr td a{
            position: absolute;
            font-family: 'jetBrainsMono Nerd Font';
            font-size: 1em;
            text-decoration: none;
            color: #81d4f9;
            width: 400px;
        }
        .table tbody tr:hover{
            background: #505050;
        }
        .main{
            position: absolute;
            width: calc(100% - 230px);
            left: 220px;
            background: #303030;
            height: calc(100% - 70px);
            border-radius: 5px;
            overflow: hidden;
            display: grid;
            place-items: center;
            font-size:2em;
            text-transform: uppercase;
            font-family: arial;
            font-weight: bold;
            color: #404040;
        }
    `;
    style.textContent = css;
    document.head.appendChild(style);
    
    
    //===============[add favicon]===============//
    const favicon = 'https://cdn-icons-png.flaticon.com/512/9396/9396415.png';
    function setFavicons(favImg){
        let setFavicon = document.createElement('link');
        setFavicon.setAttribute('rel','shortcut icon');
        setFavicon.setAttribute('href',favImg);
        document.head.appendChild(setFavicon);
    }
    setFavicons(favicon);
    //===========================================//

    
    //===============[ICON REMOVER]================//
    function removeClassFromAllElements(className) {
        const elements = document.querySelectorAll(`.${className}`);
        // Loop through each element and remove the class
        elements.forEach(element => {
            element.classList.remove(className);
        });
    }
    //removing icons from links
    removeClassFromAllElements('icon');
    removeClassFromAllElements('file');
    removeClassFromAllElements('up');
    removeClassFromAllElements('dir');
    //=============================================//



    //=========[making html well structured]=========//
    // this code put visible elements inside
    // container from body and put container inside body...
    // Create an array to hold the nodes to be moved
    const nodesToMove = [];
    // Collect all children nodes except <script> tags
    Array.from(document.body.childNodes).forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'SCRIPT') {
            console.log('Script tag found, not moving:');
        } else {
            nodesToMove.push(child); // Collect nodes to move
        }
    });
    // Move all collected nodes to the container
    nodesToMove.forEach(node => {
        document.body.removeChild(node); // Remove from body
        container.appendChild(node); // Append to new div
    });
    // Insert the container as the first child of body
    document.body.insertBefore(container, document.body.firstChild);
    //================================================//


    //========[insert sidebar and preview panel into container]=========//
    container.appendChild(sidebar);
    container.appendChild(main);
    //==================================================================//


    main.textContent = "preview here";  //insert text inside preview panel.


    //==============[move all link elements inside sidebar]=================//
    Array.from(container.childNodes).forEach(child => {
    if (child.tagName !== 'h1' && (child.id === 'parentDirLinkBox' || child.tagName === 'TABLE')) {
        container.removeChild(child);
        sidebar.appendChild(child);
    }
    });
    //======================================================================//



    //=========[remove 'index of' text from header]=========//
    const h1 = document.getElementById('header');
    if (h1) {
        let text = h1.textContent.trim();
        const words = text.split(/\s+/);
        words.splice(0, 2);
        h1.textContent = words.join(' ');
    }
    //======================================================//



    //=============[replace parent directory text with icon]==============//
    const parentdirectory = document.getElementById('parentDirLink');
    parentdirectory.querySelector('span').textContent = "";
    //====================================================================//





    //=========================[code to preview common files inside preview panel]================================//
    const fileLinks = document.querySelectorAll('a');
    fileLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const fileUrl = this.href;


            // Check if the file is audio
            if (fileUrl.endsWith('.mp3') || fileUrl.endsWith('.m4a')) {
                event.preventDefault();
                main.innerHTML = '';
                const audioPlayer = document.createElement('audio');
                audioPlayer.controls = true;
                audioPlayer.src = fileUrl;
                main.appendChild(audioPlayer);
                audioPlayer.play();
            }

            // check if the file is mp4
            if (fileUrl.endsWith('.mp4') || fileUrl.endsWith('.mkv')) {
                event.preventDefault();
                main.innerHTML = '';
                const videoPlayer = document.createElement('video');
                videoPlayer.controls = true;
                videoPlayer.src = fileUrl;
                videoPlayer.style.maxWidth = parseInt(main.clientWidth*0.9)+'px';
                videoPlayer.style.maxHeight = parseInt(main.clientHeight*0.9)+'px';
                videoPlayer.style.border = 'solid 5px #444'
                videoPlayer.style.borderRadius = '10px'
                main.appendChild(videoPlayer);
                videoPlayer.play();
            }

            //check if file is image
            if (fileUrl.endsWith('.jpg') || fileUrl.endsWith('.png')) {
                event.preventDefault();
                main.innerHTML = '';
                const imageViewer = document.createElement('img');
                imageViewer.src = fileUrl;
                imageViewer.style.maxWidth = parseInt(main.clientWidth*0.9)+'px';
                imageViewer.style.maxHeight = parseInt(main.clientHeight*0.9)+'px';
                imageViewer.style.border = 'solid 5px #444'
                imageViewer.style.borderRadius = '10px'
                main.appendChild(imageViewer);
                imageViewer.play();
            }


        });
    });
    //===============================================================================================================//


})();

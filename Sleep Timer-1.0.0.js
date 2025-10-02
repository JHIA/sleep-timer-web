// ==UserScript==
// @name         Sleep Timer
// @namespace    http://tampermonkey.net/sleeptimer
// @version      1.0.0
// @description  Sleep timer for website browser
// @author       @jhiaulhaq
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        window.close
// @grant        GM_openInTab
// ==/UserScript==

(function() {
    'use strict';
    
    let countdownInterval = null;

    function getDuration(){
        let time = parseInt(prompt("Sleep in how many minutes?"));
        let duration = time * 60;
        return duration;
    };

    function closeTab(){
        try {
            window.location.href = 'about:blank';
            window.close();
        } catch (e) {
            console.log('Redirect method failed...');
        }
    }

    function startCountdown() {
        let fixedDuration = getDuration();
        let timeLeft = fixedDuration;

        countdownInterval = setInterval(() => {
            timeLeft--;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                closeTab();
            }
        }, 1000);
    }

    if (window.top === window.self) {
        console.log("Extension sleep timer is active");
        startCountdown()
    }
})();
// ==UserScript==
// @name         Sleep Timer v2
// @namespace    http://tampermonkey.net/sleeptimer
// @version      2.0.0
// @description  Sleep timer for YouTube Music
// @author       @jhiaulhaq
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.youtube.com
// @grant        window.close
// @grant        GM_openInTab
// ==/UserScript==

(function () {
  "use strict";

  let countdownInterval = null;

  function startCountdown(timerSet) {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    let timeLeft = timerSet * 60;

    countdownInterval = setInterval(() => {
      timeLeft--;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        pause();
      }
    }, 1000);
  }

  function pause() {
    const media = document.querySelectorAll("video, audio");
    media.forEach((m) => {
      m.pause();
    });
  }

  function createTimerMenuItem() {
    const MENU_ID = "my-custom-timer-menu";
    if (document.getElementById(MENU_ID)) return;

    // Cari listbox tempat menu berada
    const parentMenu = document.querySelector(
      "tp-yt-paper-listbox.style-scope.ytmusic-menu-popup-renderer",
    );

    if (parentMenu) {
      const newItem = document.createElement("div");
      newItem.id = MENU_ID;
      newItem.setAttribute("role", "menuitem");
      newItem.setAttribute("tabindex", "-1");
      newItem.className = "style-scope ytmusic-menu-popup-renderer";

      newItem.style.cssText = `
                cursor: pointer;
                height: 48px;
                display: flex;
                align-items: center;
                font-family: "Roboto","Noto",sans-serif;
                font-size: 14px;
                color: var(--ytmusic-color-white-1);
            `;

      // Hover Effect manual karena kita tidak pakai custom element YT
      newItem.onmouseover = () =>
        (newItem.style.backgroundColor = "rgba(255,255,255,0.1)");
      newItem.onmouseout = () =>
        (newItem.style.backgroundColor = "transparent");

      // 1. Anchor (untuk struktur visual)
      const anchor = document.createElement("div");
      anchor.className =
        "yt-simple-endpoint style-scope ytmusic-menu-navigation-item-renderer";
      anchor.style.cssText =
        "display: flex; align-items: center; width: 100%; text-decoration: none; color: inherit;";

      // 2. Icon
      const iconWrap = document.createElement("div");
      iconWrap.setAttribute("id", "icon-wrap");
      iconWrap.className =
        "icon style-scope ytmusic-menu-service-item-renderer";

      iconWrap.style.cssText = "width: 18px; height: 18px; flex: none;";

      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");

      svg.setAttribute("viewBox", "0 0 2048 2048");
      svg.setAttribute("width", "18");
      svg.setAttribute("height", "18");
      svg.style.cssText =
        "pointer-events: none; display: block; width: 100%; height: 100%;";

      const pathData = [
        "M 1012.43 170.445 C 1023.08 170.247 1033.73 170.169 1044.39 170.209 C 1083.39 170.695 1141.79 175.898 1171.38 204.898 C 1186.36 219.584 1197.94 240.981 1196.1 262.261 C 1193.87 288.187 1185.39 314.615 1165.58 332.193 C 1127.2 366.246 1097.39 344.073 1057.05 342.249 C 875.497 333.986 698.126 398.333 564.102 521.078 C 428.246 645.026 348.35 818.689 342.616 1002.5 C 336.936 1179.84 400.75 1352.39 520.455 1483.37 C 645.122 1619.94 819.761 1700.25 1004.59 1705.98 C 1308.74 1713.49 1581.4 1519.51 1674.03 1229.71 C 1689.13 1181.67 1698.95 1132.13 1703.3 1081.96 C 1705.42 1054.99 1703.9 1026.03 1709.11 999.697 C 1722.42 933.898 1813.62 919.399 1856.52 964.228 C 1884.85 993.832 1878.39 1042.39 1876.2 1079.75 C 1875.67 1101 1869.85 1141.66 1866.47 1162.36 C 1839.43 1324.04 1766.49 1474.54 1656.31 1595.93 C 1501.94 1766.77 1285.23 1868.2 1055.14 1877.28 C 1015.99 1878.8 976.779 1877.35 937.843 1872.96 C 756.854 1854.25 586.564 1778.25 451.769 1656.04 C 301.59 1519.99 204.393 1335.19 177.386 1134.36 C 143.994 887.918 225.253 631.888 393.835 449.101 C 520.278 310.585 688.681 217.388 873.2 183.811 C 924.888 174.679 960.817 172.693 1012.43 170.445 z",
        "M 1417.52 256.214 C 1434.56 254.958 1460.39 255.691 1477.88 255.702 L 1587.82 255.734 L 1669.95 255.686 C 1686.11 255.661 1702.53 255.438 1718.82 256.695 C 1755.97 260.823 1785.72 295.938 1792.73 330.983 C 1796.44 356.835 1782.45 383.096 1768.05 402.617 C 1719.61 468.274 1669.26 532.668 1621.15 598.399 C 1649.56 592.469 1710.17 598.652 1740.45 598.116 C 1761.6 597.742 1788.76 622.288 1790.67 643.441 C 1792.44 663.089 1794.63 700.838 1790.89 720.108 C 1789.41 728.06 1786.36 735.639 1781.92 742.404 C 1771.44 758.084 1757.57 764.387 1739.85 767.712 C 1729.9 768.869 1702.34 768.121 1691.24 768.088 L 1602.47 768.061 L 1498.61 768.178 C 1467.36 768.239 1425.95 772.481 1400.29 751.484 C 1383.5 737.741 1366.88 711.466 1364.68 689.536 C 1361.23 655.255 1384.65 627.232 1403.85 601.606 L 1441.63 551.245 L 1502.96 469.767 C 1513.31 456.073 1524.84 439.939 1535.61 426.907 C 1524.45 427.617 1512.64 426.735 1501.38 426.94 C 1495.36 426.792 1489.49 427.094 1483.45 426.959 C 1434.72 425.869 1379.51 439.267 1366.66 375.607 C 1364.33 364.044 1364.34 354.385 1364.25 342.624 C 1364.09 321.257 1363.09 298.7 1375.97 280.341 C 1386.89 264.914 1399.98 259.632 1417.52 256.214 z",
        "M 1014.53 597.334 C 1058.33 590.825 1104.91 622.599 1108.64 667.607 C 1110.44 689.384 1110.18 709.376 1110.18 731.139 L 1110.18 833.034 L 1110.15 932.636 C 1110.14 947.581 1110.87 975.749 1109.19 989.375 C 1117.39 998.559 1133.06 1012.76 1142.49 1022.19 L 1219.53 1099.08 C 1233.61 1113.07 1255.79 1132.4 1265.76 1148.41 C 1302.73 1207.77 1265.8 1265.24 1204.46 1279.67 C 1158.12 1283.16 1136.58 1256.36 1107.06 1226.81 L 1045.07 1164.77 L 987.231 1106.88 C 971.849 1091.49 944.031 1067.3 940.56 1044.59 C 936.514 1018.12 937.932 985.99 937.939 958.867 L 937.907 815.512 L 937.904 722.909 C 937.908 686.975 933.725 648.271 961.622 620.526 C 976.847 605.384 994.061 600.673 1014.53 597.334 z",
      ];

      pathData.forEach((data) => {
        const iconPath = document.createElementNS(svgNS, "path");
        iconPath.setAttribute("d", data);
        iconPath.setAttribute("fill", "white");
        svg.appendChild(iconPath);
      });

      iconWrap.appendChild(svg);

      // 3. Label
      const textLabel = document.createElement("span");
      textLabel.className =
        "text style-scope ytmusic-menu-navigation-item-renderer";
      textLabel.textContent = "Timer tidur";

      // Susun elemen
      anchor.appendChild(iconWrap);
      anchor.appendChild(textLabel);
      newItem.appendChild(anchor);

      // 4. Logika Click
      newItem.onclick = (e) => {
        // logicSetTimer();
        popUpSetTimer();

        const dropdown = document.querySelectorAll(
          "tp-yt-iron-dropdown.style-scope.ytmusic-popup-container",
        );
        dropdown.forEach((drop) => {
          if (!drop.opened) return;
          drop.opened = false;
        });
      };

      // Menghilangkan item menu download
      const downloadItemMenu = document.querySelector(
        "tp-yt-paper-item.style-scope.ytmusic-menu-service-item-download-renderer",
      );
      downloadItemMenu ? downloadItemMenu.remove() : null;

      parentMenu.appendChild(newItem);
    }
  }

  function popUpSetTimer() {
    // Element PopUp
    const myPopupNew = document.createElement("div");
    myPopupNew.id = "myPopupNew";
    myPopupNew.setAttribute("role", "dialog");
    myPopupNew.setAttribute("tabindex", "-1");
    myPopupNew.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
        max-height: 867px;
        max-width: 332px;
        z-index: 105;
        background: #212121;
        color: white;
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.35);
        font-family: Roboto, sans-serif;
      `;

    const area = document.createElement("div");
    area.id = "popUpArea";
    area.style.margin = "6px 16px";

    // Title
    const title = document.createElement("h2");
    title.textContent = "Timer tidur";
    title.style.marginBottom = "12px";
    title.style.fontSize = "16px";
    title.style.fontWeight = "normal";

    const content = document.createElement("div");
    content.setAttribute("id", "button-timer");
    content.style.cssText = `
        margin-left : 20px;
        margin-right : 30px;
      `;

    const ul = document.createElement("ul");
    ul.style.listStyleType = "none";

    const dataList = [
      { label: "5 Menit", value: "5" },
      { label: "10 Menit", value: "10" },
      { label: "15 Menit", value: "15" },
      { label: "30 Menit", value: "30" },
    ];

    dataList.forEach((item) => {
      const li = document.createElement("li");

      const btn = document.createElement("button");
      btn.style.cssText = `
          border: none;
          background: none;
          color: white;
          font-weight: normal;
          padding: 10px 0px;
        `;
      btn.textContent = item.label;
      btn.dataset.minutes = item.value;

      btn.addEventListener("click", (e) => {
        const minutes = parseInt(e.currentTarget.dataset.minutes);
        if (isNaN(minutes)) return;
        startCountdown(minutes);
        myPopupNew.remove();
      });

      li.appendChild(btn);
      ul.appendChild(li);
    });

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Tutup";
    closeBtn.style.cssText = `
        border: none;
        background: none;
        color: white;
        font-weight: normal;
      `;
    closeBtn.addEventListener("click", () => {
      myPopupNew.remove();
    });

    const containerBtnClose = document.createElement("div");
    containerBtnClose.style.cssText = `
        margin-top: 16px;
        display: flex;
        justify-content: center;
      `;
    containerBtnClose.appendChild(closeBtn);

    content.appendChild(ul);
    area.appendChild(title);
    area.appendChild(content);
    myPopupNew.appendChild(area);
    myPopupNew.appendChild(containerBtnClose);
    document.body.appendChild(myPopupNew);
  }

  // Observer untuk mendeteksi kemunculan menu popup
  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.addedNodes.length) {
        createTimerMenuItem();
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

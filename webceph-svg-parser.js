// ==UserScript==
// @name         WebCeph svg parser
// @namespace    webceph-svg-parser
// @version      1.2
// @description:ru Скрипт позволяет скопировать информацию из таблицы CEPH в буфер обмена по нажатию кнопки
// @author       alexmacreall
// @match        https:\/\/webceph\.com\/[^\/]+\/records\/[^\/]+\/[^\/]+\/analysis\/.*
// @match        https://webceph.com/*/records/*/*/analysis/
// @match        https://webceph.com/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    await new Promise(r => setTimeout(r, 5000));

    let tableNodes = document.querySelector('svg#chartGraph').childNodes;
    let result = new Array();
    let str = '';

    tableNodes.forEach(element => {
        if(element.tagName == 'g' && element.className.baseVal == 'dimension'){
            let elementNodes = element.firstChild.childNodes;
            var key;
            var value;
            elementNodes.forEach(child =>{
                if(child.getAttribute('x') == '35'){
                    key = child.innerHTML;
                }
                else if(child.getAttribute('x') == '430'){
                    value = parseFloat(child.innerHTML).toFixed(1).toString().replace('.', ',');
                }
            })
            result[key] = value;
        }
    });

    for(var key in result){
        str += key + "\t" + result[key] + "\n";
    }

    let button = document.createElement('button');
    button.className = "btn btn-webceph-2";
    button.id = "save-table-to-string";
    button.innerHTML = "Скопировать таблицу";

    button.addEventListener('click', () => {
            var hiddenTextArea = document.createElement('textarea');

            hiddenTextArea.value = str;
            hiddenTextArea.setAttribute('readonly', '');
            hiddenTextArea.style.position = 'absolute';
            hiddenTextArea.style.left = '-9999px';
            document.body.appendChild(hiddenTextArea);
            hiddenTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(hiddenTextArea);
      });

    document.querySelector('div.chartContainer').prepend(button);
})();
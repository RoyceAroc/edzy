running = false;
let currentResults=[];
function reportWindowSize() {
    if(document.getElementById("player-iframe") != null) {
        document.getElementById("player-iframe").style.zoom = window.innerWidth/600;
        document.getElementById("main-player-2").style.zoom = window.innerWidth/600;
    }
    if(window.innerHeight < 576) {
        if(document.getElementById("main-player-2") != null) {
            document.getElementById("main-player-2").style.top = document.getElementById("main-player-2").style.top + 600*(576 - window.innerHeight) + "px";
            
        }
    } else {
        document.getElementById("main-player-2").style.top = 15/100 * window.innerHeight + "px";
    }
    document.getElementById("content").style.top = ( window.innerWidth/190 * 100) + 80 + "px";
    document.getElementById("loading-video-header").style.top = ( window.innerWidth/350 * 100) + 40 + "px";
    document.getElementById("main-container-boxes").style.top = ( window.innerWidth/190 * 100) + 80 + "px";
    if (window.innerWidth > 400 && window.innerWidth < 651) {
        let e = document.getElementsByClassName("box-option");
        for(let i=0; i < e.length; ++i) {
            console.log("Done");
           e[i].style.marginTop = ( window.innerWidth/190 * 100) - 225 + "px";
        }
        
    } else {
        let e = document.getElementsByClassName("box-option");
        for(let i=0; i < e.length; ++i) {
            e[i].style.marginTop = 0 + "px";
        }
    }
    if(window.innerWidth > 651) {
        let f = document.getElementsByClassName("box-score");
        for(let i=0; i<f.length; ++i) {
            f[i].style.top = "42px";
            f[i].style.left = 35/100 * window.innerWidth + "px";
         }
         let elems = document.getElementsByTagName("h4");
         for(let i=0; i<elems.length; i++) {
             elems[i].style.width = "70px";
         }
    } else if(window.innerWidth > 519) {
        let f = document.getElementsByClassName("box-score");
        for(let i=0; i<f.length; ++i) {
            f[i].style.top = "85px";
            f[i].style.left = 49/100 * window.innerWidth + "px";
         }
         let elems = document.getElementsByTagName("h4");
        for(let i=0; i<elems.length; i++) {
            elems[i].style.width = "150px";
        }
    } else {
        let f = document.getElementsByClassName("box-score");
        for(let i=0; i<f.length; ++i) {
            f[i].style.top = "44px";
            f[i].style.left = 70/100 * window.innerWidth + "px";
         }
         let elems = document.getElementsByTagName("h4");
         for(let i=0; i<elems.length; i++) {
             elems[i].style.width = "70px";
         }
    }
    
}

window.onresize = reportWindowSize;

document.getElementById("search-icon").addEventListener("click", () => {
    search();
});

window.onload = function() {
    reportWindowSize();
    chrome.storage.session.get('selectionText', ({ selectionText }) => {
        console.log(selectionText);
        updateDefinition(selectionText);
    });
}

chrome.storage.session.onChanged.addListener((changes) => {
    const lastWordChange = changes['selectionText'];
    if (!lastWordChange) {
        return;
    }
    updateDefinition(lastWordChange.newValue);
});

function updateDefinition(word) {
    if (!word) return;
    document.getElementById("search-input").value = word;
    search();
}

function loadingView() {
    let iframe2 = document.getElementById("player-iframe");
    iframe2.style.display = "none";
    let iframe = document.getElementById("main-player-2");
    iframe.src = "loading.html";
    iframe.style.display = "block";
}

function search() {
    let input = document.getElementById("search-input").value;

    if(input != "" && !running) {
        running = true;
        let abc = document.getElementById("table-main");
        let bcd = document.createElement("table");
        abc.style.filter = "blur(5px)";
        let iframe2 = document.getElementById("player-iframe");
        iframe2.src = "";
        iframe2.src = "https://www.edzy.tech/web/player.html";
        loadingView();
        document.getElementById("loading-video-header").innerHTML = "Searching Videos";
        document.getElementById("loading-video-header").style.display = "block";
       
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
            "query": input
        });
    
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
    
        fetch("http://20.81.161.218:5000/search", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            let output = JSON.parse(result).result;
            console.log(output.length);
            if (output.length == 0) {
                running = false;
                document.getElementById("loading-video-header").innerHTML = "No results found"
            } else {
            currentResults = output;
            let trElem = null;
                for(let i=0; i<output.length; i++) {
                    if(i == 0) {
                        trElem = document.createElement("tr");
                        trElem.style.position = "relative";
                    }
                
                    trElem.innerHTML += `
                        <td ${i == 0 ? "" : "class='box-option'"} ${i % 2 == 1 ? "id='right-box' style='top:0;'" : "style='position: relative'"}>
                        <div id="hover-${i}">
                            <img style="width: 50%; position: absolute; left: 0;" src="${output[i][1][5]}"/>
                            <h1 id="class-title-${i}" ${i == 0 ? "style='color:#D3A121'": ""}> ${output[i][1][6]}</h1>
                            <h3 style="color: grey;"> ${output[i][1][3]}</h3>
                            <h4 style="color: #D3A121;"> ${output[i][1][4]}</h4>
                            ${output[i][1][1] == 0 ? "" :
                                `<div class='box-score' style='background-color: ${parseInt(output[i][1][1]*100) >= 50 ? "green" : "orange"};'>
                                    <p class="score"> ${parseInt(output[i][1][1]*100)}%</p>
                                    <p class="match"> Match </p>
                                </div>`
                                }
                            </div>
                        </td>
                    `;
                    if(i % 2 == 1) {
                        if (trElem != null) {
                            bcd.appendChild(trElem);
                        }
                        trElem = document.createElement("tr");
                        trElem.style.position = "relative";
                    }
                }
                abc.appendChild(bcd);
                let tables = document.getElementsByTagName("table");
                if(tables.length == 3) {
                    tables[1].remove();
                }
                for (let i = 0; i < output.length; i++) {
                    let hoverElem = document.getElementById("hover-" + i);
                    if (hoverElem) {
                        hoverElem.removeEventListener("click", clickHandler);
                    }
                }
                for (let i = 0; i < output.length; i++) {
                    let hoverElem = document.getElementById("hover-" + i);
                    if (hoverElem) {
                        hoverElem.addEventListener("click", () => clickHandler(output[i][0], output[i][1][0]));
                    }
                }
                reportWindowSize();
                abc.style.filter = "blur(0px)";
                let iframe = document.getElementById("main-player-2");
                iframe.style.display = "none";
                document.getElementById("loading-video-header").style.display = "none";
                iframe2.contentWindow.postMessage(`https://www.youtube.com/embed/${output[0][0]}?enablejsapi=1&autoplay=1&amp;start=${Math.floor(output[0][1][0])}`, "*");
                iframe2.style.display = "block";
                running = false;
            }

        })
        .catch((error) => console.log(error));
    }
}

function clickHandler(videoId, startTimestamp) {
    let iframe2 = document.getElementById("player-iframe");
    iframe2.contentWindow.postMessage(`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&amp;start=${Math.floor(startTimestamp)}`, "*");
    let titles = document.querySelectorAll("[id^='class-title-']");
    titles.forEach(title => {
        title.style.color = "white";
    });
    for(let i=0; i<currentResults.length; i++) {
        if (currentResults[i][0] == videoId) {
            document.getElementById("class-title-" + i).style.color = "#D3A121";
        }
    }
}


document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        search();
    }
});
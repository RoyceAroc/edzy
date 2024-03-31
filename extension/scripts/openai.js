const mutationCallback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        const elems = document.querySelectorAll('.text-gray-400');
        if (elems.length != 0) {
            elems.forEach(function(givenElement) {
                if (!givenElement.innerHTML.includes('royce')) {
                    if ((givenElement.childNodes.length == 3) || (givenElement.childNodes.length == 4 && givenElement.childNodes[3].className == "flex")) {
                        let tempElement = document.createElement('div');
                        tempElement.innerHTML = `<span class="" data-state="closed">
    
                        <button class="royce flex items-center gap-1.5 rounded-md p-1 text-xs text-token-text-tertiary hover:text-token-text-primary md:invisible md:group-hover:visible md:group-[.final-completion]:visible">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md">
                                
                                <path fill="currentColor"  d="M8 5v14l11-7"/>
                                <path d="M0 0h24v24H0z" fill="none"/>
                            
                                </svg>
                        </button>
                        </span>`;
                        givenElement.appendChild(tempElement.firstChild);
                        givenElement.addEventListener("click", () => {
                            _search = givenElement.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerHTML;
                            (async () => {
                                const response = await chrome.runtime.sendMessage({service: "openai", query: _search });
                                console.log(response);
                              })();
                        })
                    }
                }
            });
        }
    }
};

const observer = new MutationObserver(mutationCallback);

const config = { childList: true, subtree: true };

observer.observe(document.body, config);
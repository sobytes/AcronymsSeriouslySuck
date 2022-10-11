chrome.storage.local.set({
    found: []
});

chrome.storage.local.get(["autorun"], async (res) => {
    if (res.autorun) {
        chrome.storage.local.get(["token", "acronyms"], async (res) => {
            let uri;
            let token = '';
            const hasToken = res.token;
            if (hasToken) {
                token = `?token=${hasToken}`;
                uri = `https://www.acronymsseriouslysuck.com/api/search?token=${hasToken}`;
            } else {
                uri = `https://www.acronymsseriouslysuck.com/api/search`;
            }
            const request = await fetch(uri);
            if (request.status === 200 || request.status === 304) {
                const response = await request.json();
                const acronyms = response.data.reduce((unique, o) => {
                    if (!unique.some(obj => obj.acronym === o.acronym)) {
                        unique.push(o);
                    }
                    return unique;
                }, []);
                let found = [];
                document.body.querySelectorAll('*').forEach(tag => {
                    if (tag.closest('A')) return;
                    if (['SCRIPT', 'STYLE'].includes(tag.tagName)) return;
                    [...tag.childNodes].forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            const nodeText = node.textContent;
                            let replacedText = nodeText.replace(/\b\w+\b/g, function($m) {
                                let search = acronyms.map(x => x.acronym);
                                let key = search.indexOf($m);
                                if ((key !== -1)) {
                                    found.push(acronyms[key]);
                                    return `<a class="ass-2981728390813209-acronyms-found" data-id="${acronyms[key]._id}"  data-acronym="${acronyms[key].acronym.toLowerCase()}"  data-text="${acronyms[key].text}"></a>`;
                                } else {
                                    return $m;
                                }
                            });
                            if (replacedText !== nodeText) {
                                let replacementNode = document.createElement('span');
                                replacementNode.innerHTML = replacedText;
                                node.parentNode.insertBefore(replacementNode, node);
                                node.parentNode.removeChild(node);
                            }
                        }
                    });
                });
                const collection = document.getElementsByClassName("ass-2981728390813209-acronyms-found");
                Array.from(collection).forEach((el) => {
                    let openUrl, alText;
                    if (hasToken) {
                        openUrl = `https://www.acronymsseriouslysuck.com/acronym/${el.getAttribute('data-id')}${token}`;
                        alText = res.acronyms ? el.getAttribute('data-acronym').toUpperCase() : el.getAttribute('data-text');
                    } else {
                        openUrl = `https://www.acronymsseriouslysuck.com/search/${el.getAttribute('data-acronym')}${token}`;
                        alText = el.getAttribute('data-acronym').toUpperCase();
                    }
                    el.classList.add("ass-2981728390813209-tooltip-wrap");
                    el.setAttribute('target', '_blank');
                    el.setAttribute('rel', 'noopener');
                    el.setAttribute('href', openUrl);
                    el.innerText = alText;
                });
                chrome.runtime.sendMessage({
                    found: found
                }, function(response) { });
            } else {
                console.error("There was an error get the data from the API check your token is correct in the dashboard! Contact support if issue persists")
            }
        });
    }
});
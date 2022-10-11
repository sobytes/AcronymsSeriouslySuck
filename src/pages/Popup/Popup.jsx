import React from 'react';
import { displayFound } from '../../containers/Helpers.js';
import './Popup.css';

chrome.storage.local.get(['token', 'found'], (res) => {
  if (res.found.length > 0) {
    displayFound(res.found, res.token);
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  chrome.storage.local.get(['token', 'found'], (res) => {
    if (res.found.length > 0) {
      displayFound(res.found, res.token);
    }
  });
});

const openOptions = () => {
  chrome.runtime.openOptionsPage((e) => {
    console.log(e);
  });
};

const findAcronyms = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: getAcronyms,
    });
  });
};

const getAcronyms = async () => {
  chrome.storage.local.get(['token', 'acronyms'], async (res) => {
    let uri;
    const token = res.token;
    if (token) {
      uri = `https://www.acronymsseriouslysuck.com/api/search?token=${token}`;
    } else {
      uri = `https://www.acronymsseriouslysuck.com/api/search`;
    }
    const request = await fetch(uri);
    if (request.status === 200 || request.status === 304) {
      const response = await request.json();
      const acronyms = response.data.reduce((unique, o) => {
        if (!unique.some((obj) => obj.acronym === o.acronym)) {
          unique.push(o);
        }
        return unique;
      }, []);
      let found = [];
      document.body.querySelectorAll('*').forEach((tag) => {
        if (tag.closest('A')) return;
        if (['SCRIPT', 'STYLE'].includes(tag.tagName)) return;
        [...tag.childNodes].forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const nodeText = node.textContent;
            let replacedText = nodeText.replace(/\b\w+\b/g, function ($m) {
              let search = acronyms.map((x) => x.acronym);
              let key = search.indexOf($m);
              if (key !== -1) {
                found.push(acronyms[key]);
                return `<a class="ass-2981728390813209-acronyms-found" data-id="${
                  acronyms[key]._id
                }"  data-acronym="${acronyms[
                  key
                ].acronym.toLowerCase()}"  data-text="${
                  acronyms[key].text
                }"></a>`;
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
      const collection = document.getElementsByClassName(
        'ass-2981728390813209-acronyms-found'
      );
      Array.from(collection).forEach((el) => {
        let openUrl, alText;
        if (token) {
          openUrl = `https://www.acronymsseriouslysuck.com/acronym/${el.getAttribute(
            'data-id'
          )}?token=${token}`;
          alText = res.acronyms
            ? el.getAttribute('data-acronym').toUpperCase()
            : el.getAttribute('data-text');
        } else {
          openUrl = `https://www.acronymsseriouslysuck.com/search/${el.getAttribute(
            'data-acronym'
          )}`;
          alText = el.getAttribute('data-acronym').toUpperCase();
        }
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
        el.setAttribute('href', openUrl);
        el.innerText = alText;
      });
      chrome.runtime.sendMessage(
        {
          found: found,
        },
        function (response) {}
      );
    } else {
      console.error(
        'There was an error get the data from the API check your token is correct in the dashboard! Contact support if issue persists'
      );
    }
  });
};

const Popup = () => {
  return (
    <div className="ass-popup">
      <h5>Acronyms Suck</h5>
      <p>
        Click find acronyms to show acronyms on page or create an account an
        find acronyms specific to your industry with tokens. Sign up and find
        out more.{' '}
        <a
          href="https://www.acronymsseriouslysuck.com/"
          target="_blank"
          rel="noreferrer"
        >
          www.acronymsseriouslysuck.com
        </a>
        .
      </p>
      <button className="btn btn-primary rounded mb-3" onClick={findAcronyms}>
        Find Acronyms
      </button>
      <button className="btn btn-primary rounded" onClick={openOptions}>
        Add department token
      </button>
      <p id="ass-found-list"></p>
    </div>
  );
};

export default Popup;

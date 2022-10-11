import React from 'react';
import './Options.css';

interface Props {
  title: string;
}

chrome.storage.local.get(['token'], (res) => {
  if (res.token) {
    (document.getElementById('token') as HTMLInputElement).value = res.token;
  }
});

chrome.storage.local.get(['autorun'], (res) => {
  if (res.autorun) {
    (document.getElementById('autorun') as HTMLInputElement).checked =
      res.autorun;
  }
});

chrome.storage.local.get(['acronyms'], (res) => {
  if (res.acronyms) {
    (document.getElementById('acronyms') as HTMLInputElement).checked =
      res.acronyms;
  }
});

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.target as any);
  chrome.storage.local.set({
    token: data.get('token'),
    autorun: data.get('autorun') ? true : false,
    acronyms: data.get('acronyms') ? true : false,
  });
  document.getElementById('save-btn')!.innerText = 'Saved...';
  setTimeout(() => {
    document.getElementById('save-btn')!.innerText = 'Save Options';
  }, 2000);
};

const Options: React.FC<Props> = ({ title }: Props) => {
  return (
    <div className="ass-options">
      <div className="card">
        <h1>Acronyms Seriously Suck</h1>
        <p>
          Department tokens allow you to only specify acronyms that are related
          to your industry. You can create your industry specific acronyms by
          signing up at{' '}
          <a
            href="https://www.acronymsseriouslysuck.com/"
            target="_blank"
            rel="noreferrer"
          >
            acronymsseriouslysuck.com
          </a>
          .
        </p>
        <form onSubmit={handleSubmit}>
          <label>
            <h2>Department Token:</h2>
            <input
              name="token"
              id="token"
              type="text"
              className="form-input"
              placeholder="Enter department token"
            />
          </label>
          <label>
            <h2>Auto Run On Page load:</h2>
            <input
              name="autorun"
              id="autorun"
              type="checkbox"
              className="form-checkbox"
            />
          </label>
          <label>
            <h2>Only Show Acronyms:</h2>
            <input
              name="acronyms"
              id="acronyms"
              type="checkbox"
              className="form-checkbox"
            />
          </label>
          <div>
            <button type="submit" id="save-btn">
              Save Options
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Options;

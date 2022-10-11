export const displayFound = (found, token) => {
    const result = [
        ...found
            .reduce((mp, o) => {
                if (!mp.has(o.acronym)) mp.set(o.acronym, { ...o, count: 0 });
                mp.get(o.acronym).count++;
                return mp;
            }, new Map())
            .values(),
    ];
    let html = '';
    result.forEach((el) => {
        html += `<a href="https://www.acronymsseriouslysuck.com/search/${el.acronym.toLowerCase()}${token ? '?token=' + token : ''}" target="_blank" rel="noopener">${el.acronym} (${el.count})</a>, `;
    });
    document.getElementById(
        'ass-found-list'
    ).innerHTML = `<h6>${found.length} Acronym Found</h6>${html}`;
};
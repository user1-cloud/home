const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function search() {
    const kw = searchInput.value.trim();
    if(kw) {
        window.open(`https://www.bing.com/search?q=${encodeURIComponent(kw)}`, '_self');
    }
}

searchBtn.addEventListener('click', search);
searchInput.addEventListener('keydown', e => {
    if(e.key === 'Enter') search();
});
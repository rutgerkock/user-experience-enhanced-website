function scrollList(direction, listSelector, scrollAmount) {
    const list = document.querySelector('.' + listSelector);
    if (!list) return; 

    if (direction === 'left') {
        list.classList.add('left-scroll-animation');
        list.scrollLeft -= scrollAmount;
    } else if (direction === 'right') {
        list.classList.add('right-scroll-animation');
        list.scrollLeft += scrollAmount;
    }
}


function addToFavorites(itemId) {
    fetch('/add-to-list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: itemId }),
    })
}

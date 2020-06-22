export const elements = {
    searchInput : document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchResultList : document.querySelector('.results__list'),
    searchRes: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likes: document.querySelector('.likes__list'),
    likeMenu : document.querySelector('.likes')
}


export const renderLoader = parent => {
    const loader = `
        <div class="loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = ()=> {
    const loader = document.querySelector('.loader');
    if(loader) {
        loader.parentElement.removeChild(loader);
    }
}
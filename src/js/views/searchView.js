import { elements } from './base';

export const getInput = () => elements.searchInput.value;


export const cleatInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
    let classes = Array.from(document.querySelectorAll('.results__link'));

    classes.forEach(ele=> {
        ele.classList.remove('results__link--active');
    })

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

const limitRecipeTitles = (title, limit = 17) => {
    let newTitle = [];
    if (title.length > limit) {
        title.split(" ").reduce((acc, curr) => {
            if (acc + curr.length <= limit) {
                newTitle.push(curr);
            }
            return acc + curr.length;
        }, 0);

        return `${newTitle.join(' ')}...`
    }
    return title;
}

const renderRecipe = (recipe) => {
    const markUp = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitles(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}n</p>
                </div>
            </a>
        </li>
    `

    elements.searchResultList.insertAdjacentHTML('beforeend', markUp);
}

const createButton = (pageNumber, type) => {

    let markUp = `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? pageNumber - 1 : pageNumber + 1}>
        <span>Page ${type === 'prev' ? pageNumber - 1 : pageNumber + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
    `;
    return markUp;
}

const renderButtons = (page, results, resPerPage) => {
    const pages = Math.ceil(results / resPerPage);
    let button;
    if (page === 1) {
        //Only Button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        //Both buttons
        button = `${createButton(page, 'next')}
            ${createButton(page, 'prev')}`;
    } else if (page === pages) {
        //ONly button to previous pages
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(recipe => {
        renderRecipe(recipe);
    });
    renderButtons(parseInt(page), recipes.length, resPerPage);
}
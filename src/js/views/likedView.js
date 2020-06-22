import { elements } from './base'

export const renderLikedItem = (item) => {
    const markUp = `
        <li>
            <a class="likes__link" href="#${item.id}">
                <figure class="likes__fig">
                    <img src="${item.image}" alt="${item.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${item.title}</h4>
                    <p class="likes__author">${item.author}</p>
                </div>
            </a>
        </li>
    `
    elements.likes.insertAdjacentHTML('beforeend', markUp);
}

export const deleteItem = (id) => {
    const el = document.querySelector(`.likes__link[href="#${id}"]`);
    el.parentElement.removeChild(el);
}

export const toggleLike = (isLiked) => {
    const image = isLiked ? 'icon-heart' : 'icon-heart-outlined'
    document.querySelector('.recipe__love use').setAttribute('href', 'img/icons.svg#'+image);
}

export const toggleLikeMenu = (numOfLikes) => {
    elements.likeMenu.style.visibility = numOfLikes > 0 ? 'visible' : 'hidden';
}
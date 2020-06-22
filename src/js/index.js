import Search from './modules/Search'
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import Recipe from './modules/Recipe';
import List from './modules/List'
import * as listView from './views/shoppingListView'
import * as likedView from './views/likedView';
import * as recipeView from './views/recipeView'
import Likes from './modules/Likes';


const state = {}


/*
**
***** SEARCH CONTROLLER *****
**
*/

const controlSearch = async () => {
    const query = searchView.getInput();

    console.log(query);

    if (query) {
        state.search = new Search(query);

        //Prepare UI Results
        searchView.cleatInput();
        searchView.clearResults();
        console.log(elements.searchRes)
        renderLoader(elements.searchRes);

        //Search for Recipes
        await state.search.getResults();

        //Render Results on the UI
        clearLoader();
        searchView.renderResults(state.search.result);

    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if (button) {
        const goTo = button.dataset.goto;
        searchView.clearResults();
        searchView.renderResults(state.search.result, goTo);
    }
})


/*
**
***** RECIPE CONTROLLER *****
**
*/

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        //Prepare UI Changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight Selected
        if (state.search) {
            searchView.highlightSelected(id);
        }
           

        //Create new Recipe
        state.recipe = new Recipe(id);

        try {
            //Get Recipe
            await state.recipe.getRecipe();

            state.recipe.parseIngrediants();

            //Calc Servings and Time
            state.recipe.calcTime();
            state.recipe.calcServings();

            let isLiked;
            if(state.likes) {
                isLiked = state.likes.isLiked(id)
            } else {
                isLiked = false;
            }
            //Render the data
            clearLoader();
            recipeView.renderRecipe(state.recipe,
                isLiked);
        } catch (err) {
            console.log(err);
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



/*
**
***** LIST CONTROLLER *****
**
*/

const controlList = () => {

    if(!state.list) state.list = new List();

    state.recipe.ingrediants.forEach(ingredient=> {
        const item = state.list.addItem(ingredient.count, ingredient.units, ingredient.ingrediant);
        listView.renderItem(item);
    })

}


//Handling Delete and Update Items

elements.shoppingList.addEventListener('click', e=> {
    console.log(e.target.closest('.shopping__item').dataset)
    const eleId = e.target.closest('.shopping__item').dataset.itemid;
    console.log(eleId);
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(eleId);
        listView.deleteItem(eleId);
    } else if(e.target.matches('.shopping__count--value')) {
        let val = e.target.value;
        state.list.updateCount(eleId, val);
    }
});



/*
**
***** LIKES CONTROLLER *****
**
*/


const controlLikes = () => {
    if(!state.likes) state.likes = new Likes();

    let recipe = state.recipe;
    console.log(state.recipe);

    if(!state.likes.isLiked(recipe.id)) {
        let item = state.likes.addLikedItem(recipe.id, recipe.title, recipe.author, recipe.image);
        likedView.renderLikedItem(item);
        likedView.toggleLike(true);
    } else {
        state.likes.deleteItem(recipe.id);
        likedView.toggleLike(false);
        likedView.deleteItem(recipe.id);
    }
    likedView.toggleLikeMenu(state.likes.getItemsLikedLength());
}


window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likedView.toggleLikeMenu(state.likes.getItemsLikedLength());
    state.likes.likes.forEach(like=> {
        likedView.renderLikedItem(like);
    })
})


elements.recipe.addEventListener('click', e=> {
    console.log(e.target);
    if(e.target.matches('.btn-decreased, .btn-decreased *')) {
        //Decrease the servings
        state.recipe.updateServings('dec');
    } else if(e.target.matches('.btn-increased, .btn-increased *')) {
        //Increase the servings
        state.recipe.updateServings('inc');
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if(e.target.matches('.header__likes, .header__likes *')) {
        controlLikes();
    }

    if(state.recipe)
        recipeView.updateServingIngreditents(state.recipe);
});



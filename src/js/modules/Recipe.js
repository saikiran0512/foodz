import axios from 'axios';

export default class Recipe {

    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            let recipe = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.image = recipe.data.recipe.image_url;
            this.author = recipe.data.recipe.publisher;
            this.title = recipe.data.recipe.title;
            this.url = recipe.data.recipe.source_url;
            this.ingrediants = recipe.data.recipe.ingredients;
            console.log(recipe);
        } catch(error) {
            console.log(error);
        }
    }

    calcTime() {
        //Takes 15 minutes to make each 3 ingrediants
        const numIng = this.ingrediants.length;
        const periods = Math.ceil(numIng/ 3);
        this.time = periods * 15;
    }

    calcServings(servings = 4) {
        this.servings = servings;
    }

    parseIngrediants() {
        const unitsLong = ['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'ounces', 'ounce', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'pound'];
        if(this.ingrediants) {
            let newIngrediants= this.ingrediants.map(el=>{
                let ingrediant = el.toLowerCase();
    
                //Replace units
                unitsLong.forEach((unit,i)=>{
                    ingrediant = ingrediant.replace(unit, unitsShort[i]);
                });
    
                //Replace Parantheses
                ingrediant = ingrediant.replace(/ *\([^)]*\) */g, ' ');
            
                
                //Parse ingrediant into count unit and ingrdiant
                const arr = ingrediant.split(' ');
        
                const unitIndex = arr.findIndex(ele=> {
                    return unitsShort.includes(ele);
                });
    
                let objString;
                if(unitIndex > -1) {
                    const arrString = arr.slice(0, unitIndex);
                    let count;
                    if(arrString.length === 1) {
                        count = eval(arr[0].replace('-','+'));
                    } else {
                        count = eval(arr.slice(0, unitIndex).join('+'));
                    }
    
                    objString = {
                        count,
                        units : arr[unitIndex],
                        ingrediant: arr.slice(unitIndex+1).join(' ')
                    }
                } else if(parseInt(arr[0], 10)) {
                    objString = {
                        count: parseInt(arr[0], 10),
                        units: '',
                        ingrediant: arr.slice(1).join(' ')
                    }
                } else if(unitIndex === -1) {
                    objString = {
                        count: 1,
                        units: '',
                        ingrediant
                    }
                }
                
                return objString;
            });
    
            this.ingrediants = newIngrediants;
        }
    }

    updateServings(type) {
        console.log('----' + type)
        let newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        if(newServings != 0) {

            console.log(newServings);

            this.ingrediants.forEach(ing => {
                ing.count *= (newServings/this.servings); 
            });
    
            this.servings = newServings;
        }

    }
 
}
export default class Likes {

    constructor() {
        this.likes = [];
    }

    addLikedItem(id, title, author, image) {
        let likedItem = {
            id,
            title,
            author,
            image
        }
        this.likes.push(likedItem);

        //Persist Data to Local storage
        this.persistData();

        return likedItem;
    }

    deleteItem(id) {
        let index = this.likes.findIndex(el => el.id === id);
        
        this.likes.splice(index, 1);
        //Persist Data to Local storage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getItemsLikedLength() {
        return this.likes.length;
    }


    readStorage() {
        console.log('>>>>>>>')
        console.log(localStorage.getItem('likes'))
        const storage= JSON.parse(localStorage.getItem('likes'));
        if(storage) this.likes = storage;
    }

    
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

}


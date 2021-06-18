const utilsModule = require('./utils');
const cardModule = require('./card');

const listModule = {
    base_url: 'null',

    getListsFromApi: async () => {

        const response = await fetch(listModule.base_url + '/lists');
        const lists = await response.json();


        for (list of lists) {
            listModule.makeListInDOM(list.name, list.id);
            for (card of list.cards) {
                cardModule.makeCardInDOM(card.title, list.id, card.id, card.color, card.position, card.labels);
            }
        }
    },

    /**
       * fonction qui genere le html d une liste a partir du template de liste et des donnees du forumlaire et qui l'ajoute dans le dom
       * @param {String} listName 
       * @param {Number} listId 
       */

    makeListInDOM: (listName, listId) => {
        //recuperation du template de list et clone dans un nouvel element
        const { newElem } = utilsModule.getTemplate('list__template');

        const newList = newElem.querySelector('.list__elem');
        //Je rempli les donnees de la liste
        const listNameElem = newElem.querySelector('.list__name');
        listNameElem.innerText = listName;



        //j'ajoute l'ecouteur pour editer le nom de la liste

        listNameElem.addEventListener('dblclick', listModule.showUpdateListForm);

        // j'ajoute l ecouteur au bouton addCard de ma nouvelle liste
        const addCardBtn = newElem.querySelector('.add__card');
        addCardBtn.addEventListener('click', cardModule.showAddCardModal);

        // j'ajoute l ecouteur au bouton remove_list de ma nouvelle liste

        const removeListElem = newElem.querySelector('.remove__list');
        removeListElem.addEventListener('click', listModule.showDeleteListModal);

        //je rempli le dataset de la liste
        newList.dataset.listId = listId;

        //je met a jour le formulaire d'edition de la liste
        const editFormElem = newElem.querySelector('.edit__list__form');

        editFormElem.querySelector('[type="hidden"]').value = listId;
        editFormElem.querySelector('[type="text"]').value = listName;

        editFormElem.addEventListener('submit', listModule.handleEditListForm);


        /** GESTION DU DRAG N DROP 
         */
        const sortableId = `dragContainer${listId}`;

        const sortableContainer = newList.querySelector('.card__container');
        sortableContainer.id = sortableId;

        new Sortable(sortableContainer, {

            group: 'shared', // set both lists to same group
            animation: 150,
            onEnd: cardModule.handleDraggedCard

        });

        if (!utilsModule.listDragIds) {
            utilsModule.listDragIds = [];
        }
        utilsModule.listDragIds.push(sortableId);



        // j'ajoute la liste dans le DOM
        document.getElementById('list__container').append(newElem);
    },

    /**
     *  callback qui gere la soumission du formulaire de deletion d'un carte
     * 
     * @param {Event} event 
     */

    handleDeleteListForm: async (event) => {

        event.preventDefault();

        //on recupere l'id de la liste a supprimer et l'element liste du dom correspondant a la liste

        const listId = event.target.querySelector('[type="hidden"]').value;

        const listElem = document.querySelector(`[data-list-id="${listId}"].list__elem `);

        try { //On construit et lance la requete de deletion a la bdd
            const init = {
                method: 'DELETE',
            }

            const response = await fetch(`${listModule.base_url}/lists/${listId}`, init);

            if (!response.ok) { //si probleme 
                const error = await response.json();
                throw error;
            }
            // sinon tout s'est bien passe, on recup la reponse et on supprime la liste du DOM
            result = await response.json();
            listElem.remove();
        } catch (error) {
            alert(error);
        }

        utilsModule.hideModals();
    },

    /**
    *  fonction qui gere la soumission du formulaire d'edition de listes
    * @param {Event} event 
    */

    handleEditListForm: async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const listId = formData.get('list-id');
        const listTitleElem = event.target.closest('.list__elem').querySelector('.list__name');


        formData.delete('list-id');

        if (formData.get('name') && formData.get('name').trim()) {
            const init = {
                method: 'PATCH',
                headers: new Headers(),
                body: formData
            };
            try {
                const response = await fetch(`${listModule.base_url}/lists/${listId}`, init);
                if (!response.ok) {
                    const error = await response.json();
                    throw error;
                }

                const result = await response.json();

                listTitleElem.innerText = result.name;
                event.target.querySelector('[type="text"]').value = result.name;


            } catch (error) {
                alert(error);
            }
        } else {

            event.target.querySelector('[type="text"]').value = listTitleElem.innerText;

        }

        // je recache le formulaire et affiche le titre modifie ou non
        listTitleElem.classList.toggle('is-hidden');
        event.target.classList.toggle('is-hidden');

    },

    /**
    * Fonction qui gere la soumission du formulaire d'ajout de list
    *  => on recupere les donnees du form dans un FormData et on appel la fonction qui va generer le html
    * 
    * @param {Event} event 
    */

    handleAddListForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        // if (formData.has('name') && formData.get('name')) {
        //   app.makeListInDOM(formData);
        // }

        //je cree un objet d'initialisation
        console.log('addlistform');
        const init = {
            method: 'POST',
            headers: new Headers(),
            body: formData
        };

        const response = await fetch(listModule.base_url + '/lists', init);
        const result = await response.json();
        if (response.ok) {
            listModule.makeListInDOM(result.name, result.id);
            utilsModule.hideModals();
        } else {
            alert(result[0]);
        }
    },

    /**
     * afficher modale suppression de liste
     */

    showDeleteListModal: (event) => {
        const deleteModal = document.querySelector('#deleteListModal');

        const listId = event.target.closest('.list__elem').dataset.listId;

        deleteModal.querySelector('[type="hidden"]').value = listId;

        deleteModal.classList.add('is-active');
    },

    /**
     * fonction pour afficher la modale ajout liste
     */
    showAddListModal: () => {
        const addListModal = document.getElementById('addListModal');
        addListModal.classList.toggle('is-active');
    },

    /**
    * afficher le formulaire de modif d une liste
    * @param {Event} event 
    */

    showUpdateListForm: (event) => {
        const listFormElem = event.target.closest('.list__elem').querySelector('.edit__list__form');


        event.target.classList.toggle('is-hidden');
        listFormElem.classList.toggle('is-hidden');
        listFormElem.querySelector('[type="text"]').focus();

    },

    /**
     * callback appele lorsque l'on a fini de modifier ou supprimer nos labels.
     * la methode va mettre a jour les infos de notre page et cacher la modale
     */

    hideLabelModalRefresh: () => {
        const labelEditModal = document.getElementById('handleLabelsModal');
        const listContainer = document.getElementById('list__container');
        const lists = listContainer.querySelectorAll('.list__elem');

        lists.forEach(list => list.remove());

        listModule.getListsFromApi();

        labelEditModal.classList.remove('is-active');

    },

};

module.exports = listModule;

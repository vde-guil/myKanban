const utilsModule = require('./utils');
const labelModule = require('./label')

const cardModule = {
    base_url: 'null',
    /**
       * fonction qui genere le html d une carte a partir du template de carte et des donnees du formulaire 
       * et qui l injecte dans le DOM
       * @param {String} cardTitle 
       * @param {Number} listId 
       * @param {Number} cardId 
       * @param {String} color 
       */

    makeCardInDOM: (cardTitle, listId, cardId, color, position, labels = null) => {
        //je recupere l' un element carte a partir du template
        const { newElem } = utilsModule.getTemplate('card__template');


        // Je remplis le nom de la carte
        const cardTitleElem = newElem.querySelector('.card__name');
        cardTitleElem.innerText = cardTitle;

        //je met a jour le dataset de l'elem avec l id recu en bdd

        const newCard = newElem.querySelector('.card__elem');
        newCard.dataset.cardId = cardId;
        newCard.dataset.position = position;
        //Je met la bonne couleur de la carte

        newCard.style.borderTop = `5px solid ${color}`;



        //mis a jour du formulaire d'edition d'une carte

        const editFormElem = newCard.querySelector('.edit__card__form');

        editFormElem.querySelector('input[name="card-id"]').value = cardId;
        editFormElem.querySelector('input[name="title"]').value = cardTitle;
        editFormElem.querySelector('input[name="color"]').value = color;

        /*
        ** FORMULAIRE EDITION CARTE
        **  met ecouteur d'evenement au bouton d'edit
        */

        const editBtnElem = newCard.querySelector('.edit__card__btn');
        editBtnElem.addEventListener('click', cardModule.showUpdateCardForm);

        // mets ecouteur evenement a la validation du form edition

        editFormElem.addEventListener('submit', cardModule.handleEditCardForm);

        /*
        ** FORMULAIRE SUPPRESSION CARTE
        ** ecouteur d'evenement au bouton supprimer de la carte
        */

        const deleteBtnElem = newCard.querySelector('.delete__card__btn');
        deleteBtnElem.addEventListener('click', cardModule.handleDeleteCard);

        /*
        ** FORMULAIRE AJOUT ASSOC LABEL
        **ecouteur d'evenements ajouter association carte/label
        */

        const addAssociationBtn = newCard.querySelector('.add__label__association__btn');
        addAssociationBtn.addEventListener('click', labelModule.showAddLabelAssociationForm);

        //ecouteur evenement validation du form association


        const associationFormElem = newCard.querySelector('.add__association__form');

        associationFormElem.querySelector('[type="hidden"]').value = cardId;

        associationFormElem.addEventListener('submit', labelModule.handleAddAssociationForm);



        // je recupere le container de carte de la bonne list et injecte la carte a la suite
        const cardContainer = document.querySelector(`div[data-list-id='${listId}'].list__elem .card__container`);
        cardContainer.appendChild(newCard);

        // creation de tags si disponibles

        if (labels) {
            labels.forEach(label => {

                labelModule.makeLabelInDOM(label, cardId);

            });
        }

        /*
        ** GESTION DRAG N DROP
        */

        // J'ajoute la class sortableJS
        newCard.classList.add('list-group-item');

    },

    /**
     * method qui gere la suppression d'un element card dans le front et dans la bdd
     * @param {Event} event 
    */

    handleDeleteCard: async (event) => {
        const cardElem = event.target.closest('.card__elem');
        const cardId = cardElem.dataset.cardId;

        try {
            const init = {
                method: "DELETE",
            }

            const response = await fetch(`${cardModule.base_url}/cards/${cardId}`, init);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            result = await response.json();
            cardElem.remove();

        } catch (error) {
            alert("error " + error);
        }
    },

    /**
    *  fonction qui gere la soumission du formulaire d'edition de cartes
    * @param {Event} event 
    */

    handleEditCardForm: async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const cardId = formData.get('card-id');
        const cardElem = event.target.closest('.card__elem');
        const cardTitleElem = cardElem.querySelector('.card__name');

        formData.delete('card-id');

        // on envoie la requete seulement si le champs du formulaire est correctement rentre
        if (formData.get('title') && formData.get('title').trim()) {

            //preparation de la requete http
            const init = {
                method: 'PATCH',
                headers: new Headers(),
                body: formData
            };

            // on soumet la requete et on teste s'il tout s'est bien passe (cad status 200)
            const response = await fetch(`${cardModule.base_url}/cards/${cardId}`, init);
            const result = await response.json();

            if (response.status !== 200) {
                alert(result);

            } else {  //tout s'est bien passe, on peut mettre a jour nos cartes en front avec les nouvelles donnees

                cardTitleElem.innerText = result.title;
                cardElem.style.borderTop = `5px solid ${result.color}`;

            }

        } else {

            event.target.querySelector('[type="text"]').value = cardTitleElem.innerText;

        }

        // on cache le formulaire et on affiche les donnees normales
        const container = cardElem.querySelector('.edit__helper');
        // cardElem.querySelectorAll('.columns').forEach(elem => elem.classList.toggle('is-hidden'));
        for (child of container.children) {
            child.classList.toggle('is-hidden');
        }
    },

    /**
     * Fonction qui gere le formulaire d'ajout de card => on recupere les donnees du form 
     * dans un FormData et on appel la fonction qui va generer le html
     * @param {Event} event 
     */

    handleAddCardForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        // if (formData.has('name') && formData.get('name')) {
        //   app.makeCardInDOM(formData);
        // }

        const listId = event.target.querySelector('[type="hidden"]').value;
        formData.append('list_id', listId)
        const nbOfCards = document.querySelectorAll(`[data-list-id='${listId}'].list__elem .card__elem`).length;
        formData.append('position', nbOfCards + 1);

        const init = {
            method: 'POST',
            headers: new Headers(),
            body: formData
        };

        try {
            const response = await fetch(cardModule.base_url + '/cards', init);
            const result = await response.json();
            if (response.ok) {
                cardModule.makeCardInDOM(result.title, listId, result.id, result.color, result.position);
                utilsModule.hideModals();
            } else {
                alert(result);
            }
        } catch (error) {
            console.log("gros proutasse" + error);
        }

    },

    /**
   * fonction pour afficher la modale ajout carte
   * @param {Event} event 
   */

    showAddCardModal: (event) => {
        console.log("coucou")
        //je recupere la modale
        const cardModal = document.getElementById('addCardModal');
        //je l'affiche
        cardModal.classList.add('is-active');
        // je recupe l'id de la liste ou je veux rajouter une carte
        const listId = event.target.closest('.panel').dataset.listId;
        // je met a jour le bon id dans le form de ma modale
        cardModal.querySelector('input[name="list-id"]').value = listId;
    },
    /**
    *  callback qui affiche le form de modif d une carte
    * @param {Event} event 
    */

    showUpdateCardForm: (event) => {

        const cardElem = event.target.closest('.card__elem > .edit__helper');
        // cardElem.querySelectorAll('.columns').forEach(elem => elem.classList.toggle('is-hidden'));
        for (child of cardElem.children) {
            child.classList.toggle('is-hidden');
        }
    },

    refreshCardPosFromList: async (cards, listId) => {
        let index = 0;

        for (card of cards) {
            //calcul de la position dans la liste
            const curPos = index + 1;
            const currentCardId = card.dataset.cardId;

            card.dataset.position = curPos;

            try {
                //construction de l'objet formulaire a passer dans la requete
                const formData = new FormData();
                formData.append('position', curPos);

                //je rempli le form avec la relation list_id de la carte, au cas ou elle ai change de liste
                formData.append('list_id', listId);


                const init = {
                    method: 'PATCH',
                    body: formData,
                };

                const response = await fetch(`${cardModule.base_url}/cards/${currentCardId}`, init);

                if (!response.ok) {
                    throw await response.json();
                }
                const result = await response.json();
            } catch (error) {
                alert(error);
            }
            index++;

        }

    },

    /**
   * callback de drag n drop appele lorsqu un drag n drop de carte se termine
   * on va refleter en back les changement survenu en front (si la carte a changee de liste et/ou de position dans sa liste ou la nouvelle)
   * @param {Event} event 
   */

    handleDraggedCard: (event) => {
        const movedCardId = event.item.dataset.cardId;
        const oldListId = event.from.closest('.list__elem').dataset.listId;
        const newListId = event.to.closest('.list__elem').dataset.listId;

        const cardsFromOldList = event.from.querySelectorAll('.card__elem');

        // On remet a jour les positions des cartes dans la liste d'origine

        cardModule.refreshCardPosFromList(cardsFromOldList, oldListId);

        if (oldListId !== newListId) { //Si la carte bougee a changee de liste, il faut mettre a jour les positions dans cette liste aussi
            const cardsFromNewList = event.to.querySelectorAll('.card__elem');
            
            //il faut mettre a jour toutes les positons des cartes dans la liste courante
            cardModule.refreshCardPosFromList(cardsFromNewList, newListId);

            //il faut changer la relation list_id de la carte avec l id de la nouvelle carte de destination

        }
    },
};

module.exports = cardModule;
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const utilsModule = require('./utils');
const listModule = require('./list');
const cardModule = require('./card');
const labelModule = require('./label');

// on objet qui contient des fonctions
const app = {

  // url de base de notre API
  base_url: 'https://my-kanban-vde-guil.herokuapp.com/',

  /**
   * fonction d'initialisation, lancée au chargement de la page
   */
  init:  function () {
    listModule.base_url = app.base_url;
    cardModule.base_url = app.base_url;
    labelModule.base_url = app.base_url;
    console.log('app.init !');
    app.addListenerToAction();
    listModule.getListsFromApi();

    // utilsModule.listDragIds.forEach(idElem => {
    //   const dragList = document.getElementById(idElem);

    //   new Sortable(dragList, {
    //     group: 'shared', // set both lists to same group
    //     animation: 150
    //   });

    // })

  },

  /** 
   * fonction pour ajouter listener au bouton ajout list
   */

  addListenerToAction: () => {

    /**
     * LISTES
     */

    // on ajoute event listener au bouton ajouter une liste
    const addListBtn = document.getElementById('addListButton');
    addListBtn.addEventListener('click', listModule.showAddListModal);

    //on ajoute une ecouteur au formulaire d'ajout d une liste
    const addListForm = document.querySelector('#addListModal form');
    addListForm.addEventListener('submit', listModule.handleAddListForm);

    const addCardForm = document.querySelector('#addCardModal form');
    addCardForm.addEventListener('submit', cardModule.handleAddCardForm);

    const removeListForm = document.querySelector('#deleteListModal form');
    removeListForm.addEventListener('submit', listModule.handleDeleteListForm)


    // on ajoute un ecouteur au bouton plus de chaque liste

    const addCardBtns = document.querySelectorAll('.add__card');
    for (const addCardBtn of addCardBtns) {
      addCardBtn.addEventListener('click', cardModule.showAddCardModal);
    }
    /**
     * LABELS
     */

    //on ajoute un event listener au bouton pour creer un label

    const addLabelBtn = document.getElementById('addLabelButton');
    addLabelBtn.addEventListener('click', labelModule.showAddLabelModal)

    // event listener soumission formulaire creation label

    const addLabelForm = document.querySelector('#addLabelModal form');
    addLabelForm.addEventListener('submit', labelModule.handleAddLabelForm);

    //on ajoute un event listener au bouton pour gerer les labels

    handleLabelBtn = document.getElementById('handleLabelsButton');
    handleLabelBtn.addEventListener('click', labelModule.showHandleLabelModal);

    // on ajoute event listener pour close la modale gerer les label pour faire un 'refresh' des infos de la page

    closeLabelBtns = document.querySelectorAll('.close__handle__label');
    closeLabelBtns.forEach(btn => {
      btn.addEventListener('click', listModule.hideLabelModalRefresh);
    });

    /**
     * MODALES
     */

    // on recupere tous les boutons close des modales pour leur ajouter
    const closeBtns = document.querySelectorAll('.modal .close');
    for (const closeBtn of closeBtns) {
      closeBtn.addEventListener('click', utilsModule.hideModals);
    }




  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);

},{"./card":2,"./label":3,"./list":4,"./utils":5}],2:[function(require,module,exports){
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
},{"./label":3,"./utils":5}],3:[function(require,module,exports){
const utilsModule = require('./utils');
const listModule = require('./list');

const labelModule = {
    base_url: 'null',
    /**
     * fonction qui cree un elem lable et qui l'ajoute
     * 
     * @param {Label} label Instance d'un element label venant de la bdd
     * @param {Number} listId 
     * @param {Number} cardId 
     */

    makeLabelInDOM: (label, cardId) => {

        const { newElem } = utilsModule.getTemplate('label__template');

        labelElem = newElem.querySelector('.label__elem');

        const labelContainer = document.querySelector(`[data-card-id="${cardId}"].card__elem  .label__container`);


        labelElem.querySelector('.label__name').textContent = label.name;
        labelElem.dataset.labelId = label.id;

        /**
         * ECOUTEUR EVENEMENT SUPPRESSION ASSOCIATION LABEL
         */

        const delAssociation = labelElem.querySelector('.delete__label__association__btn');
        delAssociation.addEventListener('click', labelModule.handleDeleteAssocation);


        // ajout dans le dom 

        labelContainer.append(labelElem);


    },

    /**
     * Methode qui gere la soumission du formulaire de creation d'un label
     * 
     * @param {Event} event 
     */

    handleAddLabelForm: async (event) => {
        event.preventDefault();

        
        const formData = new FormData(event.target);

        if (formData.get('name') && formData.get('name').trim()) {

            try {
                const init = {
                    method: 'POST',
                    body: formData
                }

                const response = await fetch(`${labelModule.base_url}/labels`, init);
                
                if (!response.ok) {
                    const error = await response.json();
                    throw error;
                }
                const label = await response.json();
                utilsModule.hideModals();

            } catch (error) {
                alert(error);
            }
        }
    },

    /**
     * callback qui gere la soumission du formulaire d'edition d'un label
     * @param {Event} event 
     */

    handleUpdateLabel: async (event) => {
        event.preventDefault();

        const labelElem = event.target.closest('.label__modal__elem')
        const labelTitle = labelElem.querySelector('.label__modal__name');
        console.log(labelTitle);

        const formData = new FormData(event.target);
        const labelId = formData.get('label-id');
        formData.delete('label-id');
        console.log(formData.get('name'));
        if (formData.get('name') && formData.get('name').trim()) {
            console.log('okay')
            try {

                const init = {
                    method: 'PATCH',
                    body: formData
                }

                const response = await fetch(`${labelModule.base_url}/labels/${labelId}`, init);
                if (!response) {
                    const error = await response.json();
                    throw error;
                }
                const newLabel = await response.json();

                labelTitle.innerText = newLabel.name;

            } catch (error) {
                alert(error);
            }
        } else {
            console.log('ko')

            event.target.querySelector('[type="text"]').value = labelTitle.innerText;
        }

        const currentLabelElement = labelElem.querySelector('.modal__edit__helper');

        for (element of currentLabelElement.children) {
            element.classList.toggle('is-hidden');
        }

    },

    /**
     * callback qui va supprimer une label dans la base de donnee
     * @param {Event} event 
     */

    handleDeleteLabelForm: async (event) => {

        const labelElem = event.target.closest('.label__modal__elem');
        const labelId = labelElem.dataset.labelId;

        console.log(labelId);
        try {
            const init = {
                method: 'DELETE',
            }

            const response = await fetch(`${labelModule.base_url}/labels/${labelId}`, init);
            if (!response.ok) {
                const error = await response.json();
                throw (error);
            }

            labelElem.remove();

        } catch (error) {
            alert(error);
        }

    },

    /**
     *  methode factorise qui gere soit la suppression soit l addition d une association de label
     * 
     * @param {Number} cardId 
     * @param {Number} labelId 
     * @param {DOMElement} labelContainer 
     * @param {Object} init object to pass to fetch with good method POST OR DELETE
     */

    handleAssociation: async (cardId, labelId, labelContainer, init) => {
        try {

            const response = await fetch(`${labelModule.base_url}/cards/${cardId}/labels/${labelId}`, init);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            // on recupere en resultat l'instance de la carte avec la liste des labels en include
            const result = await response.json();

            //je supprime et re injectes les labels dans le dom
            labelModule.refreshLabels(labelContainer, result.labels, cardId);


        } catch (error) {
            alert(error);
        }
    },

    /**
     * callback qui gere soumission formulaire d'ajout association label
     * 
     * @param {Event} event 
     */

    handleAddAssociationForm: async (event) => {
        event.preventDefault();

        const cardElem = event.target.closest('.card__elem');
        const labelContainer = cardElem.querySelector('.label__container');

        const formData = new FormData(event.target);
        const cardId = formData.get('card-id');
        const labelId = formData.get('tags');

        const init = {
            method: "POST"
        }

        if (formData.get('tags')) {
            labelModule.handleAssociation(cardId, labelId, labelContainer, init);
        }

        //je cache les labels 
        cardElem.querySelector('.label__container').classList.toggle('is-hidden');
        //j'affiche le formulaire
        cardElem.querySelector('form.add__association__form').classList.toggle('is-hidden');

    },

    /**
     *  callback qui gere soumission formulaire suppression association label
     * @param {Event} event 
     */

    handleDeleteAssocation: async (event) => {
        event.preventDefault();

        const cardElem = event.target.closest('.card__elem');
        const cardId = cardElem.dataset.cardId;
        const labelId = event.target.closest('.label__elem').dataset.labelId;
        const labelContainer = cardElem.querySelector('.label__container');

        const init = {
            method: "DELETE"
        }

        labelModule.handleAssociation(cardId, labelId, labelContainer, init);

    },

    /**
     * 
     * Fonction est appelee apres une association ou dissociation reussie entre label et carte
     * cette fonction va mettre a jour tous les labels associes a la carte en fonction des modifs d'associations reussis
     * 
     * @param {DOMElement} labelContainer element du Dom
     * @param {Array} labelList tableau d'instances de label recup en bdd
     * @param {Number} cardId id de la carte courante
     */

    refreshLabels: (labelContainer, labelList, cardId) => {
        // je vide les elements labels dans la carte
        const labelElements = labelContainer.querySelectorAll('.label__elem');
        labelElements.forEach(elem => elem.remove());

        //et je les recree

        labelList.forEach(label => {
            labelModule.makeLabelInDOM(label, cardId);
        });
    },

    /**
     * method qui cree un element label dans la modale de gestion des labels
     * 
     * @param {Label} label 
     * @param {DomElement} labelContainer 
     */

    makeLabelInModal: (label, labelContainer) => {

        const { newElem } = utilsModule.getTemplate('label__modal__template');

        labelElem = newElem.querySelector('.label__modal__elem');
        editLabelBtn = newElem.querySelector('.edit__label__btn');
        deleteLabelBtn = newElem.querySelector('.delete__label__btn');
        const editLabelForm = newElem.querySelector('form.edit__label__form');


        labelElem.dataset.labelId = label.id;
        labelElem.querySelector('.label__modal__name').textContent = label.name;

        /**
         * EDITION LABEL
         * ajout event listener sur click bouton modif label
         */

        editLabelBtn.addEventListener('click', labelModule.showUpdateLabelForm);

        // mise a jour du hidden input du formulaire avec label id + prefill du champ name


        editLabelForm.querySelector('[type="hidden"]').value = label.id;
        editLabelForm.querySelector('[type="text"]').value = label.name;


        //ajout du listener lors de la validation du form d'edition de label
        editLabelForm.addEventListener('submit', labelModule.handleUpdateLabel);


        /**
         * SUPPRESSION LABEL
         * ajout event listener suppression label
         */

        deleteLabelBtn.addEventListener('click', labelModule.handleDeleteLabelForm);

        /**
         * AJOUT DANS LE DOM
         */

        labelContainer.append(labelElem);
    },

    /**
     * callback pour afficher la modale d'ajout de label
     */

    showAddLabelModal: () => {
        const addLabelModal = document.getElementById('addLabelModal');

        addLabelModal.classList.add('is-active');
    },

    /**
     * callback qui va afficher le formulaire d'edition d'un label pour pouvoir modifier son nom
     * @param {Event} event 
     */

    showUpdateLabelForm: (event) => {
        const currentLabelElement = event.target.closest('.modal__edit__helper');

        for (element of currentLabelElement.children) {
            element.classList.toggle('is-hidden');
        }
    },

    /**
     *  Callback qui va afficher la modale de gestion des labels (suppression modification)
     * @param {Event} event 
     */

    showHandleLabelModal: async (event) => {
        const labelModalElem = document.getElementById('handleLabelsModal');
        labelModalElem.classList.toggle('is-active');

        const labelContainer = labelModalElem.querySelector('section');
        //Je vide tous les labels presents avant de reafficher la derniere liste a jour
        labelContainer.innerHTML = "";

        try { // et je vais chercher la liste a jour dans la base et je l'affiche dans le dom
            const response = await fetch(`${labelModule.base_url}/labels`);

            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            const labels = await response.json();

            labels.forEach(label => {
                labelModule.makeLabelInModal(label, labelContainer);
            });

        } catch (error) {
            console.log(error);
        }

    },

    /**
     *  callback qui affiche le formulaire d'association d'un label et d'une carte
     * 
     * @param {Event} event 
     */


    showAddLabelAssociationForm: async (event) => {
        const cardElem = event.target.closest('.card__elem');
        const cardId = cardElem.dataset.cardId;

        //je cache les labels 
        cardElem.querySelector('.label__container').classList.toggle('is-hidden');
        //j'affiche le formulaire
        cardElem.querySelector('form.add__association__form').classList.toggle('is-hidden');

        labelSelectElem = cardElem.querySelector('select.tags__select');

        //je vide les options deja existantes

        const prevOptions = labelSelectElem.querySelectorAll('option');

        for (let index = 1; index < prevOptions.length; ++index) {
            prevOptions[index].remove();
        }

        // Je fais un fetch vers la bdd pour remplir le select avec les labels dispos

        try {
            const response = await fetch(`${labelModule.base_url}/labels`);
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            const labels = await response.json();

            // j'itere a travers mes labels pour creer les options du select

            for (label of labels) {
                const curOption = document.createElement('option');
                curOption.value = label.id;
                curOption.textContent = label.name;
                labelSelectElem.append(curOption);
            }

        } catch (error) {
            alert("error: " + error);
        }

    },
};

module.exports = labelModule;

},{"./list":4,"./utils":5}],4:[function(require,module,exports){
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

},{"./card":2,"./utils":5}],5:[function(require,module,exports){
const utilsModule = {

  listDragIds: undefined,


  /**
     * fonction pour fermer toutes les modales
     */
  hideModals: () => {
    const modals = document.querySelectorAll('.modal');

    for (const modal of modals) {
      modal.classList.remove('is-active');
    }

    // je vide tous les inputs du formulaire
    document.querySelectorAll('input').forEach((elem) => {
      if (elem.type !== 'hidden') {
        if (elem.type === 'color') {
          elem.value = '#ffffff';
        } else {
          elem.value = '';
        }
      }
    });
  },

  /**
   * Recupere un id de template et cree et renvoie
   * 
   * @param { String } templateId - string de l'id du template dans le html
   */

  getTemplate: (templateId) => {
    //recuperation du template de list et clone dans un nouvel element
    const template = document.getElementById(templateId);
    //const newElem = template.content.cloneNode(true);
    const newElem = document.importNode(template.content, true);
    return { newElem };
  },

  
};

module.exports = utilsModule;
},{}]},{},[1]);

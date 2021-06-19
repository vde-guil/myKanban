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

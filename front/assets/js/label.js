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

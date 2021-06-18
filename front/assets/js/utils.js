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
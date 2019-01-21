when('I add a cross table', () => {
  cy.get('.ui-selectbutton .ui-button-text-only').last().click();
  cy.get('.btn-container .btn.btn-primary').contains('Add').click();
});

then('A cross table should show up', () => {
  cy.get('.table-container .description').contains('Cross Table').should('exist');
  cy.get('.row').first().contains('Column');
  cy.get('.row').last().contains('Row');
});

/**
 * Note that for PrimeNg drag n drop, the drop action is only recognizable by Cypress
 * if the drop zone is a descendant element of its droppable-scoped ancestor,
 * i.e. the parent has the primeNg directive [pDroppable]=...
 * also, the descendant element should be a div
 */
then('Drag CATEGORICAL_VALUES:Demography:Race from Tree View to row zone', () => {
  cy.toggleNode('Demography');
  cy.drag('Race', '.gb-variables-tree-container').drop(1, 'div.gb-droppable-zone-info-container');
});

then('Cross table has Latino and Caucasian labels', () => {
  cy.get('.ui-table-tbody').contains('Latino');
  cy.get('.ui-table-tbody').contains('Caucasian');
});

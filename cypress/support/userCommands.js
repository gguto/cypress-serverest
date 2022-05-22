/// <reference types="Cypress" />

Cypress.Commands.add('getTodosUsuarios', () => {
    cy.api({
        method: 'GET',
        url: '/usuarios'
    });
});

Cypress.Commands.add('getUsuarios', (queryString) => {
    cy.api({
        method: 'GET',
        failOnStatusCode: false,
        url: '/usuarios?' + queryString
    });
});

Cypress.Commands.add('postUser', (userObject) => {
    cy.api({
        method: 'POST',
        failOnStatusCode: false,
        url: '/usuarios',
        body: userObject
    });
});
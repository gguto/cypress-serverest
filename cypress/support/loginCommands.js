
/// <reference types="Cypress" />

Cypress.Commands.add('generateUserToken', (email, password) => {

      cy.api({
          method: 'POST',
          url: '/login',
          body: {
              "email": email,
              "password": password
          }
      })
          .then(response => {
              expect(response.status).to.eql(200);
              localStorage.setItem('token', response.body.authorization);
              expect(localStorage.getItem('token')).not.null;
              cy.log(localStorage.getItem('token'));
          })
  })
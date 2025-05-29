import './commands'
import '@testing-library/cypress/add-commands'
import 'cypress-file-upload'

beforeEach(() => {
  cy.intercept('GET', '**/api/dashboard/stats').as('getDashboardStats');
  cy.intercept('GET', '**/api/programs').as('getPrograms');
  cy.intercept('POST', '**/api/programs').as('createProgram');
});
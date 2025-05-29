Cypress.Commands.add('login', (email = 'admin@salman.org', password = 'admin123') => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: {
      email,
      password
    }
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
    window.localStorage.setItem('user', JSON.stringify(response.body.user));
  });
});

Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
});

Cypress.Commands.add('createTestProgram', (programData) => {
  const token = window.localStorage.getItem('token');
  
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/programs`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: programData
  });
});

Cypress.Commands.add('cleanupTestData', () => {
  const token = window.localStorage.getItem('token');
  
  cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/programs`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((response) => {
    response.body.data.forEach(program => {
      if (program.nama_program.includes('Test')) {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiUrl')}/programs/${program.id}`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    });
  });
});
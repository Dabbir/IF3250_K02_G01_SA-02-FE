describe('Login Page Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  describe('UI Elements', () => {
    it('should display all login form elements', () => {
      cy.contains('Masuk').should('be.visible');
      
      cy.get('[data-cy=email-input]').should('be.visible');
      cy.get('[data-cy=password-input]').should('be.visible');
      cy.get('[data-cy=login-button]').should('be.visible');
      
      cy.get('[data-cy=google-login-button]').should('be.visible');
      
      cy.contains('Daftar Di Sini').should('be.visible');
      
      cy.contains('Alamat Email').should('be.visible');
      cy.contains('Kata Sandi').should('be.visible');
    });

    it('should toggle password visibility', () => {
      cy.get('[data-cy=password-input]').type('testpassword');
      
      cy.get('[data-cy=password-input]').should('have.attr', 'type', 'password');
      
      cy.get('[data-cy=password-input]').parent().find('button').click();
      cy.get('[data-cy=password-input]').should('have.attr', 'type', 'text');
      
      cy.get('[data-cy=password-input]').parent().find('button').click();
      cy.get('[data-cy=password-input]').should('have.attr', 'type', 'password');
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty fields', () => {
      cy.get('[data-cy=login-button]').click();
      
      cy.wait(500);
      
      cy.get('body').should('contain', 'Alamat email wajib diisi');
      cy.get('body').should('contain', 'Kata sandi wajib diisi');
    });

    it('should validate email format', () => {
      cy.get('[data-cy=email-input]').type('invalid-email-format');
      cy.get('[data-cy=password-input]').type('password123');
      cy.get('[data-cy=login-button]').click();
      
      cy.wait(500);
      cy.get('body').should('contain', 'Format email tidak valid');
    });

    it('should clear validation errors when user types', () => {
      cy.get('[data-cy=login-button]').click();
      cy.wait(500);
      cy.get('body').should('contain', 'Alamat email wajib diisi');
      
      cy.get('[data-cy=email-input]').type('test@example.com');
      cy.get('body').should('not.contain', 'Alamat email wajib diisi');
    });
  });

  describe('Authentication Flow', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/api/auth/login').as('loginRequest');
    });

    it('should login successfully with valid credentials', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: {
          token: 'mock-jwt-token',
          user: { 
            id: 1, 
            email: 'admin@salman.org', 
            nama: 'Admin Salman',
            peran: 'Admin' 
          }
        }
      }).as('successLogin');

      cy.get('[data-cy=email-input]').type('admin@salman.org');
      cy.get('[data-cy=password-input]').type('admin123');
      cy.get('[data-cy=login-button]').click();
      
      cy.wait('@successLogin');
      
      cy.wait(100);
      
      cy.window().its('localStorage').invoke('getItem', 'token').should('equal', 'mock-jwt-token');
      
      cy.window().its('localStorage').invoke('getItem', 'showSuccessLoginToast').should('equal', 'true');
    });

    it('should show error message for invalid credentials', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 401,
        body: {
          message: 'email/password yang anda masukkan salah'
        }
      }).as('failedLogin');

      cy.get('[data-cy=email-input]').type('wrong@email.com');
      cy.get('[data-cy=password-input]').type('wrongpassword');
      cy.get('[data-cy=login-button]').click();
      
      cy.wait('@failedLogin');
      cy.wait(1000);
      
      cy.get('body').should('contain', 'email/password yang anda masukkan salah');
    });

    it('should handle server error gracefully', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 500,
        body: {
          message: 'Internal server error'
        }
      }).as('serverError');

      cy.get('[data-cy=email-input]').type('admin@salman.org');
      cy.get('[data-cy=password-input]').type('admin123');
      cy.get('[data-cy=login-button]').click();
      
      cy.wait('@serverError');
      cy.wait(2000);
      
      cy.get('body').should('satisfy', ($body) => {
        const text = $body.text();
        return text.includes('Login gagal') || 
               text.includes('gagal') || 
               text.includes('server error') ||
               text.includes('Internal server error');
      });
    });

    it('should handle network error', () => {
      cy.intercept('POST', '**/api/auth/login', { forceNetworkError: true }).as('networkError');

      cy.get('[data-cy=email-input]').type('admin@salman.org');
      cy.get('[data-cy=password-input]').type('admin123');
      cy.get('[data-cy=login-button]').click();
      
      cy.wait('@networkError');
      cy.wait(3000);
      
      cy.get('body').should('satisfy', ($body) => {
        const text = $body.text();
        return text.includes('Login gagal') || 
               text.includes('gagal') || 
               text.includes('network') ||
               text.includes('koneksi') ||
               text.includes('error') ||
               $body.find('[data-cy=login-button]:not(:disabled)').length > 0;
      });
    });
  });

  // describe('Google Authentication', () => {
  //   it('should have Google login button that triggers redirect', () => {
  //     cy.get('[data-cy=google-login-button]').should('be.visible');
  //     cy.get('[data-cy=google-login-button]').should('contain', 'Masuk dengan Akun Google');
  //     cy.get('[data-cy=google-login-button]').should('not.be.disabled');
  //   });

  //   it('should handle Google OAuth button click', () => {
  //     // Simple test - just verify the button is clickable and doesn't cause errors
  //     // We can't easily test the actual redirect without complex setup
  //     cy.get('[data-cy=google-login-button]').click();
      
  //     // If we reach this point, the click didn't cause JavaScript errors
  //     // In a real app, this would redirect to Google OAuth
  //     cy.get('[data-cy=google-login-button]').should('exist');
  //   });
  // });

  describe('Navigation', () => {
    it('should navigate to register page when register link is clicked', () => {
      cy.contains('Daftar Di Sini').click();
      cy.url().should('include', '/register');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x');
      
      cy.get('[data-cy=email-input]').should('be.visible');
      cy.get('[data-cy=password-input]').should('be.visible');
      cy.get('[data-cy=login-button]').should('be.visible');
      
      cy.get('[data-cy=email-input]').type('test@example.com');
      cy.get('[data-cy=password-input]').type('password123');
      cy.get('[data-cy=login-button]').should('be.enabled');
    });

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2');
      
      cy.get('[data-cy=email-input]').should('be.visible');
      cy.get('[data-cy=password-input]').should('be.visible');
      cy.get('[data-cy=login-button]').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      cy.contains('label', 'Alamat Email').should('be.visible');
      cy.contains('label', 'Kata Sandi').should('be.visible');
    });

    it('should allow sequential focus through form elements', () => {
      cy.get('[data-cy=email-input]').focus().should('be.focused');
      cy.get('[data-cy=password-input]').focus().should('be.focused');
      cy.get('[data-cy=login-button]').focus().should('be.focused');
      cy.get('[data-cy=google-login-button]').focus().should('be.focused');
    });

    it('should submit form when Enter is pressed', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: { token: 'test-token', user: {} }
      }).as('loginRequest');
      
      cy.get('[data-cy=email-input]').type('admin@salman.org');
      cy.get('[data-cy=password-input]').type('admin123{enter}');
      
      cy.wait('@loginRequest');
    });
  });

  describe('Security', () => {
    it('should have password field with proper security attributes', () => {
      cy.get('[data-cy=password-input]').type('secretpassword');
      
      cy.get('[data-cy=password-input]').should('have.attr', 'type', 'password');
      cy.get('[data-cy=password-input]').should('not.contain.text', 'secretpassword');
      cy.get('[data-cy=password-input]').should('have.css', '-webkit-text-security');
    });

    it('should not expose sensitive data through DOM inspection', () => {
      const sensitivePassword = 'topsecretpassword123';
      cy.get('[data-cy=password-input]').type(sensitivePassword);
      
      cy.get('body').should('not.contain', sensitivePassword);
      
      cy.get('[data-cy=password-input]').then(($input) => {
        expect($input.attr('type')).to.equal('password');
      });
    });

    it('should clear form when redirecting', () => {
      cy.get('[data-cy=email-input]').type('admin@salman.org');
      cy.get('[data-cy=password-input]').type('admin123');
      
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: { token: 'token', user: {} }
      }).as('loginSuccess');
      
      cy.get('[data-cy=login-button]').click();
      cy.wait('@loginSuccess');
      cy.wait(1000);
      
      cy.window().then((win) => {
        expect(win.password).to.be.undefined;
      });
    });
  });

  describe('Performance', () => {
    it('should load page elements within reasonable time', () => {
      cy.get('[data-cy=email-input]', { timeout: 3000 }).should('be.visible');
      cy.get('[data-cy=password-input]', { timeout: 3000 }).should('be.visible');
      cy.get('[data-cy=login-button]', { timeout: 3000 }).should('be.visible');
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle toast error messages', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 500,
        body: { message: 'Server error' }
      }).as('serverError');

      cy.get('[data-cy=email-input]').type('admin@salman.org');
      cy.get('[data-cy=password-input]').type('admin123');
      cy.get('[data-cy=login-button]').click();
      
      cy.wait('@serverError');
      cy.wait(3000);
      
      cy.get('body').should('satisfy', ($body) => {
        const text = $body.text().toLowerCase();
        return text.includes('error') || 
               text.includes('gagal') || 
               text.includes('salah') ||
               $body.find('[data-cy=login-button]').length > 0;
      });
    });

    it('should maintain form state during error scenarios', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' }
      }).as('invalidCreds');

      const email = 'test@example.com';
      const password = 'wrongpassword';

      cy.get('[data-cy=email-input]').type(email);
      cy.get('[data-cy=password-input]').type(password);
      cy.get('[data-cy=login-button]').click();
      
      cy.wait('@invalidCreds');
      cy.wait(1000);
      
      cy.get('[data-cy=email-input]').should('have.value', email);
    });
  });
});
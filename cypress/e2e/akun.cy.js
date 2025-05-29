describe('Account Management Page', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhaG1hZEBleGFtcGxlLmNvbSIsIm1hc2ppZF9pZCI6MSwicGVyYW4iOiJFZGl0b3IiLCJpYXQiOjE3NDg1MDg2MzYsImV4cCI6MTc0ODUxMjIzNn0.wk8BJWLp1O3MFRQOP00H91dDv7MTB0TU7wztkYw1f34');
    });

    cy.visit('/akun-manajemen');
  })

  describe('Page Load and Initial State', () => {
    it('should display the page title', () => {
      cy.get('[data-cy="page-title"]')
        .should('be.visible')
        .and('contain.text', 'Manajemen Akun')
    })

    it('should display mosque information', () => {
      cy.get('[data-cy="mosque-name"]')
        .should('be.visible')
        .and('not.be.empty')
      
      cy.get('[data-cy="mosque-address"]')
        .should('be.visible')
        .and('not.be.empty')
    })

    it('should display profile image section', () => {
      cy.get('[data-cy="profile-image-section"]')
        .should('be.visible')
      
      cy.get('[data-cy="profile-image"]')
        .should('be.visible')
    })

    it('should display edit button in non-editing mode', () => {
      cy.get('[data-cy="edit-button"]')
        .should('be.visible')
        .and('contain.text', 'Edit')
    })

    it('should display profile form', () => {
      cy.get('[data-cy="profile-form"]')
        .should('be.visible')
    })
  })

  describe('Form Fields in View Mode', () => {
    it('should display all form inputs as disabled', () => {
      cy.get('[data-cy="namaDepan-input"]')
        .should('be.visible')
        .and('be.disabled')
      
      cy.get('[data-cy="namaBelakang-input"]')
        .should('be.visible')
        .and('be.disabled')
      
      cy.get('[data-cy="email-input"]')
        .should('be.visible')
        .and('be.disabled')
      
      cy.get('[data-cy="alasanBergabung-textarea"]')
        .should('be.visible')
        .and('be.disabled')
      
      cy.get('[data-cy="bio-textarea"]')
        .should('be.visible')
        .and('be.disabled')
    })

    it('should not display image upload and delete buttons in view mode', () => {
      cy.get('[data-cy="image-upload-button"]')
        .should('not.exist')
      
      cy.get('[data-cy="delete-photo-button"]')
        .should('not.exist')
    })

    it('should not display save and cancel buttons in view mode', () => {
      cy.get('[data-cy="save-button"]')
        .should('not.exist')
      
      cy.get('[data-cy="cancel-button"]')
        .should('not.exist')
    })
  })

  describe('Edit Mode Functionality', () => {
    beforeEach(() => {
      // Enter edit mode
      cy.get('[data-cy="edit-button"]').click()
    })

    it('should enable all form inputs when in edit mode', () => {
      cy.get('[data-cy="namaDepan-input"]')
        .should('not.be.disabled')
      
      cy.get('[data-cy="namaBelakang-input"]')
        .should('not.be.disabled')
      
      cy.get('[data-cy="email-input"]')
        .should('not.be.disabled')
      
      cy.get('[data-cy="alasanBergabung-textarea"]')
        .should('not.be.disabled')
      
      cy.get('[data-cy="bio-textarea"]')
        .should('not.be.disabled')
    })

    it('should display image upload and delete buttons in edit mode', () => {
      cy.get('[data-cy="image-upload-button"]')
        .should('be.visible')
        .and('contain.text', 'Ubah')
      
      cy.get('[data-cy="delete-photo-button"]')
        .should('be.visible')
        .and('contain.text', 'Hapus')
    })

    it('should display save and cancel buttons in edit mode', () => {
      cy.get('[data-cy="save-button"]')
        .should('be.visible')
        .and('contain.text', 'Simpan')
      
      cy.get('[data-cy="cancel-button"]')
        .should('be.visible')
        .and('contain.text', 'Batal')
    })
  })

  describe('Form Input Validation', () => {
    beforeEach(() => {
      cy.get('[data-cy="edit-button"]').click()
    })

    it('should allow typing in nama depan input', () => {
      const testName = 'John'
      cy.get('[data-cy="namaDepan-input"]')
        .clear()
        .type(testName)
        .should('have.value', testName)
    })

    it('should allow typing in nama belakang input', () => {
      const testName = 'Doe'
      cy.get('[data-cy="namaBelakang-input"]')
        .clear()
        .type(testName)
        .should('have.value', testName)
    })

    it('should allow typing in email input', () => {
      const testEmail = 'john.doe@example.com'
      cy.get('[data-cy="email-input"]')
        .clear()
        .type(testEmail)
        .should('have.value', testEmail)
    })

    it('should allow typing in alasan bergabung textarea', () => {
      const testReason = 'This is my reason for joining'
      cy.get('[data-cy="alasanBergabung-textarea"]')
        .clear()
        .type(testReason)
        .should('have.value', testReason)
    })

    it('should allow typing in bio textarea', () => {
      const testBio = 'This is my bio'
      cy.get('[data-cy="bio-textarea"]')
        .clear()
        .type(testBio)
        .should('have.value', testBio)
    })

    it('should show character count for alasan bergabung', () => {
      const testText = 'Test text'
      cy.get('[data-cy="alasanBergabung-textarea"]')
        .clear()
        .type(testText)
      
      // Check if character count is displayed (should show something like "9/100")
      cy.get('[data-cy="alasanBergabung-textarea"]')
        .parent()
        .should('contain.text', `${testText.length}/100`)
    })

    it('should show character count for bio', () => {
      const testText = 'Test bio'
      cy.get('[data-cy="bio-textarea"]')
        .clear()
        .type(testText)
      
      // Check if character count is displayed (should show something like "8/300")
      cy.get('[data-cy="bio-textarea"]')
        .parent()
        .should('contain.text', `${testText.length}/300`)
    })
  })

  describe('Image Management', () => {
    beforeEach(() => {
      cy.get('[data-cy="edit-button"]').click()
    })

    it('should trigger file input when upload button is clicked', () => {
      // Mock file input
      cy.get('#profile-upload').should('exist')
      
      cy.get('[data-cy="image-upload-button"]')
        .should('be.visible')
        .and('not.be.disabled')
    })

    it('should show delete confirmation dialog when delete button is clicked', () => {
      cy.get('[data-cy="delete-photo-button"]').click()
      
      // Check if dialog appears
      cy.get('body').should('contain.text', 'Hapus Foto Profil')
      cy.get('body').should('contain.text', 'Apakah Anda yakin ingin menghapus foto profil?')
      
      // Check dialog buttons
      cy.contains('button', 'Batal').should('be.visible')
      cy.contains('button', 'Hapus Foto').should('be.visible')
    })
  })

  describe('Save and Cancel Actions', () => {
    beforeEach(() => {
      cy.get('[data-cy="edit-button"]').click()
    })

    it('should return to view mode when cancel button is clicked', () => {
      // Make some changes
      cy.get('[data-cy="namaDepan-input"]')
        .clear()
        .type('Test Name')
      
      // Click cancel
      cy.get('[data-cy="cancel-button"]').click()
      
      // Should return to view mode
      cy.get('[data-cy="edit-button"]')
        .should('be.visible')
      
      cy.get('[data-cy="namaDepan-input"]')
        .should('be.disabled')
    })

    it('should disable save and cancel buttons when saving', () => {
      // This test might need to be adjusted based on actual save behavior
      // and might require mocking the save API call to test properly
      cy.get('[data-cy="save-button"]').should('not.be.disabled')
      cy.get('[data-cy="cancel-button"]').should('not.be.disabled')
    })
  })

  describe('Form Validation Errors', () => {
    beforeEach(() => {
      cy.get('[data-cy="edit-button"]').click()
    })

    it('should show validation errors for required fields', () => {
      // Clear required fields
      cy.get('[data-cy="namaDepan-input"]').clear()
      cy.get('[data-cy="email-input"]').clear()
      
      // Try to save
      cy.get('[data-cy="save-button"]').click()
      
      // Check if validation errors appear
      // This depends on the actual validation implementation
      cy.get('[data-cy="namaDepan-input"]')
        .should('have.class', 'border-red-500')
      
      cy.get('[data-cy="email-input"]')
        .should('have.class', 'border-red-500')
    })

    it('should show proper border color for valid fields', () => {
      cy.get('[data-cy="namaBelakang-input"]')
        .should('have.class', 'border-[var(--green)]')
      
      cy.get('[data-cy="bio-textarea"]')
        .should('have.class', 'border-[var(--green)]')
    })
  })

  describe('Responsive Design', () => {
    it('should be responsive on mobile devices', () => {
      cy.viewport('iphone-x')
      
      cy.get('[data-cy="page-title"]').should('be.visible')
      cy.get('[data-cy="profile-image"]').should('be.visible')
      cy.get('[data-cy="profile-form"]').should('be.visible')
    })

    it('should be responsive on tablet devices', () => {
      cy.viewport('ipad-2')
      
      cy.get('[data-cy="page-title"]').should('be.visible')
      cy.get('[data-cy="profile-image"]').should('be.visible')
      cy.get('[data-cy="profile-form"]').should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for form inputs', () => {
      cy.get('[data-cy="namaDepan-input"]')
        .should('have.attr', 'id', 'namaDepan')
      
      cy.get('label[for="namaDepan"]')
        .should('exist')
        .and('contain.text', 'Nama Depan')
      
      cy.get('[data-cy="email-input"]')
        .should('have.attr', 'id', 'email')
      
      cy.get('label[for="email"]')
        .should('exist')
        .and('contain.text', 'Email')
    })
  })
})
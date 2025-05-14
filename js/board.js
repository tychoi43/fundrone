document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('.open-modal');
    const modalClosers = document.querySelectorAll('.close-modal');
    
    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('href');
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            }
        });
    });
    
    // Close modal
    modalClosers.forEach(closer => {
        closer.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    });
    
    // Close modal when clicking outside of modal content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const tableRows = document.querySelectorAll('.board-list tbody tr');
    
    if (searchInput && searchButton && tableRows.length > 0) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            tableRows.forEach(row => {
                const title = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                const author = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
    }
    
    // Category filter functionality
    const categoryFilter = document.querySelector('.filter-options select');
    
    if (categoryFilter && tableRows.length > 0) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            
            tableRows.forEach(row => {
                if (selectedCategory === 'all') {
                    row.style.display = '';
                } else {
                    const categoryCell = row.querySelector('td:nth-child(2) span');
                    if (categoryCell && categoryCell.classList.contains(selectedCategory)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // File upload preview (for upload forms)
    const fileInput = document.getElementById('file');
    
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            // Create file list preview or update existing
            let fileListPreview = document.querySelector('.file-preview');
            
            if (!fileListPreview) {
                fileListPreview = document.createElement('div');
                fileListPreview.className = 'file-preview';
                fileListPreview.innerHTML = '<h4>선택된 파일:</h4><ul></ul>';
                this.parentNode.appendChild(fileListPreview);
            }
            
            const fileList = fileListPreview.querySelector('ul');
            fileList.innerHTML = '';
            
            // Add each file to the preview
            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                const fileSize = (file.size / 1024 / 1024).toFixed(2); // Convert to MB
                
                const listItem = document.createElement('li');
                
                // Get file icon based on type
                let iconClass = 'fa-file';
                if (file.type.includes('image')) {
                    iconClass = 'fa-file-image';
                } else if (file.type.includes('pdf')) {
                    iconClass = 'fa-file-pdf';
                } else if (file.type.includes('word') || file.type.includes('doc')) {
                    iconClass = 'fa-file-word';
                } else if (file.type.includes('excel') || file.type.includes('sheet')) {
                    iconClass = 'fa-file-excel';
                } else if (file.type.includes('video')) {
                    iconClass = 'fa-file-video';
                }
                
                listItem.innerHTML = `
                    <i class="fas ${iconClass}"></i>
                    <span>${file.name} (${fileSize} MB)</span>
                `;
                
                fileList.appendChild(listItem);
            }
        });
    }
    
    // Form submission handling
    const uploadForm = document.querySelector('.upload-form');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would handle the form submission here
            // For this demonstration, we'll just show a success message
            
            const formData = new FormData(this);
            console.log('Form submitted with:', formData);
            
            // Create a success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>문서가 성공적으로 업로드되었습니다!</p>
            `;
            
            // Replace form with success message
            this.innerHTML = '';
            this.appendChild(successMessage);
            
            // Close the modal after a delay
            setTimeout(() => {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                    
                    // Reset the form for next use
                    setTimeout(() => {
                        this.reset();
                        this.innerHTML = document.querySelector('#upload-form-template').innerHTML;
                    }, 500);
                }
            }, 2000);
        });
    }
}); 
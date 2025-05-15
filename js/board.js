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
    
    // Pagination functionality
    const paginationLinks = document.querySelectorAll('.board-pagination a');
    const tableRows = document.querySelectorAll('.board-list tbody tr');
    
    if (paginationLinks.length > 0 && tableRows.length > 0) {
        // Set default items per page
        const itemsPerPage = 5;
        
        // Calculate total pages
        const totalItems = tableRows.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Store all rows data
        const allRows = Array.from(tableRows);
        let currentPage = 1;
        
        // Function to display rows for the current page
        function displayRows(page) {
            // Hide all rows
            allRows.forEach(row => {
                row.style.display = 'none';
            });
            
            // Calculate start and end index for the current page
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
            
            // Show rows for the current page
            for (let i = startIndex; i < endIndex; i++) {
                if (allRows[i]) {
                    allRows[i].style.display = '';
                }
            }
            
            // Update pagination active state
            paginationLinks.forEach((link, index) => {
                if (index > 0 && index <= totalPages) { // Skip the 'next' button
                    if (index === page) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                }
            });
        }
        
        // Add click event to pagination links
        paginationLinks.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (this.classList.contains('next')) {
                    // Next button clicked
                    if (currentPage < totalPages) {
                        currentPage++;
                        displayRows(currentPage);
                    }
                } else {
                    // Page number clicked
                    currentPage = index;
                    displayRows(currentPage);
                }
            });
        });
        
        // Initialize with first page
        displayRows(currentPage);
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
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
            
            // Reset pagination after search
            if (paginationLinks.length > 0) {
                paginationLinks[0].classList.add('active');
                for (let i = 1; i < paginationLinks.length; i++) {
                    paginationLinks[i].classList.remove('active');
                }
            }
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
            
            // Reset pagination after filtering
            if (paginationLinks.length > 0) {
                paginationLinks[0].classList.add('active');
                for (let i = 1; i < paginationLinks.length; i++) {
                    paginationLinks[i].classList.remove('active');
                }
            }
        });
    }
    
    // File upload preview (for upload forms)
    const fileInput = document.getElementById('file');
    const questionFileInput = document.getElementById('question-file');
    
    function setupFileUploadPreview(input) {
        if (!input) return;
        
        input.addEventListener('change', function() {
            // Create file list preview or update existing
            let fileListPreview = this.parentNode.querySelector('.file-preview');
            
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
    
    // Setup file upload previews for both document and question upload forms
    setupFileUploadPreview(fileInput);
    setupFileUploadPreview(questionFileInput);
    
    // Form submission handling
    const uploadForms = document.querySelectorAll('.upload-form');
    
    if (uploadForms.length > 0) {
        uploadForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // In a real application, you would handle the form submission here
                // For this demonstration, we'll just show a success message
                
                const formData = new FormData(this);
                console.log('Form submitted with:', formData);
                
                // Get form type
                let successMessage = '문서가 성공적으로 업로드되었습니다!';
                if (form.closest('#question-modal')) {
                    successMessage = '질문이 성공적으로 등록되었습니다!';
                }
                
                // Create a success message
                const successElement = document.createElement('div');
                successElement.className = 'success-message';
                successElement.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>${successMessage}</p>
                `;
                
                // Replace form with success message
                this.innerHTML = '';
                this.appendChild(successElement);
                
                // Close the modal after a delay
                setTimeout(() => {
                    const modal = this.closest('.modal');
                    if (modal) {
                        modal.style.display = 'none';
                        document.body.style.overflow = '';
                        
                        // Add new item to the board
                        addNewItemToBoard(formData);
                        
                        // Reset the form for next use
                        setTimeout(() => {
                            this.reset();
                            const filePreview = this.querySelector('.file-preview');
                            if (filePreview) filePreview.remove();
                        }, 500);
                    }
                }, 2000);
            });
        });
    }
    
    // Function to add new item to the board
    function addNewItemToBoard(formData) {
        const boardList = document.querySelector('.board-list tbody');
        if (!boardList) return;
        
        // Get form data
        const title = formData.get('title') || formData.get('question-title') || '새 게시물';
        const category = formData.get('category') || formData.get('question-category') || 'other';
        const categoryText = getCategoryText(category);
        
        // Get the latest post number
        const latestNumber = parseInt(boardList.querySelector('tr:first-child td:first-child').textContent) + 1;
        
        // Create a new row
        const newRow = document.createElement('tr');
        const today = new Date().toISOString().split('T')[0];
        
        newRow.innerHTML = `
            <td>${latestNumber}</td>
            <td><span class="category ${category}">${categoryText}</span></td>
            <td><a href="#post-modal" class="open-modal">${title}</a></td>
            <td>현재 사용자</td>
            <td>${today}</td>
            <td>0</td>
        `;
        
        // Add to the board
        boardList.insertBefore(newRow, boardList.firstChild);
        
        // Reinitialize event listeners for the new item
        const newModalTrigger = newRow.querySelector('.open-modal');
        if (newModalTrigger) {
            newModalTrigger.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('href');
                const modal = document.querySelector(modalId);
                if (modal) {
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        }
    }
    
    // Helper function to get category text
    function getCategoryText(category) {
        const categoryMap = {
            'fpv': 'FPV 드론',
            'educational': '교육용 드론',
            'assembly': '조립 가이드',
            'flight': '비행 테크닉',
            'other': '기타'
        };
        
        return categoryMap[category] || '기타';
    }
    
    // Answer form handling
    const answerForm = document.querySelector('.answer-form form');
    
    if (answerForm) {
        answerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const textarea = this.querySelector('textarea');
            const answerText = textarea.value.trim();
            
            if (answerText === '') return; // Don't submit empty answers
            
            // Create a new answer
            const answersSection = document.querySelector('.answers-section');
            const newAnswer = document.createElement('div');
            newAnswer.className = 'answer';
            
            const currentDate = new Date().toISOString().split('T')[0];
            
            newAnswer.innerHTML = `
                <div class="answer-header">
                    <div class="answer-info">
                        <span><i class="fas fa-user"></i> 현재 사용자</span>
                        <span><i class="fas fa-calendar"></i> ${currentDate}</span>
                    </div>
                    <div class="answer-votes">
                        <button class="vote-up"><i class="fas fa-thumbs-up"></i> 0</button>
                        <button class="vote-down"><i class="fas fa-thumbs-down"></i> 0</button>
                    </div>
                </div>
                <div class="answer-content">
                    <p>${answerText}</p>
                </div>
            `;
            
            // Add answer to the list (before the answer form)
            answersSection.insertBefore(newAnswer, answerForm.parentNode);
            
            // Update answer count
            const answerCountEl = answersSection.querySelector('h3');
            const currentCount = parseInt(answerCountEl.textContent.match(/\d+/)[0]);
            answerCountEl.textContent = `답변 (${currentCount + 1})`;
            
            // Also update the post info
            const postInfo = document.querySelector('.post-header .post-info');
            if (postInfo) {
                const answerCountSpan = postInfo.querySelector('span:nth-child(3)');
                if (answerCountSpan) {
                    answerCountSpan.innerHTML = `<i class="fas fa-comments"></i> 답변 ${currentCount + 1}개`;
                }
            }
            
            // Clear the form
            textarea.value = '';
            
            // Setup vote buttons
            const voteButtons = newAnswer.querySelectorAll('.vote-up, .vote-down');
            voteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const countEl = this.querySelector('i').nextSibling;
                    let count = parseInt(countEl.textContent.trim());
                    countEl.textContent = ' ' + (count + 1);
                });
            });
        });
    }
    
    // Setup vote buttons for existing answers
    const voteButtons = document.querySelectorAll('.vote-up, .vote-down');
    voteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const countEl = this.querySelector('i').nextSibling;
            let count = parseInt(countEl.textContent.trim());
            countEl.textContent = ' ' + (count + 1);
        });
    });
}); 
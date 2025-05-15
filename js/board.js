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
            const postId = this.getAttribute('data-post-id');
            
            if (modal) {
                if (postId && window.postData && window.postData[postId]) {
                    // Handle new posts with stored data
                    const postData = window.postData[postId];
                    
                    // Set content in the modal
                    const modalHeader = modal.querySelector('.post-header');
                    if (modalHeader) {
                        modalHeader.querySelector('h2').textContent = postData.title;
                        const postInfo = modalHeader.querySelector('.post-info');
                        if (postInfo) {
                            const infoSpans = postInfo.querySelectorAll('span');
                            if (infoSpans.length >= 3) {
                                infoSpans[0].innerHTML = `<i class="fas fa-user"></i> ${postData.author}`;
                                infoSpans[1].innerHTML = `<i class="fas fa-calendar"></i> ${postData.date}`;
                                infoSpans[2].innerHTML = `<i class="fas fa-eye"></i> ${postData.views}`;
                            }
                        }
                    }
                    
                    // Set the post content
                    const postContent = modal.querySelector('.post-content');
                    if (postContent) {
                        // Create a simple content display with paragraphs
                        const contentHtml = postData.content.split('\n')
                            .filter(para => para.trim() !== '')
                            .map(para => `<p>${para}</p>`)
                            .join('');
                        
                        // Keep any heading elements that might be in the modal template
                        const headings = postContent.querySelectorAll('h3, h4');
                        const headingsHtml = Array.from(headings).map(h => h.outerHTML).join('');
                        
                        // Update content, preserving any structured elements like file sections
                        const fileSection = postContent.querySelector('.post-files');
                        if (fileSection) {
                            postContent.innerHTML = headingsHtml + contentHtml;
                            postContent.appendChild(fileSection);
                        } else {
                            postContent.innerHTML = headingsHtml + contentHtml;
                        }
                    }
                } 
                // If this is an existing demo post without data-post-id, we'll just show the default content
                
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
    
    // Set default items per page
    const itemsPerPage = 5;
    let currentPage = 1;
    let allRows = [];
    
    // Function to update pagination
    function updatePagination() {
        console.log("Updating pagination...");
        
        // Get fresh references to all rows
        allRows = Array.from(document.querySelectorAll('.board-list tbody tr'));
        
        // Calculate total pages
        const totalItems = allRows.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Set current page to 1 if we're adding a new item
        currentPage = 1;
        
        // Display rows for current page
        displayRows(currentPage);
        
        console.log(`Pagination updated: ${totalItems} items, ${totalPages} pages, current page is ${currentPage}`);
    }
    
    if (paginationLinks.length > 0 && tableRows.length > 0) {
        // Store all rows data
        allRows = Array.from(tableRows);
        
        // Add click event to pagination links using event delegation
        const paginationContainer = document.querySelector('.board-pagination');
        if (paginationContainer) {
            paginationContainer.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Make sure we clicked on a page link
                if (e.target.tagName === 'A') {
                    const link = e.target;
                    
                    if (link.classList.contains('next')) {
                        // Next button clicked
                        const totalPages = Math.ceil(allRows.length / itemsPerPage);
                        if (currentPage < totalPages) {
                            currentPage++;
                            displayRows(currentPage);
                        }
                    } else {
                        // Page number clicked - get the actual page number from the link text
                        const pageNum = parseInt(link.textContent);
                        if (!isNaN(pageNum)) {
                            currentPage = pageNum;
                            displayRows(currentPage);
                        }
                    }
                }
            });
        }
        
        // Initialize with first page
        displayRows(currentPage);
    }
    
    // Function to display rows for the current page
    function displayRows(page) {
        console.log("Displaying page", page);
        
        // Get fresh references to all rows
        if (allRows.length === 0) {
            allRows = Array.from(document.querySelectorAll('.board-list tbody tr'));
        }
        
        // Validate page number
        if (page < 1) page = 1;
        const totalPages = Math.ceil(allRows.length / itemsPerPage);
        if (page > totalPages) page = totalPages;
        
        // Hide all rows
        allRows.forEach(row => {
            row.style.display = 'none';
        });
        
        // Calculate start and end index for the current page
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, allRows.length);
        
        // Show rows for the current page
        for (let i = startIndex; i < endIndex; i++) {
            if (allRows[i]) {
                allRows[i].style.display = '';
            }
        }
        
        // Update pagination active state
        paginationLinks.forEach(link => {
            // Remove active class from all links
            link.classList.remove('active');
            
            // Add active class to current page link
            if (!link.classList.contains('next')) {
                const linkPage = parseInt(link.textContent);
                if (linkPage === page) {
                    link.classList.add('active');
                }
            }
        });
        
        console.log('Displayed page', page, 'of', totalPages, 'with items', startIndex, 'to', endIndex-1);
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            // Get fresh list of rows
            const allRows = Array.from(document.querySelectorAll('.board-list tbody tr'));
            
            allRows.forEach(row => {
                const title = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                const author = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    row.style.display = '';
                    row.dataset.filtered = 'visible';
                } else {
                    row.style.display = 'none';
                    row.dataset.filtered = 'hidden';
                }
            });
            
            // Reset to first page after search
            currentPage = 1;
            
            // Only apply pagination if search term is empty
            if (searchTerm === '') {
                updatePagination();
            } else {
                // Otherwise, show all visible items without pagination
                paginationLinks.forEach(link => {
                    link.classList.remove('active');
                });
                if (paginationLinks.length > 0) {
                    paginationLinks[0].classList.add('active');
                }
            }
        }
    }
    
    // Category filter functionality
    const categoryFilter = document.querySelector('.filter-options select');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            
            // Get fresh list of rows
            const allRows = Array.from(document.querySelectorAll('.board-list tbody tr'));
            
            allRows.forEach(row => {
                if (selectedCategory === 'all') {
                    row.style.display = '';
                    row.dataset.filtered = 'visible';
                } else {
                    const categoryCell = row.querySelector('td:nth-child(2) span');
                    if (categoryCell && categoryCell.classList.contains(selectedCategory)) {
                        row.style.display = '';
                        row.dataset.filtered = 'visible';
                    } else {
                        row.style.display = 'none';
                        row.dataset.filtered = 'hidden';
                    }
                }
            });
            
            // Reset to first page after filtering
            currentPage = 1;
            
            // Only apply pagination if category is 'all'
            if (selectedCategory === 'all') {
                updatePagination();
            } else {
                // Clear pagination active states
                paginationLinks.forEach(link => {
                    link.classList.remove('active');
                });
                if (paginationLinks.length > 0) {
                    paginationLinks[0].classList.add('active');
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
        const content = formData.get('content') || formData.get('question-content') || '';
        const categoryText = getCategoryText(category);
        
        // Get the latest post number
        const latestNumber = parseInt(boardList.querySelector('tr:first-child td:first-child').textContent) + 1;
        
        // Create a new row
        const newRow = document.createElement('tr');
        const today = new Date().toISOString().split('T')[0];
        
        // Create a unique ID for the new post
        const newPostId = 'post-' + Date.now();
        newRow.id = newPostId;
        
        newRow.innerHTML = `
            <td>${latestNumber}</td>
            <td><span class="category ${category}">${categoryText}</span></td>
            <td><a href="#post-modal" class="open-modal" data-post-id="${newPostId}">${title}</a></td>
            <td>현재 사용자</td>
            <td>${today}</td>
            <td>0</td>
        `;
        
        // Add to the board
        boardList.insertBefore(newRow, boardList.firstChild);
        
        // Store the post data to be used when opening the modal
        if (!window.postData) {
            window.postData = {};
        }
        
        window.postData[newPostId] = {
            title: title,
            category: categoryText,
            author: '현재 사용자',
            date: today,
            content: content,
            views: 0
        };
        
        // Reinitialize event listeners for the new item
        const newModalTrigger = newRow.querySelector('.open-modal');
        if (newModalTrigger) {
            // Use the existing event listener through event delegation
            // No need to add a new click handler as it's handled by the main modal trigger code
        }
        
        // Update pagination to show the first page with the new post
        updatePagination();
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
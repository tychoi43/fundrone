document.addEventListener('DOMContentLoaded', function() {
    // Initialize post data storage if not exists
    if (!window.postData) {
        window.postData = {};
    }
    
    // Keep track of the currently opened post
    let currentPostId = null;
    
    // Pre-load existing posts data
    initializeExistingPostsData();
    
    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('.open-modal');
    const modalClosers = document.querySelectorAll('.close-modal');
    
    // Open modal - for posts
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('href');
            const modal = document.querySelector(modalId);
            const postId = this.getAttribute('data-post-id');
            
            if (modal) {
                // Store the current post ID when opening a post
                currentPostId = postId;
                
                // Check if it's a post with stored data
                if (postId && window.postData && window.postData[postId]) {
                    const postData = window.postData[postId];
                    console.log("Opening post with stored data:", postId);
                    
                    // Update modal content with the post data
                    updateModalContent(modal, postData);
                } else {
                    console.log("Warning: No data found for post ID:", postId);
                }
                
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            }
        });
    });
    
    // Function to initialize existing posts data from static HTML
    function initializeExistingPostsData() {
        // Get all post links that don't have data-post-id attribute
        const existingPostLinks = document.querySelectorAll('.open-modal:not([data-post-id])');
        
        existingPostLinks.forEach((link, index) => {
            // Get post data from row
            const row = link.closest('tr');
            if (!row) return;
            
            // Generate a unique ID for this existing post (using row id if available or generate one)
            const postId = row.id || `existing-post-${index}`;
            row.id = postId; // Ensure row has an ID
            
            // Add data-post-id attribute to the link
            link.setAttribute('data-post-id', postId);
            
            // Extract post data from the row
            const title = link.textContent;
            const categoryElem = row.querySelector('td:nth-child(2) span');
            const categoryClass = categoryElem ? Array.from(categoryElem.classList).find(cls => cls !== 'category') : 'other';
            const categoryText = categoryElem ? categoryElem.textContent : '기타';
            const author = row.querySelector('td:nth-child(4)').textContent;
            const date = row.querySelector('td:nth-child(5)').textContent;
            let views = '0';
            
            // Views or answers (depending on board type)
            if (row.querySelector('td:nth-child(6)')) {
                views = row.querySelector('td:nth-child(6)').textContent;
            }
            
            // Create unique content for each post
            let content = '';
            let files = [];
            
            // First, try to find a post-specific content in the modal
            const modal = document.querySelector(link.getAttribute('href'));
            
            if (modal) {
                // First, try to find post with matching title in the modal
                const modalTitle = modal.querySelector('.post-header h2').textContent;
                
                if (modalTitle === title) {
                    // Found matching title - use this content
                    const contentElement = modal.querySelector('.post-content');
                    if (contentElement) {
                        // Clone to avoid modifying the original DOM
                        const contentClone = contentElement.cloneNode(true);
                        
                        // Extract file section if exists
                        const fileSection = contentClone.querySelector('.post-files');
                        if (fileSection) {
                            // Extract files and create file objects
                            const fileItems = fileSection.querySelectorAll('li');
                            fileItems.forEach((fileItem, fileIndex) => {
                                const fileName = fileItem.textContent.trim();
                                const fileType = getFileTypeFromName(fileName);
                                
                                files.push({
                                    id: `file-${postId}-${fileIndex}`,
                                    name: fileName,
                                    type: fileType,
                                    size: 'Unknown',
                                    url: '#'
                                });
                            });
                            
                            // Remove file section from content to avoid duplicates
                            fileSection.remove();
                        }
                        
                        // Get the HTML content
                        content = contentClone.innerHTML;
                        console.log(`Found matching title for ${title}, using its content`);
                    }
                } else {
                    // Generate placeholder content based on post details
                    content = `
                        <h3>${title}</h3>
                        <p>이 게시물은 <strong>${categoryText}</strong> 카테고리에 속하는 내용입니다.</p>
                        <p>${author}님이 작성한 게시물로, ${date}에 게시되었습니다.</p>
                        <p>게시물 상세 내용은 현재 준비 중입니다. 빠른 시일 내에 업데이트하겠습니다.</p>
                    `;
                    console.log(`Generated placeholder content for ${title}`);
                    
                    // Add a sample file for each post to ensure uniqueness
                    files.push({
                        id: `file-${postId}-sample`,
                        name: `${title}-첨부파일.pdf`,
                        type: 'application/pdf',
                        size: '1.2 MB',
                        url: '#'
                    });
                }
            }
            
            // Store post data
            window.postData[postId] = {
                title: title,
                category: categoryText,
                categoryClass: categoryClass,
                author: author,
                date: date,
                content: content,
                rawContent: content,
                views: views,
                files: files
            };
            
            console.log(`Initialized data for existing post: ${postId}`);
        });
        
        // Helper function to guess file type from file name
        function getFileTypeFromName(fileName) {
            fileName = fileName.toLowerCase();
            if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
                return 'image';
            } else if (fileName.endsWith('.pdf')) {
                return 'application/pdf';
            } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
                return 'application/msword';
            } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
                return 'application/excel';
            } else if (fileName.endsWith('.mp4') || fileName.endsWith('.avi') || fileName.endsWith('.mov')) {
                return 'video';
            } else {
                return 'application/octet-stream';
            }
        }
    }
    
    // Helper function to update modal content with post data
    function updateModalContent(modal, postData) {
        // Set content in the modal header
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
            console.log("Updating modal content with:", postData.content);
            
            // Make sure we have valid content
            const content = postData.content ? postData.content.toString() : '';
            
            // Create a simple content display with paragraphs
            if (content.includes('<') && content.includes('>')) {
                // Content already has HTML formatting
                postContent.innerHTML = content;
                
                // If the post has files, add them
                if (postData.files && postData.files.length > 0) {
                    // Create a new file section or use existing one if it's from the same post
                    let fileSection = postContent.querySelector('.post-files');
                    if (!fileSection) {
                        fileSection = document.createElement('div');
                        fileSection.className = 'post-files';
                        fileSection.innerHTML = '<h4>첨부 파일:</h4>';
                        postContent.appendChild(fileSection);
                    } else {
                        // Clear existing file list if needed
                        fileSection.innerHTML = '<h4>첨부 파일:</h4>';
                    }
                    
                    // Create a file list
                    const fileList = document.createElement('ul');
                    fileSection.appendChild(fileList);
                    
                    // Add each file to the list
                    postData.files.forEach(file => {
                        const fileItem = document.createElement('li');
                        
                        // Get file icon based on type
                        let iconClass = 'fa-file';
                        if (file.type && file.type.includes('image')) {
                            iconClass = 'fa-file-image';
                        } else if (file.type && file.type.includes('pdf')) {
                            iconClass = 'fa-file-pdf';
                        } else if (file.type && (file.type.includes('word') || file.type.includes('doc'))) {
                            iconClass = 'fa-file-word';
                        } else if (file.type && (file.type.includes('excel') || file.type.includes('sheet'))) {
                            iconClass = 'fa-file-excel';
                        } else if (file.type && file.type.includes('video')) {
                            iconClass = 'fa-file-video';
                        }
                        
                        fileItem.innerHTML = `
                            <i class="fas ${iconClass}"></i>
                            <a href="${file.url || '#'}" target="_blank">${file.name}</a>
                            (${file.size || 'Unknown'})
                        `;
                        
                        fileList.appendChild(fileItem);
                    });
                }
            } else if (content.trim() !== '') {
                // Simple text content, convert to paragraphs
                const contentHtml = content.split('\n')
                    .filter(para => para.trim() !== '')
                    .map(para => `<p>${para}</p>`)
                    .join('');
                
                postContent.innerHTML = contentHtml;
                
                // If the post has files, add them
                if (postData.files && postData.files.length > 0) {
                    // Create a new file section
                    const fileSection = document.createElement('div');
                    fileSection.className = 'post-files';
                    fileSection.innerHTML = '<h4>첨부 파일:</h4>';
                    
                    // Create a file list
                    const fileList = document.createElement('ul');
                    fileSection.appendChild(fileList);
                    
                    // Add each file to the list
                    postData.files.forEach(file => {
                        const fileItem = document.createElement('li');
                        
                        // Get file icon based on type
                        let iconClass = 'fa-file';
                        if (file.type && file.type.includes('image')) {
                            iconClass = 'fa-file-image';
                        } else if (file.type && file.type.includes('pdf')) {
                            iconClass = 'fa-file-pdf';
                        } else if (file.type && (file.type.includes('word') || file.type.includes('doc'))) {
                            iconClass = 'fa-file-word';
                        } else if (file.type && (file.type.includes('excel') || file.type.includes('sheet'))) {
                            iconClass = 'fa-file-excel';
                        } else if (file.type && file.type.includes('video')) {
                            iconClass = 'fa-file-video';
                        }
                        
                        fileItem.innerHTML = `
                            <i class="fas ${iconClass}"></i>
                            <a href="${file.url || '#'}" target="_blank">${file.name}</a>
                            (${file.size || 'Unknown'})
                        `;
                        
                        fileList.appendChild(fileItem);
                    });
                    
                    postContent.appendChild(fileSection);
                }
            } else {
                // Empty content case
                postContent.innerHTML = '<p>게시물 내용이 없습니다.</p>';
                
                // If the post has files, add them
                if (postData.files && postData.files.length > 0) {
                    // Create a new file section
                    const fileSection = document.createElement('div');
                    fileSection.className = 'post-files';
                    fileSection.innerHTML = '<h4>첨부 파일:</h4>';
                    
                    // Create a file list
                    const fileList = document.createElement('ul');
                    fileSection.appendChild(fileList);
                    
                    // Add each file to the list
                    postData.files.forEach(file => {
                        const fileItem = document.createElement('li');
                        
                        // Get file icon based on type
                        let iconClass = 'fa-file';
                        if (file.type && file.type.includes('image')) {
                            iconClass = 'fa-file-image';
                        } else if (file.type && file.type.includes('pdf')) {
                            iconClass = 'fa-file-pdf';
                        } else if (file.type && (file.type.includes('word') || file.type.includes('doc'))) {
                            iconClass = 'fa-file-word';
                        } else if (file.type && (file.type.includes('excel') || file.type.includes('sheet'))) {
                            iconClass = 'fa-file-excel';
                        } else if (file.type && file.type.includes('video')) {
                            iconClass = 'fa-file-video';
                        }
                        
                        fileItem.innerHTML = `
                            <i class="fas ${iconClass}"></i>
                            <a href="${file.url || '#'}" target="_blank">${file.name}</a>
                            (${file.size || 'Unknown'})
                        `;
                        
                        fileList.appendChild(fileItem);
                    });
                    
                    postContent.appendChild(fileSection);
                }
            }
        }
    }
    
    // Close modal
    modalClosers.forEach(closer => {
        closer.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Re-enable scrolling
                // Reset current post ID when closing the modal
                if (modal.id === 'post-modal') {
                    currentPostId = null;
                }
            }
        });
    });
    
    // Close modal when clicking outside of modal content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = '';
                // Reset current post ID when closing the modal
                if (this.id === 'post-modal') {
                    currentPostId = null;
                }
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
                    // Reset current post ID when closing the post modal
                    if (modal.id === 'post-modal') {
                        currentPostId = null;
                    }
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
        allRows = Array.from(document.querySelectorAll('.board-list tbody tr'));
        
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
    const editFileInput = document.getElementById('edit-file');
    
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
    
    // Setup file upload previews for all upload forms
    setupFileUploadPreview(fileInput);
    setupFileUploadPreview(questionFileInput);
    setupFileUploadPreview(editFileInput);
    
    // Form submission handling
    const uploadForms = document.querySelectorAll('.upload-form');
    
    if (uploadForms.length > 0) {
        uploadForms.forEach(form => {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                const formData = new FormData(this);
                // 파일 input 이름 추출
                const fileInput = this.querySelector('input[type="file"]');
                let uploadedFiles = [];

                // 파일 첨부 시 서버로 업로드
                if (fileInput && fileInput.files && fileInput.files.length > 0) {
                    const uploadData = new FormData();
                    for (let i = 0; i < fileInput.files.length; i++) {
                        uploadData.append('files', fileInput.files[i]);
                    }
                    try {
                        const res = await fetch('/api/upload', {
                            method: 'POST',
                            body: uploadData
                        });
                        const result = await res.json();
                        if (result.success) {
                            uploadedFiles = result.files;
                        }
                    } catch (err) {
                        alert('파일 업로드에 실패했습니다.');
                        return;
                    }
                }

                // 기존 폼 데이터에서 파일 필드는 제거 (이미 업로드됨)
                formData.delete('file');
                formData.delete('question-file');
                formData.delete('edit-file');

                // 업로드된 파일 정보를 게시물 데이터에 추가
                formData.append('uploadedFiles', JSON.stringify(uploadedFiles));

                // 이하 기존 로직(성공 메시지, 모달 닫기 등) 유지
                let successMessage = '문서가 성공적으로 업로드되었습니다!';
                if (form.closest('#question-modal')) {
                    successMessage = '질문이 성공적으로 등록되었습니다!';
                }
                const successElement = document.createElement('div');
                successElement.className = 'success-message';
                successElement.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>${successMessage}</p>
                `;
                this.innerHTML = '';
                this.appendChild(successElement);
                setTimeout(() => {
                    const modal = this.closest('.modal');
                    if (modal) {
                        modal.style.display = 'none';
                        document.body.style.overflow = '';
                        // 게시판에 새 항목 추가 (업로드 파일 정보 포함)
                        addNewItemToBoard(formData);
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
        
        console.log('New post content:', content);
        
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
        
        // Make sure content is always treated as a string
        const processedContent = content ? content.toString() : '';
        
        // Process file attachments, if any
        const files = [];
        const fileInput = formData.get('file') || formData.get('question-file');
        
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            for (let i = 0; i < fileInput.files.length; i++) {
                const file = fileInput.files[i];
                const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB'; // Convert to MB
                
                files.push({
                    id: 'file-' + Date.now() + '-' + i,
                    name: file.name,
                    type: file.type,
                    size: fileSize,
                    url: '#', // In a real app, this would be the file's URL after upload
                });
            }
        }
        
        // 업로드된 파일 정보 파싱
        let uploadedFiles = [];
        if (formData.get('uploadedFiles')) {
            try {
                uploadedFiles = JSON.parse(formData.get('uploadedFiles'));
            } catch (e) {}
        }
        
        window.postData[newPostId] = {
            title: title,
            category: categoryText,
            categoryClass: category,
            author: '현재 사용자',
            date: today,
            content: processedContent,
            rawContent: processedContent, // Store raw content for editing
            views: 0,
            files: files  // Store files data
        };
        
        console.log('Stored post data:', window.postData[newPostId]);
        
        // Explicitly add click handler to the new modal trigger
        const newModalTrigger = newRow.querySelector('.open-modal');
        if (newModalTrigger) {
            newModalTrigger.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('href');
                const modal = document.querySelector(modalId);
                const postId = this.getAttribute('data-post-id');
                
                if (modal && postId && window.postData && window.postData[postId]) {
                    const postData = window.postData[postId];
                    console.log("Opening new post with data:", postData);
                    
                    // Set current post ID
                    currentPostId = postId;
                    
                    // Use the helper function to update modal content
                    updateModalContent(modal, postData);
                    
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                } else if (modal) {
                    // Fallback for any issues
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        }
        
        // Add event handlers for edit and delete buttons
        setupNewPostActionButtons();
        
        // Update pagination to show the first page with the new post
        updatePagination();
    }
    
    // Function to setup action buttons for newly created posts
    function setupNewPostActionButtons() {
        const editButtons = document.querySelectorAll('.edit-post-btn');
        const deleteButtons = document.querySelectorAll('.delete-post-btn');
        
        // Setup edit button handler for the most recently added button
        if (editButtons.length > 0) {
            const lastEditButton = editButtons[editButtons.length - 1];
            if (!lastEditButton.hasEventListener) {
                lastEditButton.addEventListener('click', handleEditButtonClick);
                lastEditButton.hasEventListener = true;
            }
        }
        
        // Setup delete button handler for the most recently added button
        if (deleteButtons.length > 0) {
            const lastDeleteButton = deleteButtons[deleteButtons.length - 1];
            if (!lastDeleteButton.hasEventListener) {
                lastDeleteButton.addEventListener('click', handleDeleteButtonClick);
                lastDeleteButton.hasEventListener = true;
            }
        }
    }
    
    // Setup edit button handlers
    const editPostButtons = document.querySelectorAll('.edit-post-btn');
    editPostButtons.forEach(button => {
        if (!button.hasEventListener) {
            button.addEventListener('click', handleEditButtonClick);
            button.hasEventListener = true;
        }
    });
    
    // Setup delete button handlers
    const deletePostButtons = document.querySelectorAll('.delete-post-btn');
    deletePostButtons.forEach(button => {
        if (!button.hasEventListener) {
            button.addEventListener('click', handleDeleteButtonClick);
            button.hasEventListener = true;
        }
    });
    
    // Handler function for edit button click
    function handleEditButtonClick() {
        // Check if user is logged in (simulated)
        const isLoggedIn = true; // In a real app, check user authentication status
        
        if (!isLoggedIn) {
            alert('게시물 수정하려면 로그인이 필요합니다.');
            return;
        }
        
        // Check if a post is currently open
        if (!currentPostId) {
            console.error('No post is currently open');
            return;
        }
        
        // Get the post data
        const postData = window.postData[currentPostId];
        if (!postData) {
            console.error('No data found for post ID:', currentPostId);
            return;
        }
        
        // Check if the current user is the author (simulated)
        const isAuthor = true; // In a real app, check if the current user is the author
        if (!isAuthor) {
            alert('자신이 작성한 게시물만 수정할 수 있습니다.');
            return;
        }
        
        // Open the edit modal
        const editModal = document.getElementById('edit-modal');
        if (!editModal) {
            console.error('Edit modal not found');
            return;
        }
        
        // Fill the form with post data
        document.getElementById('edit-post-id').value = currentPostId;
        document.getElementById('edit-title').value = postData.title || '';
        
        // Set the category dropdown
        const categorySelect = document.getElementById('edit-category');
        if (categorySelect) {
            const categoryValue = postData.categoryClass || '';
            for (let i = 0; i < categorySelect.options.length; i++) {
                if (categorySelect.options[i].value === categoryValue) {
                    categorySelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Set the content - prefer rawContent if available
        document.getElementById('edit-content').value = postData.rawContent || postData.content || '';
        
        // Show existing files if any
        const filesListContainer = editModal.querySelector('.edit-files-list');
        if (filesListContainer) {
            filesListContainer.innerHTML = '';
            
            if (postData.files && postData.files.length > 0) {
                postData.files.forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.innerHTML = `
                        <span><i class="fas fa-file"></i> ${file.name}</span>
                        <button type="button" class="remove-file-btn" data-file-id="${file.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    filesListContainer.appendChild(fileItem);
                });
                
                // Add event listeners for file removal buttons
                const removeFileButtons = filesListContainer.querySelectorAll('.remove-file-btn');
                removeFileButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const fileId = this.getAttribute('data-file-id');
                        if (fileId && postData.files) {
                            // Remove the file from the data
                            postData.files = postData.files.filter(file => file.id !== fileId);
                            
                            // Remove the file item from the UI
                            this.closest('.file-item').remove();
                            
                            // If no files left, show a message
                            if (postData.files.length === 0 && filesListContainer.children.length === 0) {
                                filesListContainer.innerHTML = '<p>첨부된 파일이 없습니다.</p>';
                            }
                        }
                    });
                });
            } else {
                filesListContainer.innerHTML = '<p>첨부된 파일이 없습니다.</p>';
            }
        }
        
        // Display the edit modal
        editModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Close the post modal
        const postModal = document.getElementById('post-modal');
        if (postModal) {
            postModal.style.display = 'none';
        }
    }
    
    // Handler function for delete button click
    function handleDeleteButtonClick() {
        // Check if user is logged in (simulated)
        const isLoggedIn = true; // In a real app, check user authentication status
        
        if (!isLoggedIn) {
            alert('게시물을 삭제하려면 로그인이 필요합니다.');
            return;
        }
        
        if (!currentPostId) {
            console.error('No post is currently open');
            return;
        }
        
        // Check if the current user is the author (simulated)
        const isAuthor = true; // In a real app, check if the current user is the author
        if (!isAuthor) {
            alert('자신이 작성한 게시물만 삭제할 수 있습니다.');
            return;
        }
        
        // Set the post ID in the delete confirmation modal
        const deletePostIdInput = document.getElementById('delete-post-id');
        if (deletePostIdInput) {
            deletePostIdInput.value = currentPostId;
        }
        
        // Open the delete confirmation modal
        const deleteModal = document.getElementById('delete-confirm-modal');
        if (deleteModal) {
            deleteModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        
        // Hide the post modal
        const postModal = document.getElementById('post-modal');
        if (postModal) {
            postModal.style.display = 'none';
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

    // Handle edit form submission
    const editForm = document.querySelector('.edit-form');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const postId = document.getElementById('edit-post-id').value;
            if (!postId || !window.postData[postId]) {
                console.error('Invalid post ID or post data not found');
                return;
            }
            
            // Get form data
            const title = document.getElementById('edit-title').value;
            const categoryValue = document.getElementById('edit-category').value;
            const content = document.getElementById('edit-content').value;
            
            // Get the category text
            const categoryText = getCategoryText(categoryValue);
            
            // Check for file uploads
            const editFileInput = document.getElementById('edit-file');
            let files = window.postData[postId].files || [];
            
            // Add new files if uploaded
            if (editFileInput && editFileInput.files && editFileInput.files.length > 0) {
                for (let i = 0; i < editFileInput.files.length; i++) {
                    const file = editFileInput.files[i];
                    const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB'; // Convert to MB
                    
                    files.push({
                        id: 'file-' + Date.now() + '-' + i,
                        name: file.name,
                        type: file.type,
                        size: fileSize,
                        url: '#', // In a real app, this would be the file's URL after upload
                    });
                }
            }
            
            // Update the post data
            window.postData[postId].title = title;
            window.postData[postId].category = categoryText;
            window.postData[postId].categoryClass = categoryValue;
            window.postData[postId].content = content;
            window.postData[postId].rawContent = content; // Store raw content for editing
            window.postData[postId].files = files; // Update file attachments
            
            // Update the row in the table
            const postRow = document.getElementById(postId);
            if (postRow) {
                const titleCell = postRow.querySelector('td:nth-child(3) a');
                if (titleCell) titleCell.textContent = title;
                
                const categoryCell = postRow.querySelector('td:nth-child(2) span');
                if (categoryCell) {
                    // Remove old category classes and add the new one
                    categoryCell.className = 'category ' + categoryValue;
                    categoryCell.textContent = categoryText;
                }
            }
            
            // Show success message
            alert('게시물이 성공적으로 수정되었습니다.');
            
            // Close the edit modal
            const editModal = document.getElementById('edit-modal');
            if (editModal) {
                editModal.style.display = 'none';
                document.body.style.overflow = '';
            }
            
            // Reopen the post modal with updated content
            const postModal = document.getElementById('post-modal');
            if (postModal) {
                updateModalContent(postModal, window.postData[postId]);
                postModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Handle delete confirmation
    const deleteConfirmBtn = document.querySelector('.delete-confirm-btn');
    if (deleteConfirmBtn) {
        deleteConfirmBtn.addEventListener('click', function() {
            const postId = document.getElementById('delete-post-id').value;
            if (!postId) {
                console.error('No post ID specified for deletion');
                return;
            }
            
            // Remove the post from storage
            if (window.postData && window.postData[postId]) {
                delete window.postData[postId];
            }
            
            // Remove the row from the table
            const postRow = document.getElementById(postId);
            if (postRow) {
                postRow.remove();
                
                // Update pagination after removing a post
                updatePagination();
            }
            
            // Show success message
            alert('게시물이 성공적으로 삭제되었습니다.');
            
            // Close the delete confirmation modal
            const deleteModal = document.getElementById('delete-confirm-modal');
            if (deleteModal) {
                deleteModal.style.display = 'none';
                document.body.style.overflow = '';
            }
            
            // Reset current post ID
            currentPostId = null;
        });
    }

    // 예시: 게시물 상세 모달에 첨부파일 표시
    function renderPostModal(postId) {
        const post = window.postData[postId];
        let filesHtml = '';
        if (post.uploadedFiles && post.uploadedFiles.length > 0) {
            filesHtml = '<div class="post-files"><h4>첨부 파일</h4><ul>' +
                post.uploadedFiles.map(f => `<li><a href="${f.url}" download target="_blank"><i class="fas fa-file"></i> ${f.originalname}</a></li>`).join('') +
                '</ul></div>';
        }
        // ... post-content 아래에 filesHtml 삽입 ...
        // ... existing code ...
    }
}); 
document.addEventListener('DOMContentLoaded', function() {
    // Gallery filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Reset pagination after filtering
                if (paginationLinks.length > 0) {
                    currentPage = 1;
                    displayGalleryItems(currentPage);
                }
            });
        });
    }
    
    // Gallery pagination functionality
    const paginationLinks = document.querySelectorAll('.gallery-pagination a');
    
    if (paginationLinks.length > 0 && galleryItems.length > 0) {
        // Set default items per page
        const itemsPerPage = 3;
        
        // Calculate total pages
        const totalItems = galleryItems.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Store all gallery items data
        const allItems = Array.from(galleryItems);
        let currentPage = 1;
        
        // Function to display items for the current page
        function displayGalleryItems(page) {
            // Validate page number
            if (page < 1) page = 1;
            if (page > totalPages) page = totalPages;
            
            // Get visible items (those matching current filter)
            const visibleItems = allItems.filter(item => {
                const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                return activeFilter === 'all' || item.classList.contains(activeFilter);
            });
            
            // Hide all items
            allItems.forEach(item => {
                item.style.display = 'none';
            });
            
            // Calculate start and end index for the current page
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, visibleItems.length);
            
            // Show items for the current page
            for (let i = startIndex; i < endIndex; i++) {
                if (visibleItems[i]) {
                    visibleItems[i].style.display = '';
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
            
            console.log('Displaying gallery page', page, 'of', totalPages, 'with', visibleItems.length, 'visible items');
        }
        
        // Add click event to pagination links
        paginationLinks.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (this.classList.contains('next')) {
                    // Next button clicked
                    if (currentPage < totalPages) {
                        currentPage++;
                        displayGalleryItems(currentPage);
                    }
                } else {
                    // Page number clicked - get the actual page number from the link text
                    const pageNum = parseInt(this.textContent);
                    if (!isNaN(pageNum)) {
                        currentPage = pageNum;
                        displayGalleryItems(currentPage);
                    }
                }
            });
        });
        
        // Initialize with first page
        displayGalleryItems(currentPage);
    }
    
    // Search functionality
    const searchInput = document.querySelector('.gallery-filter .search-bar input');
    const searchButton = document.querySelector('.gallery-filter .search-bar button');
    
    if (searchInput && searchButton && galleryItems.length > 0) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // If search term is empty, reset view
                galleryItems.forEach(item => {
                    item.style.display = '';
                });
                // Reset pagination after search
                if (paginationLinks.length > 0) {
                    currentPage = 1;
                    displayGalleryItems(currentPage);
                }
                return;
            }
            
            galleryItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();
                const author = item.querySelector('.gallery-meta span:first-child').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm) || author.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Reset pagination after search
            if (paginationLinks.length > 0) {
                currentPage = 1;
                // We don't call displayGalleryItems here because our search already sets visibility
            }
        }
    }
    
    // Video modal functionality
    const videoLinks = document.querySelectorAll('a[data-video]');
    const videoModal = document.getElementById('video-modal');
    const videoIframe = videoModal ? videoModal.querySelector('iframe') : null;
    
    if (videoLinks.length > 0 && videoModal && videoIframe) {
        videoLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const videoUrl = this.getAttribute('data-video');
                const videoTitle = this.closest('.gallery-item').querySelector('h3').textContent;
                const videoAuthor = this.closest('.gallery-item').querySelector('.gallery-meta span:first-child').textContent;
                const videoDate = this.closest('.gallery-item').querySelector('.gallery-meta span:nth-child(2)').textContent;
                const videoViews = this.closest('.gallery-item').querySelector('.gallery-meta span:nth-child(3)').textContent;
                const videoDescription = this.closest('.gallery-item').querySelector('p').textContent;
                
                // Set iframe source
                videoIframe.src = videoUrl;
                
                // Update modal content
                videoModal.querySelector('.video-header h2').textContent = videoTitle;
                videoModal.querySelector('.video-meta span:first-child').textContent = videoAuthor;
                videoModal.querySelector('.video-meta span:nth-child(2)').textContent = videoDate;
                videoModal.querySelector('.video-meta span:nth-child(3)').textContent = videoViews;
                videoModal.querySelector('.video-description p').textContent = videoDescription;
            });
        });
        
        // Close video modal and stop video playback
        const closeVideoModal = function() {
            videoIframe.src = '';
        };
        
        const videoModalClosers = videoModal.querySelectorAll('.close-modal');
        videoModalClosers.forEach(closer => {
            closer.addEventListener('click', closeVideoModal);
        });
        
        videoModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeVideoModal();
            }
        });
    }
    
    // Upload method selection for videos
    const uploadMethod = document.getElementById('upload-method');
    const videoFileGroup = document.querySelector('.video-file-group');
    const videoUrlGroup = document.querySelector('.video-url-group');
    
    if(uploadMethod) {
        uploadMethod.addEventListener('change', function() {
            if(this.value === 'file') {
                videoFileGroup.style.display = 'block';
                videoUrlGroup.style.display = 'none';
            } else if(this.value === 'url') {
                videoFileGroup.style.display = 'none';
                videoUrlGroup.style.display = 'block';
            } else {
                videoFileGroup.style.display = 'none';
                videoUrlGroup.style.display = 'none';
            }
        });
    }
    
    // Image preview functionality
    const photoFileInput = document.getElementById('photo-file');
    const thumbnailInput = document.getElementById('thumbnail');
    const videoFileInput = document.getElementById('video-file');
    
    function createImagePreview(input, previewContainerId) {
        if (!input) return;
        
        input.addEventListener('change', function() {
            // Check if file was selected
            if (!this.files || !this.files[0]) return;
            
            const file = this.files[0];
            
            // Check if file is an image
            if (!file.type.match('image.*')) {
                alert('이미지 파일만 선택할 수 있습니다.');
                this.value = ''; // Clear the input
                return;
            }
            
            // Create or find preview container
            let previewContainer = document.getElementById(previewContainerId);
            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.id = previewContainerId;
                previewContainer.className = 'image-preview';
                this.parentNode.appendChild(previewContainer);
            } else {
                previewContainer.innerHTML = ''; // Clear existing content
            }
            
            // Create image element
            const img = document.createElement('img');
            
            // Create file reader to load the image
            const reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
                previewContainer.appendChild(img);
            };
            
            // Read the file
            reader.readAsDataURL(file);
        });
    }
    
    if (photoFileInput) {
        createImagePreview(photoFileInput, 'photo-preview');
    }
    
    if (thumbnailInput) {
        createImagePreview(thumbnailInput, 'thumbnail-preview');
    }
    
    // Create video preview
    if (videoFileInput) {
        videoFileInput.addEventListener('change', function() {
            // Check if file was selected
            if (!this.files || !this.files[0]) return;
            
            const file = this.files[0];
            
            // Check if file is a video
            if (!file.type.match('video.*')) {
                alert('동영상 파일만 선택할 수 있습니다.');
                this.value = ''; // Clear the input
                return;
            }
            
            // Create or find preview container
            let previewContainer = document.getElementById('video-preview');
            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.id = 'video-preview';
                previewContainer.className = 'video-preview';
                this.parentNode.appendChild(previewContainer);
            } else {
                previewContainer.innerHTML = ''; // Clear existing content
            }
            
            // Create video element
            const video = document.createElement('video');
            video.controls = true;
            video.style.maxWidth = '100%';
            video.style.maxHeight = '200px';
            
            // Create file reader to load the video
            const reader = new FileReader();
            reader.onload = function(e) {
                video.src = e.target.result;
                previewContainer.appendChild(video);
            };
            
            // Read the file
            reader.readAsDataURL(file);
        });
    }
    
    // Form submission handling for both photos and videos
    const uploadForm = document.querySelector('#upload-modal .upload-form');
    
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
                <p>작품이 성공적으로 업로드되었습니다!</p>
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
                    
                    // Add new item to gallery
                    addNewItemToGallery(formData);
                    
                    // Reset the form for next use
                    setTimeout(() => {
                        this.reset();
                        const previews = this.querySelectorAll('.image-preview, .video-preview');
                        previews.forEach(preview => preview.remove());
                    }, 500);
                }
            }, 2000);
        });
    }
    
    // Function to add new item to gallery
    function addNewItemToGallery(formData) {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        // Get form data
        const title = formData.get('title') || '새 항목';
        const category = formData.get('content-category') || 'other';
        const description = formData.get('description') || '';
        
        // Determine if it's a photo or video
        let itemType = 'photo';
        const pageUrl = window.location.pathname;
        if (pageUrl.includes('videos.html')) {
            itemType = 'video';
        }
        
        // Create a new gallery item
        const newItem = document.createElement('div');
        newItem.className = `gallery-item ${itemType} ${category}`;
        
        const today = new Date().toISOString().split('T')[0];
        
        // Use a placeholder image
        const thumbnailSrc = '../../images/gallery/placeholder.jpg';
        
        if (itemType === 'photo') {
            newItem.innerHTML = `
                <div class="gallery-item-thumbnail">
                    <img src="${thumbnailSrc}" alt="${title}">
                </div>
                <div class="gallery-item-info">
                    <h3>${title}</h3>
                    <div class="gallery-meta">
                        <span><i class="fas fa-user"></i> 현재 사용자</span>
                        <span><i class="fas fa-calendar"></i> ${today}</span>
                        <span><i class="fas fa-eye"></i> 0</span>
                    </div>
                    <p>${description}</p>
                    <a href="#photo-modal" class="btn open-modal">사진 보기</a>
                </div>
            `;
        } else {
            newItem.innerHTML = `
                <div class="gallery-item-thumbnail">
                    <img src="${thumbnailSrc}" alt="${title}">
                    <div class="play-icon">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="gallery-item-info">
                    <h3>${title}</h3>
                    <div class="gallery-meta">
                        <span><i class="fas fa-user"></i> 현재 사용자</span>
                        <span><i class="fas fa-calendar"></i> ${today}</span>
                        <span><i class="fas fa-eye"></i> 0</span>
                    </div>
                    <p>${description}</p>
                    <a href="#video-modal" class="btn open-modal" data-video="https://www.youtube.com/embed/dQw4w9WgXcQ">영상 보기</a>
                </div>
            `;
        }
        
        // Add the new item to the gallery
        galleryGrid.insertBefore(newItem, galleryGrid.firstChild);
        
        // Reinitialize event listeners for the new item
        const newModalTrigger = newItem.querySelector('.open-modal');
        if (newModalTrigger) {
            newModalTrigger.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('href');
                const modal = document.querySelector(modalId);
                if (modal) {
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    
                    // If it's a video, update iframe
                    if (modalId === '#video-modal') {
                        const videoUrl = this.getAttribute('data-video');
                        const videoIframe = modal.querySelector('iframe');
                        if (videoIframe) {
                            videoIframe.src = videoUrl;
                        }
                    }
                }
            });
        }
        
        // Update pagination since we have a new item
        if (paginationLinks.length > 0) {
            currentPage = 1;
            displayGalleryItems(currentPage);
        }
    }
    
    // Comment form handling
    const commentForms = document.querySelectorAll('.comment-form');
    
    if (commentForms.length > 0) {
        commentForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const textarea = this.querySelector('textarea');
                const commentText = textarea.value.trim();
                
                if (commentText === '') return; // Don't submit empty comments
                
                // Create a new comment (in a real app, this would be sent to the server)
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                
                const currentDate = new Date().toISOString().split('T')[0];
                
                newComment.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-author">현재 사용자</span>
                        <span class="comment-date">${currentDate}</span>
                    </div>
                    <div class="comment-content">
                        <p>${commentText}</p>
                    </div>
                `;
                
                // Add comment to the list
                const commentsSection = this.closest('.photo-comments, .video-comments');
                commentsSection.insertBefore(newComment, this);
                
                // Update comment count
                const commentCountEl = commentsSection.querySelector('h4');
                const currentCount = parseInt(commentCountEl.textContent.match(/\d+/)[0]);
                commentCountEl.textContent = commentCountEl.textContent.replace(`(${currentCount})`, `(${currentCount + 1})`);
                
                // Clear the form
                textarea.value = '';
            });
        });
    }
});
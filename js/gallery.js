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
            });
        });
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
    
    // Upload form dynamic content type behavior
    const contentTypeSelect = document.getElementById('content-type');
    const videoUrlGroup = document.querySelector('.video-url-group');
    const photoUploadGroup = document.querySelector('.photo-upload-group');
    
    if (contentTypeSelect && videoUrlGroup && photoUploadGroup) {
        contentTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            
            if (selectedType === 'video') {
                videoUrlGroup.style.display = 'block';
                photoUploadGroup.style.display = 'none';
            } else if (selectedType === 'photo') {
                videoUrlGroup.style.display = 'none';
                photoUploadGroup.style.display = 'block';
            } else {
                videoUrlGroup.style.display = 'none';
                photoUploadGroup.style.display = 'none';
            }
        });
    }
    
    // Image preview functionality
    const photoFileInput = document.getElementById('photo-file');
    const thumbnailInput = document.getElementById('thumbnail');
    
    function createImagePreview(input, previewContainerId) {
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
    
    // Form submission handling
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
                    
                    // Reset the form for next use
                    setTimeout(() => {
                        location.reload(); // In a real app, would reset form without reload
                    }, 500);
                }
            }, 2000);
        });
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
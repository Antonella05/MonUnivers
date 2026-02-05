/**
 * Blog Share Functionality
 * Handles social media sharing and link copying for blog posts
 */

class BlogShare {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupShareButtons());
        } else {
            this.setupShareButtons();
        }
    }

    setupShareButtons() {
        const shareButtons = document.querySelectorAll('.share-btn');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const platform = button.dataset.platform;
                
                if (button.classList.contains('copy-link')) {
                    this.copyLink(button);
                } else {
                    this.shareToSocial(platform, button);
                }
            });
        });
    }

    getCurrentPageData() {
        // Get the current page URL and title
        const url = window.location.href;
        const title = document.title || 'Article de blog - Antonella TAMADAHO';
        
        // Try to get a more specific description from meta tags or article content
        const description = this.getArticleDescription();
        
        return { url, title, description };
    }

    getArticleDescription() {
        // Try to get meta description first
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && metaDesc.content) {
            return metaDesc.content;
        }
        
        // Fallback to first paragraph of article content
        const firstParagraph = document.querySelector('.blog-details__text');
        if (firstParagraph) {
            return firstParagraph.textContent.trim().substring(0, 200) + '...';
        }
        
        // Default fallback
        return 'Découvrez cet article intéressant sur le développement web et la technologie.';
    }

    shareToSocial(platform, button) {
        const { url, title, description } = this.getCurrentPageData();
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                break;
            
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;
                break;
            
            default:
                console.warn(`Platform ${platform} not supported`);
                return;
        }

        // Open share dialog in a popup
        this.openSharePopup(shareUrl, platform);
        
        // Add animation feedback
        this.addClickFeedback(button);
    }

    openSharePopup(url, platform) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        const popup = window.open(
            url,
            `share-${platform}`,
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
        );
        
        // Focus on the popup if it opens successfully
        if (popup) {
            popup.focus();
        }
    }

    copyLink(button) {
        const { url } = this.getCurrentPageData();
        
        // Use modern Clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                this.showCopySuccess(button);
            }).catch(() => {
                // Fallback to older method
                this.fallbackCopyToClipboard(url, button);
            });
        } else {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(url, button);
        }
    }

    fallbackCopyToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess(button);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            this.showCopyError(button);
        }
        
        document.body.removeChild(textArea);
    }

    showCopySuccess(button) {
        // Add success class
        button.classList.add('copied');
        
        // Change icon temporarily
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        
        // Show tooltip
        this.showTooltip(button, 'Lien copié!');
        
        // Reset after 2 seconds
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalIcon;
        }, 2000);
    }

    showCopyError(button) {
        this.showTooltip(button, 'Erreur lors de la copie', 'error');
    }

    showTooltip(button, message, type = 'success') {
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = `share-tooltip share-tooltip--${type}`;
        tooltip.textContent = message;
        
        // Style the tooltip
        Object.assign(tooltip.style, {
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: '1000',
            marginBottom: '8px',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        
        // Position the button relatively if not already
        if (button.style.position !== 'relative') {
            button.style.position = 'relative';
        }
        
        // Add tooltip to button
        button.appendChild(tooltip);
        
        // Show tooltip with animation
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
        
        // Remove tooltip after 2 seconds
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (button.contains(tooltip)) {
                    button.removeChild(tooltip);
                }
            }, 300);
        }, 2000);
    }

    addClickFeedback(button) {
        // Add a subtle animation when clicking share buttons
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
}

// Initialize the blog share functionality
const blogShare = new BlogShare();

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogShare;
}

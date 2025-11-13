class AFKBypasser {
    constructor() {
        this.apiEndpoint = 'https://afklol-api.vercel.app/bypass?url=';
        this.initializeEventListeners();
        this.checkForAutoBypass();
    }

    initializeEventListeners() {
        const bypassBtn = document.getElementById('bypassBtn');
        const urlInput = document.getElementById('urlInput');

        bypassBtn.addEventListener('click', () => this.handleBypass());
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleBypass();
            }
        });
    }

    checkForAutoBypass() {
        const urlParams = new URLSearchParams(window.location.search);
        const autoUrl = urlParams.get('url');
        
        if (autoUrl) {
            const urlInput = document.getElementById('urlInput');
            urlInput.value = autoUrl;
            
            setTimeout(() => {
                this.handleBypass();
            }, 500);
        }
    }

    async handleBypass() {
        const urlInput = document.getElementById('urlInput');
        const bypassBtn = document.getElementById('bypassBtn');
        const btnText = bypassBtn.querySelector('.btn-text');
        const spinner = bypassBtn.querySelector('.loading-spinner');
        const url = urlInput.value.trim();

        if (!url) {
            this.showError('Please enter a URL');
            return;
        }

        if (!this.isValidUrl(url)) {
            this.showError('Please enter a valid URL');
            return;
        }

        btnText.textContent = 'Processing...';
        spinner.style.display = 'block';
        bypassBtn.disabled = true;

        try {
            const response = await this.callBypassAPI(url);
            this.displayResult(response);
        } catch (error) {
            this.showError(error.message);
        } finally {
            btnText.textContent = 'Bypass';
            spinner.style.display = 'none';
            bypassBtn.disabled = false;
        }
    }

    async callBypassAPI(url) {
        const apiUrl = `${this.apiEndpoint}${encodeURIComponent(url)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    }

    displayResult(data) {
        const resultSection = document.getElementById('resultSection');
        const resultContent = document.getElementById('resultContent');
        const actionButtons = document.getElementById('actionButtons');

        resultSection.style.display = 'block';

        if (data.status === 'success' && data.result) {
            const result = data.result;
            
            if (this.isValidUrl(result)) {
                resultContent.innerHTML = `
                    <strong>Direct URL:</strong><br>
                    <a href="${result}" target="_blank" class="result-url">${result}</a>
                `;
                
                actionButtons.innerHTML = `
                    <button class="action-btn redirect-btn" onclick="window.location.href='${result}'">
                        🔗 Redirect Now
                    </button>
                    <button class="action-btn copy-btn" onclick="copyToClipboard('${result}')">
                        📋 Copy URL
                    </button>
                `;
                actionButtons.style.display = 'flex';
                
                setTimeout(() => {
                    window.location.href = result;
                }, 3000);
                
            } else {
                resultContent.textContent = result;
                
                actionButtons.innerHTML = `
                    <button class="action-btn copy-btn" onclick="copyToClipboard('${result.replace(/'/g, "\\'")}')">
                        📋 Copy Text
                    </button>
                `;
                actionButtons.style.display = 'flex';
            }
            
            if (data.time) {
                const timeInfo = document.createElement('div');
                timeInfo.style.marginTop = '1rem';
                timeInfo.style.color = '#a0aec0';
                timeInfo.style.fontSize = '0.8rem';
                timeInfo.textContent = `Processed in ${data.time} seconds`;
                resultContent.appendChild(timeInfo);
            }
            
        } else if (data.status === 'error') {
            this.showError(data.message);
        } else {
            this.showError('Unexpected response format');
        }
    }

    showError(message) {
        const resultSection = document.getElementById('resultSection');
        const resultContent = document.getElementById('resultContent');
        const actionButtons = document.getElementById('actionButtons');

        resultSection.style.display = 'block';
        resultContent.innerHTML = `
            <div style="color: #fc8181; background: rgba(252, 129, 129, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid rgba(252, 129, 129, 0.2);">
                <strong>Error:</strong> ${message}
            </div>
        `;
        actionButtons.style.display = 'none';
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy to clipboard');
    });
}

function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new AFKBypasser();
});

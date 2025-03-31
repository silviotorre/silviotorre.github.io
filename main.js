class ContentPresenter {
    constructor() {
        this.textBlock = document.getElementById('text-block');
        this.currentInterval = null;
        this.bindEvents();
        this.loadConfig();
    }

    async loadConfig() {
        try {
            const response = await fetch('config.json');
            this.texts = (await response.json()).texts;
        } catch (error) {
            console.error('Error loading configuration:', error);
        }
    }

    revealText(text) {
        // Clear any existing interval immediately
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
        }

        this.textBlock.textContent = "";

        // Handle HTML content differently
        if (text.includes('<a')) {
            this.textBlock.innerHTML = text;
            return;
        }

        const words = text.split(" ");
        let index = 0;

        this.currentInterval = setInterval(() => {
            if (index < words.length) {
                this.textBlock.textContent += words[index] + " ";
                index++;
            } else {
                clearInterval(this.currentInterval);
                this.currentInterval = null;
            }
        }, 100); // Reduced delay for better responsiveness
    }

    bindEvents() {
        document.querySelectorAll("nav a").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const key = e.target.getAttribute("data-text");
                if (this.texts && this.texts[key]) {
                    this.revealText(this.texts[key]);
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ContentPresenter();
});
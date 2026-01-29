if (typeof emailjs !== 'undefined') {
    emailjs.init("5FbENOQ8sMEnQiTvO");
}

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form && typeof emailjs !== 'undefined') {
    let lastSent = localStorage.getItem('lastSentTime');

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const now = Date.now();
        if (lastSent && (now - lastSent < 60000)) {
             status.textContent = `Please wait ${Math.ceil((60000 - (now - lastSent)) / 1000)}s before sending another details.`;
             status.style.color = "#ef4444";
             return;
        }

        const emailInput = form.querySelector('input[name="email"]');
        const email = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            status.textContent = "Please enter a valid email address.";
            status.style.color = "#ef4444";
            return;
        }

        status.textContent = "Sending...";
        status.style.color = "#8b5cf6";
        
        emailjs.sendForm("service_hbg3vrp", "template_0l48xki", this)
            .then(() => {
                status.textContent = "Message sent successfully!";
                status.style.color = "#10b981";
                form.reset();
                localStorage.setItem('lastSentTime', Date.now());
                lastSent = Date.now();
            }, (err) => {
                status.textContent = "Failed to send message. Try again.";
                status.style.color = "#ef4444";
                console.error(err);
            });
    });
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function renderTimeline(projects, container) {
    container.innerHTML = '';
    
    projects.forEach((project, index) => {
        const side = index % 2 === 0 ? 'left' : 'right';
        const delay = index > 0 ? `delay-${index * 100}` : '';
        
        const item = document.createElement('div');
        item.className = `timeline-item ${side} reveal ${delay} active`;
        item.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-card card">
                <span class="timeline-badge">${project.year}</span>
                <h3>
                    <a href="${project.url}" target="_blank">
                        <i class="fab fa-github"></i> ${project.title}
                    </a>
                </h3>
                <span class="timeline-subtitle">${project.subtitle}</span>
                <p>${project.description}</p>
                <div class="tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderCards(projects, container) {
    container.innerHTML = '';
    
    projects.forEach((project, index) => {
        const delay = `delay-${((index % 3) + 1) * 100}`;
        
        const card = document.createElement('div');
        card.className = `project-card card reveal ${delay} active`;
        card.innerHTML = `
            <h3>
                <a href="${project.url}" target="_blank">
                    <i class="fab fa-github"></i> ${project.title}
                </a>
            </h3>
            <p>${project.description}</p>
            <div class="tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
        container.appendChild(card);
    });
}

function renderSkills(skills, container) {
    container.innerHTML = '';
    
    skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = skill;
        container.appendChild(tag);
    });
}

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const allProjects = await response.json();
        
        const timeline = document.getElementById('projects-timeline');
        if (timeline) {
            const featuredProjects = allProjects.filter(p => p.featured === true);
            renderTimeline(featuredProjects, timeline);
        }
        
        const cardsContainer = document.getElementById('projects-cards');
        if (cardsContainer) {
            renderCards(allProjects, cardsContainer);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

async function loadSkills() {
    try {
        const response = await fetch('skills.json');
        const skills = await response.json();
        
        const skillsContainer = document.getElementById('skills-tags');
        if (skillsContainer) {
            renderSkills(skills, skillsContainer);
        }
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

function updateVisitorCount() {
    const counterElement = document.getElementById('visitor-count');
    if (counterElement) {
        let count = localStorage.getItem('visitorCount');
        if (!count) {
            count = 0;
        } else {
            count = parseInt(count) + 1;
        }
        localStorage.setItem('visitorCount', count);
        counterElement.textContent = count;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateVisitorCount();
    loadProjects();
    loadSkills();
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
});

// Check if emailjs is loaded before using it
if (typeof emailjs !== 'undefined') {
    (function() {
      emailjs.init("YOUR_EMAILJS_USER_ID");
    })();
}

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form && typeof emailjs !== 'undefined') {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      status.textContent = "Sending...";
    
      const serviceID = "service_xxxxx";
      const templateID = "template_xxxxx";
    
      emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
          status.textContent = "Message sent successfully!";
          form.reset();
        }, (err) => {
          status.textContent = "Failed to send message. Try again.";
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
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));
});

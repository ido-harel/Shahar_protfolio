// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    
    /* -------------------------------------------
       Header Scroll Effect
    ------------------------------------------- */
    const header = document.querySelector('.site-header');
    
    const toggleHeaderBackground = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Initial check
    toggleHeaderBackground();
    
    // Check on scroll
    window.addEventListener('scroll', toggleHeaderBackground);

    
    /* -------------------------------------------
       Scroll Reveal Animations
    ------------------------------------------- */
    // Select all elements that need to be revealed
    const revealElements = document.querySelectorAll('.reveal, .reveal-seq');

    // Setup intersection observer options
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -10% 0px', // trigger slightly before it comes into view
        threshold: 0.1 // 10% of element is visible
    };

    // Callback function for when intersections occur
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add active class to fade/slide in
                entry.target.classList.add('active');
                
                // Stop observing once revealed (so it stays visible)
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, observerOptions);

    // Observe each element
    revealElements.forEach(el => revealObserver.observe(el));


    /* -------------------------------------------
       Smooth Scrolling for Anchor Links
    ------------------------------------------- */
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // If it's just '#' then scroll to top
            if(targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get offset top considering fixed header
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

});

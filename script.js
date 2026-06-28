// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    
    /* -------------------------------------------
       Header Scroll Effect
    ------------------------------------------- */
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;
    const scrollDelta = 10;
    
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        // Toggle header scrolled styling
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header on scroll down, show on scroll up
        const isMenuOpen = document.body.classList.contains('menu-open');
        
        if (currentScrollY <= 150) {
            header.classList.remove('header-hidden');
            lastScrollY = currentScrollY;
        } else if (Math.abs(currentScrollY - lastScrollY) > scrollDelta && !isMenuOpen) {
            if (currentScrollY > lastScrollY) {
                // Scrolling down
                header.classList.add('header-hidden');
            } else {
                // Scrolling up
                header.classList.remove('header-hidden');
            }
            lastScrollY = currentScrollY;
        }
    };
    
    // Initial check
    handleScroll();
    
    // Check on scroll
    window.addEventListener('scroll', handleScroll);

    
    /* -------------------------------------------
       Scroll Reveal Animations
    ------------------------------------------- */
    // Select all elements that need to be revealed
    const revealElements = document.querySelectorAll('.reveal, .reveal-seq, .project-card-reveal');

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

    /* -------------------------------------------
       Mobile Navigation Menu Toggle
    ------------------------------------------- */
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');

    if (menuToggle && mobileNavOverlay) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNavOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    /* -------------------------------------------
       Live Local Time (Tel Aviv)
    ------------------------------------------- */
    const updateLocalTime = () => {
        const clockElement = document.getElementById('live-clock');
        if (clockElement) {
            const options = {
                timeZone: 'Asia/Jerusalem',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            };
            const timeString = new Intl.DateTimeFormat('en-US', options).format(new Date());
            clockElement.textContent = timeString.toLowerCase();
        }
    };
    updateLocalTime();
    setInterval(updateLocalTime, 1000); // Update every second to maintain exact time

    /* -------------------------------------------
       Interactive Physics Sandbox Playground
    ------------------------------------------- */
    const sandbox = document.getElementById('physics-sandbox');
    if (sandbox) {
        // Items list
        const itemDefs = [
            { text: ':):', type: 'badge-item' },
            { text: '🌊', type: 'circle-item' },
            { text: '🎱', type: 'circle-item' },
            { text: '📸', type: 'circle-item' },
            { text: '👾', type: 'circle-item' },
            { text: '⚡', type: 'circle-item' },
            { text: 'drag here', type: 'tag-item', isTarget: true },
            { text: 'Beyond 🍌', type: 'normal', url: 'project.html' },
            { text: 'Drama 🛀🏼', type: 'normal', url: 'project-drama-bombs.html' },
            { text: 'Voices 🌸', type: 'normal', url: 'project-womens-voices.html' },
            { text: 'Seaty 🌊', type: 'normal', url: 'project-the-beatles.html' }
        ];

        // Create DOM nodes and initialize physics states
        const items = itemDefs.map((def) => {
            const el = document.createElement('div');
            el.className = `sandbox-item ${def.type}`;
            el.textContent = def.text;
            sandbox.appendChild(el);

            const width = el.offsetWidth;
            const height = el.offsetHeight;
            
            // Safe boundaries to prevent negative values on initialization
            const maxX = Math.max(10, sandbox.clientWidth - width - 20);
            const maxY = Math.max(10, sandbox.clientHeight - height - 20);
            const x = Math.random() * maxX + 10;
            const y = Math.random() * maxY + 10;
            
            return {
                el,
                x,
                y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                width,
                height,
                isDragged: false,
                lastX: x,
                lastY: y,
                dragPointerId: null,
                isTarget: def.isTarget || false,
                url: def.url || null
            };
        });

        // Resize handler to update widths/heights and keep items in bounds
        const updateSizes = () => {
            items.forEach(item => {
                item.width = item.el.offsetWidth;
                item.height = item.el.offsetHeight;
                
                const maxX = sandbox.clientWidth - item.width;
                const maxY = sandbox.clientHeight - item.height;
                if (item.x > maxX) item.x = maxX;
                if (item.y > maxY) item.y = maxY;
                if (item.x < 0) item.x = 0;
                if (item.y < 0) item.y = 0;
            });
        };
        // Run once DOM settles
        setTimeout(updateSizes, 100);
        window.addEventListener('resize', updateSizes);

        sandbox.addEventListener('pointerdown', (e) => {
            const el = e.target.closest('.sandbox-item');
            if (!el) return;
            e.preventDefault();

            const item = items.find(i => i.el === el);
            if (!item) return;

            item.isDragged = true;
            item.dragPointerId = e.pointerId;
            el.setPointerCapture(e.pointerId);

            const rect = el.getBoundingClientRect();
            item.offsetX = e.clientX - rect.left;
            item.offsetY = e.clientY - rect.top;
            
            item.vx = 0;
            item.vy = 0;
            item.lastX = item.x;
            item.lastY = item.y;
        });

        sandbox.addEventListener('pointermove', (e) => {
            let activeDraggedItem = null;
            items.forEach(item => {
                if (item.isDragged && item.dragPointerId === e.pointerId) {
                    const sandboxRect = sandbox.getBoundingClientRect();
                    const targetX = e.clientX - sandboxRect.left - item.offsetX;
                    const targetY = e.clientY - sandboxRect.top - item.offsetY;

                    item.x = Math.max(0, Math.min(sandbox.clientWidth - item.width, targetX));
                    item.y = Math.max(0, Math.min(sandbox.clientHeight - item.height, targetY));

                    item.vx = item.x - item.lastX;
                    item.vy = item.y - item.lastY;
                    item.lastX = item.x;
                    item.lastY = item.y;

                    activeDraggedItem = item;
                }
            });

            // Target hover feedback highlight
            const targetItem = items.find(i => i.isTarget);
            if (targetItem) {
                const anyDrag = activeDraggedItem || items.find(i => i.isDragged);
                let isHovering = false;
                if (anyDrag) {
                    if (anyDrag.isTarget) {
                        isHovering = items.some(other => {
                            if (!other.url) return false;
                            const r1 = targetItem.el.getBoundingClientRect();
                            const r2 = other.el.getBoundingClientRect();
                            return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
                        });
                    } else if (anyDrag.url) {
                        const r1 = anyDrag.el.getBoundingClientRect();
                        const r2 = targetItem.el.getBoundingClientRect();
                        isHovering = !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
                    }
                }
                if (isHovering) {
                    targetItem.el.classList.add('drag-hover');
                } else {
                    targetItem.el.classList.remove('drag-hover');
                }
            }
        });

        const endDrag = (e) => {
            const targetItem = items.find(i => i.isTarget);
            let triggeredUrl = null;

            items.forEach(item => {
                if (item.isDragged && item.dragPointerId === e.pointerId) {
                    item.isDragged = false;
                    item.dragPointerId = null;
                    item.el.releasePointerCapture(e.pointerId);

                    // Check for overlap navigation
                    if (targetItem) {
                        if (item.url) {
                            const r1 = item.el.getBoundingClientRect();
                            const r2 = targetItem.el.getBoundingClientRect();
                            const overlap = !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
                            if (overlap) {
                                triggeredUrl = item.url;
                            }
                        } else if (item.isTarget) {
                            items.forEach(other => {
                                if (other.url) {
                                    const r1 = targetItem.el.getBoundingClientRect();
                                    const r2 = other.el.getBoundingClientRect();
                                    const overlap = !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
                                    if (overlap) {
                                        triggeredUrl = other.url;
                                    }
                                }
                            });
                        }
                    }
                }
            });

            if (triggeredUrl && targetItem) {
                targetItem.el.classList.add('drag-success');
                setTimeout(() => {
                    window.location.href = triggeredUrl;
                }, 200);
            }

            if (targetItem) {
                targetItem.el.classList.remove('drag-hover');
            }
        };

        sandbox.addEventListener('pointerup', endDrag);
        sandbox.addEventListener('pointercancel', endDrag);

        // Physics parameters
        const bounce = 0.75;
        const damping = 0.985;

        // Main animation loop
        const updatePhysics = () => {
            const containerWidth = sandbox.clientWidth;
            const containerHeight = sandbox.clientHeight;
            const isAnyOtherDragged = items.some(i => i.isDragged && !i.isTarget);

            items.forEach((item, idx) => {
                const itemImmovable = item.isDragged || (item.isTarget && isAnyOtherDragged);

                if (!itemImmovable) {
                    item.x += item.vx;
                    item.y += item.vy;

                    item.vx *= damping;
                    item.vy *= damping;

                    // Wall boundaries
                    if (item.x <= 0) {
                        item.x = 0;
                        item.vx = -item.vx * bounce;
                    } else if (item.x + item.width >= containerWidth) {
                        item.x = containerWidth - item.width;
                        item.vx = -item.vx * bounce;
                    }

                    if (item.y <= 0) {
                        item.y = 0;
                        item.vy = -item.vy * bounce;
                    } else if (item.y + item.height >= containerHeight) {
                        item.y = containerHeight - item.height;
                        item.vy = -item.vy * bounce;
                    }

                    // Keep minor motion alive
                    if (Math.abs(item.vx) < 0.05 && Math.abs(item.vy) < 0.05) {
                        item.vx = (Math.random() - 0.5) * 0.5;
                        item.vy = (Math.random() - 0.5) * 0.5;
                    }
                } else if (item.isTarget && isAnyOtherDragged) {
                    // Lock velocity to 0 while frozen
                    item.vx = 0;
                    item.vy = 0;
                }

                // Item to item collisions (circle overlap check)
                for (let j = idx + 1; j < items.length; j++) {
                    const other = items[j];
                    
                    const cx1 = item.x + item.width / 2;
                    const cy1 = item.y + item.height / 2;
                    const r1 = (item.width + item.height) / 4;

                    const cx2 = other.x + other.width / 2;
                    const cy2 = other.y + other.height / 2;
                    const r2 = (other.width + other.height) / 4;

                    const dx = cx2 - cx1;
                    const dy = cy2 - cy1;
                    const distance = Math.hypot(dx, dy);
                    const minDist = r1 + r2;

                    if (distance < minDist && distance > 0) {
                        const overlap = minDist - distance;
                        const nx = dx / distance;
                        const ny = dy / distance;

                        const itemImmovable = item.isDragged || (item.isTarget && isAnyOtherDragged);
                        const otherImmovable = other.isDragged || (other.isTarget && isAnyOtherDragged);

                        if (!itemImmovable) {
                            item.x -= nx * overlap * 0.5;
                            item.y -= ny * overlap * 0.5;
                        }
                        if (!otherImmovable) {
                            other.x += nx * overlap * 0.5;
                            other.y += ny * overlap * 0.5;
                        }

                        // Elastic collision velocity swap
                        const kx = item.vx - other.vx;
                        const ky = item.vy - other.vy;
                        const p = 2 * (nx * kx + ny * ky) / 2;

                        if (!itemImmovable) {
                            item.vx -= p * nx * bounce;
                            item.vy -= p * ny * bounce;
                        }
                        if (!otherImmovable) {
                            other.vx += p * nx * bounce;
                            other.vy += p * ny * bounce;
                        }
                    }
                }

                // Apply transform styling
                item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
            });

            requestAnimationFrame(updatePhysics);
        };

        requestAnimationFrame(updatePhysics);
    }

});


document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("interactive-sphere");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    // Internal coordinate resolution (high res for retina displays)
    const size = 800;
    canvas.width = size;
    canvas.height = size;
    
    const dots = [];
    const numDots = 1000;
    
    // Repulsion config
    const repelRadius = 150; // How close mouse needs to be in canvas coords
    const repelForce = 2.5;
    
    // Mouse tracks
    let mouseX = -1000;
    let mouseY = -1000;
    
    // Listen to mouse movement
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        mouseX = (e.clientX - rect.left) * scaleX;
        mouseY = (e.clientY - rect.top) * scaleY;
    });

    canvas.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });
    
    // Handle touch roughly
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        mouseX = (e.touches[0].clientX - rect.left) * scaleX;
        mouseY = (e.touches[0].clientY - rect.top) * scaleY;
    }, {passive: false});
    
    canvas.addEventListener('touchend', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    // Generate points uniformly on sphere using Fibonacci sphere
    for (let i = 0; i < numDots; i++) {
        const y = 1 - (i / (numDots - 1)) * 2; 
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = 2.399963229728653 * i; 
        
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        
        dots.push({
            origX: x, origY: y, origZ: z, 
            displayX: 0, displayY: 0, // Spring position
            initialized: false
        });
    }

    let rotationY = 0;
    let rotationX = 0;
    
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Constant rotation
        rotationY += 0.002;
        rotationX += 0.0005;
        
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        
        const sphereRadius = size * 0.4;
        const centerX = size / 2;
        const centerY = size / 2;
        
        // Calculate physics & draw layers
        dots.forEach(dot => {
            // Rotate around Y
            let rx = dot.origX * cosY - dot.origZ * sinY;
            let rz = dot.origX * sinY + dot.origZ * cosY;
            
            // Rotate around X
            let ry = dot.origY * cosX - rz * sinX;
            rz = dot.origY * sinX + rz * cosX;
            
            dot.currentZ = rz;
            
            // 2D Target coordinate projection
            let destX = centerX + rx * sphereRadius;
            let destY = centerY + ry * sphereRadius;
            
            // Handle mouse repulsion
            let dx = destX - mouseX;
            let dy = destY - mouseY;
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            let forceX = 0;
            let forceY = 0;
            
            // If near front of sphere and near mouse
            if (dist < repelRadius && rz > -0.5) {
                let force = (repelRadius - dist) / repelRadius;
                forceX = (dx / dist) * force * repelForce * sphereRadius * 0.15;
                forceY = (dy / dist) * force * repelForce * sphereRadius * 0.15;
            }
            
            // Init immediately to avoid flying in
            if(!dot.initialized) {
                dot.displayX = destX;
                dot.displayY = destY;
                dot.initialized = true;
            }
            
            // Spring interpolation
            dot.displayX += (destX + forceX - dot.displayX) * 0.08;
            dot.displayY += (destY + forceY - dot.displayY) * 0.08;
            
            // Perpective size & depth fade
            let zPerc = (rz + 1) / 2; // maps roughly to 0->1
            dot.size = zPerc * 3.5 + 0.5; // range 0.5 to 4.0
            dot.alpha = zPerc * 0.8 + 0.2; // range 0.2 to 1.0
        });
        
        // Z-sort to draw back to front naturally
        dots.sort((a,b) => a.currentZ - b.currentZ);
        
        // Render
        dots.forEach(dot => {
            // Skip totally hidden/tiny dots for performance
            if(dot.alpha < 0.1) return;
            
            ctx.beginPath();
            ctx.arc(dot.displayX, dot.displayY, dot.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(235, 232, 224, ${dot.alpha})`; // Site text color
            ctx.fill();
        });
        
        requestAnimationFrame(render);
    }
    
    render();
});

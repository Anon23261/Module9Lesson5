// Matrix background effect
function initMatrix() {
    const canvas = document.getElementById('matrix');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width/fontSize;

    const rainDrops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ff3333';
        ctx.font = fontSize + 'px monospace';

        for(let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i*fontSize, rainDrops[i]*fontSize);
            
            if(rainDrops[i]*fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    }

    setInterval(draw, 30);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        rainDrops.length = Math.floor(canvas.width/fontSize);
        rainDrops.fill(1);
    });
}

// Form validation and submission
function initForms() {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', async event => {
            event.preventDefault();
            
            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;
            
            try {
                // Disable form while submitting
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                // Collect form data
                const formData = new FormData(form);
                const formObject = {};
                formData.forEach((value, key) => formObject[key] = value);
                
                // Add form type
                formObject.formType = form.id === 'loginForm' ? 'login' : 'signup';
                
                // Send to server
                const response = await fetch('process_form.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success
                    btn.innerHTML = '<i class="fas fa-check"></i> Access Granted';
                    btn.classList.remove('btn-danger');
                    btn.classList.add('btn-success');
                    
                    // Redirect after delay
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (error) {
                // Show error
                btn.innerHTML = '<i class="fas fa-times"></i> Error';
                btn.classList.remove('btn-success');
                btn.classList.add('btn-danger');
                
                // Reset after delay
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalContent;
                }, 2000);
                
                console.error('Form submission error:', error);
            }
            
            form.classList.add('was-validated');
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                }
            });
        });
    });
}

// Initialize typed.js effect if element exists
function initTypedEffect() {
    const typedElement = document.querySelector('.typed-text');
    if (typedElement) {
        new Typed('.typed-text', {
            strings: [
                'Elite Cyber Operations Division',
                'Advanced Threat Detection',
                'Secure Communications Network',
                'Strategic Defense Initiative'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true
        });
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    initMatrix();
    initForms();
    initTypedEffect();
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const resultDiv = document.querySelector('.result');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default page reload
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Envoi en cours...';
            resultDiv.innerHTML = '';
            resultDiv.className = 'result'; // Reset classes
            
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === 'true' || data.ok === true) {
                    // Success
                    resultDiv.innerHTML = '<div class="alert alert-success">Message envoyé avec succès !</div>';
                    form.reset(); // Clear form fields
                } else {
                    // API reported error
                    resultDiv.innerHTML = '<div class="alert alert-danger">Une erreur est survenue. Veuillez réessayer.</div>';
                }
            })
            .catch(error => {
                // Network or other error
                console.error('Error:', error);
                resultDiv.innerHTML = '<div class="alert alert-danger">Une erreur est survenue. Veuillez réessayer.</div>';
            })
            .finally(() => {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }
});

function openModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function switchModal(currentType, newType) {
    closeModal(currentType);
    setTimeout(() => openModal(newType), 200);
}

// Close modal when clicking outside
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Handle Login
function handleLogin() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    if (emailInput && passwordInput) {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email && password) {
            alert('Login successful! Welcome back!');
            closeModal('login');
        } else {
            alert('Please fill in all fields');
        }
    }
}

// Handle Signup
function handleSignup() {
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const confirmInput = document.getElementById('signup-confirm');

    if (nameInput && emailInput && passwordInput && confirmInput) {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirm = confirmInput.value;

        if (!name || !email || !password || !confirm) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }

        // Call Frappe API
        frappe.call({
            method: "e_com.api.items.signup_user",
            args: {
                full_name: name,
                email: email,
                password: password  
            },
            callback: function(r) {
                console.log(r);
                
                if(r.message.status === "success") {
                    alert(r.message.message);
                    closeModal('signup');
                } else {
                    alert(r.message.message);
                }
            }
        });
    }
}

// Add to Cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        this.textContent = 'Added!';
        this.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        setTimeout(() => {
            this.textContent = 'Add to Cart';
            this.style.background = 'linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)';
        }, 2000);
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
const filterDropdown = document.getElementById('item-group-filter');
const productCards = document.querySelectorAll('.product-card');
const noItemsMsg = document.getElementById('no-items-msg');

filterDropdown.addEventListener('change', () => {
    const selectedGroup = filterDropdown.value;
    let anyVisible = false;

    productCards.forEach(card => {
        const cardGroup = card.getAttribute('data-group');
        if (selectedGroup === 'all' || cardGroup === selectedGroup) {
            card.style.display = 'block';
            anyVisible = true;
        } else {
            card.style.display = 'none';
        }
    });

    noItemsMsg.style.display = anyVisible ? 'none' : 'block';
});


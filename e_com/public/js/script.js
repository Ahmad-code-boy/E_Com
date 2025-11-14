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
async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/method/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                usr: email,
                pwd: password
            }),
            credentials: 'include'
        });

        const result = await response.json();

        if (result.message === 'Logged In') {
            window.open('http://127.0.0.1:8000', '_blank');
        } else {
            alert(result.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred while logging in.');
    }
}

// Handle Signup

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

const logout = () => {
	return frappe.call({
		method: "logout",
		callback: function (r) {
			if (r.exc) {
				return;
			}
			window.location.href = "/login.html";
		},
	});
}
document.addEventListener('DOMContentLoaded', () => {
    // Manejo del registro de usuarios
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Obtener usuarios de localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Verificar si el correo ya está registrado
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                alert('El correo electrónico ya está registrado.');
                return;
            }

            // Agregar nuevo usuario al array de usuarios
            users.push({ name, email, password, isAdmin: false });
            localStorage.setItem('users', JSON.stringify(users));

            alert('Registro exitoso! Ahora puedes iniciar sesión.');
            window.location.href = 'login.html';
        });
    }

    // Manejo del inicio de sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Obtener usuarios de localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Verificar credenciales
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                // Almacenar usuario en sessionStorage
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));

                // Redirigir según si es administrador o no
                if (user.isAdmin) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'reservations.html';
                }
            } else {
                alert('Correo o contraseña incorrectos.');
            }
        });
    }

    // Manejo del formulario de reservaciones
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                alert('Debes iniciar sesión para hacer una reservación.');
                window.location.href = 'login.html';
                return;
            }

            const name = document.getElementById('name').value;
            const email = loggedInUser.email; // Utilizamos el correo del usuario logueado
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;

            // Obtener reservaciones de localStorage
            const reservations = JSON.parse(localStorage.getItem('reservations')) || [];

            // Agregar nueva reservación al array de reservaciones
            reservations.push({ name, email, service, date, status: 'Pendiente' });
            localStorage.setItem('reservations', JSON.stringify(reservations));

            alert('Reservación exitosa!');
            reservationForm.reset();
            loadReservations(); // Recargar lista de reservaciones
        });
    }

    // Función para cargar y mostrar las reservaciones
    function loadReservations() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        const table = document.getElementById('reservationTable');
        const adminTable = document.getElementById('adminReservationTable');
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];

        // Mostrar reservaciones del usuario logueado en la página de reservaciones
        if (table) {
            const tbody = table.getElementsByTagName('tbody')[0];
            tbody.innerHTML = '';
            reservations.forEach(reservation => {
                if (reservation.email === loggedInUser.email) {
                    const newRow = tbody.insertRow();
                    newRow.insertCell(0).textContent = reservation.name;
                    newRow.insertCell(1).textContent = reservation.email;
                    newRow.insertCell(2).textContent = reservation.service;
                    newRow.insertCell(3).textContent = reservation.date;
                }
            });
        }

        // Mostrar todas las reservaciones en la página de administración (solo para admin)
        if (adminTable) {
            const adminTbody = adminTable.getElementsByTagName('tbody')[0];
            adminTbody.innerHTML = '';
            reservations.forEach((reservation, index) => {
                const newRow = adminTbody.insertRow();
                newRow.insertCell(0).textContent = reservation.name;
                newRow.insertCell(1).textContent = reservation.email;
                newRow.insertCell(2).textContent = reservation.service;
                newRow.insertCell(3).textContent = reservation.date;
                newRow.insertCell(4).textContent = reservation.status;

                // Botón para marcar como completada una reservación (solo para admin)
                const actionsCell = newRow.insertCell(5);
                const completeButton = document.createElement('button');
                completeButton.textContent = 'Completar';
                completeButton.addEventListener('click', () => {
                    reservations[index].status = 'Completado';
                    localStorage.setItem('reservations', JSON.stringify(reservations));
                    loadReservations(); // Recargar lista de reservaciones
                });
                actionsCell.appendChild(completeButton);
            });
        }
    }

    // Cargar reservaciones al cargar la página
    loadReservations();

    // Manejo del cierre de sesión
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('loggedInUser');
            window.location.href = 'logout.html';
        });
    }

    // Código para añadir admin
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userToMakeAdmin = users.find(user => user.email === 'poncemoreno96@gmail.com');
    if (userToMakeAdmin) {
        userToMakeAdmin.isAdmin = true;
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Manejo del formulario de ventas
    const salesForm = document.getElementById('salesForm');
    if (salesForm) {
        salesForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const saleDate = document.getElementById('saleDate').value;
            const saleAmount = document.getElementById('saleAmount').value;
            const saleDescription = document.getElementById('saleDescription').value;

            const sales = JSON.parse(localStorage.getItem('sales')) || [];
            sales.push({ saleDate, saleAmount, saleDescription });
            localStorage.setItem('sales', JSON.stringify(sales));

            alert('Venta registrada exitosamente!');
            salesForm.reset();
            loadSales(); // Cargar ventas registradas
        });
    }

    // Función para cargar y mostrar las ventas registradas
    function loadSales() {
        const salesTable = document.getElementById('salesTable');
        const sales = JSON.parse(localStorage.getItem('sales')) || [];
        const tbody = salesTable.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        sales.forEach(sale => {
            const newRow = tbody.insertRow();
            newRow.insertCell(0).textContent = sale.saleDate;
            newRow.insertCell(1).textContent = sale.saleAmount;
            newRow.insertCell(2).textContent = sale.saleDescription;
        });
    }

    // Cargar ventas al cargar la página
    loadSales();
});
// Función para controlar el carousel
var currentIndex = 0;
var totalSlides = document.querySelectorAll('.carousel-img').length;

function moveCarousel(direction) {
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
    var translateValue = currentIndex * -100;
    document.querySelector('.carousel').style.transform = 'translateX(' + translateValue + '%)';
}

// Función para enviar mensaje por WhatsApp
function sendWhatsAppMessage() {
    var name = document.getElementById('name').value;
    var message = document.getElementById('message').value;
    var phone = '4494923384'; // Número de WhatsApp destinatario

    var url = 'https://wa.me/' + phone + '?text=Hola,%20mi%20nombre%20es%20' + name + '.%20' + message;
    window.open(url);
}

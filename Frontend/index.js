const API_URL = 'http://localhost:3001/clients';

// Get references to HTML elements
const clientsTableBody = document.querySelector('#clientsTable tbody');
const clientForm = document.getElementById('clientForm');
const clientIdInput = document.getElementById('clientId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');
const genreSelect = document.getElementById('genre');
const cancelEditBtn = document.getElementById('cancelEdit');

let editMode = false; // Flag to track if we are editing an existing client

// Function to load clients from the server and display them in the table
async function loadClients() {
  try {
    const res = await fetch(API_URL);
    const clients = await res.json();

    clientsTableBody.innerHTML = ''; // Clear existing table rows

    clients.forEach(client => {
      // Create a new table row for each client
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${client.id}</td>
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.phone}</td>
        <td>${client.address}</td>
        <td>${client.genre}</td>
        <td>
            <button class="edit" data-id="${client.id}">Edit</button>
            <button class="delete" data-id="${client.id}">Delete</button>
        </td>
      `;
      clientsTableBody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error loading clients:', error);
  }
}

// Event listener for form submission to create or update a client
clientForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Gather data from the form fields
  const clientData = {
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    phone: phoneInput.value,
    address: addressInput.value,
    genre: genreSelect.value,
  };

  try {
    if (editMode) {
      // If in edit mode, send PUT request to update client
      const id = clientIdInput.value;
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      alert('Client updated');
    } else {
      // Otherwise, send POST request to create new client
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      alert('Client created');
    }
    resetForm();    // Clear form and reset state
    loadClients();  // Refresh the client list
  } catch (error) {
    console.error('Error saving client:', error);
  }
});

// Function to load client data into the form for editing
window.editClient = async function(id) {
  try {
    const res = await fetch(`${API_URL}`);
    const clients = await res.json();
    const client = clients.find(c => c.id === id);

    if (!client) return alert('Client not found');

    // Fill form inputs with client data
    clientIdInput.value = client.id;
    nameInput.value = client.name;
    emailInput.value = client.email;
    passwordInput.value = client.password || '';
    phoneInput.value = client.phone || '';
    addressInput.value = client.address || '';
    genreSelect.value = client.genre || '';

    editMode = true;                  // Set edit mode
    cancelEditBtn.style.display = 'inline';  // Show cancel button
  } catch (error) {
    console.error('Error loading client:', error);
  }
};

// Event listener for cancel edit button
cancelEditBtn.addEventListener('click', () => {
  resetForm();
});

// Function to reset the form and exit edit mode
function resetForm() {
  clientForm.reset();
  clientIdInput.value = '';
  editMode = false;
  cancelEditBtn.style.display = 'none';
}

// Function to delete a client
window.deleteClient = async function(id) {
  if (!confirm('Are you sure you want to delete this client?')) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    alert('Client deleted');
    loadClients();  // Refresh client list after deletion
  } catch (error) {
    console.error('Error deleting client:', error);
  }
};

// Load clients when the page loads
loadClients();

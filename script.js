// Import Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase project credentials (replace with your actual credentials)
const supabaseUrl = "***";
const supabaseKey = "***";
const supabase = createClient(supabaseUrl, supabaseKey);

const loginForm = document.getElementById('loginForm');
const messageArea = document.getElementById('messageArea');

// Function to display messages
function showMessage(message, type = 'info') {
    messageArea.textContent = message;
    messageArea.className = type; // 'success', 'error', or remove class for info
}

// Login user function
async function loginUser(event) {
    event.preventDefault(); // Prevent default form submission
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    showMessage('Logging in...', 'info');

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Login error:', error.message);
            showMessage(`Error: ${error.message}`, 'error');
            return;
        }

        if (data && data.user) {
            console.log('Logged in successfully:', data.user);
            showMessage('Login successful!', 'success');
            // You can redirect or do other actions here
            // e.g., window.location.href = '/dashboard.html';
        } else {
             // Should not happen if error is not present, but good to have a fallback
            showMessage('Login failed. Please try again.', 'error');
        }

    } catch (err) {
        console.error('Unexpected error during login:', err);
        showMessage('An unexpected error occurred. Please try again.', 'error');
    }
}

// Attach event listener to the login form
if (loginForm) {
    loginForm.addEventListener('submit', loginUser);
} else {
    console.error('Login form not found!');
}

// --- Admin User Creation (for testing) ---
// This function is intended for one-time setup or testing.
// You would typically call this from the browser's developer console.
async function createAdminUser(adminEmail, adminPassword) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: adminEmail,
            password: adminPassword,
            // You can add options here, like user_metadata
            // options: {
            //   data: { is_admin: true }
            // }
        });

        if (error) {
            console.error('Error creating admin user:', error.message);
            alert(`Error creating admin user: ${error.message}`); // Alert for direct feedback
            return { user: null, error: error };
        }

        if (data && data.user) {
            console.log('Admin user created successfully:', data.user);
            alert('Admin user created successfully! Please check your email to confirm (if email confirmation is enabled in Supabase).');
            // If you added custom data like is_admin, you might want to update the user record or handle it post-signup.
            // For example, if you have RLS policies that depend on a role, you'd set that role here or in a trigger.
            return { user: data.user, error: null };
        } else {
            console.warn('Admin user creation did not return a user object, but no error was reported.');
            alert('Admin user creation process completed, but no user data was returned. Check Supabase logs.');
            return { user: null, error: new Error('No user data returned after sign up.') };
        }
    } catch (err) {
        console.error('Unexpected error during admin user creation:', err);
        alert(`Unexpected error: ${err.message}`);
        return { user: null, error: err };
    }
}

// Example of how you might call createAdminUser from the console:
// createAdminUser('admin@example.com', 'securePassword123');

// To make it available in the console:
window.createAdminUser = createAdminUser;
console.log("Supabase client initialized. Login form listener attached. Use createAdminUser('email', 'password') in console to create an admin.");

document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('auth-button');

    // Ensure we have compat auth/db available (firebase-config.js sets window.auth/window.db)
    const auth = window.auth || (window.firebase && window.firebase.auth && window.firebase.auth());
    const db = window.db || (window.firebase && window.firebase.firestore && window.firebase.firestore());

    // --- Authentication State Listener (Core Functionality) ---
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            console.log("User logged in:", user.uid);
            
            // 1. Change button to Logout
            authButton.textContent = 'Logout';
            authButton.classList.remove('login-btn');
            authButton.classList.add('logout-btn');

            // 2. Fetch User Role and Update UI (Student/Admin)
            // Assumes you have a 'users' collection in Firestore
            db.collection('users').doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const userRole = userData.role || 'student'; // Default to student
                    console.log("User Role:", userRole);

                    // Example: Display student info or admin controls
                    if (userRole === 'admin') {
                        console.log("Admin logged in. Showing admin tools.");
                        // Call a function to show admin-specific elements (e.g., upload/post button)
                        showAdminFeatures();
                    } else { // Student/Regular user
                        console.log("Student logged in. Showing all center information.");
                        // Call a function to show internal BACE info (if hidden by default)
                        showStudentFeatures(); 
                    }
                } else {
                    console.log("No role data found for user.");
                }
            }).catch(error => {
                console.error("Error getting user role:", error);
            });

        } else {
            // User is signed out.
            console.log("User logged out.");
            
            // 1. Change button back to Login
            authButton.textContent = 'Login';
            authButton.classList.remove('logout-btn');
            authButton.classList.add('login-btn');

            // 2. Hide restricted elements
            hideRestrictedFeatures();
        }
    });

    // --- Login/Logout Handler ---
    authButton.addEventListener('click', () => {
        if (auth.currentUser) {
            // If currently logged in -> LOGOUT
            auth.signOut().then(() => {
                alert('Logged out successfully.');
            }).catch((error) => {
                console.error('Logout error:', error);
            });
        } else {
            // If currently logged out -> LOGIN
            // Redirect to a dedicated login page
            window.location.href = 'login.html';
        }
    });

    // --- Role-Based UI/Data Functions (Placeholder) ---
    
    // Admin: Upload Data (e.g., to Storage) and Create Post (e.g., to Firestore)
    function showAdminFeatures() {
        // You would typically dynamically add or un-hide HTML elements here
        // Example: Add a 'Dashboard' link or a 'New Post' button to the navbar
        // createPostInFirestore(title, content); // Example function call for admin
        // uploadFileToDrive(file); // Example function call for admin
        console.log("Admin can now upload data and create posts.");
    }

    // Student: View General BACE Information (e.g., from Firestore)
    function showStudentFeatures() {
        // Example: Fetch and display a private "Student Noticeboard" from Firestore
        db.collection('privateInfo').doc('studentNotice').get().then((doc) => {
            if (doc.exists) {
                console.log("Student Notice:", doc.data().content);
                // Dynamically add content to a private section of the page
            }
        });
        console.log("Student can now see all BACE information.");
    }
    
    function hideRestrictedFeatures() {
        // Hide elements only visible to logged-in users (both admin and student)
        // Hide elements only visible to admin
        console.log("Restricted features are hidden.");
    }

});
FINAL MASTER PROMPT – Food Street Web Application

Build a modern, responsive full-stack web application named Food Street with two main modules:

User Website
Admin Dashboard

The application should have a clean, minimal, professional UI, a single combined login/register flow, a card-based food questionnaire system, and an admin panel to view all submitted user responses.

1. USER WEBSITE
1.1 User Authentication (Single Combined Login/Register Page)

Create only one authentication page for users.
Do not create separate Login and Register pages.

Authentication UI Logic

Initially, the form should show only:

Email
Password
Authentication Behavior
When the user enters their email, the system should check whether the email already exists in the database.
If the email already exists:
Treat the user as an existing user
Perform login
Use only:
Email
Password
Do NOT show the “Re-enter Password” field
If the email does not exist:
Treat the user as a new user
Switch to registration flow
Dynamically show:
Re-enter Password
Registration should only succeed if:
Password and Re-enter Password match
Important Authentication Rule
Existing email = Login only
New email = Registration
Re-enter Password field should appear ONLY for registration
Do not show Re-enter Password during login
Access Restriction
The user must be authenticated first
Only after successful login/registration should the user be allowed to access the landing page and forms
2. USER LANDING PAGE

After successful login, redirect the user to the Food Street landing page.

2.1 Navbar
Minimal navbar
Only show the brand name “FoodName”
Place it at the top-left corner
No navigation links
No extra buttons
3. HERO SECTION

The landing page should contain a clean and visually appealing hero section.

Hero Content
Main Heading: Welcome to Food Street
Subheading: One Stop Food for Everybody
Design Requirements
Center aligned
Modern and clean
Responsive on desktop and mobile
Minimal and attractive layout
4. FOOD PREFERENCE FORM SECTION

Below the hero section, create a card-based questionnaire form system.

Form Structure
The form must be divided into multiple cards
Each card is a category
Each card contains multiple related questions
Every question must have a dropdown input
Dropdown options must be:
Yes
No
Important Requirement

This is not one question per card.
Instead:

Each form section is card-based
Each card contains multiple questions
Each question has its own Yes/No dropdown
Example Card Structure
Card 1: Food Preferences
Do you want vegetarian food? → Yes/No
Do you want spicy food? → Yes/No
Do you want desserts? → Yes/No
Card 2: Service Preferences
Do you want fast delivery? → Yes/No
Do you want takeaway? → Yes/No
Do you want combo meals? → Yes/No
Card 3: Dining Preferences (Optional)
Do you want dine-in options? → Yes/No
Do you want family seating? → Yes/No
Do you want special offers? → Yes/No
Submission
Place a Submit button below all cards
On submit:
Store all answers in the database
Save responses user-wise
Save grouped by:
User
Card category
Questions
Selected Yes/No answers
5. ADMIN MODULE
5.1 Admin Welcome Screen

Before the actual admin dashboard, create a simple admin entry screen.

Admin Welcome Page Requirements
Show a clean welcome screen for admin
Display a Login button
Keep the page minimal and professional
5.2 Admin Authentication (Single Combined Login/Register Page)

When the admin clicks the Login button, show a single combined authentication page.

Do NOT create separate Admin Login and Register pages
Admin Authentication UI Logic

Initially show only:

Email
Password
Admin Authentication Behavior
When the admin enters their email, check whether the email already exists in the admin database.
If the email already exists:
Treat as admin login
Use only:
Email
Password
Do NOT show the Re-enter Password field
If the email does not exist:
Treat as new admin registration
Dynamically show:
Re-enter Password
Registration succeeds only if:
Password and Re-enter Password match
Important Admin Authentication Rule
Existing admin email = Login only
New admin email = Registration
Re-enter Password should appear ONLY during registration
Do not show Re-enter Password during login
Post-Login Redirect
After successful admin login/registration, redirect to the Admin Dashboard
6. ADMIN DASHBOARD

The admin dashboard should be simple, minimal, and focused only on viewing submitted form responses.

Dashboard Layout
Use a vertical sidebar navigation bar on the left side
The sidebar should contain only one main button
Responses
Important
No unnecessary dashboard items
Keep the admin interface highly minimal
The focus is only on viewing user submissions
7. RESPONSES MODULE (ADMIN)
Responses Button Behavior

When the admin clicks Responses:

It should expand using a dropdown / accordion system
Inside the dropdown, show a list of users who have submitted the questionnaire
Example User List
Ramu
Shyam
Priya
Other submitted users
User List Behavior
Each user name should be clickable
Clicking a user should load their full questionnaire responses in the main content area
8. USER RESPONSE DETAIL VIEW (ADMIN)

When the admin clicks on a specific user (for example, Ramu), the main content area should display all responses submitted by that user.

Display Structure

The response view must show:

Card Categories
All questions inside each card
The selected Yes/No answers for each question
Example Display
Food Preferences
Vegetarian Food: Yes
Spicy Food: No
Desserts: Yes
Service Preferences
Fast Delivery: Yes
Takeaway: No
Combo Meals: Yes
Dining Preferences
Dine-in Options: No
Family Seating: Yes
Special Offers: Yes
Important
This same structure should work for every submitted user
The admin must be able to switch between users easily
The response data should be clearly organized and readable
9. DATA MODEL / STORAGE REQUIREMENTS

Store data in a structured way.

User Data
User ID
Email
Password (securely hashed)
Admin Data
Admin ID
Email
Password (securely hashed)
Response Data

Each submission should store:

User reference / user ID
User name or email
Submission timestamp
Card categories
Questions under each category
Selected answers (Yes/No)
Suggested Response Format
{
  "userId": "123",
  "email": "ramu@example.com",
  "submittedAt": "timestamp",
  "responses": [
    {
      "category": "Food Preferences",
      "questions": [
        { "question": "Do you want vegetarian food?", "answer": "Yes" },
        { "question": "Do you want spicy food?", "answer": "No" },
        { "question": "Do you want desserts?", "answer": "Yes" }
      ]
    },
    {
      "category": "Service Preferences",
      "questions": [
        { "question": "Do you want fast delivery?", "answer": "Yes" },
        { "question": "Do you want takeaway?", "answer": "No" },
        { "question": "Do you want combo meals?", "answer": "Yes" }
      ]
    }
  ]
}
10. UI / UX REQUIREMENTS

The entire application should follow these UI/UX principles:

Clean and modern design
Minimalistic layout
Fully responsive (desktop + tablet + mobile)
Easy to navigate
Professional visual hierarchy
Card-based form UI
Smooth dropdown / accordion behavior
Clear typography
Good spacing and alignment
Readable admin response display
Consistent design across user and admin modules
11. FUNCTIONAL REQUIREMENTS SUMMARY
User Side
Single combined login/register page
Initially show only Email + Password
Check email existence dynamically
Existing email = login only
New email = show Re-enter Password and register
Re-enter Password only during registration
After login, show landing page
Navbar only with “FoodName”
Hero section with required heading/subheading
Card-based form with multiple questions per card
Each question has Yes/No dropdown
Submit button stores user responses
Admin Side
Simple admin welcome screen
Login button on welcome screen
Single combined login/register page
Initially show only Email + Password
Existing admin email = login only
New admin email = show Re-enter Password and register
Re-enter Password only during registration
Redirect to admin dashboard after login
Vertical sidebar with only one button: Responses
Responses button expands accordion/dropdown
Shows list of users who submitted forms
Clicking a user displays all their submitted responses grouped by category and questions
12. TECH STACK (RECOMMENDED)

Build this as a full-stack web app using:

Frontend
React.js (preferably with Vite or Next.js)
Tailwind CSS for styling
Backend
Node.js + Express.js
Database
MongoDB (recommended)
Authentication
Custom auth logic or Firebase Auth
Passwords must be securely hashed (e.g., bcrypt)
Optional
JWT for session management
Protected routes for user and admin pages
13. DEVELOPMENT NOTES
Create separate routes for:
User auth
User landing/form page
Admin welcome page
Admin auth
Admin dashboard
Protect routes so unauthorized users/admins cannot access restricted pages
Use reusable card components for questionnaire sections
Use accordion component in admin sidebar for the Responses list
Ensure data is fetched dynamically from the backend
Ensure admin can see all submitted users and their latest or complete responses
Keep the architecture scalable for adding more cards/questions later
14. FINAL OUTPUT EXPECTATION

Generate the complete project with:

Frontend pages
Backend API
Authentication flow
Database schema/models
Protected routes
Form submission logic
Admin responses viewer
Responsive UI
Clean component structure
Minimal and modern design
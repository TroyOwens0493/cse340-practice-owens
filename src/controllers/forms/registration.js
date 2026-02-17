import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';
import { render } from 'ejs';

const router = Router();

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8 })
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

/**
 * Display the registration form page.
 */
const showRegistrationForm = (req, res) => {
    // Render the registration form view (forms/registration/form)
    res.render("forms/registration/form", {
        title: "User Registration"
    });
};

/**
 * Handle user registration with validation and password hashing.
 */
const processRegistration = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Store each validation error as a separate flash message
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect("/register");
    }

    // Extract validated data from request body
    const { name, email, password } = req.body;

    try {
        // Check if email already exists in database
        const isExistingEmail = await emailExists(email);

        if (isExistingEmail) {
            // Redirect back to /register
            req.flash('error', 'Email already registered');
            return res.redirect("/register");
        }

        // Hash the password before saving to database
        const hashedPassword = bcrypt.hash(password, 10)

        // Save user to database with hashed password
        saveUser(name, email, hashedPassword)

        console.log("Successful user registration");
        // Redirect to /register/list to show successful registration
        return res.redirect('/register/list');

    } catch (error) {
        console.log(error);
        req.flash('error', 'Unable to register you at this time. Please try again later');
        // Redirect back to /register
        return res.redirect('/register');
    }
};

/**
 * Display all registered users.
 */
const showAllUsers = async (req, res) => {
    // Initialize users as empty array
    let users = [];

    try {
        users = await getAllUsers()
        console.log('users', users);
    } catch (error) {
        console.log(error);
    }

    // Render the users list view (forms/registration/list)
    res.render("forms/registration/list", {
        title: "Registered Users",
        users
    });
};

/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);

/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);

/**
 * GET /register/list - Display all registered users
 */
router.get('/list', showAllUsers);

export default router;

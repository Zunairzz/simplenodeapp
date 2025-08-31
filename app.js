const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const {urlencoded} = require('body-parser');
const app = express();
import {Constants} from "./util/Constants.js";

const {BASE_URLS, PROBLEM_BASE_URL, RESUME_BASE_URL, PROJECT_BASE_URL} = Constants;

const userRoutes = require('./routes/userRoutes'); // Ensure correct path
const projectRoutes = require('./routes/projectRoutes'); // Ensure correct path
const resumeRoutes = require('./routes/resumeRoutes'); // Ensure correct path
const problemsRoutes = require('./routes/findSolutionRoutes'); // Ensure correct path

dotenv.config();

// Middleware
app.use(cors());
console.log('CORS enabled.');

app.use(urlencoded({extended: true}));
console.log('Body-parser (urlencoded) middleware configured.');

app.use(express.json());
console.log('Express JSON parser middleware configured.');

// Routes
app.use(BASE_URLS.USER, (req, res, next) => {
    console.log(`[${new Date().toISOString()}] /api/users route accessed`);
    next();
}, userRoutes);

app.use(BASE_URLS.PROJECT, (req, res, next) => {
    console.log(`[${new Date().toISOString()}] /api/project route accessed`);
    next();
}, projectRoutes);

app.use(BASE_URLS.RESUME, (req, res, next) => {
    console.log(`[${new Date().toISOString()}] /api/resume route accessed`);
    next();
}, resumeRoutes);

app.use(BASE_URLS.PROBLEM, (req, res, next) => {
    console.log(`[${new Date().toISOString()}] /api/problem route accessed`);
    next();
}, problemsRoutes);

console.log('Routes have been set up.');

module.exports = app;

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const { DatabaseGenerator } = require('./src/core/generator');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add support for urlencoded form data
app.use(fileUpload()); // Add file upload middleware

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for generating DB APIs
app.post('/api/generate', async (req, res) => {
    try {
        let type, config, autoStart;
        
        // Add super detailed logging
        console.log("---------------------------------------");
        console.log("REQUEST DETAILS:");
        console.log("Content-Type:", req.get('Content-Type'));
        console.log("Body keys:", Object.keys(req.body));
        console.log("Body content:", req.body);
        console.log("Has files:", !!req.files);
        console.log("---------------------------------------");
        
        // Special direct handling for SQLite with createNewDb
        if (req.body.type === 'sqlite') {
            console.log("DIRECT SQLITE HANDLING");
            
            // Get the project name directly
            const projectName = req.body.projectName;
            console.log("Project name from body:", projectName);
            
            if (!projectName) {
                return res.status(400).json({ error: "Project name is required (direct check)" });
            }
            
            type = 'sqlite';
            const createNewDb = req.body.createNewDb === 'true';
            autoStart = req.body.autoStart === 'true';
            
            // Create config directly
            config = {
                projectName: projectName,
                createNewDb: createNewDb
            };
            
            console.log("Using direct SQLite config:", config);
            
            // Handle file upload if needed
            if (!createNewDb && req.files && req.files.dbFile) {
                const dbFile = req.files.dbFile;
                
                // Create uploads directory if it doesn't exist
                const uploadsDir = path.join(__dirname, 'uploads');
                await fs.ensureDir(uploadsDir);
                
                // Generate unique filename
                const dbFilePath = path.join(uploadsDir, `${Date.now()}_${dbFile.name}`);
                
                // Save the uploaded file
                await dbFile.mv(dbFilePath);
                
                // Add file path to config
                config.dbFilePath = dbFilePath;
                console.log("Database file saved to:", dbFilePath);
            }
        }
        // Original form data handling for backward compatibility
        else if (req.get('Content-Type')?.includes('multipart/form-data') || 
                 req.get('Content-Type')?.includes('application/x-www-form-urlencoded')) {
            
            // SQLite form data handling
            type = req.body.type || 'sqlite';
            
            console.log("Form data received:", {
                body: req.body,
                files: req.files ? Object.keys(req.files) : 'none',
                contentType: req.get('Content-Type')
            });
            
            try {
                // Get project name and other data from body
                const projectName = req.body.projectName;
                const createNewDb = req.body.createNewDb === 'true';
                
                if (!projectName) {
                    throw new Error("Project name is required");
                }
                
                // Create config object
                config = {
                    projectName,
                    createNewDb
                };
                
                console.log("Using config from form data:", config);
                
                autoStart = req.body.autoStart === 'true';
                
                // Handle file upload if needed
                if (!createNewDb && req.files && req.files.dbFile) {
                    const dbFile = req.files.dbFile;
                    
                    // Create uploads directory if it doesn't exist
                    const uploadsDir = path.join(__dirname, 'uploads');
                    await fs.ensureDir(uploadsDir);
                    
                    // Generate unique filename
                    const dbFilePath = path.join(uploadsDir, `${Date.now()}_${dbFile.name}`);
                    
                    // Save the uploaded file
                    await dbFile.mv(dbFilePath);
                    
                    // Add file path to config
                    config.dbFilePath = dbFilePath;
                    console.log("Database file saved to:", dbFilePath);
                }
            } catch (error) {
                console.error("Error processing form data:", error);
                return res.status(400).json({ error: error.message });
            }
        } else {
            // Regular JSON request (MySQL/PostgreSQL)
            ({ type, config, autoStart } = req.body);
            
            // Validate project name for JSON requests too
            if (!config || !config.projectName) {
                return res.status(400).json({ error: "Project name is required" });
            }
        }
        
        console.log("Final config before generator:", config);
        console.log("Creating generator with:", { type, config: { ...config, password: '***' }, autoStart });
        const generator = new DatabaseGenerator(type, config, autoStart);
        const result = await generator.generate();
        
        res.json({
            success: true,
            outputPath: result.path,
            running: result.running,
            apiUrl: result.running ? `http://localhost:${result.port}` : null
        });
    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve the UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
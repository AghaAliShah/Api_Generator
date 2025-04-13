const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const TemplateEngine = require('./template-engine');

class DatabaseGenerator {
    constructor(dbType, config, autoStart = false) {
        this.dbType = dbType;
        this.config = config;
        this.autoStart = autoStart;
        this.templatePath = path.join(__dirname, '..', 'generators', dbType);
        this.outputPath = path.join(process.cwd(), 'output', config.projectName);
        
        // Use static counter to assign different ports to each API
        if (!DatabaseGenerator.portCounter) {
            DatabaseGenerator.portCounter = 4000;
        } else {
            DatabaseGenerator.portCounter++;
        }
        this.apiPort = DatabaseGenerator.portCounter;
    }

    async generate() {
        // Create output directory
        await fs.ensureDir(this.outputPath);
        
        // Copy the template files
        await fs.copy(this.templatePath, this.outputPath);
        
        // Update configuration files
        await this.updateConfigs();
        
        // Auto-start if enabled
        if (this.autoStart) {
            await this.installAndStart();
        }
        
        return {
            path: this.outputPath,
            running: this.autoStart,
            port: this.apiPort
        };
    }

    async updateConfigs() {
        // Update package.json with project name
        const packageJsonPath = path.join(this.outputPath, 'package.json');
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJSON(packageJsonPath);
            packageJson.name = this.config.projectName;
            await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
        }
        
        // Create/update .env file with database connection info
        const envPath = path.join(this.outputPath, '.env');
        const envContent = `
DB_HOST=${this.config.host}
DB_PORT=${this.config.port}
DB_USER=${this.config.username}
DB_PASS=${this.config.password}
DB_NAME=${this.config.database}
`;
        await fs.writeFile(envPath, envContent.trim());
        
        console.log(`API generated at: ${this.outputPath}`);
    }
    
    async installAndStart() {
        try {
            console.log('Installing dependencies...');
            execSync('npm install', { 
                cwd: this.outputPath, 
                stdio: 'inherit' 
            });
            
            console.log('Starting API server...');
            
            // Update the port in the generated API's server.js
            const serverFilePath = path.join(this.outputPath, 'server.js');
            if (await fs.pathExists(serverFilePath)) {
                let serverContent = await fs.readFile(serverFilePath, 'utf8');
                
                // Try different potential patterns for the port in server.js
                let updated = false;
                
                // Pattern 1: app.listen(3000, ...)
                if (serverContent.match(/app\.listen\(\d+,/)) {
                    serverContent = serverContent.replace(
                        /app\.listen\(\d+,/,
                        `app.listen(${this.apiPort},`
                    );
                    updated = true;
                }
                
                // Pattern 2: const PORT = ...
                else if (serverContent.match(/const PORT = \d+/)) {
                    serverContent = serverContent.replace(
                        /const PORT = \d+/,
                        `const PORT = ${this.apiPort}`
                    );
                    updated = true;
                }
                
                // Pattern 3: PORT=...
                else if (serverContent.match(/PORT\s*=\s*\d+/)) {
                    serverContent = serverContent.replace(
                        /PORT\s*=\s*\d+/,
                        `PORT = ${this.apiPort}`
                    );
                    updated = true;
                }
                
                // If no pattern matched, add a PORT variable at the top of the file
                if (!updated) {
                    serverContent = `const PORT = ${this.apiPort};\n${serverContent}`;
                }
                
                await fs.writeFile(serverFilePath, serverContent);
                console.log(`Updated server.js to use port ${this.apiPort}`);
            }
            
            // Fix: Use npm.cmd on Windows
            const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
            
            // Start the server in detached mode
            const child = require('child_process').spawn(
                npmCmd,
                ['start'], 
                { 
                    cwd: this.outputPath,
                    detached: true,
                    stdio: 'ignore'
                }
            );
            
            child.unref();
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log(`API server started at http://localhost:${this.apiPort}`);
            return true;
        } catch (error) {
            console.error('Failed to start API server:', error);
            return false;
        }
    }
}

module.exports = { DatabaseGenerator };
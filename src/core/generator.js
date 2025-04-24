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
        
        // Different configuration based on database type
        if (this.dbType === 'sqlite') {
            await this.configureSqlite();
        } else {
            // Create/update .env file with database connection info for MySQL/PostgreSQL
            const envPath = path.join(this.outputPath, '.env');
            const envContent = `
DB_HOST=${this.config.host || 'localhost'}
DB_PORT=${this.config.port || (this.dbType === 'mysql' ? '3306' : '5432')}
DB_USER=${this.config.username || ''}
DB_PASS=${this.config.password || ''}
DB_NAME=${this.config.database || ''}
`;
            await fs.writeFile(envPath, envContent.trim());
        }
        
        console.log(`API generated at: ${this.outputPath}`);
    }
    
    async configureSqlite() {
        // Handle SQLite database file
        let dbFileName = 'database.db';
        
        if (this.config.dbFilePath && await fs.pathExists(this.config.dbFilePath)) {
            // Copy the uploaded database file to the output directory
            dbFileName = path.basename(this.config.dbFilePath);
            const targetDbPath = path.join(this.outputPath, dbFileName);
            await fs.copy(this.config.dbFilePath, targetDbPath);
            console.log(`SQLite database copied from ${this.config.dbFilePath} to ${targetDbPath}`);
        } else if (this.config.createNewDb) {
            // Create a new empty SQLite database or use template
            const templateDbPath = path.join(process.cwd(), 'templates', 'sqlite', 'empty.db');
            const targetDbPath = path.join(this.outputPath, dbFileName);
            
            console.log('Looking for template at:', templateDbPath);
            
            if (await fs.pathExists(templateDbPath)) {
                await fs.copy(templateDbPath, targetDbPath);
                console.log(`Created new SQLite database from template at ${targetDbPath}`);
            } else {
                // Create empty DB file
                await fs.writeFile(targetDbPath, '');
                console.log(`Created empty SQLite database at ${targetDbPath} (template not found)`);
            }
        }
        
        // Update the db.js file to use the correct database file name
        const dbFilePath = path.join(this.outputPath, 'db.js');
        if (await fs.pathExists(dbFilePath)) {
            let dbContent = await fs.readFile(dbFilePath, 'utf8');
            
            // Add better pattern matching for database paths
            if (dbContent.includes('test2.db')) {
                dbContent = dbContent.replace('test2.db', dbFileName);
            } else {
                // Replace any database file reference
                dbContent = dbContent.replace(
                    /(["'])(?:.*?)\.(?:db|sqlite|sqlite3)\1/g,
                    `'${dbFileName}'`
                );
            }
            
            await fs.writeFile(dbFilePath, dbContent);
            console.log(`Updated db.js to use database file: ${dbFileName}`);
        }
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
                
                // Pattern 4: const port = ...
                else if (serverContent.match(/const port = \d+/)) {
                    serverContent = serverContent.replace(
                        /const port = \d+/,
                        `const port = ${this.apiPort}`
                    );
                    updated = true;
                }
                
                // If no pattern matched, add a PORT variable at the top of the file
                if (!updated) {
                    serverContent = `const PORT = ${this.apiPort};\n${serverContent}`;
                }
                
                // Fix the log message to show the correct port
                serverContent = serverContent.replace(
                    /('|"|\`)(?:.*?)localhost:\d+(?:.*?)('|"|\`)/g,
                    `$1http://localhost:${this.apiPort}$2`
                );
                
                await fs.writeFile(serverFilePath, serverContent);
                console.log(`Updated server.js to use port ${this.apiPort}`);
            }
            
            // Special handling for SQLite - direct node command
            if (this.dbType === 'sqlite') {
                console.log('Using direct node command for SQLite API');
                const child = require('child_process').spawn(
                    'node',
                    [path.join(this.outputPath, 'server.js')], 
                    { 
                        detached: true,
                        stdio: 'inherit'  // Show output in the main console for easier debugging
                    }
                );
                
                child.unref();
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                console.log(`SQLite API server started at http://localhost:${this.apiPort}`);
                return true;
            } else {
                // Keep existing logic for other database types
                const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
                
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
            }
        } catch (error) {
            console.error('Failed to start API server:', error);
            return false;
        }
    }
}

module.exports = { DatabaseGenerator };
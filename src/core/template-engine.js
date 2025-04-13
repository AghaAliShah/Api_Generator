const fs = require('fs-extra');
const path = require('path');

class TemplateEngine {
    static async processTemplate(templatePath, outputPath, variables) {
        // Read template content
        let content = await fs.readFile(templatePath, 'utf8');
        
        // Replace variables (format: {{variableName}})
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, value);
        });
        
        // Write processed content to output path
        await fs.writeFile(outputPath, content);
    }
}

module.exports = TemplateEngine;
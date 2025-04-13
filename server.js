// const express = require('express');
// const cors = require('cors');
// const { DatabaseGenerator } = require('./src/core/generator');

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post('/api/generate', async (req, res) => {
//     try {
//         const { type, config } = req.body;
//         const generator = new DatabaseGenerator(type, config);
//         await generator.generate();
        
//         res.json({
//             success: true,
//             outputPath: generator.outputPath
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(5000, () => console.log('Server running on port 5000'));
const express = require('express');
const cors = require('cors');
const path = require('path');
const { DatabaseGenerator } = require('./src/core/generator');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for generating DB APIs
app.post('/api/generate', async (req, res) => {
    try {
        const { type, config, autoStart } = req.body;
        const generator = new DatabaseGenerator(type, config, autoStart);
        const result = await generator.generate();
        
        res.json({
            success: true,
            outputPath: result.path,
            running: result.running,
            apiUrl: result.running ? `http://localhost:${result.port}` : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
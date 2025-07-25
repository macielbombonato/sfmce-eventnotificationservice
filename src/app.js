const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./api/index');
const memoryDB = require('./db/memory');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

// Agendamento da limpeza automática
const CLEAN_DB_SCHEDULE = process.env.CLEAN_DB_SCHEDULE || '59 23 * * *';
function cleanMemoryDB() {
    if (typeof memoryDB.clearAll === 'function') {
        memoryDB.clearAll();
        console.log('Banco de dados in-memory limpo automaticamente.');
    }
}
cron.schedule(CLEAN_DB_SCHEDULE, cleanMemoryDB);


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api', apiRoutes);

// Home route
app.get('/', (req, res) => {
    const data = memoryDB.getAllItems(); // ajuste conforme sua função de acesso
    res.render('index', { data });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// server.js
const express = require('express');
const getConnection = require('./db');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const SECRET = 'your_jwt_secret'; // Change this to a strong secret in production

const ADMIN_USER = 'sirg.researchgroup@gmail.com';
const ADMIN_PASS = 'Lnmiit@14Jaipur'; // Change this in production!

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Helper to run SQL queries
function runQuery(query, params = [], single = false) {
  return new Promise((resolve, reject) => {
    const conn = getConnection();
    conn.query(query, params, (err, results) => {
      conn.end();
      if (err) reject(err);
      else resolve(single ? results[0] : results);
    });
  });
}

// Helper to extract and replace overview in index.html
function extractOverviewFromHTML(html) {
  const match = html.match(/<p class="main-content-text">([\s\S]*?)<\/p>/);
  return match ? match[1].trim() : '';
}

function replaceOverviewInHTML(html, newOverview) {
  return html.replace(
    /(<p class="main-content-text">)[\s\S]*?(<\/p>)/,
    `$1${newOverview}$2`
  );
}

// Admin login route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware to protect admin routes
function authenticateAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// --- Research Verticals ---
app.get('/api/research-verticals', async (req, res) => {
  try {
    const data = await runQuery('SELECT * FROM research_verticals');
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/research-verticals', authenticateAdmin, async (req, res) => {
  const { id, title, description, image_url } = req.body;
  try {
    await runQuery('INSERT INTO research_verticals (id, title, description, image_url) VALUES (?, ?, ?, ?)', [id, title, description, image_url]);
    res.status(201).json({ id, title, description, image_url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/research-verticals/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, image_url } = req.body;
  try {
    await runQuery('UPDATE research_verticals SET title=?, description=?, image_url=? WHERE id=?', [title, description, image_url, id]);
    res.json({ id, title, description, image_url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/research-verticals/:id', authenticateAdmin, async (req, res) => {
  try {
    await runQuery('DELETE FROM research_verticals WHERE id=?', [req.params.id]);
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- People ---
app.get('/api/people', async (req, res) => {
  try { res.json(await runQuery('SELECT * FROM people')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/people', authenticateAdmin, async (req, res) => {
  const { id, name, role, bio, image_url, email, linkedin_url } = req.body;
  try {
    await runQuery('INSERT INTO people (id, name, role, bio, image_url, email, linkedin_url) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, name, role, bio, image_url, email, linkedin_url]);
    res.status(201).json({ id, name, role, bio, image_url, email, linkedin_url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/people/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, role, bio, image_url, email, linkedin_url } = req.body;
  try {
    await runQuery('UPDATE people SET name=?, role=?, bio=?, image_url=?, email=?, linkedin_url=? WHERE id=?', [name, role, bio, image_url, email, linkedin_url, id]);
    res.json({ id, name, role, bio, image_url, email, linkedin_url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/people/:id', authenticateAdmin, async (req, res) => {
  try {
    await runQuery('DELETE FROM people WHERE id=?', [req.params.id]);
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- Projects ---
app.get('/api/projects', async (req, res) => {
  try {
    const data = await runQuery('SELECT * FROM projects');
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/projects', authenticateAdmin, async (req, res) => {
  const { id, title, description, start_date, end_date, status, image_url } = req.body;
  try {
    await runQuery('INSERT INTO projects (id, title, description, start_date, end_date, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, title, description, start_date, end_date, status, image_url]);
    res.status(201).json({ id, title, description, start_date, end_date, status, image_url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/projects/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, status, image_url } = req.body;
  try {
    await runQuery('UPDATE projects SET title=?, description=?, start_date=?, end_date=?, status=?, image_url=? WHERE id=?', [title, description, start_date, end_date, status, image_url, id]);
    res.json({ id, title, description, start_date, end_date, status, image_url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    await runQuery('DELETE FROM projects WHERE id=?', [req.params.id]);
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- Achievements ---
app.get('/api/achievements', async (req, res) => {
  try {
    const data = await runQuery('SELECT * FROM achievements');
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/achievements', authenticateAdmin, async (req, res) => {
  const { id, title, description, date, image_url } = req.body;
  try {
    await runQuery('INSERT INTO achievements (id, title, description, date, image_url) VALUES (?, ?, ?, ?, ?)', [id, title, description, date, image_url]);
    res.status(201).json({ id, title, description, date, image_url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/achievements/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, date, image_url } = req.body;
  try {
    await runQuery('UPDATE achievements SET title=?, description=?, date=?, image_url=? WHERE id=?', [title, description, date, image_url, id]);
    res.json({ id, title, description, date, image_url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/achievements/:id', authenticateAdmin, async (req, res) => {
  try {
    await runQuery('DELETE FROM achievements WHERE id=?', [req.params.id]);
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- Publications ---
app.get('/api/publications', async (req, res) => {
  try {
    const data = await runQuery('SELECT * FROM publications');
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/publications', authenticateAdmin, async (req, res) => {
  const { id, title, authors, journal, year, doi, abstract } = req.body;
  try {
    await runQuery('INSERT INTO publications (id, title, authors, journal, year, doi, abstract) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, title, authors, journal, year, doi, abstract]);
    res.status(201).json({ id, title, authors, journal, year, doi, abstract });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/publications/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, authors, journal, year, doi, abstract } = req.body;
  try {
    await runQuery('UPDATE publications SET title=?, authors=?, journal=?, year=?, doi=?, abstract=? WHERE id=?', [title, authors, journal, year, doi, abstract, id]);
    res.json({ id, title, authors, journal, year, doi, abstract });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/publications/:id', authenticateAdmin, async (req, res) => {
  try {
    await runQuery('DELETE FROM publications WHERE id=?', [req.params.id]);
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- Teaching ---
app.get('/api/teaching', async (req, res) => {
  try {
    const data = await runQuery('SELECT * FROM teaching');
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/teaching', authenticateAdmin, async (req, res) => {
  const { id, course_code, course_name, description, semester, year, course_url, syllabus_url, order_index, is_active } = req.body;
  try {
    await runQuery('INSERT INTO teaching (id, course_code, course_name, description, semester, year, course_url, syllabus_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, course_code, course_name, description, semester, year, course_url, syllabus_url, order_index, is_active]);
    res.status(201).json({ id, course_code, course_name, description, semester, year, course_url, syllabus_url, order_index, is_active });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/teaching/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { course_code, course_name, description, semester, year, course_url, syllabus_url, order_index, is_active } = req.body;
  try {
    await runQuery('UPDATE teaching SET course_code=?, course_name=?, description=?, semester=?, year=?, course_url=?, syllabus_url=?, order_index=?, is_active=? WHERE id=?', [course_code, course_name, description, semester, year, course_url, syllabus_url, order_index, is_active, id]);
    res.json({ id, course_code, course_name, description, semester, year, course_url, syllabus_url, order_index, is_active });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/teaching/:id', authenticateAdmin, async (req, res) => {
  try {
    await runQuery('DELETE FROM teaching WHERE id=?', [req.params.id]);
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- Open Positions ---
app.get('/api/open-positions', async (req, res) => {
  try {
    const data = await runQuery('SELECT * FROM open_positions');
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/open-positions', authenticateAdmin, async (req, res) => {
  const { id, title, description, requirements, deadline, position_type, application_url, order_index, is_active } = req.body;
  try {
    await runQuery('INSERT INTO open_positions (id, title, description, requirements, deadline, position_type, application_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, title, description, requirements, deadline, position_type, application_url, order_index, is_active]);
    res.status(201).json({ id, title, description, requirements, deadline, position_type, application_url, order_index, is_active });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/open-positions/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, requirements, deadline, position_type, application_url, order_index, is_active } = req.body;
  try {
    await runQuery('UPDATE open_positions SET title=?, description=?, requirements=?, deadline=?, position_type=?, application_url=?, order_index=?, is_active=? WHERE id=?', [title, description, requirements, deadline, position_type, application_url, order_index, is_active, id]);
    res.json({ id, title, description, requirements, deadline, position_type, application_url, order_index, is_active });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete('/api/open-positions/:id', authenticateAdmin, async (req, res) => {
  try {
    await runQuery('DELETE FROM open_positions WHERE id=?', [req.params.id]);
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- About (Overview) ---
app.get('/api/about', async (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
    const overview = extractOverviewFromHTML(html);
    res.json({ overview });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/about', authenticateAdmin, async (req, res) => {
  const { overview } = req.body;
  if (!overview || typeof overview !== 'string') {
    return res.status(400).json({ error: "Overview is required." });
  }
  try {
    const filePath = path.join(__dirname, 'public', 'index.html');
    let html = fs.readFileSync(filePath, 'utf8');
    html = replaceOverviewInHTML(html, overview);
    fs.writeFileSync(filePath, html, 'utf8');
    res.json({ overview });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add this route to serve admin.js
app.get('/admin.js', (req, res) => {
  res.sendFile(__dirname + '/admin.js');
});

const port = 3004;
app.listen(port, () => {
  console.log(`Admin server running on port ${port}`);
});
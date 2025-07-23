# Research Group Website

A modern website for research groups to showcase their work, team members, projects, publications, and achievements.

## Features

- Research Verticals showcase
- Team members profiles
- Projects display
- Publications listing
- Achievements showcase
- Responsive design
- Modern UI with Bootstrap 5

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd research-group-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=research_group
PORT=3000
```

4. Set up the database:
```bash
mysql -u your_mysql_username -p < database.sql
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. For production:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
research-group-website/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── db.js
├── database.sql
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/research-verticals` - Get all research verticals
- `GET /api/research-verticals/:id` - Get a specific research vertical
- `GET /api/people` - Get all team members
- `GET /api/projects` - Get all projects
- `GET /api/publications` - Get all publications
- `GET /api/achievements` - Get all achievements

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
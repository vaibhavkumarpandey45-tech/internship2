-- Create database if not exists
CREATE DATABASE research_group;
USE research_group;

-- Users table for authentication
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Research Verticals table
CREATE TABLE research_verticals (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- People table (Team Members)
CREATE TABLE people (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    bio TEXT,
    image_url VARCHAR(255),
    email VARCHAR(255),
    linkedin_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Publications table
CREATE TABLE publications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    authors TEXT,
    journal VARCHAR(255),
    year INT,
    doi VARCHAR(255),
    abstract TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Achievements table
CREATE TABLE achievements (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Teaching table
CREATE TABLE teaching (
    id VARCHAR(50) PRIMARY KEY,
    course_code VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    description TEXT,
    semester VARCHAR(50),
    year INT,
    course_url VARCHAR(255),
    syllabus_url VARCHAR(255),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Open Positions table
CREATE TABLE open_positions (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    deadline DATE,
    position_type VARCHAR(100),
    application_url VARCHAR(255),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Remove the about table if it exists
DROP TABLE IF EXISTS about;

-- Recreate the about table
CREATE TABLE IF NOT EXISTS about (
    id INT PRIMARY KEY AUTO_INCREMENT,
    overview TEXT NOT NULL
);

-- Insert the default overview
INSERT INTO about (overview) VALUES (
'The Symbiotic Intelligence Research Group (SIRG) aims towards transdisciplinary research by augmenting human intelligence with the capabilities of intelligent information systems. The acronym ''SIRG'' is pronounced as ''Surge'', conveying dynamism and a leap towards innovation and progress. Symbiotic intelligence is considered the future of Artificial Intelligence. Our missions is to design, develop, and validate solutions through the deployment of connected and cooperative intelligence by exploring the potential of intelligent communication systems. The group focuses on applied research using cooperation, coordination, and communication techniques to solve problems for autonomous systems.'
);

select * from research_verticals;
select * from people;
select * from projects;
select * from publications;
select * from achievements;
select * from teaching;
select * from open_positions;

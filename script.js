// Mock data for the application
const mockData = {
    'research-verticals': [
        {
            id: '1',
            title: 'Collaborative Data Processing',
            description: 'Collaborative Data Processing (CDP) is an interdisciplinary field focusing on the development of systems, frameworks, and algorithms that enable multiple entities, devices, or agents to work together efficiently in processing, analyzing, and deriving insights from data.',
            status: 'Active'
        },
        {
            id: '2',
            title: 'Internet of Things',
            description: 'The Internet of Things (IoT) is a transformative technology paradigm that connects everyday physical objects, devices, and systems to the internet, enabling them to collect, share, and act on data.',
            status: 'Active'
        },
        {
            id: '3',
            title: 'Multiagent System',
            description: 'Multi-Agent Systems (MAS) is a field of study that focuses on the design, analysis, and application of systems composed of multiple autonomous agents. These agents interact and collaborate to achieve individual or collective goals in dynamic and often complex environments.',
            status: 'Active'
        },
        {
            id: '4',
            title: 'Intelligent Transportation System',
            description: 'Intelligent Transportation Systems (ITS) leverage advanced technologies, including communication, sensing, and data analytics, to enhance the efficiency, safety, and sustainability of transportation networks.',
            status: 'Active'
        },
        {
            id: '5',
            title: 'Unmanned Vehicular Communication',
            description: 'Unmanned Vehicular Communication (UVC) is a research area that focuses on enabling seamless and reliable communication between unmanned vehicles (e.g., drones, autonomous cars, and unmanned ships) and their environment. This field integrates advancements in wireless communication, autonomous systems, and network protocols to support efficient coordination, control, and data exchange in diverse applications.',
            status: 'Active'
        },
        {
            id: '6',
            title: 'Cyber-Physical System',
            description: 'Cyber-Physical Systems (CPS) are advanced systems that integrate computation, networking, and physical processes. These systems enable seamless interaction between the cyber (computational and communication) and physical (real-world) components to monitor, control, and optimize operations in real-time. CPS research focuses on the development of architecture, algorithms, and technologies to create smart, adaptive, and interconnected systems across various domains.',
            status: 'Active'
        },
        {
            id: '7',
            title: 'Artificial Intelligence',
            description: 'Artificial Intelligence (AI) is a multidisciplinary field that focuses on the development of systems capable of performing tasks that typically require human intelligence. These tasks include reasoning, learning, problem-solving, perception, and natural language understanding. AI research aims to create algorithms and models that enable machines to adapt, think, and make decisions autonomously, revolutionizing industries and improving the quality of life.',
            status: 'Active'
        },
        {
            id: '8',
            title: 'Cooperative Communication Protocols',
            description: 'Cooperative Communication Protocols focus on enabling efficient and reliable data transmission by leveraging collaboration among multiple network nodes. These protocols facilitate the sharing of resources and information between nodes to enhance communication performance in terms of throughput, coverage, reliability, and energy efficiency. Cooperative communication is particularly valuable in wireless networks, where challenges such as signal fading, interference, and limited bandwidth are prevalent.',
            status: 'Active'
        },
        {
            id: '9',
            title: 'Human-Centric Autonomous Intelligent Systems',
            description: 'Human-Centric Autonomous Intelligent Systems (HCAIS) focus on designing autonomous technologies that prioritize human needs, values, and interactions. These systems integrate advanced artificial intelligence, robotics, and human-computer interaction (HCI) to create solutions that are intuitive, adaptive, and capable of seamlessly collaborating with humans. HCAIS research emphasizes user-centered design, safety, transparency, and ethical decision-making, ensuring that autonomous systems enhance human capabilities while respecting societal norms.',
            status: 'Active'
        },
        {
            id: '10',
            title: 'Software System Engineering',
            description: 'Software System Engineering is a multidisciplinary field that focuses on the design, development, and maintenance of complex software systems. It combines principles of software engineering, system engineering, and project management to create robust, scalable, and efficient systems that meet the diverse needs of users and industries. Research in software system engineering seeks to improve the methodologies, tools, and processes used to build high-quality software systems, ensuring they are reliable, maintainable, and capable of evolving with technological advancements.',
            status: 'Active'
        }
    ],
    'people': [
        {
            
        }
    ],
    'projects': [
        {
            
        }
    ],
    'publications': [
        {
            
        }
    ],
    'achievements': [
        {
           
        }
    ],
    'project-categories': [
        { id: '1', title: 'AI Applications', description: 'Projects focused on applying artificial intelligence to real-world problems.' },
        { id: '2', title: 'IoT Deployments', description: 'Projects involving Internet of Things devices and systems.' },
        { id: '3', title: 'Autonomous Vehicles', description: 'Projects related to self-driving cars, drones, and other autonomous vehicles.' },
        { id: '4', title: 'Smart Cities', description: 'Projects aimed at developing smart infrastructure and urban solutions.' },
        { id: '5', title: 'Healthcare Tech', description: 'Projects leveraging technology for healthcare and medical applications.' },
        { id: '6', title: 'Robotics', description: 'Projects in the field of robotics and automation.' },
        { id: '7', title: 'Data Science', description: 'Projects focused on data analysis, machine learning, and big data.' }
    ]
};

// Modified fetchData function to use mock data
async function fetchData(endpoint) {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockData[endpoint] || null;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to render research verticals
async function renderResearchVerticals() {
    const data = await fetchData('research-verticals');
    if (!data) return;

    const content = document.getElementById('content');
    content.innerHTML = `
        <h2 class="mb-4">Research Verticals</h2>
        <div class="row">
            ${data.map(vertical => `
                <div class="col-md-4">
                    <div class="card research-vertical-card">
                        ${vertical.image_url ? `<img src="${vertical.image_url}" class="card-img-top" alt="${vertical.title}">` : ''}
                        <div class="card-body">
                            <h5 class="card-title">${vertical.title}</h5>
                            <p class="card-text">${vertical.description}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Function to render people
async function renderPeople() {
    const data = await fetchData('people');
    if (!data) return;

    const content = document.getElementById('content');
    content.innerHTML = `
        <h2 class="mb-4">Our Team</h2>
        <div class="row">
            ${data.map(person => `
                <div class="col-md-4">
                    <div class="card person-card">
                        ${person.image_url ? `<img src="${person.image_url}" alt="${person.name}">` : ''}
                        <div class="card-body">
                            <h5 class="card-title">${person.name}</h5>
                            <p class="card-text">${person.role}</p>
                            <p class="card-text">${person.bio}</p>
                            ${person.email ? `<a href="mailto:${person.email}" class="btn btn-outline-primary">Contact</a>` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Function to render projects
async function renderProjects() {
    const data = await fetchData('projects');
    if (!data) return;

    const content = document.getElementById('content');
    content.innerHTML = `
        <h2 class="mb-4">Our Projects</h2>
        <div class="row">
            ${data.map(project => `
                <div class="col-md-6">
                    <div class="card project-card">
                        ${project.image_url ? `<img src="${project.image_url}" class="card-img-top" alt="${project.title}">` : ''}
                        <div class="card-body">
                            <h5 class="card-title">${project.title}</h5>
                            <p class="card-text">${project.description}</p>
                            <p class="card-text">
                                <small class="text-muted">
                                    ${project.start_date} - ${project.end_date || 'Present'}
                                </small>
                            </p>
                            <span class="badge bg-${project.status === 'Active' ? 'success' : 'secondary'}">${project.status}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Function to render publications
async function renderPublications() {
    const data = await fetchData('publications');
    if (!data) return;

    const content = document.getElementById('content');
    content.innerHTML = `
        <h2 class="mb-4">Publications</h2>
        <div class="list-group">
            ${data.map(pub => `
                <div class="publication-item">
                    <h5>${pub.title}</h5>
                    <p class="mb-1">${pub.authors}</p>
                    <p class="mb-1"><em>${pub.journal}</em> (${pub.year})</p>
                    ${pub.doi ? `<a href="https://doi.org/${pub.doi}" target="_blank" class="btn btn-sm btn-outline-primary">View Paper</a>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// Function to render achievements
async function renderAchievements() {
    const data = await fetchData('achievements');
    if (!data) return;

    const content = document.getElementById('content');
    content.innerHTML = `
        <h2 class="mb-4">Achievements</h2>
        <div class="row">
            ${data.map(achievement => `
                <div class="col-md-4">
                    <div class="card achievement-card">
                        ${achievement.image_url ? `<img src="${achievement.image_url}" class="card-img-top" alt="${achievement.title}">` : ''}
                        <div class="card-body">
                            <h5 class="card-title">${achievement.title}</h5>
                            <p class="card-text">${achievement.description}</p>
                            <p class="card-text"><small class="text-muted">${achievement.date}</small></p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Route handling
function handleRoute() {
    const path = window.location.pathname;
    switch (path) {
        case '/research-verticals':
            renderResearchVerticals();
            break;
        case '/people':
            renderPeople();
            break;
        case '/projects':
            renderProjects();
            break;
        case '/publications':
            renderPublications();
            break;
        case '/achievements':
            renderAchievements();
            break;
        default:
            renderResearchVerticals(); // Default to research verticals
    }
}

// Function to populate tables with data
async function populateTables() {
    try {
        // Populate Research Verticals Table
        const verticalsData = await fetchData('research-verticals');
        if (verticalsData) {
            const tbody = document.getElementById('researchVerticalsTable');
            tbody.innerHTML = verticalsData.map(item => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.title}</td>
                    <td>${item.description}</td>
                    <td><span class="badge bg-${item.status === 'Active' ? 'success' : 'secondary'}">${item.status}</span></td>
                </tr>
            `).join('');
        }

        // Populate People Table
        const peopleData = await fetchData('people');
        if (peopleData) {
            const tbody = document.getElementById('peopleTable');
            tbody.innerHTML = peopleData.map(item => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.role}</td>
                    <td><a href="mailto:${item.email}">${item.email}</a></td>
                    <td>${item.department}</td>
                </tr>
            `).join('');
        }

        // Populate Projects Table (if authenticated)
        if (isAuthenticated) {
            const projectsData = await fetchData('projects');
            if (projectsData) {
                const tbody = document.getElementById('projectsTable');
                tbody.innerHTML = projectsData.map(item => `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.title}</td>
                        <td>${item.description}</td>
                        <td>${new Date(item.start_date).toLocaleDateString()}</td>
                        <td>${item.end_date ? new Date(item.end_date).toLocaleDateString() : 'Present'}</td>
                        <td><span class="badge bg-${item.status === 'Active' ? 'success' : 'secondary'}">${item.status}</span></td>
                    </tr>
                `).join('');
            }
        }

        // Populate Publications Table (if authenticated)
        if (isAuthenticated) {
            const publicationsData = await fetchData('publications');
            if (publicationsData) {
                const tbody = document.getElementById('publicationsTable');
                tbody.innerHTML = publicationsData.map(item => `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.title}</td>
                        <td>${item.authors}</td>
                        <td>${item.journal}</td>
                        <td>${item.year}</td>
                        <td>${item.doi ? `<a href="https://doi.org/${item.doi}" target="_blank">${item.doi}</a>` : 'N/A'}</td>
                    </tr>
                `).join('');
            }
        }

        // Populate Achievements Table (if authenticated)
        if (isAuthenticated) {
            const achievementsData = await fetchData('achievements');
            if (achievementsData) {
                const tbody = document.getElementById('achievementsTable');
                tbody.innerHTML = achievementsData.map(item => `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.title}</td>
                        <td>${item.description}</td>
                        <td>${new Date(item.date).toLocaleDateString()}</td>
                        <td><span class="badge bg-info">${item.category}</span></td>
                    </tr>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error populating tables:', error);
    }
}

// Add live search for research verticals
function setupResearchVerticalsSearch() {
    const searchBox = document.getElementById('researchSearch');
    const list = document.getElementById('researchVerticalsList');
    const noMsg = document.getElementById('noResearchVerticalsMsg');
    if (!searchBox || !list) return;

    searchBox.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        let found = false;
        // Hide all cards initially
        list.querySelectorAll('.col-12').forEach(card => {
            // Only search in title and description
            const title = card.querySelector('.research-vertical-title')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.research-vertical-content')?.textContent.toLowerCase() || '';
            if (title.includes(query) || desc.includes(query)) {
                card.style.display = '';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });
        // Show/hide no results message
        if (!found) {
            noMsg.style.display = 'block';
        } else {
            noMsg.style.display = 'none';
        }
    });
}

// Add live search for project categories in the Projects section
function setupProjectCategoriesSearch() {
    const searchBox = document.getElementById('projectCategorySearch');
    const list = document.getElementById('projectCategoriesList');
    const noMsg = document.getElementById('noProjectCategoriesMsg');
    if (!searchBox || !list) return;
    searchBox.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        let found = false;
        // Only filter the research-vertical-card children (not the noMsg div)
        const cards = Array.from(list.getElementsByClassName('research-vertical-card'));
        cards.forEach(card => {
            const heading = card.querySelector('.research-vertical-title')?.textContent.toLowerCase() || '';
            // Gather all bullet texts
            const bullets = Array.from(card.querySelectorAll('.bullet-text')).map(el => el.textContent.toLowerCase());
            // Match if query is in heading or any bullet
            const match = heading.includes(query) || bullets.some(text => text.includes(query));
            if (match) {
                card.style.display = '';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });
        if (!found) {
            if (noMsg) noMsg.style.display = 'block';
        } else {
            if (noMsg) noMsg.style.display = 'none';
        }
    });
}

// Add live search for achievements in the Achievements section
function setupAchievementsSearch() {
    const searchBox = document.getElementById('achievementSearch');
    const list = document.getElementById('achievementsList');
    const noMsg = document.getElementById('noAchievementsMsg');
    if (!searchBox || !list) return;
    searchBox.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        let found = false;
        // Only filter the achievement-card children
        const cards = Array.from(list.getElementsByClassName('achievement-card'));
        cards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
            const match = title.includes(query) || desc.includes(query);
            if (match) {
                card.parentElement.style.display = '';
                found = true;
            } else {
                card.parentElement.style.display = 'none';
            }
        });
        if (!found) {
            if (noMsg) noMsg.style.display = 'block';
        } else {
            if (noMsg) noMsg.style.display = 'none';
        }
    });
}

// Add live search for publications in the Publications section
function setupPublicationsSearch() {
    const searchBox = document.getElementById('publicationSearch');
    const list = document.getElementById('publicationsList');
    const noMsg = document.getElementById('noPublicationsMsg');
    // Also select the research-vertical-card publication cards
    const pubCards = Array.from(document.querySelectorAll('#publications .research-vertical-card'));
    if (!searchBox || !list) return;
    searchBox.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        let found = false;
        // Filter publication-item children
        const items = Array.from(list.getElementsByClassName('publication-item'));
        let itemFound = false;
        items.forEach(item => {
            const title = item.querySelector('h5')?.textContent.toLowerCase() || '';
            const authors = item.querySelectorAll('p')[0]?.textContent.toLowerCase() || '';
            const journal = item.querySelectorAll('p')[1]?.textContent.toLowerCase() || '';
            const match = title.includes(query) || authors.includes(query) || journal.includes(query);
            if (match) {
                item.style.display = '';
                itemFound = true;
            } else {
                item.style.display = 'none';
            }
        });
        // Filter research-vertical-card publication cards
        let cardFound = false;
        pubCards.forEach(card => {
            // Check if any bullet-text inside matches
            const heading = card.querySelector('.research-vertical-title')?.textContent.toLowerCase() || '';
            const bullets = Array.from(card.querySelectorAll('.bullet-text')).map(el => el.textContent.toLowerCase());
            const match = heading.includes(query) || bullets.some(text => text.includes(query));
            if (match) {
                card.style.display = '';
                cardFound = true;
            } else {
                card.style.display = 'none';
            }
        });
        found = itemFound || cardFound;
        if (!found) {
            if (noMsg) noMsg.style.display = 'block';
        } else {
            if (noMsg) noMsg.style.display = 'none';
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    handleRoute();
    populateTables();
    setupResearchVerticalsSearch();
    setupProjectCategoriesSearch();
    setupAchievementsSearch();
    setupPublicationsSearch();
    // Handle navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = e.target.getAttribute('href');
            window.history.pushState({}, '', path);
            handleRoute();
        });
    });
});

// Update loadProtectedContent to also populate tables
async function loadProtectedContent() {
    try {
        await populateTables(); // Add this line to refresh tables when protected content is loaded
    } catch (error) {
        console.error('Error loading protected content:', error);
        alert('Error loading protected content. Please try refreshing the page.');
    }
}

// Ensure About is the default active section and navigation order matches the new layout. No code change needed if logic is based on data-section attributes, but set About as default if not already.
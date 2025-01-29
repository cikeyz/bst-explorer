// Theme handling
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function updateTheme(isDark) {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateCytoscapeTheme(isDark);
}

function getCytoscapeStyles(isDark) {
    return [
        {
            selector: 'node',
            style: {
                'background-color': isDark ? '#3CAB6E' : '#2E8B57',
                'label': 'data(label)',
                'color': '#fff',
                'text-valign': 'center',
                'text-halign': 'center',
                'width': '45px',
                'height': '45px',
                'font-size': '16px',
                'font-weight': 'bold',
                'border-width': '3px',
                'border-color': isDark ? '#2E8B57' : '#1F704D',
                'text-outline-width': 2,
                'text-outline-color': isDark ? '#2E8B57' : '#1F704D'
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': isDark ? '#355C4B' : '#98FB98',
                'curve-style': 'straight',
                'target-arrow-shape': 'none',
                'arrow-scale': 2
            }
        }
    ];
}

function updateCytoscapeTheme(isDark) {
    if (cy) {
        cy.style(getCytoscapeStyles(isDark));
    }
}

// Initialize Cytoscape instance
let cy = cytoscape({
    container: document.getElementById('tree-visualization'),
    style: getCytoscapeStyles(document.body.getAttribute('data-theme') === 'dark'),
    layout: {
        name: 'dagre',
        rankDir: 'TB',
        nodeSep: 80,
        rankSep: 100,
        animate: true,
        animationDuration: 500,
        fit: true,
        padding: 50
    },
    wheelSensitivity: 0.3
});

// Initialize theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    updateTheme(savedTheme === 'dark');
} else {
    updateTheme(prefersDarkScheme.matches);
}

// Theme toggle button
themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'light';
    updateTheme(isDark);
});

// Listen for system theme changes
prefersDarkScheme.addListener((e) => {
    if (!localStorage.getItem('theme')) {
        updateTheme(e.matches);
    }
});

// DOM Elements
const numbersInput = document.getElementById('numbers-input');
const generateRandomBtn = document.getElementById('generate-random');
const buildTreeBtn = document.getElementById('build-tree');
const postOrderResult = document.getElementById('postOrder');
const preOrderResult = document.getElementById('preOrder');
const inOrderResult = document.getElementById('inOrder');

// Generate random numbers
function generateRandomNumbers() {
    const numbers = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 1);
    numbersInput.value = numbers.join(' ');
}

// Validate input
function validateInput(input) {
    const numbers = input.trim().split(/\s+/).map(Number);
    if (numbers.length > 30) {
        alert('Please enter at most 30 numbers.');
        return null;
    }
    if (numbers.some(isNaN)) {
        alert('Please enter valid integers only.');
        return null;
    }
    return numbers;
}

// Build and visualize the tree
async function buildAndVisualizeTree() {
    const numbers = validateInput(numbersInput.value);
    if (!numbers) return;

    try {
        const response = await fetch('/build_tree', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ numbers })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        updateVisualization(data.elements);
        // Clear all traversal results
        postOrderResult.textContent = '';
        preOrderResult.textContent = '';
        inOrderResult.textContent = '';
    } catch (error) {
        console.error('Error:', error);
        alert('Error building tree. Please try again.');
    }
}

// Update tree visualization
function updateVisualization(elements) {
    cy.elements().remove();
    cy.add(elements);
    cy.layout({
        name: 'dagre',
        rankDir: 'TB',
        nodeSep: 80,
        rankSep: 100,
        animate: true,
        animationDuration: 500,
        fit: true,
        padding: 50
    }).run();
    cy.fit();
    cy.center();
}

// Get traversal
async function getTraversal(type, elementId) {
    try {
        const response = await fetch(`/traversal/${type}`, {
            method: 'GET'
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        document.getElementById(elementId).textContent = data.result.join(' → ');
    } catch (error) {
        console.error('Error:', error);
        alert('Error getting traversal. Please try again.');
    }
}

// Update all traversals
async function updateTraversals() {
    await Promise.all([
        getTraversal('lrt', 'postOrder'),
        getTraversal('tlr', 'preOrder'),
        getTraversal('ltr', 'inOrder')
    ]);
}

// Event Listeners
generateRandomBtn.addEventListener('click', generateRandomNumbers);
buildTreeBtn.addEventListener('click', async () => {
    await buildAndVisualizeTree();
    await updateTraversals();
});

// Node hover effects
cy.on('mouseover', 'node', function(e) {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    e.target.style({
        'background-color': isDark ? '#4FBE81' : '#3CAB6E',
        'border-color': isDark ? '#3CAB6E' : '#2E8B57',
        'text-outline-color': isDark ? '#3CAB6E' : '#2E8B57'
    });
});

cy.on('mouseout', 'node', function(e) {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    e.target.style({
        'background-color': isDark ? '#3CAB6E' : '#2E8B57',
        'border-color': isDark ? '#2E8B57' : '#1F704D',
        'text-outline-color': isDark ? '#2E8B57' : '#1F704D'
    });
});

// Enable panning and zooming with better defaults
cy.panzoom({
    zoomFactor: 0.05,
    zoomDelay: 45,
    minZoom: 0.1,
    maxZoom: 10,
    fitPadding: 50
});

// Center and fit the graph initially
cy.ready(() => {
    cy.fit();
    cy.center();
});

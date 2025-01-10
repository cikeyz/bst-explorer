// Initialize Cytoscape instance
let cy = cytoscape({
    container: document.getElementById('tree-visualization'),
    style: [
        {
            selector: 'node',
            style: {
                'background-color': '#4CAF50',
                'label': 'data(label)',
                'color': '#fff',
                'text-valign': 'center',
                'text-halign': 'center',
                'width': '45px',
                'height': '45px',
                'font-size': '16px',
                'font-weight': 'bold',
                'border-width': '3px',
                'border-color': '#388E3C',
                'text-outline-width': 2,
                'text-outline-color': '#388E3C'
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#78909C',
                'curve-style': 'straight',
                'target-arrow-shape': 'none',
                'arrow-scale': 2
            }
        }
    ],
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

// DOM Elements
const numbersInput = document.getElementById('numbers-input');
const generateRandomBtn = document.getElementById('generate-random');
const buildTreeBtn = document.getElementById('build-tree');
const lrtBtn = document.getElementById('lrt-btn');
const tlrBtn = document.getElementById('tlr-btn');
const ltrBtn = document.getElementById('ltr-btn');
const traversalResult = document.getElementById('traversal-result');

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
        traversalResult.textContent = '';
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
async function getTraversal(type) {
    try {
        const response = await fetch(`/traversal/${type}`, {
            method: 'GET'
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        traversalResult.textContent = `${type.toUpperCase()}: ${data.result.join(' → ')}`;
    } catch (error) {
        console.error('Error:', error);
        alert('Error getting traversal. Please try again.');
    }
}

// Event Listeners
generateRandomBtn.addEventListener('click', generateRandomNumbers);
buildTreeBtn.addEventListener('click', buildAndVisualizeTree);
lrtBtn.addEventListener('click', () => getTraversal('lrt'));
tlrBtn.addEventListener('click', () => getTraversal('tlr'));
ltrBtn.addEventListener('click', () => getTraversal('ltr'));

// Add zoom controls
cy.on('mouseover', 'node', function(e) {
    e.target.style({
        'background-color': '#2196F3',
        'border-color': '#1976D2',
        'text-outline-color': '#1976D2'
    });
});

cy.on('mouseout', 'node', function(e) {
    e.target.style({
        'background-color': '#4CAF50',
        'border-color': '#388E3C',
        'text-outline-color': '#388E3C'
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
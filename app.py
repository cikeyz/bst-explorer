from flask import Flask, request, jsonify, send_from_directory
import os

# ----------------------- AVL Tree Implementation -----------------------

class TreeNode:
    """Node of the AVL tree."""
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.height = 1  # Height of the node (for balancing)

def get_height(node):
    """Get the height of a node."""
    if not node:
        return 0
    return node.height

def get_balance(node):
    """Get the balance factor of a node."""
    if not node:
        return 0
    return get_height(node.left) - get_height(node.right)

def update_height(node):
    """Update the height of a node."""
    if not node:
        return
    node.height = max(get_height(node.left), get_height(node.right)) + 1

def right_rotate(y):
    """Right rotation."""
    x = y.left
    T2 = x.right

    x.right = y
    y.left = T2

    update_height(y)
    update_height(x)

    return x

def left_rotate(x):
    """Left rotation."""
    y = x.right
    T2 = y.left

    y.left = x
    x.right = T2

    update_height(x)
    update_height(y)

    return y

def insert_into_avl(root, val):
    """Insert a value into the AVL tree maintaining balance."""
    # Standard BST insert
    if not root:
        return TreeNode(val)

    if val < root.val:
        root.left = insert_into_avl(root.left, val)
    else:
        root.right = insert_into_avl(root.right, val)

    # Update height of current node
    update_height(root)

    # Get balance factor
    balance = get_balance(root)

    # Left Left Case
    if balance > 1 and val < root.left.val:
        return right_rotate(root)

    # Right Right Case
    if balance < -1 and val >= root.right.val:
        return left_rotate(root)

    # Left Right Case
    if balance > 1 and val >= root.left.val:
        root.left = left_rotate(root.left)
        return right_rotate(root)

    # Right Left Case
    if balance < -1 and val < root.right.val:
        root.right = right_rotate(root.right)
        return left_rotate(root)

    return root

def insert_into_bst(root, val):
    """Insert a value into a regular BST."""
    if not root:
        return TreeNode(val)

    if val < root.val:
        root.left = insert_into_bst(root.left, val)
    else:
        root.right = insert_into_bst(root.right, val)

    return root

def build_balanced_bst(values):
    """Build a BST from a list of values, using the first value as root."""
    if not values:
        return None
    
    root = TreeNode(values[0])  # First value becomes root
    for val in values[1:]:
        root = insert_into_bst(root, val)  # Use regular BST insertion
    
    return root

def preorder_traversal(root, result=None):
    """TLR (Top-Left-Right) traversal."""
    if result is None:
        result = []
    if root:
        result.append(root.val)
        preorder_traversal(root.left, result)
        preorder_traversal(root.right, result)
    return result

def inorder_traversal(root, result=None):
    """LTR (Left-Top-Right) traversal."""
    if result is None:
        result = []
    if root:
        inorder_traversal(root.left, result)
        result.append(root.val)
        inorder_traversal(root.right, result)
    return result

def postorder_traversal(root, result=None):
    """LRT (Left-Right-Top) traversal."""
    if result is None:
        result = []
    if root:
        postorder_traversal(root.left, result)
        postorder_traversal(root.right, result)
        result.append(root.val)
    return result

def build_cytoscape_elements(root):
    """Build elements for Cytoscape visualization."""
    elements = []
    if not root:
        return elements
    
    queue = [(root, 0, None)]  # (node, unique_id, parent_id)
    unique_id_counter = 0

    while queue:
        node, node_id, parent_id = queue.pop(0)
        # Create node element
        elements.append({
            'data': {'id': str(node_id), 'label': str(node.val)}
        })
        # Create edge from parent if exists
        if parent_id is not None:
            elements.append({
                'data': {'source': str(parent_id), 'target': str(node_id)}
            })
        
        # Add children to queue
        if node.left:
            unique_id_counter += 1
            queue.append((node.left, unique_id_counter, node_id))
        if node.right:
            unique_id_counter += 1
            queue.append((node.right, unique_id_counter, node_id))

    return elements

# ----------------------- Flask Application -----------------------

app = Flask(__name__)

# Store the current BST in memory
current_bst = None

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/build_tree', methods=['POST'])
def build_tree():
    global current_bst
    try:
        data = request.json
        numbers = data.get('numbers', [])
        
        # Build the BST
        current_bst = build_balanced_bst(numbers)
        
        # Get elements for visualization
        elements = build_cytoscape_elements(current_bst)
        
        return jsonify({'elements': elements})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/traversal/<traversal_type>', methods=['GET'])
def get_traversal(traversal_type):
    global current_bst
    if not current_bst:
        return jsonify({'error': 'No tree has been built yet'}), 400
    
    try:
        result = []
        if traversal_type == 'lrt':
            result = postorder_traversal(current_bst)
        elif traversal_type == 'tlr':
            result = preorder_traversal(current_bst)
        elif traversal_type == 'ltr':
            result = inorder_traversal(current_bst)
        else:
            return jsonify({'error': 'Invalid traversal type'}), 400
        
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000) 
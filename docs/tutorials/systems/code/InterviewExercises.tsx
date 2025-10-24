// systems/code/InterviewExercises.tsx
// Time-boxed exercises for technical interviews and rapid prototyping

import React, { useState, useEffect } from "react";

// ============================================================================
// EXERCISE 1: 30-Minute Todo App
// ============================================================================

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Add todo
  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  // Toggle completion
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Todo App</h1>

      {/* Add todo form */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a todo..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Todo list */}
      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center gap-3 p-3 bg-white border rounded-lg ${
              todo.completed ? "opacity-50" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="h-5 w-5"
            />
            <span className={`flex-1 ${todo.completed ? "line-through" : ""}`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {todos.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No todos yet. Add one above!
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXERCISE 2: 45-Minute User Directory
// ============================================================================

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export function UserDirectory() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  // Mock data - in real interview, this would be an API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "admin",
        avatar: "https://via.placeholder.com/64",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user",
        avatar: "https://via.placeholder.com/64",
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob@example.com",
        role: "moderator",
        avatar: "https://via.placeholder.com/64",
      },
      {
        id: 4,
        name: "Alice Brown",
        email: "alice@example.com",
        role: "user",
        avatar: "https://via.placeholder.com/64",
      },
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">User Directory</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Results count */}
      <div className="mb-4 text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* User grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white p-6 rounded-lg shadow border border-gray-200"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg text-center mb-2">
              {user.name}
            </h3>
            <p className="text-gray-600 text-center mb-2">{user.email}</p>
            <div className="text-center">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-800"
                    : user.role === "moderator"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No users found matching your criteria.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXERCISE 3: 60-Minute E-commerce Product List
// ============================================================================

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export function EcommerceApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCart, setShowCart] = useState(false);

  // Mock data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Laptop",
        price: 999,
        image: "https://via.placeholder.com/200",
        category: "electronics",
      },
      {
        id: 2,
        name: "Smartphone",
        price: 699,
        image: "https://via.placeholder.com/200",
        category: "electronics",
      },
      {
        id: 3,
        name: "Coffee Maker",
        price: 89,
        image: "https://via.placeholder.com/200",
        category: "appliances",
      },
      {
        id: 4,
        name: "Running Shoes",
        price: 120,
        image: "https://via.placeholder.com/200",
        category: "clothing",
      },
      {
        id: 5,
        name: "Book",
        price: 15,
        image: "https://via.placeholder.com/200",
        category: "books",
      },
    ];
    setProducts(mockProducts);
  }, []);

  // Filter products
  const filteredProducts = products.filter(
    (product) =>
      selectedCategory === "all" || product.category === selectedCategory
  );

  // Add to cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // Remove from cart
  const removeFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  // Update quantity
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Calculate totals
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">E-commerce Store</h1>
        <button
          onClick={() => setShowCart(true)}
          className="relative px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Cart ({cartItemCount})
        </button>
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white p-6 rounded-lg shadow border border-gray-200"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Your cart is empty
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-gray-600">${item.product.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-semibold">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

export function ExerciseExamples() {
  const [currentExercise, setCurrentExercise] = useState("todo");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Interview Exercises</h1>

      {/* Exercise selector */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setCurrentExercise("todo")}
          className={`px-4 py-2 rounded-lg ${
            currentExercise === "todo"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          30-Min Todo App
        </button>
        <button
          onClick={() => setCurrentExercise("users")}
          className={`px-4 py-2 rounded-lg ${
            currentExercise === "users"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          45-Min User Directory
        </button>
        <button
          onClick={() => setCurrentExercise("ecommerce")}
          className={`px-4 py-2 rounded-lg ${
            currentExercise === "ecommerce"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          60-Min E-commerce
        </button>
      </div>

      {/* Render selected exercise */}
      {currentExercise === "todo" && <TodoApp />}
      {currentExercise === "users" && <UserDirectory />}
      {currentExercise === "ecommerce" && <EcommerceApp />}
    </div>
  );
}

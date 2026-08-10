import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Layers,
  Package,
  Users,
  Star,
  Plus,
  Trash2,
  LogIn,
  LogOut,
  ShoppingCart,
  Search,
  Truck
} from 'lucide-react';
import { api } from './api';
import type { User, Category, Product, Order } from './api';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'categories' | 'orders' | 'users'>('catalog');
  
  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  
  // Cart state
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  
  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState<Product | null>(null);
  
  // Form states
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'USER' as 'USER' | 'ADMIN' });
  const [productForm, setProductForm] = useState({ title: '', description: '', price: '', stock: '10', categoryId: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  
  // Notification toast
  const [toast, setToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Initial load
  useEffect(() => {
    fetchProfile();
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategoryFilter, searchQuery]);

  useEffect(() => {
    if (activeTab === 'orders' && user) loadOrders();
    if (activeTab === 'users' && user?.role === 'ADMIN') loadUsers();
  }, [activeTab, user]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await api.getProfile();
      if (res.success && res.data) setUser(res.data);
    } catch (e) {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.getCategories();
      if (res.success && res.data) setCategories(res.data);
    } catch (e: any) {
      console.error(e);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.getProducts({
        categoryId: selectedCategoryFilter || undefined,
        search: searchQuery || undefined,
      });
      if (res.success && res.data) setProducts(res.data);
    } catch (e: any) {
      console.error(e);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await api.getOrders();
      if (res.success && res.data) setOrders(res.data);
    } catch (e: any) {
      console.error(e);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.getUsers();
      if (res.success && res.data) setUsersList(res.data);
    } catch (e: any) {
      console.error(e);
    }
  };

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegisterMode) {
        const res = await api.register(authForm);
        if (res.success && res.data) {
          localStorage.setItem('token', res.data.token);
          setUser(res.data.user);
          showNotification('Registration successful! Welcome aboard.');
        }
      } else {
        const res = await api.login({ email: authForm.email, password: authForm.password });
        if (res.success && res.data) {
          localStorage.setItem('token', res.data.token);
          setUser(res.data.user);
          showNotification('Login successful!');
        }
      }
      setShowAuthModal(false);
    } catch (err: any) {
      showNotification(`Auth Error: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart([]);
    showNotification('Logged out successfully.');
  };

  // Product Handlers
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createProduct({
        title: productForm.title,
        description: productForm.description,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        categoryId: productForm.categoryId || categories[0]?.id,
      });
      if (res.success) {
        showNotification('Product created successfully!');
        setShowProductModal(false);
        setProductForm({ title: '', description: '', price: '', stock: '10', categoryId: '' });
        loadProducts();
      }
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to soft-delete this product?')) return;
    try {
      await api.deleteProduct(id);
      showNotification('Product soft deleted.');
      loadProducts();
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    }
  };

  // Category Handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createCategory(categoryForm);
      if (res.success) {
        showNotification('Category created!');
        setShowCategoryModal(false);
        setCategoryForm({ name: '', description: '' });
        loadCategories();
      }
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete category?')) return;
    try {
      await api.deleteCategory(id);
      showNotification('Category deleted.');
      loadCategories();
      loadProducts();
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    }
  };

  // Review Handlers
  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReviewModal) return;
    try {
      const res = await api.createReview({
        productId: showReviewModal.id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      if (res.success) {
        showNotification('Review posted successfully!');
        setShowReviewModal(null);
        setReviewForm({ rating: 5, comment: '' });
        loadProducts();
      }
    } catch (err: any) {
      showNotification(`Review Error: ${err.message}`);
    }
  };

  // Cart & Order Handlers
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showNotification(`Added "${product.title}" to cart!`);
  };

  const handleCheckout = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (cart.length === 0) return;

    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const items = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    try {
      const res = await api.createOrder({ items, totalAmount });
      if (res.success) {
        showNotification('Order placed successfully!');
        setCart([]);
        setActiveTab('orders');
      }
    } catch (err: any) {
      showNotification(`Checkout Error: ${err.message}`);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      showNotification(`Order status changed to ${status}`);
      loadOrders();
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Soft delete user?')) return;
    try {
      await api.deleteUser(userId);
      showNotification('User soft deleted.');
      loadUsers();
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && <div className="toast">{toast}</div>}

      {/* Glassmorphic Navbar */}
      <nav className="navbar">
        <div className="brand">
          <ShoppingBag className="w-8 h-8 text-indigo-400" />
          <span>SCIC Express Shop</span>
        </div>

        <div className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <Package size={18} /> Products
          </button>
          <button
            className={`nav-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Layers size={18} /> Categories
          </button>
          {user && (
            <button
              className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Truck size={18} /> Orders
            </button>
          )}
          {user?.role === 'ADMIN' && (
            <button
              className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} /> Admin Users
            </button>
          )}

          {/* Cart Counter */}
          <button
            className="btn-secondary"
            style={{ position: 'relative', marginLeft: '12px' }}
            onClick={handleCheckout}
          >
            <ShoppingCart size={18} />
            Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
          </button>

          {/* User Auth Info */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
              <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                {user.name} ({user.role})
              </span>
              <button className="btn-danger" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <button
              className="btn-primary"
              style={{ marginLeft: '12px' }}
              onClick={() => {
                setIsRegisterMode(false);
                setShowAuthModal(true);
              }}
            >
              <LogIn size={18} /> Login / Register
            </button>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      {activeTab === 'catalog' && (
        <div>
          {/* Header Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '600px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Search
                  size={18}
                  style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }}
                />
              </div>
              <select
                className="select-control"
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                style={{ width: '200px' }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {user?.role === 'ADMIN' && (
              <button className="btn-primary" onClick={() => setShowProductModal(true)}>
                <Plus size={18} /> Add New Product
              </button>
            )}
          </div>

          {/* Product Cards Grid */}
          <div className="grid-cards">
            {products.map((product) => (
              <div key={product.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge badge-user">{product.category?.name || 'Uncategorized'}</span>
                  <span className={`badge ${product.status === 'AVAILABLE' ? 'badge-available' : 'badge-out'}`}>
                    {product.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>{product.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px', flex: 1 }}>
                  {product.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Stock: {product.stock}</span>
                </div>

                {/* Reviews Summary */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
                      Reviews ({product.reviews?.length || 0})
                    </span>
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      onClick={() => setShowReviewModal(product)}
                    >
                      <Star size={14} /> Review
                    </button>
                  </div>
                  {product.reviews && product.reviews.length > 0 && (
                    <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#94a3b8' }}>
                      <em>"{product.reviews[0].comment}"</em> - {product.reviews[0].user?.name}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={() => addToCart(product)}>
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                  {user?.role === 'ADMIN' && (
                    <button className="btn-danger" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Categories Overview</h2>
            {user?.role === 'ADMIN' && (
              <button className="btn-primary" onClick={() => setShowCategoryModal(true)}>
                <Plus size={18} /> Add Category
              </button>
            )}
          </div>

          <div className="grid-cards">
            {categories.map((cat) => (
              <div key={cat.id} className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{cat.name}</h3>
                  <span className="badge badge-admin">{cat._count?.products || 0} Products</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {cat.description || 'No description provided.'}
                </p>
                {user?.role === 'ADMIN' && (
                  <button className="btn-danger" onClick={() => handleDeleteCategory(cat.id)}>
                    <Trash2 size={16} /> Soft Delete Category
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
            {user?.role === 'ADMIN' ? 'All Customer Orders' : 'My Orders'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((ord) => (
              <div key={ord.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700 }}>Order #{ord.id.slice(0, 8)}</span>
                    <span className={`badge badge-${ord.status.toLowerCase()}`}>{ord.status}</span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    Placed by: <strong>{ord.user?.name || ord.userId}</strong> | Date: {new Date(ord.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>
                    ${ord.totalAmount.toFixed(2)}
                  </span>
                  {user?.role === 'ADMIN' && (
                    <select
                      className="select-control"
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      style={{ width: '150px' }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN USERS TAB */}
      {activeTab === 'users' && user?.role === 'ADMIN' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Registered Users Management</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {usersList.map((u) => (
              <div key={u.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{u.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{u.email}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span>
                  <button className="btn-danger" onClick={() => handleDeleteUser(u.id)}>
                    <Trash2 size={16} /> Delete User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* 1. AUTH MODAL */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
              {isRegisterMode ? 'Create Account' : 'Welcome Back'}
            </h2>
            <form onSubmit={handleAuthSubmit}>
              {isRegisterMode && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="input-control"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  />
                </div>
              )}
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="input-control"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="input-control"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
              </div>
              {isRegisterMode && (
                <div className="form-group">
                  <label>Account Role</label>
                  <select
                    className="select-control"
                    value={authForm.role}
                    onChange={(e) => setAuthForm({ ...authForm, role: e.target.value as any })}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsRegisterMode(!isRegisterMode)}>
                  {isRegisterMode ? 'Already have account?' : 'Need account?'}
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowAuthModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {isRegisterMode ? 'Register' : 'Login'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PRODUCT MODAL */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Add New Product</h2>
            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label>Product Title</label>
                <input
                  type="text"
                  className="input-control"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="input-control"
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-control"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    className="input-control"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="select-control"
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowProductModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Add Category</h2>
            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  className="input-control"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  className="input-control"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCategoryModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. REVIEW MODAL */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>
              Review: {showReviewModal.title}
            </h2>
            <form onSubmit={handleCreateReview}>
              <div className="form-group">
                <label>Rating (1 - 5 Stars)</label>
                <select
                  className="select-control"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  <option value={2}>⭐⭐ (2 Stars)</option>
                  <option value={1}>⭐ (1 Star)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  className="input-control"
                  rows={3}
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowReviewModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

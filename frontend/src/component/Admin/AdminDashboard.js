import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import "./AdminDashboard.css";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [counts, setCounts] = useState({
    foodCount: 0,
    orderCount: 0,
    pendingOrderCount: 0,
    servedOrderCount: 0
  });
  const [chartData, setChartData] = useState([]);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkFoodsJSON, setBulkFoodsJSON] = useState("");
  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    category: "IndianFood",
    image: "",
    ingredients: ""
  });

  const history = useHistory();
  const COLORS = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe'];

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      toast.error("Access Denied");
      history.push('/login');
      return;
    }

    fetchCounts();
    fetchChartData();
    fetchFoods();
    fetchOrders();
  }, []);

  const fetchCounts = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/counts");
      const data = await res.json();
      if (data.success) setCounts(data);
    } catch (err) { console.error(err); }
  };

  const fetchChartData = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/chartsData");
      const data = await res.json();
      if (data.success) setChartData(data.foodChart);
    } catch (err) { console.error(err); }
  };

  const fetchFoods = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/getFoods");
      const data = await res.json();
      if (data.success) setFoods(data.Foods);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/getAllOrders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success("Logged out");
    history.push("/login");
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/deleteFood/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Food deleted");
        fetchFoods();
        fetchCounts();
      }
    } catch (err) { toast.error("Delete failed"); }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const formattedFood = {
        ...newFood,
        ingredients: newFood.ingredients.split(',').map(i => i.trim())
      };
      const res = await fetch("http://localhost:5000/admin/addFood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedFood)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Food added successfully");
        setIsAddModalOpen(false);
        setNewFood({ name: "", price: "", category: "IndianFood", image: "", ingredients: "" });
        fetchFoods();
        fetchCounts();
      }
    } catch (err) { toast.error("Failed to add food"); }
  };

  const handleBulkAdd = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(bulkFoodsJSON);
      const foodsArray = Array.isArray(parsedData) ? parsedData : parsedData.foods;

      if (!foodsArray || !Array.isArray(foodsArray)) {
        throw new Error("Invalid format. Please provide an array.");
      }

      const res = await fetch("http://localhost:5000/admin/addMultipleFoods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foods: foodsArray })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setIsBulkModalOpen(false);
        setBulkFoodsJSON("");
        fetchFoods();
        fetchCounts();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Invalid JSON format");
    }
  };

  const handleServeOrder = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/completed/${id}`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        toast.success("Order served");
        fetchOrders();
        fetchCounts();
      }
    } catch (err) { toast.error("Failed to update status"); }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const res = await fetch("http://localhost:5000/admin/deleteOrder", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Order deleted");
        fetchOrders();
        fetchCounts();
      }
    } catch (err) { toast.error("Delete failed"); }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">FOODAPP ADMIN</div>
        <div className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={20} /> Overview
          </div>
          <div className={`nav-item ${activeTab === 'foods' ? 'active' : ''}`} onClick={() => setActiveTab('foods')}>
            <UtensilsCrossed size={20} /> Manage Food
          </div>
          <div className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <ShoppingBag size={20} /> Manage Orders
          </div>
        </div>
        <div className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="content-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard</h1>
          {activeTab === 'foods' && (
            <div style={{display: 'flex', gap: '10px'}}>
              <button className="add-btn" style={{background: '#74b9ff'}} onClick={() => setIsBulkModalOpen(true)}>
                <Package size={18} style={{marginRight: '5px'}}/> Bulk Add
              </button>
              <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
                <Plus size={18} style={{marginRight: '5px'}}/> Add Food
              </button>
            </div>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: '#fff5f5', color: '#ff7675'}}><TrendingUp /></div>
                <div className="stat-info"><h3>Total Food</h3><p>{counts.foodCount}</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: '#ebf5ff', color: '#74b9ff'}}><ShoppingBag /></div>
                <div className="stat-info"><h3>Total Orders</h3><p>{counts.orderCount}</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: '#fffbe6', color: '#ffeaa7'}}><Clock /></div>
                <div className="stat-info"><h3>Pending</h3><p>{counts.pendingOrderCount}</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: '#f0fff4', color: '#00b894'}}><CheckCircle2 /></div>
                <div className="stat-info"><h3>Served</h3><p>{counts.servedOrderCount}</p></div>
              </div>
            </div>

            <div className="charts-container">
              <h3 style={{marginBottom: '20px', fontSize: '18px'}}>Food Popularity Analytics</h3>
              <div style={{width: '100%', height: 350}}>
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f2f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: '#f4f7fe'}}
                      contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                    />
                    <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Food Management Tab */}
        {activeTab === 'foods' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map(food => (
                  <tr key={food._id}>
                    <td><img src={food.image} className="food-img-td" alt=""/></td>
                    <td style={{fontWeight: '600'}}>{food.name}</td>
                    <td><span className="status-badge" style={{backgroundColor: '#f1f2f6', color: '#2d3436'}}>{food.category}</span></td>
                    <td style={{color: '#00b894', fontWeight: '700'}}>₹{food.price}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon btn-delete" onClick={() => handleDeleteFood(food._id)}><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Details</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <div style={{fontWeight: '600'}}>{order.custName}</div>
                      <div style={{fontSize: '12px', color: '#636e72'}}>{order.custPhone}</div>
                    </td>
                    <td>Table: {order.tableNumber}</td>
                    <td style={{maxWidth: '200px', fontSize: '13px'}}>
                      {order.items.map(item => `${item.foodId?.name || 'Food'} x${item.quantity}`).join(', ')}
                    </td>
                    <td>
                      <span className={`status-badge status-${order.orderStatus}`}>
                        {order.orderStatus.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        {order.orderStatus === 'pending' && (
                          <button className="btn-icon btn-serve" title="Mark as Served" onClick={() => handleServeOrder(order._id)}>
                            <CheckCircle size={18}/>
                          </button>
                        )}
                        <button className="btn-icon btn-delete" title="Delete Order" onClick={() => handleDeleteOrder(order._id)}>
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Food Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{marginBottom: '20px'}}>Add New Food Item</h2>
            <form className="modal-form" onSubmit={handleAddFood}>
              <input type="text" placeholder="Food Name" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} required />
              <input type="number" placeholder="Price (₹)" value={newFood.price} onChange={e => setNewFood({...newFood, price: e.target.value})} required />
              <select value={newFood.category} onChange={e => setNewFood({...newFood, category: e.target.value})}>
                <option value="IndianFood">Indian Food</option>
                <option value="ItalianFood">Italian Food</option>
                <option value="korean">Korean Food</option>
              </select>
              <input type="text" placeholder="Image URL" value={newFood.image} onChange={e => setNewFood({...newFood, image: e.target.value})} required />
              <textarea placeholder="Ingredients (comma separated)" value={newFood.ingredients} onChange={e => setNewFood({...newFood, ingredients: e.target.value})} rows="3"></textarea>
              <div className="modal-btns">
                <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="add-btn">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Bulk Add Modal */}
      {isBulkModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '600px'}}>
            <h2 style={{marginBottom: '10px'}}>Bulk Add Food Items</h2>
            <p style={{fontSize: '14px', color: '#636e72', marginBottom: '15px'}}>
              Paste a JSON array of food objects. Each object should have: name, price, category, image, and ingredients (array).
            </p>
            <form className="modal-form" onSubmit={handleBulkAdd}>
              <textarea 
                placeholder='[{"name": "Dosa", "price": 100, ...}]' 
                value={bulkFoodsJSON} 
                onChange={e => setBulkFoodsJSON(e.target.value)} 
                rows="12"
                style={{fontFamily: 'monospace', fontSize: '13px'}}
                required
              ></textarea>
              <div className="modal-btns">
                <button type="button" className="btn-cancel" onClick={() => setIsBulkModalOpen(false)}>Cancel</button>
                <button type="submit" className="add-btn" style={{background: '#74b9ff'}}>Upload Bulk Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

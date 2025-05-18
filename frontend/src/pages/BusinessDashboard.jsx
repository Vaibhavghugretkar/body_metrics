import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import Sidebar from "../components/layout/SidebarBusiness";
import { LogOut, Clipboard, Check, AlertCircle, Plus, Trash2, Edit2, Save, Key } from "lucide-react";

const HOST = import.meta.env.VITE_BACKEND_URL;

const defaultProduct = {
  category: "Shirt",
  sizes: [
    { size: "M", chest: 38, waist: 32, hip: 40, length: 28, shoeSize: null },
  ],
};

export default function BusinessDashboard() {
  const { user, logout } = useUser();
  const [company, setCompany] = useState(null);
  const [form, setForm] = useState({ name: "", products: [defaultProduct] });
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user?.userType === "Business") {
      axios
        .get(`${HOST}/company/profile`, { withCredentials: true })
        .then((res) => {
          if (res.data.company) {
            setCompany(res.data.company);
            setForm({
              name: res.data.company.name,
              products: res.data.company.products,
            });
            setApiKey(res.data.company.apiKey || "");
            if (
              !res.data.company.name ||
              !res.data.company.products ||
              res.data.company.products.length === 0
            ) {
              setEditMode(true);
            } else {
              setEditMode(false);
            }
          } else {
            setEditMode(true);
          }
        })
        .catch(() => {
          setEditMode(true);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleFormChange = (e, idx, sizeIdx) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const products = prev.products.map((product, pIdx) => {
        if (pIdx !== idx) return product;
        if (typeof sizeIdx === "number") {
          const sizes = product.sizes.map((s, sIdx) =>
            sIdx === sizeIdx ? { ...s, [name]: value } : s
          );
          return { ...product, sizes };
        } else {
          return { ...product, [name]: value };
        }
      });
      return { ...prev, products };
    });
  };

  const handleAddProduct = () => {
    setForm((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          category: "Shirt",
          sizes: [
            {
              size: "M",
              chest: 38,
              waist: 32,
              hip: 40,
              length: 28,
              shoeSize: null,
            },
          ],
        },
      ],
    }));
  };

  const handleAddSize = (idx) => {
    setForm((prev) => {
      const products = prev.products.map((product, pIdx) => {
        if (pIdx !== idx) return product;
        return {
          ...product,
          sizes: [
            ...product.sizes,
            {
              size: product.category === "Pant" ? 30 : "M",
              chest:
                product.category === "Shirt" || product.category === "T-Shirt"
                  ? 98
                  : undefined,
              waist: product.category === "Pant" ? 76 : undefined,
              hip: product.category === "Pant" ? 92 : undefined,
              length:
                product.category === "Pant" ||
                product.category === "Shirt" ||
                product.category === "T-Shirt"
                  ? 104
                  : undefined,
              shoeSize: product.category === "Shoe" ? 7 : undefined,
              height: product.category === "Shoe" ? 170 : undefined,
            },
          ],
        };
      });
      return { ...prev, products };
    });
  };

  const handleDeleteProduct = (idx) => {
    setForm((prev) => {
      const products = prev.products.filter((_, pIdx) => pIdx !== idx);
      return { ...prev, products };
    });
  };

  const handleDeleteSize = (productIdx, sizeIdx) => {
    setForm((prev) => {
      const products = prev.products.map((product, pIdx) => {
        if (pIdx !== productIdx) return product;
        const sizes = product.sizes.filter((_, sIdx) => sIdx !== sizeIdx);
        return { ...product, sizes };
      });
      return { ...prev, products };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${HOST}/company/profile`, form, {
        withCredentials: true,
      });
      setCompany(res.data.company);
      setEditMode(false);
    } catch (err) {
      setError("Failed to save company profile");
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      const res = await axios.post(
        `${HOST}/company/generate-api-key`,
        {},
        { withCredentials: true }
      );
      setApiKey(res.data.apiKey);
      setCompany((prev) => ({ ...prev, apiKey: res.data.apiKey }));
    } catch {
      setError("Failed to generate API key");
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey || company?.apiKey || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="flex min-h-screen">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          allowedRoutes={["/dashboard", "/dashboard/profile"]}
        />
        <div className="flex-1 flex items-center justify-center bg-[#fff6fa]">
          <div className="p-8 text-center">
            <div className="inline-block w-16 h-16 border-4 border-[#d888bb] border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-lg text-[#d888bb] font-semibold">Loading your dashboard...</div>
          </div>
        </div>
      </div>
    );

  if (!company || editMode) {
    return (
      <div className="flex min-h-screen">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          allowedRoutes={["/dashboard", "/dashboard/profile"]}
          onProfileEdit={() => setEditMode(true)}
        />
        <div className="flex-1 bg-[#fff6fa] overflow-auto">
          <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
            <div className="bg-white rounded-xl shadow-lg border border-[#ffd6e3] overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] p-4 md:p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                  <Edit2 className="w-6 h-6 mr-2" /> 
                  Business Profile Setup
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  Configure your business profile and product sizing information
                </p>
              </div>
              
              <div className="p-4 md:p-6 lg:p-8">
                {error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-[#fffafd] p-4 rounded-lg border border-[#ffd6e3]">
                    <label className="block font-medium mb-2 text-[#d888bb]">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full border border-[#ffd6e3] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFC107] transition-all duration-200"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#d888bb]">Products</h3>
                      <button
                        type="button"
                        onClick={handleAddProduct}
                        className="flex items-center text-sm bg-[#FFC107] hover:bg-[#FFB000] text-white px-3 py-1.5 rounded-full shadow transition-all duration-200 transform hover:scale-105"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Product
                      </button>
                    </div>
                    
                    {form.products.map((product, idx) => (
                      <div
                        key={idx}
                        className="border border-[#ffd6e3] p-4 md:p-5 rounded-lg bg-[#fffafd] transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                          <div className="flex-1">
                            <label className="block font-medium text-[#d888bb] mb-1.5">
                              Product Category
                            </label>
                            <select
                              name="category"
                              value={product.category}
                              onChange={(e) => handleFormChange(e, idx)}
                              className="w-full border border-[#ffd6e3] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC107] transition-all duration-200"
                            >
                              <option value="Shirt">Shirt</option>
                              <option value="T-Shirt">T-Shirt</option>
                              <option value="Pant">Pant</option>
                              <option value="Shoe">Shoe</option>
                            </select>
                          </div>
                          
                          {form.products.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(idx)}
                              className="text-red-500 hover:text-red-700 flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </button>
                          )}
                        </div>
                        
                        <div className="mb-3 pb-2 border-b border-[#ffd6e3]">
                          <h4 className="text-sm font-medium text-[#d888bb] flex items-center">
                            <span className="w-2 h-2 bg-[#FFC107] rounded-full mr-2"></span> 
                            Size Information
                          </h4>
                        </div>
                        
                        <div className="space-y-3">
                          {product.sizes.map((size, sizeIdx) => (
                            <div
                              key={sizeIdx}
                              className="p-3 bg-white rounded-lg border border-[#ffd6e3] hover:border-[#FFC107] transition-colors duration-200"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-xs font-medium text-[#d888bb]">
                                  Size {sizeIdx + 1}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSize(idx, sizeIdx)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-all"
                                  disabled={product.sizes.length === 1}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3">
                                {/* Size input for each product type */}
                                {product.category === "Shoe" ? (
                                  <>
                                    <div>
                                      <label className="text-xs block mb-1">Shoe Size (UK)</label>
                                      <input
                                        type="number"
                                        name="size"
                                        value={size.size}
                                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                                        placeholder="UK Size"
                                        className="w-full border border-[#ffd6e3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107] transition-all duration-200"
                                        step="0.5"
                                        min="0"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs block mb-1">Height (cm)</label>
                                      <input
                                        type="number"
                                        name="height"
                                        value={size.height || ""}
                                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                                        placeholder="Height in cm"
                                        className="w-full border border-[#ffd6e3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107] transition-all duration-200"
                                        step="0.1"
                                        min="0"
                                      />
                                    </div>
                                  </>
                                ) : product.category === "Pant" ? (
                                  <>
                                    <div>
                                      <label className="text-xs block mb-1">Pant Size</label>
                                      <input
                                        type="number"
                                        name="size"
                                        value={size.size}
                                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                                        placeholder="30, 32, 34..."
                                        className="w-full border border-[#ffd6e3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107] transition-all duration-200"
                                        step="1"
                                        min="24"
                                        max="60"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs block mb-1">Waist (cm)</label>
                                      <input
                                        type="number"
                                        name="waist"
                                        value={size.waist || ""}
                                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                                        placeholder="Waist in cm"
                                        className="w-full border border-[#ffd6e3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107] transition-all duration-200"
                                        step="0.1"
                                        min="0"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs block mb-1">Hip (cm)</label>
                                      <input
                                        type="number"
                                        name="hip"
                                        value={size.hip || ""}
                                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                                        placeholder="Hip in cm"
                                        className="w-full border border-[#ffd6e3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107] transition-all duration-200"
                                        step="0.1"
                                        min="0"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs block mb-1">Length (cm)</label>
                                      <input
                                        type="number"
                                        name="length"
                                        value={size.length || ""}
                                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                                        placeholder="Length in cm"
                                        className="w-full border border-[#ffd6e3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107] transition-all duration-200"
                                        step="0.1"
                                        min="0"
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div>
                                      <label className="text-xs block mb-1">Size</label>
                                      <input
                                        type="text"
                                        name="size"
                                        value={size.size}
                                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                                        placeholder="S, M, L, XL..."
                                        className="w-full border border-[#ffd6e3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107] transition-all duration-200"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs block mb-1">Chest (cm)</label>
                                      <input
                                        type="number"
                                        name="chest"
                                        value={size.chest || ""}
                                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                                        placeholder="Chest in cm"
                                        className="w-full border border-[#ffd6e3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107] transition-all duration-200"
                                        step="0.1"
                                        min="0"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs block mb-1">Length (cm)</label>
                                      <input
                                        type="number"
                                        name="length"
                                        value={size.length || ""}
                                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                                        placeholder="Length in cm"
                                        className="w-full border border-[#ffd6e3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107] transition-all duration-200"
                                        step="0.1"
                                        min="0"
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          <button
                            type="button"
                            onClick={() => handleAddSize(idx)}
                            className="w-full py-2 border border-dashed border-[#ffd6e3] rounded-lg text-[#d888bb] hover:border-[#FFC107] hover:bg-[#FFC107]/5 transition-all duration-200 text-sm"
                          >
                            <Plus className="w-4 h-4 inline-block mr-1" /> Add Size
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="flex items-center bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <Save className="w-5 h-5 mr-2" /> Save Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show company profile and API key
  return (
    <div className="flex min-h-screen">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        allowedRoutes={["/dashboard", "/dashboard/profile"]}
        onProfileEdit={() => setEditMode(true)}
      />
      <div className="flex-1 bg-[#fff6fa] overflow-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-lg border border-[#ffd6e3] overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Business Dashboard
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    Welcome to your business control center
                  </p>
                </div>
                {/* <div className="mt-4 md:mt-0">
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                  </button>
                </div> */}
              </div>
            </div>
            
            <div className="p-0">
              <div className="flex border-b border-[#ffd6e3]">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-all ${
                    activeTab === "overview"
                      ? "border-b-2 border-[#FFC107] text-[#d888bb]"
                      : "text-gray-500 hover:text-[#d888bb]"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-all ${
                    activeTab === "products"
                      ? "border-b-2 border-[#FFC107] text-[#d888bb]"
                      : "text-gray-500 hover:text-[#d888bb]"
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => setActiveTab("api")}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-all ${
                    activeTab === "api"
                      ? "border-b-2 border-[#FFC107] text-[#d888bb]"
                      : "text-gray-500 hover:text-[#d888bb]"
                  }`}
                >
                  API Access
                </button>
              </div>
              
              <div className="p-4 md:p-6 lg:p-8">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="p-5 bg-[#fffafd] rounded-xl border border-[#ffd6e3]">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-[#FFC107] rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">
                            {company.name?.charAt(0) || "C"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-[#d888bb] text-sm">Company Name</h3>
                          <div className="text-xl font-semibold">{company.name}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-lg border border-[#ffd6e3] hover:border-[#FFC107] transition-colors duration-200">
                          <div className="text-sm font-medium text-[#d888bb] mb-2">Total Products</div>
                          <div className="text-2xl font-bold">{company.products?.length || 0}</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-[#ffd6e3] hover:border-[#FFC107] transition-colors duration-200">
                          <div className="text-sm font-medium text-[#d888bb] mb-2">Total Sizes</div>
                          <div className="text-2xl font-bold">
                            {company.products?.reduce((acc, product) => acc + product.sizes.length, 0) || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 bg-[#fffafd] rounded-xl border border-[#ffd6e3]">
                      <h3 className="font-medium text-[#d888bb] mb-3">Recent Activity</h3>
                      <div className="py-8 text-center text-gray-500">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <AlertCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <p>No recent activity to display</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "products" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-[#d888bb] text-lg">Your Products</h3>
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-xs bg-[#FFC107] hover:bg-[#FFB000] text-white px-3 py-1.5 rounded-full shadow transition-all duration-200"
                      >
                        Manage Products
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.products.map((product, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-lg border border-[#ffd6e3] hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 bg-[#FFC107]/20 rounded-full flex items-center justify-center mr-2">
                              <span className="text-[#FFC107] font-bold text-sm">{idx + 1}</span>
                            </div>
                            <h4 className="font-semibold text-[#ffa8b8]">{product.category}</h4>
                          </div>
                          
                          <div className="ml-4 space-y-1.5">
                            {product.sizes.map((size, sidx) => (
                              <div key={sidx} className="text-sm text-gray-700 bg-[#fffafd] p-2 rounded border border-[#ffd6e3]/50">
                                {product.category === "Shirt" || product.category === "T-Shirt" ? (
                                  <div className="flex flex-wrap gap-x-3">
                                    <span className="font-medium text-xs text-[#d888bb]">Size: {size.size}</span>
                                    {size.chest && <span>Chest: {size.chest} cm</span>}
                                    {size.length && <span>Length: {size.length} cm</span>}
                                  </div>
                                ) : product.category === "Pant" ? (
                                  <div className="flex flex-wrap gap-x-3">
                                    <span className="font-medium text-xs text-[#d888bb]">Size: {size.size}</span>
                                    {size.waist && <span>Waist: {size.waist} cm</span>}
                                    {size.hip && <span>Hip: {size.hip} cm</span>}
                                    {size.length && <span>Length: {size.length} cm</span>}
                                  </div>
                                ) : product.category === "Shoe" ? (
                                  <div className="flex flex-wrap gap-x-3">
                                    <span className="font-medium text-xs text-[#d888bb]">UK Size: {size.size}</span>
                                    {size.height && <span>Height: {size.height} cm</span>}
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === "api" && (
                  <div className="space-y-6">
                    <div className="p-5 bg-[#fffafd] rounded-xl border border-[#ffd6e3]">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-[#FFC107] rounded-full flex items-center justify-center mr-3">
                          <Key className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#d888bb]">API Access Key</h3>
                          <p className="text-sm text-gray-500">Use this key to authenticate API requests</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="relative">
                          <div className="flex">
                            <input
                              type="text"
                              value={apiKey || company.apiKey || "Not generated yet"}
                              readOnly
                              className="flex-1 bg-gray-50 border border-[#ffd6e3] rounded-l-lg px-4 py-3 font-mono text-sm"
                            />
                            <button
                              onClick={copyApiKey}
                              className={`px-4 rounded-r-lg flex items-center justify-center ${
                                copied
                                  ? "bg-green-500 text-white"
                                  : "bg-[#FFC107] text-white"
                              } transition-colors duration-300`}
                            >
                              {copied ? (
                                <Check className="h-5 w-5" />
                              ) : (
                                <Clipboard className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4">
                          <button
                            onClick={handleGenerateApiKey}
                            className="bg-gradient-to-r from-[#ffa8b8] to-[#d888bb] text-white px-4 py-2 rounded-lg text-sm shadow hover:shadow-md transition-all duration-300"
                          >
                            Generate New API Key
                          </button>
                          <div className="ml-3 text-xs text-gray-500">
                            {copied && "Copied to clipboard!"}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 bg-[#fffafd] rounded-xl border border-[#ffd6e3]">
                      <h3 className="font-medium text-[#d888bb] mb-3">API Documentation</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Learn how to integrate with our API to access your sizing data programmatically.
                      </p>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <code className="text-xs font-mono block">
                          GET /api/company/predict
                          <br />
                          Headers: &#123; "x-api-key": "{apiKey || '[YOUR_API_KEY]'}" &#125;
                          <br />
                          Body (Files): image: [your_image_file] 
                        </code>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

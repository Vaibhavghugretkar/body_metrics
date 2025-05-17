import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const HOST = import.meta.env.VITE_BACKEND_URL;

const defaultProduct = {
  category: "Shirt",
  sizes: [
    { size: "M", chest: 38, waist: 32, hip: 40, length: 28, shoeSize: null },
  ],
};

export default function BusinessDashboard() {
  const { user } = useUser();
  const [company, setCompany] = useState(null);
  const [form, setForm] = useState({ name: "", products: [defaultProduct] });
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

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
            // If company profile is incomplete (no name or no products), force edit mode
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
            // No company profile found, force edit mode
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
          // Only update the specific size in the specific product
          const sizes = product.sizes.map((s, sIdx) =>
            sIdx === sizeIdx ? { ...s, [name]: value } : s
          );
          return { ...product, sizes };
        } else {
          // Only update the specific product's field
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
        // Only add one new size
        return {
          ...product,
          sizes: [
            ...product.sizes,
            {
              size: product.category === "Pant" ? 30 : "M",
              chest:
                product.category === "Shirt" ||
                product.category === "T-Shirt"
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

  // Delete a product by index
  const handleDeleteProduct = (idx) => {
    setForm((prev) => {
      const products = prev.products.filter((_, pIdx) => pIdx !== idx);
      return { ...prev, products };
    });
  };

  // Delete a size from a product by product and size index
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!company || editMode) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
        <h2 className="text-2xl font-bold mb-4">Business Profile Setup</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Company Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          {form.products.map((product, idx) => (
            <div key={idx} className="border p-3 rounded mb-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Product Category</label>
                {form.products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(idx)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete Product
                  </button>
                )}
              </div>
              <select
                name="category"
                value={product.category}
                onChange={(e) => handleFormChange(e, idx)}
                className="w-full border rounded px-3 py-2 mb-2"
              >
                <option value="Shirt">Shirt</option>
                <option value="T-Shirt">T-Shirt</option>
                <option value="Pant">Pant</option>
                <option value="Shoe">Shoe</option>
              </select>
              {product.sizes.map((size, sizeIdx) => (
                <div key={sizeIdx} className="flex gap-2 mb-1 items-center">
                  {/* Standard size label/input for each product */}
                  {product.category === "Shoe" ? (
                    <>
                      <label className="text-xs w-20">Shoe Size (UK)</label>
                      <input
                        type="number"
                        name="size"
                        value={size.size}
                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                        placeholder="UK Size (e.g. 8)"
                        className="border rounded px-2 py-1 w-24"
                        step="0.5"
                        min="0"
                        required
                      />
                      <label className="text-xs w-24">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={size.height || ""}
                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                        placeholder="Height in cm"
                        className="border rounded px-2 py-1 w-24"
                        step="0.1"
                        min="0"
                      />
                    </>
                  ) : product.category === "Pant" ? (
                    <>
                      <label className="text-xs w-24">
                        Pant Size (e.g. 30, 32, 34)
                      </label>
                      <input
                        type="number"
                        name="size"
                        value={size.size}
                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                        placeholder="Pant Size (e.g. 30, 32, 34)"
                        className="border rounded px-2 py-1 w-24"
                        step="1"
                        min="24"
                        max="60"
                        required
                      />
                    </>
                  ) : (
                    <>
                      <label className="text-xs w-16">
                        Size (e.g. S/M/L/XL)
                      </label>
                      <input
                        type="text"
                        name="size"
                        value={size.size}
                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                        placeholder="S, M, L, XL, etc."
                        className="border rounded px-2 py-1 w-20"
                        required
                      />
                    </>
                  )}
                  {/* Shirt/T-Shirt: Chest, Length */}
                  {(product.category === "Shirt" ||
                    product.category === "T-Shirt") && (
                    <>
                      <label className="text-xs w-16">Chest (cm)</label>
                      <input
                        type="number"
                        name="chest"
                        value={size.chest || ""}
                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                        placeholder="Chest in cm"
                        className="border rounded px-2 py-1 w-20"
                        step="0.1"
                        min="0"
                      />
                      <label className="text-xs w-16">Length (cm)</label>
                      <input
                        type="number"
                        name="length"
                        value={size.length || ""}
                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                        placeholder="Length in cm"
                        className="border rounded px-2 py-1 w-20"
                        step="0.1"
                        min="0"
                      />
                    </>
                  )}
                  {/* Pant: Waist, Hip, Length */}
                  {product.category === "Pant" && (
                    <>
                      <label className="text-xs w-16">Waist (cm)</label>
                      <input
                        type="number"
                        name="waist"
                        value={size.waist || ""}
                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                        placeholder="Waist in cm"
                        className="border rounded px-2 py-1 w-20"
                        step="0.1"
                        min="0"
                      />
                      <label className="text-xs w-16">Hip (cm)</label>
                      <input
                        type="number"
                        name="hip"
                        value={size.hip || ""}
                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                        placeholder="Hip in cm"
                        className="border rounded px-2 py-1 w-20"
                        step="0.1"
                        min="0"
                      />
                      <label className="text-xs w-16">Length (cm)</label>
                      <input
                        type="number"
                        name="length"
                        value={size.length || ""}
                        onChange={(e) => handleFormChange(e, idx, sizeIdx)}
                        placeholder="Length in cm"
                        className="border rounded px-2 py-1 w-20"
                        step="0.1"
                        min="0"
                      />
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteSize(idx, sizeIdx)}
                    className="text-xs text-red-500 ml-2"
                    disabled={product.sizes.length === 1}
                  >
                    Delete Size
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddSize(idx)}
                className="text-xs text-[#d888bb] mt-1"
              >
                + Add Size
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddProduct}
            className="text-xs text-[#d888bb]"
          >
            + Add Product
          </button>
          <div>
            <button
              type="submit"
              className="bg-[#d888bb] text-white px-6 py-2 rounded"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Show company profile and API key
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Business Dashboard</h2>
      <div className="mb-4">
        <div className="font-medium">Company Name:</div>
        <div>{company.name}</div>
      </div>
      <div className="mb-4">
        <div className="font-medium">Products:</div>
        {company.products.map((product, idx) => (
          <div key={idx} className="mb-2">
            <div className="font-semibold">{product.category}</div>
            {product.sizes.map((size, sidx) => (
              <div key={sidx} className="text-sm ml-4">
                {product.category === "Shirt" || product.category === "T-Shirt" ? (
                  <>
                    Size: {size.size}, Chest: {size.chest} cm, Length: {size.length} cm
                  </>
                ) : product.category === "Pant" ? (
                  <>
                    Pant Size: {size.size}, Waist: {size.waist} cm, Hip: {size.hip} cm, Length: {size.length} cm
                  </>
                ) : product.category === "Shoe" ? (
                  <>
                    Shoe Size (UK): {size.size}, Height (cm): {size.height}
                  </>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <div className="font-medium">API Key:</div>
        <div className="flex items-center gap-2">
          <span className="bg-gray-100 px-2 py-1 rounded text-xs select-all">
            {apiKey || company.apiKey || "Not generated yet"}
          </span>
          <button
            onClick={handleGenerateApiKey}
            className="bg-[#ffa8b8] text-white px-3 py-1 rounded text-xs"
          >
            Generate API Key
          </button>
        </div>
      </div>
      <button
        onClick={() => setEditMode(true)}
        className="text-[#d888bb] underline text-sm"
      >
        Edit Profile
      </button>
    </div>
  );
}

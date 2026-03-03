import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import stationsData from "../data/stations.json";

function AdminTrains() {
  const navigate = useNavigate();
  const [trains, setTrains] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("number");
  const [form, setForm] = useState({
    number: "",
    name: "",
    currentStation: ""
  });
  const [stationSuggestions, setStationSuggestions] = useState([]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  /* 🔒 ADMIN PROTECTION */
  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      navigate("/login");
      return;
    }

    loadTrains();
  }, [navigate]);

  const loadTrains = () => {
    const saved = JSON.parse(localStorage.getItem("adminTrains")) || [];
    setTrains(saved);
    setFilteredTrains(saved);
  };

  /* FILTER & SEARCH */
  useEffect(() => {
    let filtered = trains.filter(train =>
      train.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train.currentStation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "number") return a.number.localeCompare(b.number);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "station") return a.currentStation.localeCompare(b.currentStation);
      return 0;
    });

    setFilteredTrains(filtered);
  }, [searchTerm, sortBy, trains]);

  /* SAVE TO STORAGE */
  const saveToStorage = (data) => {
    localStorage.setItem("adminTrains", JSON.stringify(data));
    setTrains(data);
    showSuccess("✓ Saved successfully");
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  /* ADD / UPDATE TRAIN */
  const handleSubmit = () => {
    if (!form.number.trim() || !form.name.trim() || !form.currentStation.trim()) {
      alert("⚠️ All fields are required");
      return;
    }

    let updated;

    if (editingIndex !== null) {
      updated = [...trains];
      updated[editingIndex] = form;
      setEditingIndex(null);
      showSuccess("✓ Train updated");
    } else {
      updated = [...trains, form];
      showSuccess("✓ Train added");
    }

    saveToStorage(updated);
    setForm({ number: "", name: "", currentStation: "" });
  };

  /* EDIT */
  const handleEdit = (train, index) => {
    const actualIndex = trains.findIndex(t => t.number === train.number && t.name === train.name);
    setForm(train);
    setEditingIndex(actualIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* DELETE */
  const handleDelete = (index) => {
    const train = trains[index];
    if (!window.confirm(`Delete train ${train.number} - ${train.name}?`)) return;
    const updated = trains.filter((_, i) => i !== index);
    saveToStorage(updated);
    showSuccess("✓ Train deleted");
  };

  const handleCancel = () => {
    setForm({ number: "", name: "", currentStation: "" });
    setEditingIndex(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <header style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", margin: "0 0 4px 0", color: "#0f172a", fontWeight: "700" }}>
              🚆 Train Management
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0" }}>
              {trains.length} train{trains.length !== 1 ? 's' : ''} in system
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={{
              background: "#e2e8f0",
              color: "#1f2937",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem"
            }}
          >
            ← Back
          </button>
        </header>

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div style={{
            background: "#d1fae5",
            color: "#065f46",
            padding: "12px 16px",
            borderRadius: "6px",
            marginBottom: "24px",
            fontSize: "0.9rem",
            fontWeight: "500",
            border: "1px solid #6ee7b7"
          }}>
            {successMessage}
          </div>
        )}

        {/* ADD / EDIT FORM */}
        <div style={{
          background: "white",
          padding: "32px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          marginBottom: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
        }}>
          <h2 style={{ margin: "0 0 24px 0", fontSize: "1.2rem", color: "#0f172a", fontWeight: "600" }}>
            {editingIndex !== null ? "✏️ Edit Train" : "➕ Add New Train"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Train Number *</label>
              <input
                type="text"
                placeholder="e.g., TR-001"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value.toUpperCase() })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#0052cc"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Train Name *</label>
              <input
                type="text"
                placeholder="e.g., Express Runner"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#0052cc"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Current Station *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g., Central Station"
                  value={form.currentStation}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({ ...form, currentStation: val });
                    // suggestions from existing trains
                    if (val.trim().length < 2) {
                      setStationSuggestions([]);
                    } else {
                      setStationSuggestions(
                        stationsData
                          .filter(s => s.name.toLowerCase().includes(val.toLowerCase()))
                          .slice(0, 5)
                          .map(s => s.name)
                      );
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#0052cc"}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    // hide suggestions shortly after blur
                    setTimeout(() => setStationSuggestions([]), 100);
                  }}
                />
                {stationSuggestions.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderTop: 'none',
                    zIndex: 10,
                    maxHeight: '150px',
                    overflowY: 'auto'
                  }}>
                    {stationSuggestions.map((s,i)=>(
                      <div
                        key={i}
                        style={{ padding: '8px 12px', cursor: 'pointer' }}
                        onMouseDown={() => {
                          setForm({ ...form, currentStation: s });
                          setStationSuggestions([]);
                        }}
                      >{s}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleSubmit}
              style={{
                background: "#0052cc",
                color: "white",
                border: "none",
                padding: "11px 24px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "#003d99"}
              onMouseLeave={(e) => e.target.style.background = "#0052cc"}
            >
              {editingIndex !== null ? "💾 Update Train" : "➕ Add Train"}
            </button>
            {editingIndex !== null && (
              <button
                onClick={handleCancel}
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  padding: "11px 24px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.target.style.background = "#e5e7eb"; }}
                onMouseLeave={(e) => { e.target.style.background = "#f3f4f6"; }}
              >
                ✕ Cancel
              </button>
            )}
          </div>
        </div>

        {/* SEARCH & FILTER SECTION */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          marginBottom: "24px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <div style={{ flex: 1, minWidth: "250px" }}>
            <input
              type="text"
              placeholder="🔍 Search trains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "0.95rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "0.95rem",
              background: "white",
              cursor: "pointer",
              minWidth: "180px"
            }}
          >
            <option value="number">Sort: Number</option>
            <option value="name">Sort: Name</option>
            <option value="station">Sort: Station</option>
          </select>

          <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
            {filteredTrains.length} result{filteredTrains.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* TRAIN LIST */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          overflow: "hidden"
        }}>
          <div style={{ padding: "20px" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "1.1rem", color: "#0f172a", fontWeight: "600" }}>
              All Trains
            </h3>

            {filteredTrains.length === 0 ? (
              <div style={{
                padding: "40px 20px",
                textAlign: "center",
                background: "#f9fafb",
                borderRadius: "8px",
                color: "#64748b"
              }}>
                <p style={{ margin: "0", fontSize: "1rem" }}>
                  {searchTerm ? "❌ No trains found" : "📭 No trains added yet. Create your first train above."}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredTrains.map((train, displayIndex) => {
                  const actualIndex = trains.findIndex(t => t.number === train.number && t.name === train.name);
                  return (
                    <div
                      key={displayIndex}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        transition: "all 0.2s",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f0f4f8";
                        e.currentTarget.style.borderColor = "#d1d5db";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f9fafb";
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "1.5rem" }}>🚆</span>
                          <div>
                            <p style={{ margin: "0", fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>
                              {train.number}
                            </p>
                            <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#374151", fontWeight: "500" }}>
                              {train.name}
                            </p>
                          </div>
                        </div>
                        <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                          📍 {train.currentStation}
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(train, actualIndex)}
                          style={{
                            background: "#0052cc",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "0.85rem",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => e.target.style.background = "#003d99"}
                          onMouseLeave={(e) => e.target.style.background = "#0052cc"}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(actualIndex)}
                          style={{
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "0.85rem",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => e.target.style.background = "#dc2626"}
                          onMouseLeave={(e) => e.target.style.background = "#ef4444"}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTrains;

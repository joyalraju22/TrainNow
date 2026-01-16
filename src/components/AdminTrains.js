import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminTrains() {
  const navigate = useNavigate();
  const [trains, setTrains] = useState([]);
  const [form, setForm] = useState({
    number: "",
    name: "",
    currentStation: ""
  });
  const [editingIndex, setEditingIndex] = useState(null);

  /* 🔒 ADMIN PROTECTION */
  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      navigate("/login");
    }

    const saved = JSON.parse(localStorage.getItem("adminTrains")) || [];
    setTrains(saved);
  }, [navigate]);

  /* SAVE TO STORAGE */
  const saveToStorage = (data) => {
    localStorage.setItem("adminTrains", JSON.stringify(data));
    setTrains(data);
  };

  /* ADD / UPDATE TRAIN */
  const handleSubmit = () => {
    if (!form.number || !form.name || !form.currentStation) {
      alert("All fields are required");
      return;
    }

    let updated;

    if (editingIndex !== null) {
      updated = [...trains];
      updated[editingIndex] = form;
      setEditingIndex(null);
    } else {
      updated = [...trains, form];
    }

    saveToStorage(updated);
    setForm({ number: "", name: "", currentStation: "" });
  };

  /* EDIT */
  const handleEdit = (index) => {
    setForm(trains[index]);
    setEditingIndex(index);
  };

  /* DELETE */
  const handleDelete = (index) => {
    if (!window.confirm("Delete this train?")) return;
    const updated = trains.filter((_, i) => i !== index);
    saveToStorage(updated);
  };

  return (
    <div className="app fade-in">
      <h2>Train Management</h2>

      {/* ADD / EDIT FORM */}
      <div className="train-card">
        <h3>{editingIndex !== null ? "Edit Train" : "Add New Train"}</h3>

        <input
          placeholder="Train Number"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
        />

        <input
          placeholder="Train Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Current Station"
          value={form.currentStation}
          onChange={(e) =>
            setForm({ ...form, currentStation: e.target.value })
          }
        />

        <button className="gov-btn" onClick={handleSubmit}>
          {editingIndex !== null ? "Update Train" : "Add Train"}
        </button>
      </div>

      {/* TRAIN LIST */}
      <div className="train-card" style={{ marginTop: "20px" }}>
        <h3>Existing Trains</h3>

        {trains.length === 0 && (
          <p style={{ color: "#6b7280" }}>No trains added yet.</p>
        )}

        {trains.map((train, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              marginTop: "10px",
              background: "#f8fafc",
              borderRadius: "6px"
            }}
          >
            <div>
              <strong>{train.number}</strong> – {train.name}
              <br />
              <small>Current: {train.currentStation}</small>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button className="gov-btn" onClick={() => handleEdit(index)}>
                Edit
              </button>
              <button
                className="gov-btn"
                style={{ backgroundColor: "#dc2626" }}
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminTrains;

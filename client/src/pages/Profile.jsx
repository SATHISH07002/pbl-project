import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const baseUrl = () =>
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    degree: "",
    branch: "",
    department: "",
    collegeName: "",
    email: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        rollNumber: user.rollNumber || "",
        degree: user.degree || "",
        branch: user.branch || "",
        department: user.department || "",
        collegeName: user.collegeName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const fd = new FormData();
    Object.keys(form).forEach((k) => {
      if (form[k]) fd.append(k, form[k]);
    });
    if (file) fd.append("profileImage", file);
    try {
      const res = await API.put("/auth/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(res.data);
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Profile">
      <div className="card">
        <div className="card-title">Profile</div>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div>
            {user?.profileImage ? (
              <img
                src={`${baseUrl()}/uploads/${user.profileImage}`}
                alt="Profile"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  fontWeight: 700,
                }}
              >
                {user?.name?.charAt(0) || "?"}
              </div>
            )}
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>
          <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: 300 }}>
            <div className="form-group">
              <label>Name</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Roll Number</label>
              <input
                className="form-control"
                value={form.rollNumber}
                onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Degree</label>
              <input
                className="form-control"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Branch</label>
              <input
                className="form-control"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                className="form-control"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>College Name</label>
              <input
                className="form-control"
                value={form.collegeName}
                onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-control"
                type="email"
                value={form.email}
                readOnly
                style={{ opacity: 0.8 }}
              />
            </div>
            {message && (
              <p
                style={{
                  marginBottom: "1rem",
                  color: message.includes("success") ? "var(--color-success)" : "var(--color-danger)",
                }}
              >
                {message}
              </p>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

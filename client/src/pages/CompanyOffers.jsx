import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

export default function CompanyOffers() {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    offerType: "internship",
    title: "",
    description: "",
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    API.get("/offers/sent")
      .then((res) => setOffers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
    API.get("/auth/students")
      .then((res) => setStudents(res.data))
      .catch(() => setStudents([]));
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.title) {
      alert("Student and title required");
      return;
    }
    setSubmitLoading(true);
    try {
      await API.post("/offers", form);
      setForm({ studentId: "", offerType: "internship", title: "", description: "" });
      setOffers((prev) => [...prev, { ...form, status: "pending", _id: "new" }]);
      // Refetch to get real data
      const res = await API.get("/offers/sent");
      setOffers(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create offer");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Layout title="Post Offers">
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="card-title">Create Internship / Job Offer</div>
        <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
          <div className="form-group">
            <label>Student *</label>
            <select
              className="form-control"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              required
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Offer Type</label>
            <select
              className="form-control"
              value={form.offerType}
              onChange={(e) => setForm({ ...form, offerType: e.target.value })}
            >
              <option value="internship">Internship</option>
              <option value="job">Job</option>
            </select>
          </div>
          <div className="form-group">
            <label>Job Role   *</label>  -09876521
            <input
              className="form-control"
              placeholder="e.g. Software Developer Intern"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitLoading}>
            {submitLoading ? "Sending..." : "Send Offer"}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">Offers Sent</div>
        {loading ? (
          <p>Loading...</p>
        ) : offers.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>No offers sent yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o._id}>
                    <td>{o.student?.name || o.student?._id}</td>
                    <td>{o.title}</td>
                    <td>{o.offerType}</td>
                    <td>
                      <span
                        className={`badge badge-${
                          o.status === "accepted"
                            ? "success"
                            : o.status === "rejected"
                            ? "danger"
                            : "pending"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
        )}
      </div>
    </Layout>
  );
}

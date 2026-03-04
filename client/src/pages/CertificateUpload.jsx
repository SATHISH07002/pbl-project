import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

export default function CertificateUpload() {
  const [form, setForm] = useState({
    studentName: "",
    collegeName: "",
    degree: "",
    branch: "",
    department: "",
    companyName: "",
    roleInInternship: "",
    duration: "",
    stipend: "",
    workExperience: "",
    collegeId: "",
    companyId: "",
  });
  const [file, setFile] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/auth/colleges").then((res) => setColleges(res.data)).catch(console.error);
    API.get("/auth/companies").then((res) => setCompanies(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const fd = new FormData();
    Object.keys(form).forEach((k) => {
      if (form[k]) fd.append(k, form[k]);
    });
    if (file) fd.append("certificateFile", file);
    try {
      await API.post("/internships/submit", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Certificate submitted! Status: pending_college");
      setForm({
        studentName: "",
        collegeName: "",
        degree: "",
        branch: "",
        department: "",
        companyName: "",
        roleInInternship: "",
        duration: "",
        stipend: "",
        workExperience: "",
        collegeId: "",
        companyId: "",
      });
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCollegeSelect = (e) => {
    const id = e.target.value;
    const c = colleges.find((x) => x._id === id);
    setForm({
      ...form,
      collegeId: id,
      collegeName: c?.name || c?.collegeName || "",
    });
  };

  const handleCompanySelect = (e) => {
    const id = e.target.value;
    const c = companies.find((x) => x._id === id);
    setForm({
      ...form,
      companyId: id,
      companyName: c?.name || c?.companyName || "",
    });
  };

  return (
    <Layout title="Certificate Upload">
      <div className="card">
        <div className="card-title">Upload Certificate</div>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
          Submit your internship certificate for verification. Status will be pending_college after submit.
        </p>
        <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
          <div className="form-group">
            <label>Certificate (PDF/JPG/PNG) *</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group">
            <label>Student Name *</label>
            <input
              className="form-control"
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>College *</label>
            <select
              className="form-control"
              value={form.collegeId}
              onChange={handleCollegeSelect}
            >
              <option value="">Select College</option>
              {colleges.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.collegeName || c.name}
                </option>
              ))}
            </select>
            {colleges.length === 0 && (
              <input
                className="form-control"
                placeholder="Or type college name"
                value={form.collegeName}
                onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                style={{ marginTop: "0.5rem" }}
              />
            )}
          </div>
          <div className="form-group">
            <label>Degree *</label>
            <input
              className="form-control"
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Branch *</label>
            <input
              className="form-control"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Department *</label>
            <input
              className="form-control"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Company *</label>
            <select
              className="form-control"
              value={form.companyId}
              onChange={handleCompanySelect}
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.companyName || c.name}
                </option>
              ))}
            </select>
            {companies.length === 0 && (
              <input
                className="form-control"
                placeholder="Or type company name"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                style={{ marginTop: "0.5rem" }}
              />
            )}
          </div>
          <div className="form-group">
            <label>Role in Internship *</label>
            <input
              className="form-control"
              value={form.roleInInternship}
              onChange={(e) => setForm({ ...form, roleInInternship: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Number of Days *</label>
            <input
              type="number"
              className="form-control"
              min={1}
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Stipend</label>
            <input
              className="form-control"
              value={form.stipend}
              onChange={(e) => setForm({ ...form, stipend: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Work Experience Description</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.workExperience}
              onChange={(e) => setForm({ ...form, workExperience: e.target.value })}
            />
          </div>
          {message && (
            <p
              style={{
                marginBottom: "1rem",
                color: message.includes("pending") ? "var(--color-success)" : "var(--color-danger)",
              }}
            >
              {message}
            </p>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

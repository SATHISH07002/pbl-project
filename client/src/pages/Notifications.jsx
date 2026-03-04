import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/notifications")
      .then((res) => setNotifications(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await API.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Notifications">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div className="card-title" style={{ marginBottom: 0 }}>
            Notifications
          </div>
          {notifications.some((n) => !n.read) && (
            <button className="btn btn-outline btn-sm" onClick={markAllRead}>
              Mark all read
            </button>
          )}
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>No notifications.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.read && markRead(n._id)}
                style={{
                  padding: "1rem",
                  background: n.read ? "transparent" : "rgba(59, 130, 246, 0.1)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  cursor: n.read ? "default" : "pointer",
                }}
              >
                <div style={{ fontWeight: 600 }}>{n.title}</div>
                {n.message && (
                  <div style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                    {n.message}
                  </div>
                )}
                <div style={{ fontSize: "0.8rem", marginTop: "0.25rem", color: "var(--color-text-muted)" }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

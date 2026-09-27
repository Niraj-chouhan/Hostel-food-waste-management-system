import { Link } from "react-router-dom";

export const AdminDashboard = () => {
  return (
    <section className="admin-users-section">
      <div className="container">
        <div className="admin-page-heading"><div><span className="eyebrow">Control center</span><h1>Dashboard overview</h1><p>Manage the hostel experience from one focused workspace.</p></div><span className="status-pill">● System online</span></div>
        <div className="dashboard-grid">
          <Link to="/admin/users"><span>Users</span><strong>Manage residents</strong><p>View, update and organize registered accounts.</p><b>Open users →</b></Link>
          <Link to="/admin/contacts"><span>Inbox</span><strong>Student requests</strong><p>Review questions and messages from residents.</p><b>Open inbox →</b></Link>
          <Link to="/admin/services"><span>Services</span><strong>Service catalog</strong><p>Review the services currently shown to users.</p><b>Open services →</b></Link>
          <Link to="/admin/menu"><span>Menu</span><strong>Weekly meals</strong><p>Check meal plans and send today&apos;s notification.</p><b>Manage menu →</b></Link>
        </div>
      </div>
    </section>
  );
};

import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

// Member 1 — Waste Reports module
import WasteReports from "./pages/waste-reports/WasteReports";
import WasteReportForm from "./pages/waste-reports/WasteReportForm";
import WasteReportDetails from "./pages/waste-reports/WasteReportDetails";

// Member 4 — Community Requests module
import CommunityRequests from "./pages/community-requests/CommunityRequests";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Waste Reports CRUD */}
          <Route path="/waste-reports" element={<WasteReports />} />
          <Route path="/waste-reports/new" element={<WasteReportForm />} />
          <Route path="/waste-reports/:id" element={<WasteReportDetails />} />
          <Route path="/waste-reports/:id/edit" element={<WasteReportForm />} />

          {/* Community Requests CRUD */}
          <Route path="/community-requests" element={<CommunityRequests />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

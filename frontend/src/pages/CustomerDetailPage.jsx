// src/pages/CustomerDetailPage.jsx
// Shows the complete biodata of one customer.
// Fetches the customer by ID from the URL params.
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Phone, Mail, ExternalLink } from "lucide-react";
import PageLayout from "../components/layout/PageLayout.jsx";
import ProfileSection from "../components/customer/ProfileSection.jsx";
import NotesEditor from "../components/customer/NotesEditor.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { fetchCustomerById, updateCustomerStatus } from "../services/customer.service.js";
import toast from "react-hot-toast";

// Format income in Indian style
const formatIncome = (income) => {
  if (!income) return "Not specified";
  if (income >= 10000000) return `₹${(income / 10000000).toFixed(1)} Cr/year`;
  if (income >= 100000) return `₹${(income / 100000).toFixed(1)} L/year`;
  return `₹${income.toLocaleString("en-IN")}/year`;
};

const CustomerDetailPage = () => {
  const { id } = useParams(); // Get customer ID from URL (/customer/:id)
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Load customer data on mount
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchCustomerById(id);
        setCustomer(data.customer);
      } catch {
        toast.error("Could not load customer profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Handle status change from dropdown
  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await updateCustomerStatus(id, newStatus);
      setCustomer((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to "${newStatus}"`);
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <PageLayout><Spinner text="Loading profile..." /></PageLayout>;
  if (!customer) return <PageLayout><div className="p-8 text-gray-400">Customer not found.</div></PageLayout>;

  // Organize biodata fields into sections for ProfileSection component
  const personalFields = [
    { label: "First Name", value: customer.firstName },
    { label: "Last Name", value: customer.lastName },
    { label: "Gender", value: customer.gender },
    { label: "Date of Birth", value: customer.dateOfBirth },
    { label: "Age", value: `${customer.age} years` },
    { label: "Marital Status", value: customer.maritalStatus },
    { label: "Country", value: customer.country },
    { label: "City", value: customer.city },
    { label: "Height", value: `${customer.height} cm` },
    { label: "Mother Tongue", value: customer.motherTongue },
    { label: "Languages Known", value: customer.languagesKnown?.join(", ") },
    { label: "Siblings", value: customer.siblings?.toString() },
  ];

  const contactFields = [
    { label: "Email", value: customer.email },
    { label: "Phone", value: customer.phone },
  ];

  const professionalFields = [
    { label: "College", value: customer.undergraduateCollege },
    { label: "Degree", value: customer.degree },
    { label: "Current Company", value: customer.currentCompany },
    { label: "Designation", value: customer.designation },
    { label: "Annual Income", value: formatIncome(customer.income) },
  ];

  const lifestyleFields = [
    { label: "Diet", value: customer.diet },
    { label: "Smoking", value: customer.smoking },
    { label: "Drinking", value: customer.drinking },
    { label: "Want Kids", value: customer.wantKids },
    { label: "Open to Relocate", value: customer.openToRelocate },
    { label: "Open to Pets", value: customer.openToPets },
    { label: "Family Type", value: customer.familyType },
    { label: "Own House", value: customer.ownHouse },
    { label: "Father's Occupation", value: customer.fathersOccupation },
    { label: "Mother's Occupation", value: customer.mothersOccupation },
  ];

  const culturalFields = [
    { label: "Religion", value: customer.religion },
    { label: "Caste", value: customer.caste },
    { label: "Gotra", value: customer.gotra },
    { label: "Manglik", value: customer.manglik },
    { label: "Horoscope Match", value: customer.horoscopeMatch },
    { label: "Complexion", value: customer.complexion },
  ];

  return (
    <PageLayout>
      <div className="p-8 max-w-5xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-rose-50 p-7 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Large avatar */}
            <div className="w-20 h-20 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-500 text-2xl font-bold font-sans shrink-0">
              {customer.firstName[0]}{customer.lastName[0]}
            </div>

            <div className="flex-1">
              {/* Name + Status */}
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="font-serif text-2xl font-bold text-gray-900">
                  {customer.firstName} {customer.lastName}
                </h1>
                <StatusBadge status={customer.status} />
              </div>

              {/* Quick info */}
              <p className="text-sm text-gray-500 font-sans">
                {customer.designation} at {customer.currentCompany} · {customer.city} · {customer.age} yrs
              </p>

              {/* Contact row */}
              <div className="flex flex-wrap gap-4 mt-3">
                <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose-500 transition-colors">
                  <Mail size={12} /> {customer.email}
                </a>
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Phone size={12} /> {customer.phone}
                </span>
              </div>
            </div>

            {/* Status Changer + Matches button */}
            <div className="flex flex-col gap-2 shrink-0">
              <select
                value={customer.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="text-xs border border-gray-200 rounded-xl px-3 py-2 font-sans bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                {["Active", "On Hold", "Matched", "Inactive"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <button
                onClick={() => navigate(`/customer/${id}/matches`)}
                className="flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Heart size={13} className="fill-white" /> View Matches
              </button>
            </div>
          </div>
        </div>

        {/* Biodata Sections */}
        <div className="grid gap-5">
          <ProfileSection title="Personal Information" icon="👤" fields={personalFields} />
          <ProfileSection title="Professional Background" icon="💼" fields={professionalFields} />
          <ProfileSection title="Lifestyle Preferences" icon="🌿" fields={lifestyleFields} />
          <ProfileSection title="Cultural & Religious" icon="🙏" fields={culturalFields} />

          {/* Notes Editor */}
          <NotesEditor customerId={customer.id} initialNotes={customer.notes} />
        </div>
      </div>
    </PageLayout>
  );
};

export default CustomerDetailPage;

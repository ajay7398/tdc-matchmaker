// src/components/customer/ProfileSection.jsx
// Renders a labeled group of fields for the customer detail page.
// Used to organize biodata into sections (Personal, Professional, etc.)

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <p className="text-sm text-gray-800 font-sans font-medium">
      {value || <span className="text-gray-300 italic">Not specified</span>}
    </p>
  </div>
);

const ProfileSection = ({ title, icon, fields }) => (
  <div className="bg-white rounded-2xl border border-rose-50 p-6">
    <h3 className="font-serif text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
      <span>{icon}</span> {title}
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
      {fields.map(({ label, value }) => (
        <InfoField key={label} label={label} value={value} />
      ))}
    </div>
  </div>
);

export default ProfileSection;

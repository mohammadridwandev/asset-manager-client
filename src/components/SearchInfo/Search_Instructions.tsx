export default function Search_Instructions() {
  return (
    <div className="rounded-md border border-gray-200 bg-app-brand/10 px-5 py-4">

      <h3 className="mb-2 text-base font-bold text-app-text">
        Search Instructions
      </h3>

      <div className="space-y-1 text-sm text-brand-text leading-6">
        <p>- Enter the complete Name (e.g., John Doe)</p>
        <p>- Enter the complete Phone Number (e.g., +1234567890)</p>
        <p>- Enter the complete Iqama ID number (e.g., 2234567890)</p>
        <p>
          - Or enter the employee&apos;s email address (e.g.,
          john.doe@company.com)
        </p>
        <p>
          - The search will show all assets and licenses assigned to the
          employee
        </p>
        <p>- Partial matches are supported for email addresses</p>
      </div>
    </div>
  );
}
import Print_Layout from "../../Print_Layout";
import It_Policy from "./It_Policy";

type EmployeePrintProps = {
  data: {
    employee: any;
    assignment: any;
  };
};

function displayValue(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "N/A";
  }

  return String(value);
}

function formatDate(value: unknown) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value as string);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-GB");
}

const sectionTitleClass =
  "mb-[3mm] border-b border-[#cbd5e1] pb-[1.5mm] " +
  "text-[12pt] font-bold text-slate-800";

const labelClass =
  "text-[8.5pt] font-bold text-slate-700";

const valueClass =
  "min-w-0 border-b capitalize border-dotted border-slate-400 " +
  "pb-[1mm] text-[9pt] font-medium text-slate-800 wrap-anywhere";

export default function Employee_Print({
  data,
}: EmployeePrintProps) {
  if (!data) {
    return null;
  }

  const employee = data?.employee || {};
  const assignment = data?.assignment || {};
  const asset = assignment?.asset || {};

  const referenceNumber = `Darkstone-${String(
    assignment?.id || asset?.id || 0,
  ).padStart(5, "0")}`;

  const issueDate =
    assignment?.assignedAt ||
    assignment?.createdAt ||
    new Date().toISOString();

  const acknowledgmentItems = [
    "I confirm receipt of the above device in satisfactory working condition with all accessories.",
    "I accept full responsibility for the security, care, and proper use of the assigned device.",
    "I have read and understood the IT & Cybersecurity Policy outlined in this document.",
    "I agree to comply with all company policies regarding device usage and data protection.",
    "I will return this device immediately upon termination or when requested by management.",
    "I understand that any damage due to negligence or misuse may result in financial liability.",
  ];

  return (
    <Print_Layout>
      <div className="w-full font-sans text-[10pt] leading-[1.45] text-slate-800">
        {/* PAGE 1: DEVICE ACCEPTANCE AGREEMENT */}
        <section className="w-full">
          {/* Document Header */}
          <header className="mb-[6mm] text-center break-inside-avoid [page-break-inside:avoid]">

            <h1 className="m-0 text-[18pt] font-bold tracking-[1px] text-slate-900 uppercase">
              Device Acceptance Agreement
            </h1>

            <p className="mt-[1mm] text-[11pt] text-slate-500">
              Darkstone Technologies - IT Asset
              Assignment
            </p>

            <div className="mt-[4mm] border-t-[1.5px] border-slate-800" />

            <div className="mt-[3mm] flex items-center justify-between text-[8.5pt] text-slate-600">
              <span>
                Reference No:{" "}
                <strong className="text-slate-800">
                  {referenceNumber}
                </strong>
              </span>

              <span>
                Issue Date:{" "}
                <strong className="text-slate-800 capitalize">
                  {formatDate(issueDate)}
                </strong>
              </span>
            </div>
          </header>

          {/* Employee Details */}
          <section className="mb-[6mm] break-inside-avoid [page-break-inside:avoid]">
            <h2 className={sectionTitleClass}>
              Employee Details
            </h2>

            <div className="grid grid-cols-2 gap-x-[8mm] gap-y-[1mm]">
              <div className="grid grid-cols-[30mm_1fr] gap-[3mm]">
                <span className={labelClass}>
                  Full Name:
                </span>

                <span className={valueClass}>
                  {displayValue(
                    employee?.fullName,
                  )}
                </span>
              </div>

              <div className="grid grid-cols-[30mm_1fr] gap-[3mm]">
                
                <span className={labelClass}>
                  Iqama/Passport:
                </span>

                <span className={valueClass}>
                  {displayValue(
                    employee?.iqamaNumber,
                  )}
                </span>
              </div>

              <div className="grid grid-cols-[30mm_1fr] gap-[3mm]">
                <span className={labelClass}>
                  Phone Number:
                </span>

                <span className={valueClass}>
                  {displayValue(
                    employee?.phoneNumber,
                  )}
                </span>
              </div>

              <div className="grid grid-cols-[30mm_1fr] gap-[3mm]">
                <span className={labelClass}>
                  Department:
                </span>

                <span className={valueClass}>
                  {displayValue(
                    employee?.department,
                  )}
                </span>
              </div>

              <div className="grid grid-cols-[30mm_1fr] gap-[3mm]">
                <span className={labelClass}>
                  Position:
                </span>

                <span className={valueClass}>
                  {displayValue(
                    employee?.position,
                  )}
                </span>
              </div>

              <div className="grid grid-cols-[30mm_1fr] gap-[3mm]">
                <span className={labelClass}>
                  Email Address:
                </span>

                <span className={valueClass}>
                  {displayValue(employee?.email)}
                </span>
              </div>

              <div className="grid grid-cols-[30mm_1fr] gap-[3mm]">
                <span className={labelClass}>
                  Joining Date:
                </span>

                <span className={valueClass}>
                  {formatDate(employee?.joinDate)}
                </span>
              </div>
            </div>
          </section>

          {/* Assigned Device Details */}
          <section className="mb-[6mm] break-inside-avoid [page-break-inside:avoid]">

            <h2 className={sectionTitleClass}>
              Assigned Device Details
            </h2>

            <div className="grid grid-cols-2 gap-x-[8mm] gap-y-[1mm]">

              <div className="grid grid-cols-[30mm_1fr] gap-[3mm]">
                <span className={labelClass}>
                  Device Type:
                </span>

                <span className={valueClass}>
                  {displayValue(
                    asset?.assetType,
                  )}
                </span>
              </div>

              <div className="grid grid-cols-[30mm_1fr] gap-[3mm]">
                <span className={labelClass}>
                  Brand & Model:
                </span>

                <span className={valueClass}>
                  {displayValue(
                    asset?.assetName,
                  )}
                </span>
              </div>

              <div className="grid grid-cols-[30mm_1fr] gap-[3mm]">
                <span className={labelClass}>
                  Serial Number:
                </span>

                <span className={valueClass}>
                  {displayValue(
                    asset?.serialNumber,
                  )}
                </span>
              </div>

            

              <div className="grid grid-cols-[30mm_1fr] gap-[3mm]">
                <span className={labelClass}>
                  Condition:
                </span>

                <span className={valueClass}>
                  {displayValue(
                    assignment?.condition ||
                      asset?.condition ||
                      asset?.status,
                  )}
                </span>
              </div>

              <div className="grid grid-cols-[30mm_1fr] gap-[3mm]">
                <span className={labelClass}>
                  Assignment Date:
                </span>

                <span className={valueClass}>
                  {formatDate(
                    assignment?.assignedAt,
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* Employee Acknowledgment */}
          <section className="mb-[8mm] break-inside-avoid [page-break-inside:avoid]">
            <h2 className={sectionTitleClass}>
              Employee Acknowledgment & Acceptance
            </h2>

            <div className="space-y-[1mm]">
              {acknowledgmentItems.map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-[2.5mm] text-[9pt]"
                  >
                    <span className="mt-[0.3mm] block h-[4mm] w-[4mm] shrink-0 border border-slate-700" />

                    <p className="m-0">
                      {item}
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* Signatures */}
          <section className="  grid grid-cols-2 gap-[5mm] break-inside-avoid [page-break-inside:avoid]">
            
            <div className="border-t border-gray-500 pt-[1mm] text-center">
              <strong className="block text-[9pt]">
                Employee Signature
              </strong>

              <span className="mt-[2mm] block text-[8.5pt] text-slate-600">

                {displayValue(
                  employee?.fullName,
                )}

              </span>

              <span className=" block text-[8pt]">
                Date: _______________
              </span>
            </div>

            <div className="border-t border-gray-500 pt-[1mm] text-center">

              <strong className="block text-[9pt]">
                IT Department
              </strong>

              <span className="mt-[2mm] block text-[8pt]">
                Name: _______________
              </span>

              <span className="mt-[1.5mm] block text-[8pt]">
                Date: _______________
              </span>
            </div>
          </section>

          {/* Footer Note */}
          <section className="mt-[5mm] border-t border-slate-300 pt-[3mm] text-center text-[8pt] leading-[1.5] text-slate-500 break-inside-avoid [page-break-inside:avoid]">
            <p className="m-0">
              This is an official document. Please
              keep a copy for your records.
            </p>

            <p className="m-0">
              For device issues or technical
              support, contact IT Department
              immediately.
            </p>
          </section>
        </section>

        {/* PAGE 2 AND PAGE 3 */}
        <It_Policy
          employee={employee}
          issueDate={issueDate}
          referenceNumber={referenceNumber}
        />
      </div>
    </Print_Layout>
  );
}
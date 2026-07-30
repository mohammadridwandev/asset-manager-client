import Print_Layout from "../../Print_Layout";

type FinalizedPrintProps = {
  report: any;
};

type AssetsTableProps = {
  assets: any[];
};

function formatAmount(value: unknown) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0.00";
  }

  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  return String(value);
}

function formatStatus(value: unknown) {
  return displayValue(value).replaceAll("_", " ").toUpperCase();
}

function getStatusColor(status: unknown) {
  const value = String(status || "").toUpperCase();

  if (value === "FINALIZED" || value === "APPROVED") {
    return "text-[#087557]";
  }

  if (value === "REJECTED") {
    return "text-red-700";
  }

  return "text-amber-700";
}

const sectionTitleClass =
  "mb-[1.8mm] border-b border-[#c7cdd2] pb-[1.2mm] " +
  "text-[9.5pt] leading-none font-bold text-[#202a35] uppercase";

const informationLabelClass =
  "w-[42mm] shrink-0 text-[8pt] font-bold leading-[1.3] text-[#46515f]";

const informationValueClass =
  "min-w-0 flex-1 text-[8pt] font-medium leading-[1.3] " +
  "wrap-anywhere text-[#202a35]";

const tableHeaderClass =
  "border border-[#bcc3c9] bg-[#f3f3f3] " +
  "px-[2mm] py-[1.5mm] text-left text-[7.5pt] " +
  "leading-[1.15] font-bold text-[#111827]";

const tableCellClass =
  "border border-[#bcc3c9] px-[2mm] py-[1.5mm] " +
  "align-middle text-[7.3pt] leading-[1.2] " +
  "wrap-anywhere text-[#202a35]";

function AssetsTable({ assets }: AssetsTableProps) {
  return (
    <section className="mb-[2.5mm] w-full">
      <h2 className={sectionTitleClass}>Assets Returned</h2>

      <table className="w-full table-fixed border-collapse">
        <thead className="[display:table-header-group]">
          <tr>
            <th className={`${tableHeaderClass} w-[38%]`}>Asset Name</th>

            <th className={`${tableHeaderClass} w-[30%]`}>Serial Number</th>

            <th className={`${tableHeaderClass} w-[15%]`}>Condition</th>

            <th className={`${tableHeaderClass} w-[17%] text-right`}>
              Value
              <span className="block">(SAR)</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {assets.length > 0 ? (
            assets.map((asset: any, index: number) => (
              <tr
                key={asset?.id ?? `finalized-asset-${index}`}
                className="
                    break-inside-avoid
                    [page-break-inside:avoid]
                  "
              >
                <td className={tableCellClass}>
                  {displayValue(asset?.assetName)}
                </td>

                <td className={tableCellClass}>
                  {displayValue(asset?.serialNumber)}
                </td>

                <td className={tableCellClass}>
                  {displayValue(asset?.condition)}
                </td>

                <td className={`${tableCellClass} text-right font-medium`}>
                  {formatAmount(asset?.price)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className={`${tableCellClass} py-[2.5mm] text-center italic text-slate-500`}
              >
                No returned assets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default function Finalized_Print({ report }: FinalizedPrintProps) {
  if (!report) {
    return null;
  }

  const employee = report?.employee || {};

  const assignedAssets = Array.isArray(report?.assignedAssets)
    ? report.assignedAssets
    : [];

  const calculatedAssetPrice = assignedAssets.reduce(
    (sum: number, asset: any) => sum + Number(asset?.price || 0),
    0,
  );

  const totalAssetPrice =
    report?.totalAssetPrice !== undefined && report?.totalAssetPrice !== null
      ? Number(report.totalAssetPrice)
      : calculatedAssetPrice;

  const assetTypes = [
    ...new Set(
      assignedAssets.map((asset: any) => asset?.assetType).filter(Boolean),
    ),
  ];

  const deviceType =
    report?.deviceType || assetTypes.join(", ") || "Company Assets";

  const deviceCondition =
    report?.deviceCondition || assignedAssets?.[0]?.condition || "N/A";

  const deviceNotes =
    report?.deviceNotes ||
    report?.notes ||
    report?.finalNote ||
    report?.finalNotes ||
    assignedAssets
      .map((asset: any) => asset?.assetName)
      .filter(Boolean)
      .join(", ") ||
    "N/A";

  const signatures = ["IT QC Signature", "IT Manager Signature"];

  return (
    <Print_Layout>
      <div
        className="
          w-full
          font-sans
          text-[#202a35]
          [print-color-adjust:exact]
          [-webkit-print-color-adjust:exact]
        "
      >
        {/* Title */}
        <header
          className="
            mb-[4mm]
            break-inside-avoid
            text-center
            [page-break-inside:avoid]
          "
        >
          <h1
            className="
              m-0
              text-[17pt]
              leading-tight
              font-extrabold
              tracking-[0.2px]
              text-[#202a35]
              uppercase
            "
          >
            Finalized IT Clearance Certificate
          </h1>

          <p
            className="
              mt-[0.8mm]
              mb-0
              text-[10pt]
              font-medium
              text-[#303843]
            "
          >
            Asset Management System
          </p>

          <div className="mt-[3.5mm] border-b-[1.2px] border-[#303030]" />
        </header>

        {/* Employee Information */}
        <section
          className="
            mb-[3.5mm]
            break-inside-avoid
            [page-break-inside:avoid]
          "
        >
          <h2 className={sectionTitleClass}>Employee Information</h2>

          <div className="space-y-[1mm]">
            <div className="flex items-start">
              <span className={informationLabelClass}>Name:</span>

              <span className={informationValueClass}>
                {displayValue(employee?.fullName)}
              </span>
            </div>

            <div className="flex items-start">
              <span className={informationLabelClass}>Iqama ID:</span>

              <span className={informationValueClass}>
                {displayValue(employee?.iqamaNumber)}
              </span>
            </div>

            <div className="flex items-start">
              <span className={informationLabelClass}>Department:</span>

              <span className={informationValueClass}>
                {displayValue(employee?.department)}
              </span>
            </div>

            <div className="flex items-start">
              <span className={informationLabelClass}>Clearance Status:</span>

              <span
                className={[
                  informationValueClass,
                  "font-extrabold",
                  getStatusColor(report?.status),
                ].join(" ")}
              >
                {formatStatus(report?.status || "FINALIZED")}
              </span>
            </div>
          </div>
        </section>

        {/* Device Inspection */}
        <section
          className="
            mb-[3.5mm]
            break-inside-avoid
            [page-break-inside:avoid]
          "
        >
          <h2 className={sectionTitleClass}>Device Inspection</h2>

          <div
            className="
              rounded-[2mm]
              border
              border-[#d3d7db]
              px-[4mm]
              py-[2.4mm]
            "
          >
            <div className="space-y-[1mm]">
              <div className="flex items-start">
                <span className={informationLabelClass}>Device Type:</span>

                <span className={informationValueClass}>
                  {displayValue(deviceType)}
                </span>
              </div>

              <div className="flex items-start">
                <span className={informationLabelClass}>Condition:</span>

                <span className={informationValueClass}>
                  {displayValue(deviceCondition)}
                </span>
              </div>

              <div className="flex items-start">
                <span className={informationLabelClass}>Notes:</span>

                <span className={informationValueClass}>
                  {displayValue(deviceNotes)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Assets Returned */}
        <AssetsTable assets={assignedAssets} />

        {report?.remarks && (
          <section
            className="
      mb-[4mm]
      break-inside-avoid
      [page-break-inside:avoid]
    "
          >
            <h2 className={sectionTitleClass}>Additional Remarks</h2>
            <div
              className="
        text-[8pt]
        leading-[1.45]
        text-[#202a35]
      "
            >
              {report.remarks}
            </div>
          </section>
        )}

        {/* Totals */}
        <section
          className="
            mb-[3.5mm]
            flex
            justify-end
            break-inside-avoid
            [page-break-inside:avoid]
          "
        >
          <div
            className="
              flex
              items-center
              gap-[9mm]
              text-[7.7pt]
              font-bold
              text-[#202a35]
            "
          >
            <span>Total Assets: {assignedAssets.length}</span>

            <span>Total Value: {formatAmount(totalAssetPrice)} SAR</span>
          </div>
        </section>

        {/* Clearance Confirmation */}
        <section
          className="
            mb-[7mm]
            break-inside-avoid
            [page-break-inside:avoid]
          "
        >
          <h2 className={sectionTitleClass}>Clearance Confirmation</h2>

          <p
            className="
              m-0
              text-justify
              text-[7.7pt]
              leading-[1.4]
              text-[#202a35]
            "
          >
            This is to certify that the above-mentioned employee has returned
            all company assets in the condition described above. All IT
            equipment and access credentials have been properly collected and
            documented. The employee has completed the IT clearance process.
          </p>
        </section>

        {/* Signatures - Same Page */}
        <section
          className="
            grid
            grid-cols-2
            gap-x-[16mm]
            break-inside-avoid
            [page-break-inside:avoid]
          "
        >
          {signatures.map((signature) => (
            <div key={signature} className="min-w-0">
              <div className="border-t border-[#444]" />

              <h3
                className="
                    mt-[2.5mm]
                    mb-0
                    text-center
                    text-[8pt]
                    font-bold
                    text-[#202a35]
                  "
              >
                {signature}
              </h3>

              <p
                className="
                    mt-[3mm]
                    mb-0
                    text-center
                    text-[7.3pt]
                    text-[#202a35]
                  "
              >
                Name: ____________________
              </p>

              <p
                className="
                    mt-[1.5mm]
                    mb-0
                    text-center
                    text-[7.3pt]
                    text-[#202a35]
                  "
              >
                Date: ____________________
              </p>
            </div>
          ))}
        </section>
      </div>
    </Print_Layout>
  );
}

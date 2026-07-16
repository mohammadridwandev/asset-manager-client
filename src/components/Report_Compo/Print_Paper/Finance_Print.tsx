import Print_Layout from "../../Print_Layout";

type FinancePrintProps = {
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

// function formatDate(value: unknown) {
//   if (!value) {
//     return "N/A";
//   }

//   const date = new Date(value as string);

//   if (Number.isNaN(date.getTime())) {
//     return "N/A";
//   }

//   return date.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "2-digit",
//   });
// }

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

function formatStatus(value: unknown) {
  return displayValue(value)
    .replaceAll("_", " ")
    .toUpperCase();
}

const sectionTitleClass =
  "mb-[2mm] border-b border-[#c7cdd2] pb-[1.4mm] " +
  "text-[10pt] leading-none font-bold text-[#202a35] uppercase";

const informationLabelClass =
  "w-[43mm] shrink-0 text-[8.5pt] font-bold leading-[1.35] text-[#46515f]";

const informationValueClass =
  "min-w-0 flex-1 text-[8.5pt] font-medium leading-[1.35] " +
  "wrap-anywhere text-[#202a35]";

const tableHeaderClass =
  "border border-[#bcc3c9] bg-[#f3f3f3] " +
  "px-[2.3mm] py-[1.8mm] text-left text-[8pt] " +
  "leading-[1.15] font-bold text-[#111827]";

const tableCellClass =
  "border border-[#bcc3c9] px-[2.3mm] py-[1.8mm] " +
  "align-middle text-[7.8pt] leading-[1.25] " +
  "wrap-anywhere text-[#202a35]";

function AssetsTable({
  assets,
}: AssetsTableProps) {
  return (
    <section className="mb-[3.5mm] w-full">
      <h2 className={sectionTitleClass}>
        Equipment Details
      </h2>

      <table className="w-full table-fixed border-collapse">
        <thead className="[display:table-header-group]">
          <tr>
            <th
              className={`${tableHeaderClass} w-[36%]`}
            >
              Asset Name
            </th>

            <th
              className={`${tableHeaderClass} w-[27%]`}
            >
              Serial Number
            </th>

            <th
              className={`${tableHeaderClass} w-[18%]`}
            >
              Condition
            </th>

            <th
              className={`${tableHeaderClass} w-[19%] text-right`}
            >
              Value
              <span className="block">
                (SAR)
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {assets.length > 0 ? (
            assets.map(
              (
                asset: any,
                index: number,
              ) => (
                <tr
                  key={
                    asset?.id ??
                    `finance-asset-${index}`
                  }
                  className="
                    break-inside-avoid
                    [page-break-inside:avoid]
                  "
                >
                  <td
                    className={
                      tableCellClass
                    }
                  >
                    {displayValue(
                      asset?.assetName,
                    )}
                  </td>

                  <td
                    className={
                      tableCellClass
                    }
                  >
                    {displayValue(
                      asset?.serialNumber,
                    )}
                  </td>

                  <td
                    className={
                      tableCellClass
                    }
                  >
                    {displayValue(
                      asset?.condition,
                    )}
                  </td>

                  <td
                    className={`${tableCellClass} text-right font-medium`}
                  >
                    {formatAmount(
                      asset?.price,
                    )}
                  </td>
                </tr>
              ),
            )
          ) : (
            <tr>
              <td
                colSpan={4}
                className={`${tableCellClass} py-[3mm] text-center italic text-slate-500`}
              >
                No equipment found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default function Finance_Print({
  report,
}: FinancePrintProps) {
  if (!report) {
    return null;
  }

  const employee =
    report?.employee || {};

  const assignedAssets =
    Array.isArray(
      report?.assignedAssets,
    )
      ? report.assignedAssets
      : [];

  const calculatedAssetPrice =
    assignedAssets.reduce(
      (
        sum: number,
        asset: any,
      ) =>
        sum +
        Number(asset?.price || 0),
      0,
    );

  const totalAssetPrice =
    report?.totalAssetPrice !==
      undefined &&
    report?.totalAssetPrice !== null
      ? Number(
          report.totalAssetPrice,
        )
      : calculatedAssetPrice;

  const deviceType =
    report?.deviceType ||
    assignedAssets?.[0]
      ?.assetType ||
    "Company Equipment";

  const deviceCondition =
    report?.deviceCondition ||
    assignedAssets?.[0]
      ?.condition ||
    "N/A";

  // const rejectionReason =
  //   report?.rejectionReason ||
  //   report?.financeNote ||
  //   report?.financeNotes ||
  //   report?.description ||
  //   "Equipment condition requires finance approval.";

  const signatures = [
    "Finance Manager Signature",
    "Department Manager Signature",
    "IT QC Signature",
    "IT Manager Signature",
  ];


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
            mb-[5mm]
            break-inside-avoid
            text-center
            [page-break-inside:avoid]
          "
        >
          <h1
            className="
              m-0
              text-[18pt]
              leading-tight
              font-extrabold
              tracking-[0.2px]
              text-[#202a35]
              uppercase
            "
          >
            Finance Approval Request
          </h1>

          <p
            className="
              mt-[1mm]
              mb-0
              text-[10.5pt]
              font-medium
              text-[#303843]
            "
          >
            Asset Management System
          </p>

          <div className="mt-[4mm] border-b-[1.3px] border-[#303030]" />
        </header>

        {/* Request Information */}
        <section
          className="
            mb-[4mm]
            flex
            justify-end
            break-inside-avoid
            [page-break-inside:avoid]
          "
        >
          <div
            className="
              text-right
              text-[8pt]
              leading-[1.4]
              text-[#303843]
            "
          >
          </div>
        </section>

        {/* Warning */}
        <section
          className="
            mb-[4mm]
            break-inside-avoid
            rounded-[2mm]
            border
            border-[#e0b351]
            bg-[#fff8e7]
            px-[4mm]
            py-[3mm]
            [page-break-inside:avoid]
          "
        >
          <h2
            className="
              m-0
              text-[10pt]
              font-extrabold
              text-[#7a4a00]
              uppercase
            "
          >
            Damaged/Broken Equipment
            Clearance Request
          </h2>

          <p
            className="
              mt-[1mm]
              mb-0
              text-[8pt]
              leading-[1.4]
              text-[#684600]
            "
          >
            This request requires Finance
            Manager approval due to equipment
            condition issues.
          </p>
        </section>

        {/* Employee Information */}
        <section
          className="
            mb-[4mm]
            break-inside-avoid
            [page-break-inside:avoid]
          "
        >
          <h2
            className={
              sectionTitleClass
            }
          >
            Employee Information
          </h2>

          <div className="space-y-[1.2mm]">
            <div className="flex items-start">
              <span
                className={
                  informationLabelClass
                }
              >
                Name:
              </span>

              <span
                className={
                  informationValueClass
                }
              >
                {displayValue(
                  employee?.fullName,
                )}
              </span>
            </div>

            <div className="flex items-start">
              <span
                className={
                  informationLabelClass
                }
              >
                Iqama ID:
              </span>

              <span
                className={
                  informationValueClass
                }
              >
                {displayValue(
                  employee?.iqamaNumber,
                )}
              </span>
            </div>

            <div className="flex items-start">
              <span
                className={
                  informationLabelClass
                }
              >
                Department:
              </span>

              <span
                className={
                  informationValueClass
                }
              >
                {displayValue(
                  employee?.department,
                )}
              </span>
            </div>

            <div className="flex items-start">
              <span
                className={
                  informationLabelClass
                }
              >
                IT Clearance Status:
              </span>

              <span
                className={`${informationValueClass} font-extrabold text-red-700`}
              >
                {formatStatus(
                  report?.status,
                )}
              </span>
            </div>
          </div>
        </section>

        {/* Rejection Details */}
        <section
          className="
            mb-[4mm]
            break-inside-avoid
            [page-break-inside:avoid]
          "
        >
          <h2
            className={
              sectionTitleClass
            }
          >
            Rejection Details
          </h2>

          <div
            className="
              rounded-[2mm]
              border
              border-[#d3d7db]
              px-[4mm]
              py-[2.8mm]
            "
          >
            <div className="space-y-[1.3mm]">
              <div className="flex items-start">
                <span
                  className={
                    informationLabelClass
                  }
                >
                  Device Type:
                </span>

                <span
                  className={
                    informationValueClass
                  }
                >
                  {displayValue(
                    deviceType,
                  )}
                </span>
              </div>

              <div className="flex items-start">
                <span
                  className={
                    informationLabelClass
                  }
                >
                  Condition:
                </span>

                <span
                  className={
                    informationValueClass
                  }
                >
                  {displayValue(
                    deviceCondition,
                  )}
                </span>
              </div>

              <div className="flex items-start">
                {/* <span
                  className={
                    informationLabelClass
                  }
                >
                  Rejection Reason:
                </span> */}

                {/* <span
                  className={
                    informationValueClass
                  }
                >
                  {displayValue(
                    rejectionReason,
                  )}
                </span> */}


              </div>
            </div>
          </div>
        </section>

        {/* Equipment */}
        <AssetsTable
          assets={assignedAssets}
        />

        {/* Financial Impact */}
        <section
          className="
            mb-[4mm]
            break-inside-avoid
            [page-break-inside:avoid]
          "
        >
          <h2
            className={
              sectionTitleClass
            }
          >
            Financial Impact Summary
          </h2>

          <div
            className="
              overflow-hidden
              rounded-[2mm]
              border
              border-[#c8cdd1]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#d7dbde]
                px-[4mm]
                py-[2mm]
                text-[8.5pt]
              "
            >
              <span className="font-semibold">
                Total Assets
              </span>

              <strong>
                {assignedAssets.length}
              </strong>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#d7dbde]
                px-[4mm]
                py-[2mm]
                text-[8.5pt]
              "
            >
              <span className="font-semibold">
                Total Asset Value
              </span>

              <strong>
                {formatAmount(
                  totalAssetPrice,
                )}{" "}
                SAR
              </strong>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                bg-[#f4f4f4]
                px-[4mm]
                py-[2.3mm]
                text-[9pt]
              "
            >
              <span className="font-extrabold">
                Total Value
              </span>

              <strong className="text-[10pt]">
                {formatAmount(
                  totalAssetPrice,
                )}{" "}
                SAR
              </strong>
            </div>
          </div>

          <p
            className="
              mt-[2mm]
              mb-0
              text-[7.8pt]
              italic
              text-[#7a4a00]
            "
          >
            Note: Finance approval is required
            for damaged equipment handover.
          </p>
        </section>

        {/* Approval Authorization */}
        <section
          className="
           [page-break-before:always]
    break-before-page
    pt-[80mm]
    break-inside-avoid
    [page-break-inside:avoid] 
          "
        >
          <h2
            className={
              sectionTitleClass
            }
          >
            Approval Authorization
          </h2>

          <p
            className="
              m-0
              text-justify
              text-[8pt]
              leading-[1.45]
              text-[#202a35]
            "
          >
            By signing below, the authorized
            personnel acknowledge the equipment
            condition and approve the employee
            clearance despite the damages noted.
            The employee may be held financially
            responsible for damages as per company
            policy.
          </p>
        </section>

        {/* Signatures */}
        <section
          className="
            grid
            grid-cols-2
            gap-x-[16mm]
            gap-y-[5mm]
            break-inside-avoid
            [page-break-inside:avoid] pt-50
          "
        >
          {signatures.map(
            (signature) => (
              <div
                key={signature}
                className="min-w-0"
              >
                <h3
                  className="
                    m-0
                    mb-[2mm]
                    text-[8pt]
                    font-bold
                    text-[#202a35]
                  "
                >
                  {signature}
                </h3>

                <p className="my-[1.2mm] text-[7.8pt]">
                  Name:
                  ____________________
                </p>

                <p className="my-[1.2mm] text-[7.8pt]">
                  Date:
                  ____________________
                </p>
              </div>
            ),
          )}
        </section>

        {/* Important Note */}
        <section
          className="
            mt-[4mm]
            break-inside-avoid
            border-t
            border-[#c8cdd1]
            pt-[2mm]
            text-center
            [page-break-inside:avoid]
          "
        >
          <p
            className="
              m-0
              text-[7.5pt]
              font-bold
              text-red-700
              uppercase
            "
          >
            Important: This form must be signed
            by all parties before final IT
            clearance can be issued.
          </p>
        </section>
      </div>
    </Print_Layout>
  );
}
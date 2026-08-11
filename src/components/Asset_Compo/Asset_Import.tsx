import { useRef } from "react";
import { FiUpload } from "react-icons/fi";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

import {
  useCreateAsset,
  useGetAssets,
} from "../../context/useAssets";

export default function Asset_Import() {
  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const createAsset =
    useCreateAsset();

  const { data } =
    useGetAssets(
      1,
      1000,
    );

  const assets =
    data?.assets || [];

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  // =========================
  // EXCEL DATE FORMAT
  // =========================

  const formatPurchaseDate = (
    value: any,
  ) => {
    if (
      !value ||
      value === "N/A" ||
      value ===
        "Not Available"
    ) {
      return "";
    }

    if (
      typeof value ===
      "number"
    ) {
      const date =
        XLSX.SSF.parse_date_code(
          value,
        );

      if (!date) {
        return "";
      }

      return `${date.y}-${String(
        date.m,
      ).padStart(
        2,
        "0",
      )}-${String(
        date.d,
      ).padStart(
        2,
        "0",
      )}`;
    }

    const parsedDate =
      new Date(value);

    if (
      Number.isNaN(
        parsedDate.getTime(),
      )
    ) {
      return "";
    }

    return parsedDate
      .toISOString()
      .split("T")[0];
  };

  // =========================
  // IMPORT
  // =========================

  const handleImport = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      toast.error(
        "Only Excel (.xlsx/.xls) files are allowed.",
      );

      e.target.value = "";

      return;
    }

    try {
      const buffer =
        await file.arrayBuffer();

      const workbook =
        XLSX.read(
          buffer,
          {
            type: "array",
            cellDates:
              true,
          },
        );

      const sheetName =
        workbook
          .SheetNames[0];

      const worksheet =
        workbook.Sheets[
          sheetName
        ];

      const rows: any[] =
        XLSX.utils.sheet_to_json(
          worksheet,
        );

      if (
        rows.length === 0
      ) {
        toast.error(
          "Excel file is empty.",
        );

        return;
      }

      // =========================
      // REQUIRED VALIDATION
      // =========================

      for (
        let index = 0;
        index <
        rows.length;
        index++
      ) {
        const row =
          rows[index];

        if (
          !String(
            row[
              "Asset Name"
            ] || "",
          ).trim()
        ) {
          toast.error(
            `Row ${
              index + 2
            }: Asset Name is required.`,
          );

          return;
        }

        if (
          !String(
            row[
              "Asset Type"
            ] || "",
          ).trim()
        ) {
          toast.error(
            `Row ${
              index + 2
            }: Asset Type is required.`,
          );

          return;
        }

        if (
          !String(
            row[
              "Quantity"
            ] || "",
          ).trim()
        ) {
          toast.error(
            `Row ${
              index + 2
            }: Quantity is required.`,
          );

          return;
        }

        if (
          !String(
            row[
              "Price (SAR)"
            ] || "",
          ).trim()
        ) {
          toast.error(
            `Row ${
              index + 2
            }: Price is required.`,
          );

          return;
        }

        if (
          !String(
            row[
              "Purchase Date"
            ] || "",
          ).trim()
        ) {
          toast.error(
            `Row ${
              index + 2
            }: Purchase Date is required.`,
          );

          return;
        }
      }

      // =========================
      // DUPLICATE INSIDE EXCEL
      // =========================

      const checkExcelDuplicate =
        (
          fieldName:
            string,
          label:
            string,
        ) => {
          const seen =
            new Set<string>();

          for (
            let index = 0;
            index <
            rows.length;
            index++
          ) {
            const value =
              String(
                rows[
                  index
                ][
                  fieldName
                ] ||
                  "",
              )
                .trim()
                .toLowerCase();

            if (
              !value ||
              value ===
                "n/a" ||
              value ===
                "not available"
            ) {
              continue;
            }

            if (
              seen.has(
                value,
              )
            ) {
              toast.error(
                `Row ${
                  index +
                  2
                }: Duplicate ${label} found in Excel.`,
              );

              return true;
            }

            seen.add(
              value,
            );
          }

          return false;
        };

      if (
        checkExcelDuplicate(
          "Serial Number",
          "Serial Number",
        )
      ) {
        return;
      }

      if (
        checkExcelDuplicate(
          "Invoice Number",
          "Invoice Number",
        )
      ) {
        return;
      }

      let importedCount =
        0;

      let skippedCount =
        0;

      // =========================
      // IMPORT ROWS
      // =========================

      for (
        let index = 0;
        index <
        rows.length;
        index++
      ) {
        const row =
          rows[index];

        const serialNumber =
          String(
            row[
              "Serial Number"
            ] || "",
          )
            .trim()
            .toLowerCase();

        const invoiceNumber =
          String(
            row[
              "Invoice Number"
            ] || "",
          )
            .trim()
            .toLowerCase();

        const alreadyExists =
          assets.some(
            (
              asset: any,
            ) => {
              const existingSerial =
                String(
                  asset.serialNumber ||
                    "",
                )
                  .trim()
                  .toLowerCase();

              const existingInvoice =
                String(
                  asset.invoiceNumber ||
                    "",
                )
                  .trim()
                  .toLowerCase();

              return (
                (serialNumber &&
                  serialNumber !==
                    "n/a" &&
                  serialNumber !==
                    "not available" &&
                  existingSerial ===
                    serialNumber) ||
                (invoiceNumber &&
                  invoiceNumber !==
                    "n/a" &&
                  invoiceNumber !==
                    "not available" &&
                  existingInvoice ===
                    invoiceNumber)
              );
            },
          );

        if (
          alreadyExists
        ) {
          skippedCount++;

          continue;
        }

        // =========================
        // VALIDATE VALUES
        // =========================

        const quantity =
          Number(
            row[
              "Quantity"
            ],
          );

        if (
          !Number.isInteger(
            quantity,
          ) ||
          quantity < 1
        ) {
          toast.error(
            `Row ${
              index + 2
            }: Quantity must be at least 1.`,
          );

          return;
        }

        const price =
          Number(
            row[
              "Price (SAR)"
            ],
          );

        if (
          Number.isNaN(
            price,
          ) ||
          price < 0
        ) {
          toast.error(
            `Row ${
              index + 2
            }: Price must be 0 or greater.`,
          );

          return;
        }

        const purchaseDate =
          formatPurchaseDate(
            row[
              "Purchase Date"
            ],
          );

        if (
          !purchaseDate
        ) {
          toast.error(
            `Row ${
              index + 2
            }: Invalid Purchase Date.`,
          );

          return;
        }

        // =========================
        // CREATE FORM DATA
        // =========================

        const assetData =
          new FormData();

        assetData.append(
          "assetName",
          String(
            row[
              "Asset Name"
            ] || "",
          ).trim(),
        );

        assetData.append(
          "assetType",
          String(
            row[
              "Asset Type"
            ] || "",
          ).trim(),
        );

        // Serial Number
        const serialNumberValue =
          String(
            row[
              "Serial Number"
            ] || "",
          ).trim();

        if (
          serialNumberValue &&
          serialNumberValue.toLowerCase() !==
            "n/a" &&
          serialNumberValue.toLowerCase() !==
            "not available"
        ) {
          assetData.append(
            "serialNumber",
            serialNumberValue,
          );
        }

        // Invoice Number
        const invoiceNumberValue =
          String(
            row[
              "Invoice Number"
            ] || "",
          ).trim();

        if (
          invoiceNumberValue &&
          invoiceNumberValue.toLowerCase() !==
            "n/a" &&
          invoiceNumberValue.toLowerCase() !==
            "not available"
        ) {
          assetData.append(
            "invoiceNumber",
            invoiceNumberValue,
          );
        }

        assetData.append(
          "quantity",
          String(
            quantity,
          ),
        );

        assetData.append(
          "price",
          String(
            price,
          ),
        );

        assetData.append(
          "purchaseDate",
          purchaseDate,
        );

        const condition =
          String(
            row[
              "Condition"
            ] || "",
          ).trim();

        if (
          condition &&
          condition.toLowerCase() !==
            "n/a" &&
          condition.toLowerCase() !==
            "not available"
        ) {
          assetData.append(
            "condition",
            condition,
          );
        }

        const notes =
          String(
            row[
              "Notes"
            ] || "",
          ).trim();

        if (
          notes &&
          notes.toLowerCase() !==
            "n/a" &&
          notes.toLowerCase() !==
            "not available"
        ) {
          assetData.append(
            "notes",
            notes,
          );
        }

        await createAsset.mutateAsync(
          assetData,
        );

        importedCount++;
      }

      toast.success(
        `Import completed. New: ${importedCount}, Skipped existing: ${skippedCount}`,
      );
    } catch (
      error: any
    ) {
      console.error(
        "Asset Import Error:",
        error,
      );

      toast.error(
        error?.response
          ?.data
          ?.message ||
          error?.response
            ?.data
            ?.error ||
          "Failed to import assets.",
      );
    } finally {
      e.target.value =
        "";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={
          handleChooseFile
        }
        disabled={
          createAsset.isPending
        }
        className="flex cursor-pointer items-center gap-2 rounded-md border border-app-gray/20 px-4 py-2 text-sm font-semibold transition hover:border-app-brand hover:text-app-brand disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FiUpload
          size={17}
        />

        {createAsset.isPending
          ? "Importing..."
          : "Import"}
      </button>

      <input
        ref={
          fileInputRef
        }
        type="file"
        accept=".xlsx,.xls"
        onChange={
          handleImport
        }
        className="hidden"
      />
    </>
  );
}
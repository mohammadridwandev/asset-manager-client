import { useEffect } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import { useGetSingleInvoice } from "../../context/useInvoice";

export default function Printer_Page() {
  const { id } = useParams();

  const { data: invoice, isLoading } = useGetSingleInvoice(id);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_LINK;

  useEffect(() => {
    const generatePDF = () => {
      if (!invoice?.invoiceImage) return;

      const imageUrl = `${API_BASE_URL}${invoice.invoiceImage}`;

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(
          img,
          "JPEG",
          0,
          0,
          pageWidth,
          pageHeight,
        );

        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        window.open(pdfUrl, "_blank");
      };

      img.src = imageUrl;
    };

    generatePDF();
  }, [invoice, API_BASE_URL]);

  if (isLoading) return null;

  if (!invoice?.invoiceImage) return null;

  return null;
}
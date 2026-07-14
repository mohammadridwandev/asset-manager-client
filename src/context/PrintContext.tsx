import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useReactToPrint } from "react-to-print";

import Approved_Print from "../components/Report_Compo/Print_Paper/Approved_Print";
import Finance_Print from "../components/Report_Compo/Print_Paper/Finance_Print";


import Finalized_Print from "../components/Report_Compo/Print_Paper/Finazlied_Print";
import Employee_Print from "../components/Employee_comp/Print_Asset_Employee/Employee_Print";


  type PrintType =
  | "approved"
  | "finance"
  | "finalized"
  | "employee-agreement";

type PrintState = {
  type: PrintType;
  data: any;
} | null;

type PrintContextType = {
  printDocument: (
    type: PrintType,
    data: any,
  ) => void;

  isPrinting: boolean;
};

const PrintContext =
  createContext<PrintContextType | null>(null);

function waitForNextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

function waitForImages(
  container: HTMLElement | null,
) {
  if (!container) {
    return Promise.resolve();
  }

  const images = Array.from(
    container.querySelectorAll("img"),
  );

  if (images.length === 0) {
    return Promise.resolve();
  }

  const imagePromises = images.map((image) => {
    if (image.complete) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const finish = () => {
        image.removeEventListener(
          "load",
          finish,
        );

        image.removeEventListener(
          "error",
          finish,
        );

        resolve();
      };

      image.addEventListener(
        "load",
        finish,
        { once: true },
      );

      image.addEventListener(
        "error",
        finish,
        { once: true },
      );
    });
  });

  return Promise.all(imagePromises).then(
    () => undefined,
  );
}

export function PrintProvider({
  children,
}: {
  children: ReactNode;
}) {
  const printRef =
    useRef<HTMLDivElement>(null);

  const [printState, setPrintState] =
    useState<PrintState>(null);

  const [isPrinting, setIsPrinting] =
    useState(false);

  // UPDATED:
  // document title changes based on print type
  const getDocumentTitle = () => {
    if (!printState) {
      return "Darkstone-Document";
    }

    const employeeName =
      printState.data?.employee?.fullName ||
      "Employee";

    switch (printState.type) {
      case "approved":
        return `Employee-Clearance-${employeeName}`;

      case "finance":
        return `Finance-Clearance-${employeeName}`;

      case "finalized":
        return `Finalized-Clearance-${employeeName}`;

      default:
        return "Darkstone-Document";
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,

    documentTitle: getDocumentTitle(),

    onBeforePrint: async () => {
      await waitForImages(
        printRef.current,
      );

      await waitForNextFrame();
    },

    onAfterPrint: () => {
      setIsPrinting(false);
      setPrintState(null);
    },

    onPrintError: (
      errorLocation,
      error,
    ) => {
      console.error(
        `Print error at ${errorLocation}:`,
        error,
      );

      setIsPrinting(false);
      setPrintState(null);
    },
  });

  const printDocument = (
    type: PrintType,
    data: any,
  ) => {
    if (!data || isPrinting) {
      return;
    }

    setIsPrinting(true);

    setPrintState({
      type,
      data,
    });

    window.setTimeout(() => {
      void waitForNextFrame().then(() => {
        handlePrint();
      });
    }, 100);
  };

  // UPDATED:
  // correct print component renders based on type
  const renderPrintDocument = () => {
    if (!printState) {
      return null;
    }

    switch (printState.type) {
      case "approved":
        return (
          <Approved_Print
            report={printState.data}
          />
        );

      case "finance":
        return (
          <Finance_Print
            report={printState.data}
          />
        );

      case "finalized":
        return (
          <Finalized_Print
            report={printState.data}
          />
        );


         case "employee-agreement":
      return (
        <Employee_Print
          data={printState.data}
        />
      );



      default:
        return null;
    }
  };

  return (
    <PrintContext.Provider
      value={{
        printDocument,
        isPrinting,
      }}
    >
      {children}

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "-100000px",
          width: "210mm",
          height: 0,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <div
          ref={printRef}
          style={{
            width: "210mm",
            minHeight: "297mm",
            backgroundColor: "#ffffff",
          }}
        >
          {renderPrintDocument()}
        </div>
      </div>
    </PrintContext.Provider>
  );
}

export function usePrint() {
  const context =
    useContext(PrintContext);

  if (!context) {
    throw new Error(
      "usePrint must be used inside PrintProvider",
    );
  }

  return context;
}
type ItPolicyProps = {
  employee: any;
  issueDate: unknown;
  referenceNumber: string;
};

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
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

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const newPageClass =
  "w-full min-h-[297mm] box-border " +
  "pt-[67mm] pb-[38mm] " +
  "[break-before:page] [page-break-before:always]";

// Last Page
const lastPageClass =
  "w-full box-border " + "pt-[67mm]  " + "break-inside-avoid";

const policySectionClass =
  "mb-[2.5mm] break-inside-avoid " + "[page-break-inside:avoid]";

const policyTitleClass =
  "mb-[1mm] text-[9.5pt] leading-tight " + "font-bold text-slate-900";

const policyContentClass =
  "space-y-[0.7mm] text-[7.3pt] " + "leading-[1.28] text-slate-800";



export default function It_Policy({
  employee,
  issueDate,

}: ItPolicyProps) {
  return (
    <>
      {/* =====================================================
          PAGE 2
          Sections 1 to 6
      ====================================================== */}
      <section className={newPageClass}>

        {/* PAGE 2 HEADER */}
        <header className="mb-[3mm] border-b border-slate-500  text-center">

          <h2 className="m-0 text-[18pt] font-bold tracking-[0.6px] text-slate-900 uppercase">
            IT & Cybersecurity Policy
          </h2>

          <p className="mt-[1mm] pb-2 text-[11pt] text-slate-500">
            Darkstone Technologies - Device Usage Guidelines
          </p>
        </header>

        {/* =====================================================
            1. DEVICE SECURITY & PROTECTION
        ====================================================== */}
        <section className={policySectionClass}>
          <h3 className={policyTitleClass}>1. Device Security & Protection</h3>

          <div className={policyContentClass}>
            <div>
              <strong>Password Protection: </strong>
              Set a strong password with a minimum of eight characters and
              enable automatic screen lock after five minutes of inactivity.
              Never share your credentials.
            </div>

            <div>
              <strong>Physical Security: </strong>
              Never leave the device unattended in public places, vehicles, or
              unsecured locations. Always lock the device when stepping away.
            </div>

            <div>
              <strong>Lost or Stolen Device: </strong>
              Report any lost, stolen, or compromised device to the IT
              Department immediately.
            </div>

            <div>
              <strong>Device Encryption: </strong>
              Full disk encryption must remain enabled. Do not disable or bypass
              security features.
            </div>

            <div>
              <strong>Antivirus & Updates: </strong>
              Keep antivirus software active and install system and security
              updates promptly.
            </div>
          </div>
        </section>

        {/* =====================================================
            2. DATA PROTECTION & CONFIDENTIALITY
        ====================================================== */}
        <section className={policySectionClass}>
          <h3 className={policyTitleClass}>
            2. Data Protection & Confidentiality
          </h3>

          <div className={policyContentClass}>
            <div>
              <strong>Company Data: </strong>
              All company data is confidential and must not be shared with
              unauthorized individuals or external parties.
            </div>

            <div>
              <strong>Approved Storage: </strong>
              Store work files only on Darkstone Cloud or approved company
              storage. Do not use personal cloud services.
            </div>

            <div>
              <strong>Data Transfer: </strong>
              Transfer company data only through approved and secure channels,
              such as company email, encrypted drives, or Darkstone Cloud.
            </div>

            <div>
              <strong>Regular Backups: </strong>
              Back up important work data regularly to approved company storage.
            </div>

            <div>
              <strong>Personal Files: </strong>
              Minimize personal file storage on company devices and keep
              personal data separate from company data.
            </div>

            <div>
              <strong>Data Deletion: </strong>
              Do not delete company data without authorization. Company data
              will be securely erased upon device return.
            </div>
          </div>
        </section>

        {/* =====================================================
            3. ACCEPTABLE USE POLICY
        ====================================================== */}
        <section className={policySectionClass}>
          <h3 className={policyTitleClass}>3. Acceptable Use Policy</h3>

          <div className={policyContentClass}>
            <div>
              <strong>Primary Purpose: </strong>
              The device is provided primarily for business use. Limited
              personal use must not interfere with work.
            </div>

            <div>
              <strong>Prohibited Activities: </strong>
              Illegal downloads, pirated software, gambling, inappropriate
              content, hate speech, and harassment are prohibited.
            </div>

            <div>
              <strong>Software Installation: </strong>
              Install only software approved by the IT Department.
            </div>

            <div>
              <strong>Internet Usage: </strong>
              Use the internet responsibly. Excessive personal browsing or
              streaming during working hours is prohibited.
            </div>

            <div>
              <strong>Email Usage: </strong>
              Use company email professionally and do not send spam, chain
              letters, or inappropriate content.
            </div>

            <div>
              <strong>Social Media: </strong>
              Do not disclose confidential company information through social
              media.
            </div>
          </div>
        </section>

        {/* =====================================================
            4. DEVICE CARE & MAINTENANCE
        ====================================================== */}
        <section className={policySectionClass}>
          <h3 className={policyTitleClass}>4. Device Care & Maintenance</h3>

          <div className={policyContentClass}>
            <div>
              <strong>Physical Care: </strong>
              Handle the device carefully and protect it from liquids, moisture,
              and extreme temperatures.
            </div>

            <div>
              <strong>Cleaning: </strong>
              Clean the device using an approved cleaner and a microfiber cloth.
            </div>

            <div>
              <strong>No Self-Repairs: </strong>
              Do not repair, disassemble, or modify company hardware. Contact
              the IT Department for support.
            </div>

            <div>
              <strong>Accessories: </strong>
              Keep all provided accessories safe and return them with the
              device.
            </div>
          </div>
        </section>

        {/* =====================================================
            5. NETWORK & REMOTE ACCESS
        ====================================================== */}
        <section className={policySectionClass}>
          <h3 className={policyTitleClass}>5. Network & Remote Access</h3>

          <div className={policyContentClass}>
            <div>
              <strong>Secure Networks: </strong>
              Connect only to trusted and password-protected networks.
            </div>

            <div>
              <strong>VPN Usage: </strong>
              Use the company VPN when accessing company resources remotely.
            </div>

            <div>
              <strong>Credential Protection: </strong>
              Never share usernames, passwords, or access credentials.
            </div>

            <div>
              <strong>Remote Work: </strong>
              Work in a secure environment and do not allow another person to
              use the assigned device.
            </div>
          </div>
        </section>

        {/* =====================================================
            6. DEVICE RETURN & TERMINATION
        ====================================================== */}
        <section className={policySectionClass}>
          <h3 className={policyTitleClass}>6. Device Return & Termination</h3>

          <div className={policyContentClass}>
            <div>
              <strong>Return Timeline: </strong>
              The device must be returned on the employee&apos;s last working
              day or when requested by management.
            </div>

            <div>
              <strong>Return Condition: </strong>
              Return the device in good working condition with all assigned
              accessories.
            </div>

            <div>
              <strong>Data Backup: </strong>
              Back up authorized personal files before returning the device. The
              IT Department will perform a complete data wipe.
            </div>

            <div>
              <strong>Damage Liability: </strong>
              The employee may be liable for repair or replacement costs if
              damage results from negligence or misuse.
            </div>

            <div>
              <strong>Clearance Requirement: </strong>
              Device return is mandatory for employment clearance and final
              settlement.
            </div>
          </div>
        </section>

        {/* PAGE 2 FOOTER */}
        <footer className="mt-[3mm] border-t border-slate-300 pt-[1.5mm] text-right text-[7pt] text-slate-500">
          Darkstone Technologies - IT Department | Page 2 of 3
        </footer>

      </section>

      {/* =====================================================
          PAGE 3
          Sections 7 to 9
          Binding Agreement
          Signatures
      ====================================================== */}
      <section className={lastPageClass}>
        {/* =====================================================
            7. COMPLIANCE & MONITORING
        ====================================================== */}
        <section className={policySectionClass}>
          <h3 className={policyTitleClass}>7. Compliance & Monitoring</h3>

          <div className={policyContentClass}>
            <div>
              <strong>Monitoring Rights: </strong>
              Darkstone Technologies reserves the right to monitor device usage,
              internet activity, and company email for security and compliance.
            </div>

            <div>
              <strong>No Privacy Expectation: </strong>
              Employees should not expect privacy when using company-owned
              devices.
            </div>

            <div>
              <strong>Policy Violations: </strong>
              Violations may result in disciplinary action, including warning,
              suspension, or termination.
            </div>

            <div>
              <strong>Legal Action: </strong>
              Serious violations, such as illegal activity, data theft, or
              sabotage, may result in legal action.
            </div>

            <div>
              <strong>Policy Updates: </strong>
              This policy may be updated periodically. Employees will be
              informed of significant changes.
            </div>
          </div>
        </section>

        {/* =====================================================
            8. MOBILE & PERSONAL DEVICE POLICY
        ====================================================== */}
        <section className={policySectionClass}>
          <h3 className={policyTitleClass}>
            8. Mobile & Personal Device Policy
          </h3>

          <div className={policyContentClass}>
            <div>
              <strong>Personal Device Use: </strong>
              Personal devices must not be used to access or store company data
              unless explicitly authorized.
            </div>

            <div>
              <strong>BYOD Policy: </strong>
              Approved personal devices used for work remain subject to the same
              security requirements.
            </div>

            <div>
              <strong>Dual Use: </strong>
              Company devices must not be synchronized with personal accounts or
              used to store personal sensitive data.
            </div>
          </div>
        </section>

        {/* =====================================================
            9. ADDITIONAL SECURITY REQUIREMENTS
        ====================================================== */}
        <section className={policySectionClass}>
          <h3 className={policyTitleClass}>
            9. Additional Security Requirements
          </h3>

          <div className={policyContentClass}>
            <div>
              <strong>Multi-Factor Authentication: </strong>
              Enable multi-factor authentication whenever available.
            </div>

            <div>
              <strong>Phishing Awareness: </strong>
              Report suspicious emails, links, and login attempts to the IT
              Department immediately.
            </div>

            <div>
              <strong>Screen Privacy: </strong>
              Use appropriate privacy measures when handling confidential
              information in public places.
            </div>

            <div>
              <strong>Device Locking: </strong>
              Always lock the device when leaving the desk, even for a short
              period.
            </div>
          </div>
        </section>

        {/* =====================================================
            BINDING AGREEMENT
        ====================================================== */}
        <section className="mt-[6mm] break-inside-avoid border border-slate-300 bg-slate-50 p-[4mm] [page-break-inside:avoid]">

          <h2 className="mb-[2.5mm] text-[11pt] font-bold text-slate-900 uppercase">
            Binding Agreement & Final Acknowledgment
          </h2>

          <p className="m-0 text-[8.3pt] leading-[1.45]">
            I, <strong>{displayValue(employee?.fullName)}</strong> (Iqama:{" "}
            <strong>{displayValue(employee?.iqamaNumber)}</strong>
            ), have carefully read and fully understood all terms in this Device
            Acceptance Agreement and IT & Cybersecurity Policy. I agree to
            comply with all policies outlined herein.
          </p>

          <p className="mt-[3mm] mb-[1.5mm] text-[8.5pt] font-bold">
            I acknowledge that:
          </p>

          <div className="space-y-[1.2mm] text-[8.2pt] leading-[1.35]">
            <div>• The device remains company property at all times.</div>

            <div>
              • I am responsible for device security, proper usage, and timely
              return.
            </div>

            <div>
              • Policy violations may result in disciplinary action or
              termination.
            </div>

            <div>
              • I may be financially liable for damage caused by negligence or
              misuse.
            </div>
          </div>
        </section>

        {/* =====================================================
            SIGNATURES
        ====================================================== */}
        <section className="mt-[14mm] grid grid-cols-2 pt-30  gap-[10mm] break-inside-avoid [page-break-inside:avoid]">
          <div className="border-t border-slate-400 pt-[3mm] text-center">
            <strong className="block text-[8.5pt]">Employee Signature</strong>

            <span className="mt-[1mm] capitalize block text-[8pt] text-slate-600">
              {displayValue(employee?.fullName)}
            </span>
          </div>

          <div className="border-t border-slate-400 pt-[3mm] text-center">
            <strong className="block text-[8.5pt]">Date</strong>

            <span className=" block text-[8pt] text-slate-600">
              {formatDate(issueDate)}
            </span>
          </div>
        </section>

       

      </section>
    </>
  );
}

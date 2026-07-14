import { FiMonitor, FiShield } from "react-icons/fi";

export default function Assigned_Info({ employee }: { employee: any }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-app-gray/15 bg-app-bg p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-2 text-lg font-bold">
          <span className="text-app-brand">
            <FiMonitor />
          </span>
          Assigned Assets
        </h3>

        {employee.assetAssignments?.length ? (
          <div className="grid grid-cols-1 gap-4">
            {employee.assetAssignments.map((item: any) => (
              <AssetCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Empty text="No active assets assigned." />
        )}
      </div>

      <div className="rounded-2xl border border-app-gray/15 bg-app-bg p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-2 text-lg font-bold">
          <span className="text-app-brand">
            <FiShield />
          </span>
          Assigned Licenses
        </h3>

        {employee.licenseAssignments?.length ? (
          <div className="grid grid-cols-1 gap-4">
            {employee.licenseAssignments.map((item: any) => (
              <LicenseCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Empty text="No active licenses assigned." />
        )}
      </div>
    </section>
  );
}

const AssetCard = ({ item }: any) => {
  const asset = item.asset;

  return (
    <div className="rounded-xl border border-app-gray/15 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold">{asset.assetName}</h4>
          <p className="text-sm text-app-gray">{asset.assetType}</p>
        </div>

        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
          Assigned
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Mini label="Serial" value={asset.serialNumber || "N/A"} />
        <Mini label="Invoice" value={asset.invoiceNumber || "N/A"} />
        <Mini label="Condition" value={asset.condition || "N/A"} />
        <Mini
          label="Price"
          value={`SAR ${Number(asset.price || 0).toLocaleString()}`}
        />
      </div>
    </div>
  );
};

const LicenseCard = ({ item }: any) => {
  const license = item.license;

  return (
    <div className="rounded-xl border border-app-gray/15 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold">{license.softwareName}</h4>
          <p className="text-sm text-app-gray">
            {license.vendorPublisher || "No vendor"}
          </p>
        </div>

        <span className="rounded-full bg-app-brand/10 px-3 py-1 text-xs font-bold text-app-brand">
          {license.licenseType}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Mini label="License Key" value={license.licenseKey || "N/A"} />
        <Mini label="Quantity" value={license.totalQuantity || 0} />
        <Mini
          label="Cost"
          value={`SAR ${Number(license.costs || 0).toLocaleString()}`}
        />
        <Mini
          label="Expiry"
          value={
            license.expiryDate
              ? new Date(license.expiryDate).toLocaleDateString()
              : "N/A"
          }
        />
      </div>
    </div>
  );
};

const Mini = ({ label, value }: any) => (
  <div className="rounded-lg bg-app-gray/5 p-3">
    <p className="text-app-gray">{label}</p>
    <p className="mt-1 font-semibold truncate">{value}</p>
  </div>
);

const Empty = ({ text }: { text: string }) => (
  <div className="rounded-xl border border-dashed border-app-gray/20 p-6 text-center text-sm text-app-gray">
    {text}
  </div>
);
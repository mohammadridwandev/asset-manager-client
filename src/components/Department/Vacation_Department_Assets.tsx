import { FiPackage } from "react-icons/fi";

type Props = {
  employee?: any;
};

export default function Vacation_Department_Assets({
  employee,
}: Props) {
  const assets =
    employee?.assetAssignments || [];

  return (
    <div className="rounded-xl border border-app-gray/10 bg-app-bg p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-app-brand/10 text-app-brand">
          <FiPackage size={20} />
        </div>

        <div>
          <h3 className="font-semibold text-app-text">
            Vacation Department Assets
          </h3>

          <p className="text-sm text-app-gray">
            Assets handed over by employees during vacation
          </p>
        </div>
      </div>

      {employee && (
        <div className="mt-4 border-t border-app-gray/10 pt-4">
          <p className="text-sm font-medium text-app-text">
            {employee.fullName}
          </p>

          <p className="mt-1 text-xs text-app-gray">
            Total Assets: {assets.length}
          </p>
        </div>
      )}

      {assets.length > 0 && (
        <div className="mt-4 space-y-2">
          {assets.map((assignment: any) => {
            const asset =
              assignment.asset || assignment;

            return (
              <div
                key={
                  assignment.id ||
                  asset.id
                }
                className="rounded-lg border border-app-gray/10 p-3"
              >
                <p className="text-sm font-medium text-app-text">
                  {asset?.assetName ||
                    "Unnamed Asset"}
                </p>

                {asset?.serialNumber && (
                  <p className="mt-1 text-xs text-app-gray">
                    Serial:{" "}
                    {asset.serialNumber}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
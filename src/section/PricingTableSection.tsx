const tableData = {
  headers: ["Feature Category", "Free", "Monthly", "Yearly"],
  rows: [
    {
      feature: "Feature text goes here",
      free: "10",
      monthly: "25",
      yearly: "Unlimited",
    },
    {
      feature: "Feature text goes here",
      free: true,
      monthly: true,
      yearly: true,
    },
    {
      feature: "Feature text goes here",
      free: true,
      monthly: true,
      yearly: true,
    },
    {
      feature: "Feature text goes here",
      free: false,
      monthly: true,
      yearly: true,
    },
    {
      feature: "Feature text goes here",
      free: false,
      monthly: false,
      yearly: true,
    },
  ],
};

const CellValue = ({ value }: { value: boolean | string }) => {
  if (value === true) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-light-text mx-auto"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }

  if (value === false) {
    return null;
  }

  // Custom text (e.g. "10", "Unlimited")
  return (
    <span className="font-body text-base md:text-lg font-semibold text-light-text">
      {value}
    </span>
  );
};

const PricingTableSection = () => {
  return (
    <section
      data-bg="light"
      className="w-full pb-14 md:pb-20 px-4 sm:px-10 lg:px-[100px]"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── TABLE ── */}
        <div className="overflow-x-auto md:px-5">
          <table className="w-full min-w-[520px] border-collapse">

            {/* ── HEADER ROW ── */}
            <thead>
              <tr className="border-b border-light-outline-secondary">
                {tableData.headers.map((header, index) => (
                  <th
                    key={index}
                    className={`py-6 md:py-8 px-4 font-heading font-bold text-lg md:text-2xl text-light-text
                      ${index === 0 ? "text-center w-[35%]" : "text-center border-l border-light-outline-secondary/40"}
                    `}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── DATA ROWS ── */}
            <tbody>
              {tableData.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b border-light-outline-secondary transition-colors duration-200 hover:bg-light-panel
                  `}
                >
                  {/* Feature Name */}
                  <td className="py-4 pr-4 font-body text-base md:text-lg text-light-outline text-left">
                    {row.feature}
                  </td>

                  {/* Free */}
                  <td className="py-4 px-4 text-center border-l border-light-outline-secondary/40">
                    <CellValue value={row.free} />
                  </td>

                  {/* Monthly */}
                  <td className="py-4 px-4 text-center border-l border-light-outline-secondary/40">
                    <CellValue value={row.monthly} />
                  </td>

                  {/* Yearly */}
                  <td className="py-4 px-4 text-center border-l border-light-outline-secondary/40">
                    <CellValue value={row.yearly} />
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </section>
  );
};

export default PricingTableSection;

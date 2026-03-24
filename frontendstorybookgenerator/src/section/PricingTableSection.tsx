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
        className="text-light-primary dark:text-dark-primary mx-auto"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }

  if (value === false) {
    return <span className="text-light-outline-secondary dark:text-dark-primary-30">—</span>;
  }

  // Custom text (e.g. "10", "Unlimited")
  return (
    <span className="font-body text-sm font-medium text-light-text dark:text-dark-text">
      {value}
    </span>
  );
};

const PricingTableSection = () => {
  return (
    <section
      data-bg="light"
      className="w-full py-14 px-6 md:px-12 xl:px-20 bg-light-bg dark:bg-dark-bg"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── TABLE ── */}
        <div className="rounded-2xl overflow-hidden border border-light-outline-secondary dark:border-dark-primary-30 bg-light-on-primary dark:bg-dark-bg">
          <table className="w-full">

            {/* ── HEADER ROW ── */}
            <thead>
              <tr className="border-b border-light-outline-secondary dark:border-dark-primary-30">
                {tableData.headers.map((header, index) => (
                  <th
                    key={index}
                    className={`py-5 px-6 font-display font-bold text-sm text-light-text dark:text-dark-text
                      ${index === 0 ? "text-left w-[40%]" : "text-center"}
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
                  className={`border-b border-light-outline-secondary dark:border-dark-primary-30 transition-colors duration-200 hover:bg-dark-primary-10
                    ${rowIndex === tableData.rows.length - 1 ? "border-b-0" : ""}
                  `}
                >
                  {/* Feature Name */}
                  <td className="py-4 px-6 font-body text-sm text-light-outline dark:text-dark-text text-left">
                    {row.feature}
                  </td>

                  {/* Free */}
                  <td className="py-4 px-6 text-center">
                    <CellValue value={row.free} />
                  </td>

                  {/* Monthly */}
                  <td className="py-4 px-6 text-center">
                    <CellValue value={row.monthly} />
                  </td>

                  {/* Yearly */}
                  <td className="py-4 px-6 text-center">
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

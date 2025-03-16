type BudgetTopProgramsProps = {
    className?: string;
  };
  
  const BudgetTopPrograms: React.FC<BudgetTopProgramsProps> = ({ className }) => {
    const programs = [
      { name: "Program A", budget: "Rp.1.250.000.000", bgColor: "rgba(108, 154, 139, 1)" },
      { name: "Program B", budget: "Rp.1.100.000.000", bgColor: "rgba(108, 154, 139, 0.8)" },
      { name: "Program C", budget: "Rp.1.000.000.000", bgColor: "rgba(108, 154, 139, 0.6)" },
      { name: "Program D", budget: "Rp.850.000.000", bgColor: "rgba(108, 154, 139, 0.4)" },
      { name: "Program E", budget: "Rp.820.000.000", bgColor: "rgba(108, 154, 139, 0.2)" },
    ];
  
    return (
      <div className={`bg-white p-6 rounded-lg shadow-md border ${className}`}>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Top Program Berdasarkan Realisasi Anggaran
        </h2>
        <ul className="space-y-2">
          {programs.map((program, index) => (
            <li
              key={index}
              className="flex justify-between items-center px-4 py-4 rounded-lg text-md text-gray-900 font-medium"
              style={{ backgroundColor: program.bgColor }}
            >
              <span>{program.name}</span>
              <span className="font-medium">{program.budget}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default BudgetTopPrograms;  
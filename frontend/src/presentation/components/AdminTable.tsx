import React from "react";

interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchKey?: keyof T;
}

const AdminTable = <T extends { id: string | number }>({ 
  data, 
  columns, 
  isLoading,
  searchPlaceholder = "Search records...",
  searchKey
}: AdminTableProps<T>) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredData = React.useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    if (!searchTerm || !searchKey) return list;
    return list.filter(item => {
      const val = (item as any)[searchKey];
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchKey]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-maritime-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-maritime-gray animate-pulse font-medium">Fetching secure data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-maritime-gray/40 border-2 border-dashed border-maritime-light rounded-2xl">
        <p className="italic">No records found in the database.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="flex items-center gap-3 bg-maritime-dark/40 border border-maritime-light p-2 px-4 rounded-xl w-full max-w-md focus-within:border-maritime-accent/50 transition-all">
          <svg className="w-4 h-4 text-maritime-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-sm w-full py-1"
          />
        </div>
      )}

      <div className="overflow-hidden border border-maritime-light rounded-xl bg-maritime-dark/20">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/40 text-maritime-gray uppercase text-[10px] font-bold tracking-widest">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 border-b border-maritime-light">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-maritime-light/30">
            {filteredData.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-maritime-accent/5 transition-colors group"
              >
                {columns.map((col, idx) => (
                  <td key={idx} className="px-6 py-4 text-sm font-medium">
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;

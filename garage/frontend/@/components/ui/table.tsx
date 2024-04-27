type TableItems = {
  children: any;
  className?: string;
};
const TableItem = ({ children, className }: TableItems) => {
  return (
    <th className={`${className} px-2 py-1 font-normal border-2 border-grey`}>
      {children}
    </th>
  );
};
const TableData = ({ children, className }: TableItems) => {
  return <td className={`${className}`}>{children}</td>;
};

const TableRow = ({ children, className }: TableItems) => {
  return <tr className={`${className}`}>{children}</tr>;
};

const TableHead = ({ children, className }: TableItems) => {
  return <thead className={`${className}`}>{children}</thead>;
};

const TableBody = ({ children, className }: TableItems) => {
  return <tbody className={`${className}`}>{children}</tbody>;
};

const Table = ({ children, className }: TableItems) => {
  return (
    <table className={`${className} text-sm font-normal`}>{children}</table>
  );
};
export { Table, TableHead, TableBody, TableRow, TableItem, TableData };

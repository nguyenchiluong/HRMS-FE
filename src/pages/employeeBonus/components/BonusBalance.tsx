export default function BalanceCard ({balance}: {balance: number}) {
  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">Total Balance</p>
      <h2 className="mt-2 text-3xl font-semibold text-gray-900">
        ${balance.toLocaleString()}
      </h2>
    </div>
  );
};

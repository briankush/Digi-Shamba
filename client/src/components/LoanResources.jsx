import React from "react";

const banks = [
  { name: "KCB", url: "https://www.kcbgroup.com/loans/agri-loan" },
  { name: "Equity Bank", url: "https://equitybankgroup.com/agribusiness" },
  { name: "Co-operative Bank", url: "https://www.co-opbank.co.ke/loans" },
  // ...add more
];

export default function LoanResources() {
  return (
    <section className="bg-white p-8">
      <h2 className="text-3xl font-bold mb-4">Farmer Loan Partners</h2>
      <ul className="grid gap-4 md:grid-cols-2">
        {banks.map(b => (
          <li key={b.name} className="border rounded p-4 hover:shadow">
            <h3 className="text-xl font-semibold mb-2">{b.name}</h3>
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Visit Loan Info
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

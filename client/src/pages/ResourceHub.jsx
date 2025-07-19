import React from "react";

// Summary: Added direct resource links for each bank
const banks = [
  {
    name: "KCB Agribusiness Loan",
    policy: "Low‐interest loan tailored for crop and livestock farmers.",
    requirements: [
      "Valid ID or passport",
      "Proof of land ownership or lease agreement",
      "Detailed farm business plan",
      "Bank statements for the last 6 months"
    ],
    url: "https://ke.kcbgroup.com/for-your-biashara/get-a-loan/for-agri-business/agri-business-loans"
  },
  {
    name: "Equity Livestock Finance",
    policy: "Flexible repayment over 12–24 months with seasonal grace periods.",
    requirements: [
      "Kenyan ID",
      "Livestock ownership records",
      "Pasture or feed procurement plan",
      "Agricultural input invoices"
    ],
    url: "https://equitybankgroup.com/agribusiness"
  },
  {
    name: "Co‐operative Bank Farm Support",
    policy: "Collateral‐free loans up to 1M Ksh for smallholder farmers.",
    requirements: [
      "Co‐op Bank membership",
      "Group guarantor (if SHG member)",
      "Farm activity budget",
      "Proof of farm registration"
    ],
    url: "https://www.co-opbank.co.ke/loans"
  }
];

export default function ResourceHub() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-20">
      {/* Main title */}
      <h1 className="text-3xl font-bold mb-6">Resource Center</h1>

      {/* Loans subsection */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Loans</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {banks.map(bank => (
            <div key={bank.name} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{bank.name}</h2>
              <p className="mb-4 text-gray-600"><strong>Policy:</strong> {bank.policy}</p>
              <p className="font-medium mb-2">Requirements:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                {bank.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
              <div className="mt-4">
                <a
                  href={bank.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Visit {bank.name}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ...any other sections... */}
    </div>
  );
}

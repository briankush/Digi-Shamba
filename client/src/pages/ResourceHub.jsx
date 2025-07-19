import React from "react";

// Summary: Added direct resource links for each bank
const banks = [
  // Equity Bank products
  {
    name: "Equity Bank – Micro Agribusiness Loan",
    policy: "For livestock & crop production, traders & processors. Apply in-branch.",
    requirements: [
      "Valid ID/Passport",
      "KRA PIN",
      "Business plan",
      "Last 6 months bank statements"
    ],
    url: "https://equitygroupholdings.com/ke/borrow/agri-business/micro-agribusiness-loan/"
  },
  {
    name: "Equity Bank – Commercial Agriculture Loan",
    policy: "Medium & large-scale farming, including livestock. In-branch application.",
    requirements: [
      "Valid ID/Passport",
      "Land ownership or lease",
      "Production forecast",
      "Financial statements"
    ],
    url: "https://equitygroupholdings.com/ke/borrow/agri-business/commercial-agriculture-loan/"
  },
  {
    name: "Equity Bank – Farm Inputs Loan",
    policy: "Chattels mortgage over livestock accepted. Apply at branch.",
    requirements: [
      "Valid ID/Passport",
      "Input purchase invoices",
      "Livestock inventory"
    ],
    url: "https://equitygroupholdings.com/ke/borrow/agri-business/farm-inputs-loan/"
  },

  // KCB Bank
  {
    name: "KCB – Agri-Business & Livestock Farming Loan",
    policy: "Funds purchase/fattening of livestock, egg & pasture production. Requires active KCB account.",
    requirements: [
      "KCB account in farmer’s name",
      "ID/Passport",
      "Farm business plan",
      "Farm proceeds remittance proof"
    ],
    url: "https://ke.kcbgroup.com/for-your-biashara/get-a-loan/for-agri-business/agri-business-loans"
  },

  // Co-operative Bank
  {
    name: "Co-operative Bank – Agri-Business Loans",
    policy: "Dairy & agribusiness financing products. In-branch enquiry.",
    requirements: [
      "Co-op Bank membership",
      "ID/Passport",
      "Group guarantor (if SHG member)"
    ],
    url: "https://www.co-opbank.co.ke/corporate/agri-business/"
  },

  // Bank of Africa
  {
    name: "Bank of Africa – Agribusiness Loan",
    policy: "Purchase livestock or inputs. Branch application needed.",
    requirements: [
      "Valid ID/Passport",
      "Farm budget",
      "Collateral documents"
    ],
    url: "https://boakenya.com/business-banking/loans-credit-facilities/other-loans/agribusiness-loan/"
  },

  // Microfinance & specialized lenders
  {
    name: "Faulu – Kilimo Bora Loan",
    policy: "Supports purchase of pigs, poultry, rabbits, dairy cows & goats.",
    requirements: ["ID/Passport", "Livestock plan", "Group membership maybe"],
    url: "https://www.faulukenya.com/business-banking/kilimo-bora/"
  },
  {
    name: "Faulu – Maziwa Loan",
    policy: "For dairy farmers: high-yield cattle & farm improvement.",
    requirements: ["ID/Passport", "Milk supplier contract"],
    url: "https://www.faulukenya.com/business-banking/maziwa-loan/"
  },
  {
    name: "AFC – Agricultural Finance Corporation",
    policy: "Government-mandated credit for agricultural development.",
    requirements: ["ID/Passport", "Farm registration", "Business plan"],
    url: "https://agrifinance.org/access-to-credit/"
  },
  {
    name: "Juhudi Kilimo – Farm Animal Loans",
    policy: "Finances dairy cows, poultry, goats & sheep.",
    requirements: ["ID/Passport", "Livestock records"],
    url: "https://juhudikilimo.com/loan/farm-animal-loans/"
  },
  {
    name: "KWFT – Kilimo Bora Agribusiness",
    policy: "Women-focused loans for dairy & poultry, etc.",
    requirements: ["ID/Passport", "Group guarantee"],
    url: "https://kwftbank.com/kilimo-bora-agribusiness/"
  },
  {
    name: "Rafiki – Agribusiness Loans",
    policy: "Financing across all agri-value chains including livestock.",
    requirements: ["ID/Passport", "Farm business plan"],
    url: "https://www.rafikibank.co.ke/agribusiness-2/"
  },
  {
    name: "Bimas Kenya – Agribusiness Loans",
    policy: "Mifugo/Dairy & Kilimo Bora loans for various livestock.",
    requirements: ["ID/Passport", "Livestock production plan"],
    url: "https://www.bimaskenya.com/products-and-services/agri-business-loans"
  },
  {
    name: "ECLOF Kenya – Agribusiness Loans",
    policy: "High-breed livestock financing via microfinance model.",
    requirements: ["ID/Passport", "Livestock plan"],
    url: "https://www.eclof-kenya.org/services/agribusiness-loans/"
  }
];

export default function ResourceHub() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-20">
      <h1 className="text-3xl font-bold mb-4">Resource Hub – Loans</h1>
      <p className="mb-6 text-gray-700">
        Accessing livestock loans in Kenya involves branch visits or direct
        enquiries for specialized agricultural products. Below is a selection
        of major banks and microfinance institutions—each card links to their
        info page.
      </p>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {banks.map(bank => (
          <div key={bank.name} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{bank.name}</h2>
            <p className="mb-3 text-gray-600"><strong>Policy:</strong> {bank.policy}</p>
            <p className="font-medium mb-2">Requirements:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              {bank.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
            <a
              href={bank.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              More Info
            </a>
          </div>
        ))}
      </section>
    </div>
  );
}

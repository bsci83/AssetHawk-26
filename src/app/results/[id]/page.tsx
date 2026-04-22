'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface BillFindings {
  id: string;
  filename: string;
  status: string;
  findings: string;
  createdAt: string;
}

export default function ResultsPage() {
  const params = useParams();
  const [bill, setBill] = useState<BillFindings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch bill from API
    // For demo, show sample results
    setBill({
      id: params.id as string,
      filename: 'medical_bill_2024.pdf',
      status: 'completed',
      findings: JSON.stringify({
        totalCharges: 2450.00,
        insuranceCovered: 1800.00,
        patientResponsibility: 650.00,
        issues: [
          { type: 'overcharge', description: 'CPT code 99213 billed twice', savings: 150 },
          { type: 'error', description: 'Duplicate laboratory fees', savings: 85 },
          { type: 'review', description: 'Physical therapy session may not be covered', savings: 'verify' }
        ],
        totalPotentialSavings: 235
      }, null, 2),
      createdAt: new Date().toISOString()
    });
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen p-8">Analyzing your bill...</div>;
  }

  const findings = bill ? JSON.parse(bill.findings) : null;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Bill Review Complete</h1>
        <p className="text-muted-foreground mb-8">{bill?.filename}</p>

        <div className="grid gap-6 mb-8">
          {/* Summary Card */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Total Charges</p>
                <p className="text-2xl font-bold">${findings?.totalCharges}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Insurance Covered</p>
                <p className="text-2xl font-bold text-green-500">${findings?.insuranceCovered}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">You Owe</p>
                <p className="text-2xl font-bold text-red-500">${findings?.patientResponsibility}</p>
              </div>
            </div>
          </div>

          {/* Issues Found */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Issues Found</h2>
            <div className="space-y-3">
              {findings?.issues.map((issue: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    issue.type === 'overcharge' ? 'bg-red-100 text-red-700' :
                    issue.type === 'error' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {issue.type}
                  </span>
                  <div className="flex-1">
                    <p>{issue.description}</p>
                    {issue.savings !== 'verify' && (
                      <p className="text-green-600 font-medium">Save: ${issue.savings}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Savings */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-semibold mb-2">Potential Savings</h2>
            <p className="text-4xl font-bold text-green-600">
              ${findings?.totalPotentialSavings}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium">
            Download Report
          </button>
          <button 
            onClick={() => window.location.href = '/upload'}
            className="flex-1 bg-secondary text-secondary-foreground py-3 px-6 rounded-lg font-medium"
          >
            Upload Another Bill
          </button>
        </div>
      </div>
    </div>
  );
}

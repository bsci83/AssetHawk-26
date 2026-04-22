'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [credits, setCredits] = useState(100); // Free credits

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    try {
      // TODO: Connect to ctrl-a for bill analysis
      // For now, just save the file and redirect to results
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/bills/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const { id } = await response.json();
        router.push(`/results/${id}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Upload Your Medical Bill</h1>
        
        <div className="bg-card p-6 rounded-lg border mb-6">
          <p className="text-muted-foreground mb-4">
            Upload a photo or PDF of your medical bill and our AI will review it for errors, 
            overcharges, and savings opportunities.
          </p>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold">{credits}</span>
            <span className="text-muted-foreground">free credits remaining</span>
          </div>
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-6">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block"
          >
            {file ? (
              <div>
                <p className="text-lg font-medium">{file.name}</p>
                <p className="text-muted-foreground">Click to change</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium">Drop your bill here or click to browse</p>
                <p className="text-muted-foreground">PDF, JPG, or PNG</p>
              </div>
            )}
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium disabled:opacity-50"
        >
          {uploading ? 'Analyzing...' : 'Analyze My Bill'}
        </button>
        
        <p className="text-center text-muted-foreground mt-4 text-sm">
          First {credits} bills are free • Then $5/month
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Upload, FileDown, ScanHeart, CheckCircle, AlertTriangle, Play, RefreshCw, ZoomIn } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useParams, useNavigate } from 'react-router';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

type DiagnosisStatus = 'idle' | 'analyzing' | 'complete';

interface MockResult {
  outcome: 'Positive' | 'Negative';
  confidence: number;
  description: string;
}

function generateMockResult(): MockResult {
  const isPositive = Math.random() > 0.45;
  const confidence = isPositive
    ? parseFloat((85 + Math.random() * 13).toFixed(1))
    : parseFloat((78 + Math.random() * 18).toFixed(1));
  return {
    outcome: isPositive ? 'Positive' : 'Negative',
    confidence,
    description: isPositive
      ? `Consolidation observed in right middle lobe consistent with bacterial pneumonia. Grad-CAM confirms model focus on opacity region (confidence: ${confidence}%).`
      : `No significant consolidation or infiltrates noted. Lung fields appear clear bilaterally (confidence: ${confidence}%).`,
  };
}

export function Diagnosis() {
  const { patientId } = useParams<{ patientId?: string }>();
  const navigate = useNavigate();
  const { getPatientById, addDiagnosisRecord } = useData();
  const { user } = useAuth();

  const patient = patientId ? getPatientById(patientId) : undefined;

  const [status, setStatus] = useState<DiagnosisStatus>('idle');
  const [result, setResult] = useState<MockResult | null>(null);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const handleRunAnalysis = () => {
    setStatus('analyzing');
    setSaved(false);
    setResult(null);
    setTimeout(() => {
      const mockResult = generateMockResult();
      setResult(mockResult);
      setNotes(mockResult.description);
      setStatus('complete');
    }, 2500);
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setNotes('');
    setSaved(false);
  };

  const handleSaveReport = () => {
    if (!result || !patient || !user) return;
    addDiagnosisRecord({
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      performedBy: user.name,
      date: new Date().toISOString().split('T')[0],
      result: result.outcome,
      confidence: result.confidence,
      radiologistNotes: notes,
    });
    setSaved(true);
  };

  const activePatientLabel = patient
    ? `${patient.id} (${patient.firstName} ${patient.lastName})`
    : 'No patient selected';

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI Diagnosis Workspace</h2>
          <p className="text-slate-500">YOLOv11 + CBAM / Grad-CAM Pneumonia Detection</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 px-4 py-2 rounded-md border border-slate-200 flex items-center gap-2">
            <span className="text-sm text-slate-500">Active Patient:</span>
            <span className="font-medium text-slate-900">{activePatientLabel}</span>
          </div>
          {!patient && (
            <Button variant="outline" onClick={() => navigate('/patients')}>
              Select Patient
            </Button>
          )}
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Sidebar Controls */}
        <div className="xl:col-span-1 space-y-6 overflow-y-auto pr-2">
          <Card>
            <CardHeader>
              <CardTitle>Image Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 text-center hover:bg-slate-100 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-teal-600 mb-3" />
                <p className="text-sm font-medium text-slate-900">Upload Chest X-Ray</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, DICOM (Max 15MB)</p>
              </div>

              {!patient && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                  ⚠ Please select a patient from the Patient Records page before running a scan.
                </div>
              )}

              {status === 'idle' && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleRunAnalysis}
                  disabled={!patient}
                >
                  <Play className="h-5 w-5 mr-2" /> Run Analysis
                </Button>
              )}

              {status === 'analyzing' && (
                <Button className="w-full" size="lg" disabled>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" /> Analyzing Image...
                </Button>
              )}

              {status === 'complete' && result && (
                <div className={`border rounded-lg p-4 flex flex-col gap-2 ${result.outcome === 'Positive' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <div className={`flex items-center gap-2 font-semibold ${result.outcome === 'Positive' ? 'text-red-700' : 'text-green-700'}`}>
                    {result.outcome === 'Positive'
                      ? <AlertTriangle className="h-5 w-5" />
                      : <CheckCircle className="h-5 w-5" />
                    }
                    Detection: {result.outcome}
                  </div>
                  <p className={`text-sm ${result.outcome === 'Positive' ? 'text-red-600' : 'text-green-600'}`}>
                    {result.outcome === 'Positive'
                      ? 'Bacterial Pneumonia detected with high confidence.'
                      : 'No pneumonia patterns detected.'
                    }
                  </p>
                  <div className="mt-2 bg-white rounded-md border border-slate-100 p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Model Confidence</span>
                      <span className="font-medium text-slate-900">{result.confidence}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${result.outcome === 'Positive' ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {status === 'complete' && result && patient && (
            <Card>
              <CardHeader>
                <CardTitle>Generate Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Radiologist Notes</label>
                  <textarea
                    className="w-full h-24 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="Add clinical observations here..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
                {saved ? (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm text-teal-700 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Diagnosis record saved successfully.
                  </div>
                ) : (
                  <Button className="w-full gap-2" onClick={handleSaveReport}>
                    <FileDown className="h-4 w-4" /> Save & Generate Report
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Visualizer */}
        <div className="xl:col-span-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden relative shadow-lg">
          <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
            <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <ScanHeart className="h-4 w-4 text-teal-400" /> Image Viewer
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-slate-300 hover:text-white hover:bg-slate-700">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[500px]">
            {status === 'idle' || status === 'analyzing' ? (
              <div className="col-span-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                <ScanHeart className={`h-16 w-16 mb-4 ${status === 'analyzing' ? 'animate-pulse text-teal-500' : 'text-slate-600'}`} />
                <p>{status === 'analyzing' ? 'Processing via YOLOv11 + CBAM...' : 'Upload an image and run analysis to view results'}</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <div className="bg-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded-t-md font-medium text-center tracking-wide uppercase">
                    Original CXR Input
                  </div>
                  <div className="flex-1 bg-black rounded-b-md overflow-hidden relative border border-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1631651363531-fd29aec4cb5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                      alt="Original Chest X-Ray"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded-t-md font-medium flex justify-between items-center tracking-wide uppercase">
                    <span>Grad-CAM Heatmap</span>
                    <span className="text-teal-400 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Processed
                    </span>
                  </div>
                  <div className="flex-1 bg-black rounded-b-md overflow-hidden relative border border-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1631651363531-fd29aec4cb5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                      alt="Background Context"
                      className="absolute inset-0 w-full h-full object-contain opacity-50 mix-blend-luminosity grayscale"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1767556030469-9c135b2e9a9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                      alt="Grad-CAM Overlay"
                      className="absolute inset-0 w-full h-full object-cover mix-blend-color-dodge opacity-70"
                      style={{ clipPath: 'inset(20% 20% 30% 40%)' }}
                    />
                    {result?.outcome === 'Positive' && (
                      <div className="absolute border-2 border-red-500 rounded-sm" style={{ top: '25%', left: '45%', width: '30%', height: '40%' }}>
                        <div className="bg-red-500 text-white text-[10px] font-bold px-1 py-0.5 absolute -top-5 -left-0.5 whitespace-nowrap">
                          Pneumonia {result.confidence}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

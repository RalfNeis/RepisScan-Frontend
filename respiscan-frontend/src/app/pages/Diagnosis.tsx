import React, { useState } from 'react';
import { Upload, FileDown, ScanHeart, CheckCircle, AlertTriangle, Play, RefreshCw, ZoomIn } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function Diagnosis() {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'complete'>('complete'); // Set to complete to show the requested state by default

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
            <span className="font-medium text-slate-900">PT-2024-001 (Antonio Garcia)</span>
          </div>
          <Button variant="outline" onClick={() => setStatus('idle')}>
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Sidebar Controls & Info */}
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

              {status === 'idle' && (
                <Button className="w-full" size="lg" onClick={() => setStatus('analyzing')}>
                  <Play className="h-5 w-5 mr-2" /> Run Analysis
                </Button>
              )}

              {status === 'analyzing' && (
                <Button className="w-full" size="lg" disabled>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" /> Analyzing Image...
                </Button>
              )}

              {status === 'complete' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-red-700 font-semibold">
                    <AlertTriangle className="h-5 w-5" />
                    Detection: Positive
                  </div>
                  <p className="text-sm text-red-600">
                    Bacterial Pneumonia detected with high confidence in the right middle lobe.
                  </p>
                  <div className="mt-2 bg-white rounded-md border border-red-100 p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Model Confidence</span>
                      <span className="font-medium text-slate-900">94.2%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {status === 'complete' && (
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
                    defaultValue="Consolidation observed in right middle lobe consistent with bacterial pneumonia. Grad-CAM confirms model focus on opacity."
                  />
                </div>
                <Button className="w-full gap-2">
                  <FileDown className="h-4 w-4" /> Download Medical Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Visualizer Area */}
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
                  <div className="flex-1 bg-black rounded-b-md overflow-hidden relative border border-slate-700 group">
                    <img 
                      src="https://images.unsplash.com/photo-1631651363531-fd29aec4cb5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdCUyMHgtcmF5fGVufDF8fHx8MTc4MTc5NDMxNHww&ixlib=rb-4.1.0&q=80&w=1080" 
                      alt="Original Chest X-Ray" 
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded-t-md font-medium flex justify-between items-center tracking-wide uppercase">
                    <span>Grad-CAM Heatmap</span>
                    <span className="text-teal-400 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Processed</span>
                  </div>
                  <div className="flex-1 bg-black rounded-b-md overflow-hidden relative border border-slate-700 group">
                    {/* Background original image for context */}
                    <img 
                      src="https://images.unsplash.com/photo-1631651363531-fd29aec4cb5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdCUyMHgtcmF5fGVufDF8fHx8MTc4MTc5NDMxNHww&ixlib=rb-4.1.0&q=80&w=1080" 
                      alt="Background Context" 
                      className="absolute inset-0 w-full h-full object-contain opacity-50 mix-blend-luminosity grayscale"
                    />
                    {/* Heatmap overlay (using thermal image as approximation for Grad-CAM) */}
                    <img 
                      src="https://images.unsplash.com/photo-1767556030469-9c135b2e9a9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVybWFsJTIwaW1hZ2luZ3xlbnwxfHx8fDE3ODE3OTQzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                      alt="Grad-CAM Overlay" 
                      className="absolute inset-0 w-full h-full object-cover mix-blend-color-dodge opacity-70"
                      style={{ clipPath: 'inset(20% 20% 30% 40%)' }}
                    />
                    {/* Bounding box representation */}
                    <div className="absolute border-2 border-red-500 rounded-sm" style={{ top: '25%', left: '45%', width: '30%', height: '40%' }}>
                      <div className="bg-red-500 text-white text-[10px] font-bold px-1 py-0.5 absolute -top-5 -left-0.5 whitespace-nowrap">
                        Pneumonia 0.94
                      </div>
                    </div>
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

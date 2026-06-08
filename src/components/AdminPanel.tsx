import React, { useState } from 'react';
import { 
  BarChart3, PlusCircle, LayoutGrid, FileText, Settings2, Globe, Sparkles, 
  Trash2, Edit3, Save, CheckCircle, Info, RefreshCw, Upload, DownloadCloud, Eye, AlertTriangle,
  HardDrive, Database, Smartphone, Network, Cpu, ShieldAlert, Radio
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { App, Message, StorageConfig } from '../types';
import { AppIcon } from './AppIcon';
import { useToast } from './Toast';

interface AdminPanelProps {
  apps: App[];
  messages: Message[];
  storageConfig: StorageConfig;
  onAddApp: (app: App) => void;
  onUpdateApp: (app: App) => void;
  onDeleteApp: (appId: string) => void;
  onUpdateStorageConfig: (config: StorageConfig) => void;
  onViewAppDetails: (slug: string) => void;
  onDeleteMessage: (msgId: string) => void;
  onClearMessages: () => void;
}

type AdminTab = 'analytics' | 'apps-list' | 'add-app' | 'storage-config' | 'messages';

export function AdminPanel({
  apps,
  messages,
  storageConfig,
  onAddApp,
  onUpdateApp,
  onDeleteApp,
  onUpdateStorageConfig,
  onViewAppDetails,
  onDeleteMessage,
  onClearMessages
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [appToDelete, setAppToDelete] = useState<App | null>(null);
  const { toast } = useToast();

  // New/Edit App Form States
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Productivity');
  const [formSize, setFormSize] = useState('15.0 MB');
  const [formVersion, setFormVersion] = useState('1.0.0');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDeveloper, setFormDeveloper] = useState('My Studio Corp');
  const [formCompatibility, setFormCompatibility] = useState('Android 10.0 or higher');
  const [formFeatures, setFormFeatures] = useState('');
  const [formPermissions, setFormPermissions] = useState('');
  const [formWhatsNew, setFormWhatsNew] = useState('');
  const [formIconUrl, setFormIconUrl] = useState('');
  const [formApkName, setFormApkName] = useState('');

  // Storage Settings states
  const [storageProvider, setStorageProvider] = useState<StorageConfig['provider']>(storageConfig.provider);
  const [storageApiKey, setStorageApiKey] = useState(storageConfig.apiKeys.apiKey || '');
  const [storageBucket, setStorageBucket] = useState(storageConfig.apiKeys.bucket || '');
  const [storageRegion, setStorageRegion] = useState(storageConfig.apiKeys.region || '');

  // File Upload states for simulation
  const [uploadedIconFile, setUploadedIconFile] = useState<string | null>(null);
  const [uploadedApkFile, setUploadedApkFile] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const totalDownloads = apps.reduce((sum, current) => sum + current.downloads, 0);

  // Storage Parsing Utility
  const getAppSizeInMB = (sizeStr: string): number => {
    const clean = (sizeStr || '').toUpperCase().trim();
    const value = parseFloat(clean) || 0;
    if (clean.includes('GB')) return value * 1024;
    if (clean.includes('KB')) return value / 1024;
    return value; // default is MB
  };

  // Real-time Storage Space and Bandwidth Ticks
  const totalStorageMB = apps.reduce((sum, app) => sum + getAppSizeInMB(app.size), 0);
  const totalBandwidthGB = apps.reduce((sum, app) => {
    const appSizeMB = getAppSizeInMB(app.size);
    const downloadedMB = app.downloads * appSizeMB;
    return sum + (downloadedMB / 1024);
  }, 0);

  // Constants
  const STORAGE_QUOTA_MB = 1024; // 1.0 GB Staging Quota limit
  const storagePercent = Math.min((totalStorageMB / STORAGE_QUOTA_MB) * 100, 100);

  // Geographic / Region download breakdown
  const regionalData = [
    { name: 'Asia-Pacific', value: Math.round(totalDownloads * 0.40) || 410, color: '#00D9FF' },
    { name: 'North America', value: Math.round(totalDownloads * 0.25) || 260, color: '#A855F7' },
    { name: 'Europe', value: Math.round(totalDownloads * 0.20) || 205, color: '#EC4899' },
    { name: 'Latin America', value: Math.round(totalDownloads * 0.10) || 105, color: '#10B981' },
    { name: 'Middle East', value: Math.round(totalDownloads * 0.05) || 50, color: '#F59E0B' },
  ];

  // Device type breakdown
  const deviceData = [
    { name: 'Samsung Galaxy', count: Math.round(totalDownloads * 0.35) || 360 },
    { name: 'Google Pixel', count: Math.round(totalDownloads * 0.25) || 250 },
    { name: 'OnePlus 12', count: Math.round(totalDownloads * 0.15) || 160 },
    { name: 'Xiaomi 14 Pro', count: Math.round(totalDownloads * 0.15) || 150 },
    { name: 'Sony Xperia', count: Math.round(totalDownloads * 0.10) || 100 },
  ];

  const resetForm = () => {
    setEditingAppId(null);
    setFormName('');
    setFormCategory('Productivity');
    setFormSize('15.0 MB');
    setFormVersion('1.0.0');
    setFormShortDesc('');
    setFormDesc('');
    setFormDeveloper('My Studio Corp');
    setFormCompatibility('Android 10.0 or higher');
    setFormFeatures('Sleek responsive canvas interfaces.\nCustom multi-touch feedback loops.');
    setFormPermissions('Internet permissions\nStorage access');
    setFormWhatsNew('Initial launch build with optimized performance grids.');
    setFormIconUrl('');
    setFormApkName('');
    setUploadedIconFile(null);
    setUploadedApkFile(null);
  };

  const handleEditClick = (app: App) => {
    setEditingAppId(app.id);
    setFormName(app.name);
    setFormCategory(app.category);
    setFormSize(app.size);
    setFormVersion(app.version);
    setFormShortDesc(app.shortDescription);
    setFormDesc(app.description);
    setFormDeveloper(app.developer);
    setFormCompatibility(app.compatibility);
    setFormFeatures(app.features.join('\n'));
    setFormPermissions(app.permissions.join('\n'));
    setFormWhatsNew(app.whatsNew);
    setFormIconUrl(app.iconUrl);
    setFormApkName(app.apkUrl);
    setUploadedIconFile(null);
    setUploadedApkFile(null);
    setActiveTab('add-app');
  };

  const handleFileDrop = (e: React.DragEvent, type: 'icon' | 'apk') => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processUploadedFile(file, type);
    }
  };

  const processUploadedFile = (file: File, type: 'icon' | 'apk') => {
    if (type === 'icon') {
      // Compress image to Base64 to save local storage quota
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64String = uploadEvent.target?.result as string;
        setUploadedIconFile(base64String);
        setFormIconUrl(base64String.substring(0, 15)); // Custom prefix initializer matching AppIcon fallback
        toast(`App Icon "${file.name}" compressed and accepted.`, 'success');
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedApkFile(file.name);
      setFormApkName(file.name);
      setFormSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      toast(`APK Binary"${file.name}" verified and accepted under staging.`, 'success');
    }
  };

  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formShortDesc || !formDesc) {
      toast('Please supply name and descriptions tags.', 'error');
      return;
    }

    const featureArr = formFeatures.split('\n').map(f => f.trim()).filter(Boolean);
    const permissionArr = formPermissions.split('\n').map(p => p.trim()).filter(Boolean);
    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const appPayload: App = {
      id: editingAppId || slug,
      name: formName,
      slug,
      version: formVersion,
      category: formCategory,
      size: formSize,
      rating: editingAppId ? apps.find(a => a.id === editingAppId)?.rating || 4.5 : 4.5,
      downloads: editingAppId ? apps.find(a => a.id === editingAppId)?.downloads || 0 : 0,
      shortDescription: formShortDesc,
      description: formDesc,
      developer: formDeveloper,
      lastUpdated: new Date().toISOString().split('T')[0],
      compatibility: formCompatibility,
      features: featureArr.length > 0 ? featureArr : ['Sleek custom layout metrics.'],
      permissions: permissionArr.length > 0 ? permissionArr : ['Internet'],
      whatsNew: formWhatsNew || 'Performance audits and clean improvements.',
      apkUrl: formApkName || `${slug}_v${formVersion}.apk`,
      iconUrl: uploadedIconFile || formIconUrl || `${formName.substring(0, 2)}`,
      screenshots: ['sc-default-1', 'sc-default-2'],
      releaseDate: editingAppId ? apps.find(a => a.id === editingAppId)?.releaseDate || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    };

    if (editingAppId) {
      onUpdateApp(appPayload);
      toast(`"${formName}" updated successfully inside store!`, 'success');
    } else {
      if (apps.some(a => a.id === appPayload.id)) {
        toast(`An application with id "${appPayload.id}" already exists.`, 'error');
        return;
      }
      onAddApp(appPayload);
      toast(`"${formName}" published inside Store list!`, 'success');
    }

    resetForm();
    setActiveTab('apps-list');
  };

  const handleSaveStorage = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: StorageConfig = {
      provider: storageProvider,
      apiKeys: {
        apiKey: storageApiKey,
        bucket: storageBucket,
        region: storageRegion
      },
      isActive: storageProvider !== 'local' && !!storageApiKey
    };

    onUpdateStorageConfig(newConfig);
    toast(`Cloud Storage Config updated. Active provider: ${storageProvider.toUpperCase()}`, 'success');
  };

  return (
    <div 
      id="admin-dashboard-container"
      className="max-w-7xl mx-auto px-4 py-6 md:py-10 animate-[fade-in-slide-up_0.35s_ease-out]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDENAV BAR PANEL (LG: 3 COLS) */}
        <div id="admin-sidebar" className="lg:col-span-3 flex flex-col gap-3">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest border-b border-white/5 pb-3 mb-4 text-[#00D9FF]">
              Dashboard Terminal
            </h3>
            
            <nav className="flex flex-col gap-1.5 font-sans text-xs font-semibold text-slate-400">
              <button
                id="sidebar-btn-analytics"
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20 text-white'
                    : 'hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Performance Metrics
              </button>

              <button
                id="sidebar-btn-apps"
                onClick={() => setActiveTab('apps-list')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${
                  activeTab === 'apps-list'
                    ? 'bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 text-white'
                    : 'hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-purple-400" />
                Catalog Editor ({apps.length})
              </button>

              <button
                id="sidebar-btn-add-app"
                onClick={() => {
                  resetForm();
                  setActiveTab('add-app');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${
                  activeTab === 'add-app' && !editingAppId
                    ? 'bg-gradient-to-r from-pink-500/10 to-transparent border border-pink-500/20 text-white'
                    : 'hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-pink-400" />
                Create Application
              </button>

              <button
                id="sidebar-btn-storage"
                onClick={() => setActiveTab('storage-config')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${
                  activeTab === 'storage-config'
                    ? 'bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20 text-white'
                    : 'hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Settings2 className="w-4 h-4 text-cyan-400" />
                Cloud API Connector
              </button>

              <button
                id="sidebar-btn-messages"
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left relative ${
                  activeTab === 'messages'
                    ? 'bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 text-white'
                    : 'hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                <FileText className="w-4 h-4 text-purple-400" />
                Messages Inbox
                {messages.length > 0 && (
                  <span className="absolute right-4 px-1.5 py-0.5 rounded-full bg-pink-500 text-[9px] text-white">
                    {messages.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* MAIN ADMIN DETAIL PORT RECOGNIZER (LG: 9 COLS) */}
        <div id="admin-detail-port" className="lg:col-span-9">
          
          {/* 1. ANALYTICS GRAPHS VIEW */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-6 animate-[fade-in_0.2s_ease-out]">
              {/* Analytics Header Metrics Widgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">Staged Installers</span>
                    <div className="text-xl font-bold font-mono text-white mt-0.5 truncate">{apps.length} PKGs</div>
                  </div>
                </div>
                <div className="p-5 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <DownloadCloud className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block font-semibold">Total Downloads</span>
                    <div className="text-xl font-bold font-mono text-[#00D9FF] mt-0.5 truncate">
                      {totalDownloads.toLocaleString()} Hits
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 flex-shrink-0">
                    <Network className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">CDN Accumulation</span>
                    <div className="text-xl font-bold font-mono text-pink-400 mt-0.5 truncate">
                      {totalBandwidthGB.toFixed(2)} GB Served
                    </div>
                  </div>
                </div>
              </div>

              {/* Bandwidth & Storage Tracking Panel */}
              <div id="storage-tracking-panel" className="p-6 rounded-[22px] bg-slate-900/45 border border-white/5 backdrop-blur-xl flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <h4 className="text-white font-bold text-base font-sans tracking-tight flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-purple-400" /> Staging Node Storage Meter
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">Live filesystem size consumption across staged Android package binaries.</p>
                  </div>
                  <span id="storage-quota-lbl" className="text-xs font-mono font-black text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/15">
                    {totalStorageMB.toFixed(1)} MB / {STORAGE_QUOTA_MB} MB Quota ({storagePercent.toFixed(1)}%)
                  </span>
                </div>

                {/* storage progress tracking slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="w-full h-4 rounded-full bg-slate-950 overflow-hidden border border-white/5 p-[2px]">
                    <div 
                      id="bar-storage-used"
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-500 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                      style={{ width: `${storagePercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>STAGING_ROOT_VOLUME</span>
                    <span>1.0 GB MAX_LIMIT</span>
                  </div>
                </div>

                {/* Storage allocations per app checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {apps.map(app => {
                    const sizeMB = getAppSizeInMB(app.size);
                    const appPct = (sizeMB / STORAGE_QUOTA_MB) * 100;
                    return (
                      <div key={app.id} className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                          <AppIcon iconUrl={app.iconUrl} className="w-6 h-6 border border-white/10 rounded-lg flex-shrink-0" />
                          <span className="text-xs text-white truncate font-bold">{app.name}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-[10px] font-mono">
                          <span className="text-slate-500">Size contribution</span>
                          <span className="text-cyan-400 font-bold">{sizeMB.toFixed(1)} MB ({appPct.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Geographic & Device Analytics Charts (using Recharts library) */}
              <div id="recharts-analytics-matrix" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart Segment A: Geographic distribution Pie Plot */}
                <div className="p-5 rounded-[22px] bg-slate-900/50 border border-white/5 backdrop-blur-xl flex flex-col gap-4">
                  <div>
                    <h4 className="text-white font-bold text-sm font-sans tracking-tight flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" /> Geographic Download Matrix
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">Simulated regional edge pipeline hits calculated on active downloads.</p>
                  </div>

                  <div className="h-64 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={regionalData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {regionalData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          contentStyle={{ 
                            backgroundColor: '#090B11', 
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '11px',
                            fontFamily: 'monospace'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-mono">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">Incoming</span>
                      <span className="text-base font-black text-white">{totalDownloads} Hits</span>
                    </div>
                  </div>

                  {/* Legends segment with values and details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    {regionalData.map((reg, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: reg.color }} />
                        <span className="text-slate-400 truncate">{reg.name}:</span>
                        <span className="text-slate-200 font-bold ml-auto">{reg.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Segment B: Device compatibility bar charts */}
                <div className="p-5 rounded-[22px] bg-slate-900/50 border border-white/5 backdrop-blur-xl flex flex-col gap-4">
                  <div>
                    <h4 className="text-white font-bold text-sm font-sans tracking-tight flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-purple-400" /> Endpoint Devices Traffic Ratio
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">Real-world active installations split across android user agents.</p>
                  </div>

                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deviceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#64748B" 
                          fontSize={9} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#64748B" 
                          fontSize={9} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <ChartTooltip 
                          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                          contentStyle={{ 
                            backgroundColor: '#090B11', 
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '11px',
                            fontFamily: 'monospace'
                          }} 
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00D9FF' : '#A855F7'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-purple-400" /> Qualcomm Snapdragon (60%)</span>
                    <span className="flex items-center gap-1"><Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> 5G Edge Protocol</span>
                  </div>
                </div>

              </div>

              {/* Graphic charts space */}
              <div className="p-6 rounded-[22px] bg-slate-900/50 border border-white/5 backdrop-blur-xl flex flex-col gap-5">
                <div>
                  <h4 className="text-white font-bold text-base font-sans">Applications Metrics Visualizer</h4>
                  <p className="text-slate-400 text-xs mt-1">Real-time breakdown of download traffic indexes inside current APK packages.</p>
                </div>
                
                {/* Simulated high-fidelity beautiful CSS Bar graph */}
                <div className="flex flex-col gap-3 mt-2">
                  {apps.map((app) => {
                    const pct = totalDownloads > 0 ? (app.downloads / totalDownloads) * 100 : 0;
                    return (
                      <div key={app.id} className="flex items-center gap-4 text-xs font-mono">
                        <span className="w-32 text-slate-300 truncate font-semibold">{app.name}</span>
                        <div className="flex-1 bg-slate-950 rounded-lg h-3.5 border border-white/5 overflow-hidden flex items-center p-[2px]">
                          <div 
                            className="bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full h-full transition-all"
                            style={{ width: `${Math.max(pct, 5)}%` }} // Minimum width for visibility
                          />
                        </div>
                        <span className="w-20 text-right text-purple-300 font-bold">{app.downloads.toLocaleString()} hits</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. APPLICATIONS LIST WRAPPER */}
          {activeTab === 'apps-list' && (
            <div className="p-6 rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-xl flex flex-col gap-5 animate-[fade-in_0.2s_ease-out]">
              <div>
                <h4 className="text-white font-bold text-base">Applications Catalog</h4>
                <p className="text-slate-400 text-xs mt-1">Configure metadata details, delete files, or edit features of running Android installations.</p>
              </div>

              <div className="divide-y divide-white/5">
                {apps.map((app) => (
                  <div key={app.id} id={`admin-row-${app.id}`} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
                    <div className="flex items-center gap-3">
                      <AppIcon iconUrl={app.iconUrl} size="sm" glow={false} />
                      <div>
                        <span className="font-bold text-white text-sm md:text-base leading-tight block">{app.name}</span>
                        <div className="flex items-center gap-2 mt-0.5 mt-1">
                          <span className="text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-slate-400">v{app.version}</span>
                          <span className="text-[10px] font-mono bg-purple-500/15 px-1.5 py-0.5 rounded text-purple-300 font-bold">{app.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        id={`btn-admin-preview-${app.id}`}
                        onClick={() => onViewAppDetails(app.slug)}
                        className="p-2 justify-center rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                        title="View Public App Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        id={`btn-admin-edit-${app.id}`}
                        onClick={() => handleEditClick(app)}
                        className="p-2 justify-center rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:text-purple-100 transition-all cursor-pointer"
                        title="Edit app details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        id={`btn-admin-delete-${app.id}`}
                        onClick={() => {
                          setAppToDelete(app);
                        }}
                        className="p-2 justify-center rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-100 transition-all cursor-pointer"
                        title="Delete application file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ADD/EDIT APPLICATION GLASS FORM */}
          {activeTab === 'add-app' && (
            <div className="p-6 md:p-8 rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-xl animate-[fade-in_0.2s_ease-out]">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h4 className="text-white font-bold text-base">
                    {editingAppId ? `Editing details for "${formName}"` : 'Publish New Application'}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1">
                    Configure package metadata, security credentials, and upload APK/Icon binary bundles directly.
                  </p>
                </div>
                {editingAppId && (
                  <button
                    onClick={resetForm}
                    className="px-3 py-1.5 text-[11px] font-mono bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveApp} className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans text-sm">
                
                {/* LEFT FORM DATA PANEL */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">App Name</label>
                    <input
                      id="form-app-name"
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="My Native Toolbox"
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl focus:border-[#00D9FF]/40 text-xs text-white outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Category</label>
                      <select
                        id="form-app-category"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl focus:border-[#00D9FF]/40 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="Productivity">Productivity</option>
                        <option value="Tools">Tools</option>
                        <option value="AI">AI</option>
                        <option value="Games">Games</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Social">Social</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Version Number</label>
                      <input
                        id="form-app-version"
                        type="text"
                        value={formVersion}
                        onChange={(e) => setFormVersion(e.target.value)}
                        placeholder="1.0.0"
                        className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl focus:border-[#00D9FF]/40 text-xs text-white outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Developer Name</label>
                    <input
                      id="form-app-dev"
                      type="text"
                      value={formDeveloper}
                      onChange={(e) => setFormDeveloper(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Short Description</label>
                    <input
                      id="form-app-shortdesc"
                      type="text"
                      value={formShortDesc}
                      onChange={(e) => setFormShortDesc(e.target.value)}
                      placeholder="One sentence description explaining core functionality."
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl focus:border-[#00D9FF]/40 text-xs text-white outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Full Description</label>
                    <textarea
                      id="form-app-desc"
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Comprehensive information regarding capabilities, layouts, and use cases..."
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl focus:border-[#00D9FF]/40 text-xs text-white outline-none resize-none h-40"
                      required
                    />
                  </div>
                </div>

                {/* RIGHT FORM FILE UPLOAD AND ACCORD MATERIAL */}
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Compatibility</label>
                      <input
                        id="form-app-compat"
                        type="text"
                        value={formCompatibility}
                        onChange={(e) => setFormCompatibility(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">File Size</label>
                      <input
                        id="form-app-size"
                        type="text"
                        value={formSize}
                        onChange={(e) => setFormSize(e.target.value)}
                        placeholder="12.0 MB"
                        className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* High Quality Features Lists */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Features List (one per line)</label>
                    <textarea
                      id="form-app-features"
                      value={formFeatures}
                      onChange={(e) => setFormFeatures(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white outline-none h-20"
                    />
                  </div>

                  {/* Required Permissions list */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Permissions Required (one per line)</label>
                    <textarea
                      id="form-app-perms"
                      value={formPermissions}
                      onChange={(e) => setFormPermissions(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white outline-none h-20"
                    />
                  </div>

                  {/* Whats New changes log */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">What's New in this Build</label>
                    <input
                      id="form-app-whatsnew"
                      type="text"
                      value={formWhatsNew}
                      onChange={(e) => setFormWhatsNew(e.target.value)}
                      placeholder="Bug corrections and performance layouts."
                      className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white outline-none"
                    />
                  </div>

                  {/* Dropzone APK STREAMS UPLOADS AND ICON */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Icon dropping */}
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(e) => handleFileDrop(e, 'icon')}
                      className={`border border-dashed p-4 rounded-xl text-center cursor-pointer transition-colors relative flex flex-col items-center justify-center h-28 ${
                        uploadedIconFile 
                          ? 'border-emerald-500/40 bg-emerald-500/5' 
                          : 'border-white/10 hover:border-cyan-400 bg-slate-950/40'
                      }`}
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="icon-upload-elem"
                        onChange={(e) => e.target.files?.[0] && processUploadedFile(e.target.files[0], 'icon')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {uploadedIconFile ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-emerald-400 mb-1" />
                          <span className="text-[10px] font-mono text-emerald-300 font-bold">ICON OK</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[10px] font-bold text-slate-300">Drop App Icon</span>
                          <span className="text-[8px] text-slate-500">Compress to fit quota</span>
                        </>
                      )}
                    </div>

                    {/* APK dropping */}
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(e) => handleFileDrop(e, 'apk')}
                      className={`border border-dashed p-4 rounded-xl text-center cursor-pointer transition-colors relative flex flex-col items-center justify-center h-28 ${
                        uploadedApkFile 
                          ? 'border-emerald-500/40 bg-emerald-500/5' 
                          : 'border-white/10 hover:border-cyan-400 bg-slate-950/40'
                      }`}
                    >
                      <input 
                        type="file" 
                        accept=".apk" 
                        id="apk-upload-elem"
                        onChange={(e) => e.target.files?.[0] && processUploadedFile(e.target.files[0], 'apk')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {uploadedApkFile ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-emerald-400 mb-1" />
                          <span className="text-[10px] font-mono text-emerald-300 font-bold truncate max-w-full px-1">{uploadedApkFile}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-[10px] font-bold text-slate-300 font-sans">Drop APK Stream</span>
                          <span className="text-[8px] text-slate-500 font-sans">Auto sizes metadata</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* SUBMIT FORM ACTIONS */}
                <div className="md:col-span-2 flex justify-end gap-3 border-t border-white/5 pt-5 mt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-350 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Reset Form
                  </button>

                  <button
                    id="btn-admin-submit-app"
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,217,255,0.25)]"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingAppId ? 'APPLY ALL METADATA' : 'PUBLISH TO STORE'}</span>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* 4. CLOUD API API CONNECTIONS FORM */}
          {activeTab === 'storage-config' && (
            <div className="flex flex-col gap-6 animate-[fade-in_0.2s_ease-out]">
              <div className="p-6 md:p-8 rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-xl">
                <div>
                  <h4 className="text-white font-bold text-base">Store Storage Connectors</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    Connect this distribution platform securely to prominent Cloud S3/Storage nodes to offload large binary APK transfers.
                  </p>
                </div>

                <form onSubmit={handleSaveStorage} className="flex flex-col gap-5 mt-6 font-sans text-xs">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Active Storage Provider</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {(['local', 'firebase', 'supabase', 'cloudinary', 's3'] as const).map((prov) => (
                        <button
                          key={prov}
                          type="button"
                          id={`btn-storage-tab-${prov}`}
                          onClick={() => setStorageProvider(prov)}
                          className={`p-3.5 rounded-xl border font-bold uppercase text-[9px] tracking-wider transition-all cursor-pointer ${
                            storageProvider === prov
                              ? 'bg-[#00D9FF]/10 border-cyan-400 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.15)]'
                              : 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-950/85 hover:text-slate-200'
                          }`}
                        >
                          {prov}
                        </button>
                      ))}
                    </div>
                  </div>

                  {storageProvider !== 'local' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-5 animate-[fade-in_0.25s_ease-out]">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">API Key / Access Token</label>
                        <input
                          id="storage-input-key"
                          type="password"
                          value={storageApiKey}
                          onChange={(e) => setStorageApiKey(e.target.value)}
                          placeholder="••••••••••••••••••••••••"
                          className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl focus:border-[#00D9FF]/40 text-xs text-white outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Bucket Namespace</label>
                        <input
                          id="storage-input-bucket"
                          type="text"
                          value={storageBucket}
                          onChange={(e) => setStorageBucket(e.target.value)}
                          placeholder="client-apks-bucket"
                          className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Storage Region</label>
                        <input
                          id="storage-input-region"
                          type="text"
                          value={storageRegion}
                          onChange={(e) => setStorageRegion(e.target.value)}
                          placeholder="us-east-1"
                          className="w-full px-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-xs text-white outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Guidance information on connectors */}
                  <div className="bg-slate-950/60 border border-white/5 p-4 rounded-xl flex items-start gap-3 mt-1 text-slate-400 leading-relaxed font-sans">
                    <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-200 text-xs mb-1">
                        {storageProvider === 'local' 
                          ? 'Local Cache Protocol Active' 
                          : `${storageProvider.toUpperCase()} Storage Integration Bridge`
                        }
                      </span>
                      {storageProvider === 'local' ? (
                        'Files are currently encoded directly inside the sandboxed localStorage container. For production builds with large files, we highly suggest hooking up external providers such as Firebase Storage, AWS S3, or Supabase Storage.'
                      ) : (
                        `Once saved, all icons, screenshots, and APK installers dropped onto the Create Application module are automatically streaming-routed and hosted directly inside your ${storageProvider.toUpperCase()} cloud bucket. Credentials are securely locked inside local client keys.`
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-white/5 pt-4">
                    <button
                      id="btn-save-storage-config"
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 font-bold font-sans text-xs text-slate-950 hover:shadow-[0_0_15px_rgba(0,217,255,0.25)] transition-all cursor-pointer"
                    >
                      SAVE CONNECTOR INDEX
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 5. MESSAGES FEEDBACK TABLE INBOX */}
          {activeTab === 'messages' && (
            <div className="p-6 rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-xl animate-[fade-in_0.2s_ease-out] flex flex-col gap-5">
              <div className="flex flex-row justify-between items-start gap-4">
                <div>
                  <h4 className="text-white font-bold text-base">Contact Messages</h4>
                  <p className="text-slate-400 text-xs mt-1 font-sans">Review feedback and bug audits submitted by visitors of your distribution platform.</p>
                </div>
                {messages.length > 0 && (
                  <button
                    id="btn-clear-messages"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all messages?')) {
                        onClearMessages();
                        toast('Inbox cleared completely.', 'info');
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-450 hover:text-white text-[11px] font-semibold font-sans uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-450" />
                    <span>Clear Inbox</span>
                  </button>
                )}
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/5 rounded-xl">
                  <span className="text-xs text-slate-500 font-mono">INBOX IS COMPLETE AND EMPTY</span>
                </div>
              ) : (
                <div className="flex flex-col gap-4 font-sans text-xs">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-4 bg-slate-950/45 border border-white/5 rounded-xl flex flex-col gap-2 relative group/message">
                      <div className="absolute top-4 right-4 flex items-center gap-3">
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">{msg.date}</span>
                        <button
                          id={`btn-delete-msg-${msg.id}`}
                          onClick={() => {
                            onDeleteMessage(msg.id);
                            toast('Message deleted.', 'info');
                          }}
                          className="p-1 rounded-lg bg-white/5 hover:bg-rose-500/25 border border-white/5 hover:border-rose-500/20 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <div className="pr-20">
                        <h5 className="font-bold text-slate-200 text-sm leading-tight">{msg.name}</h5>
                        <span className="text-mono text-cyan-400 text-[10px] mt-0.5 block">{msg.email}</span>
                      </div>
                      
                      <div className="h-[1px] bg-white/5 w-full my-1 z-10" />
                      
                      <p className="text-slate-350 leading-relaxed italic pr-12">
                        "{msg.message}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 2-STEP PERSISTENT DELETE CONFIRMATION POPUP */}
      {appToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Frosted dark backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setAppToDelete(null)}
          />
          {/* Dialogue card container */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#0B0B13] border border-slate-200 dark:border-white/10 rounded-[24px] shadow-2xl p-6 overflow-hidden z-10 animate-[fade-in_0.2s_ease-out]">
            {/* Backglow panel decoration */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />
            
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Permanent Catalog Deletion
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Are you absolutely sure you want to terminate and delete <span className="font-bold text-rose-500 dark:text-rose-400">"{appToDelete.name}"</span>?
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-150 dark:border-white/5 mb-6 text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-normal">
              This action will destroy its staging build, reset registered statistics (currently <span className="font-bold text-slate-700 dark:text-slate-200">{appToDelete.downloads.toLocaleString()} downloads</span>), and remove public page search engine logs immediately. This cannot be undone.
            </div>

            <div className="flex gap-3">
              <button
                id="btn-confirm-delete-cancel"
                type="button"
                onClick={() => setAppToDelete(null)}
                className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              >
                Keep Application
              </button>
              <button
                id="btn-confirm-delete-execute"
                type="button"
                onClick={() => {
                  onDeleteApp(appToDelete.id);
                  setAppToDelete(null);
                }}
                className="w-1/2 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 transition-all cursor-pointer border-none"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

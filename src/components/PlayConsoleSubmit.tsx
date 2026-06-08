import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Upload, FileImage, 
  ShieldCheck, Smartphone, RefreshCw, BadgeCheck, AlertCircle, FileText, User, Lock, Mail
} from 'lucide-react';
import { 
  getStoreState, saveStoreState, getCurrentUser, registerUser, loginUser, UserSession, AppItem 
} from '../data';

export default function PlayConsoleSubmit() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUserLocal] = useState<UserSession | null>(getCurrentUser());
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authFeedback, setAuthFeedback] = useState({ error: '', success: '' });

  // Play Console Wizard Setup
  const [step, setStep] = useState(1);
  const [appTitle, setAppTitle] = useState('');
  const [packageName, setPackageName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [category, setCategory] = useState('apps');
  const [tag, setTag] = useState('NEW');

  // Graphic images (Base64)
  const [iconBase64, setIconBase64] = useState('');
  const [coverBase64, setCoverBase64] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);

  // APK file states
  const [apkName, setApkName] = useState('');
  const [apkSizeVal, setApkSizeVal] = useState('');
  const [apkProgress, setApkProgress] = useState(0);
  const [apkState, setApkState] = useState<'idle' | 'uploading' | 'finished'>('idle');
  const [versionName, setVersionName] = useState('1.0.0');
  const [versionCode, setVersionCode] = useState('1');
  const [track, setTrack] = useState('Production');
  const [releaseNotes, setReleaseNotes] = useState('');

  // Scanning simulation states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('');

  // Final rollout success
  const [isFinished, setIsFinished] = useState(false);
  const [deployedAppId, setDeployedAppId] = useState('');

  // Keep authenticated state in sync
  useEffect(() => {
    const handleAuth = () => {
      setCurrentUserLocal(getCurrentUser());
    };
    window.addEventListener("appstore_auth_update", handleAuth);
    return () => window.removeEventListener("appstore_auth_update", handleAuth);
  }, []);

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback({ error: '', success: '' });

    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthFeedback({ error: 'Please submit a valid email address.', success: '' });
      return;
    }

    if (authMode === 'signup') {
      if (!authName.trim()) {
        setAuthFeedback({ error: 'Please enter your Full Name', success: '' });
        return;
      }
      const result = registerUser(authName, authEmail);
      if (typeof result === 'string') {
        setAuthFeedback({ error: result, success: '' });
      } else {
        setAuthFeedback({ error: '', success: `Account configured! Welcome ${result.name}.` });
        setAuthName('');
        setAuthEmail('');
      }
    } else {
      const result = loginUser(authEmail);
      if (typeof result === 'string') {
        setAuthFeedback({ error: result, success: '' });
      } else {
        setAuthFeedback({ error: '', success: `Welcome back, dev!` });
        setAuthEmail('');
      }
    }
  };

  // Image Upload handlers converting files to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'icon' | 'cover' | 'screenshots') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (target === 'screenshots') {
      const readersArray: Promise<string>[] = (Array.from(files) as File[]).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readersArray).then(results => {
        setScreenshots(prev => [...prev, ...results].slice(0, 5)); // cap at 5 screenshots
      });
    } else {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'icon') setIconBase64(reader.result as string);
        if (target === 'cover') setCoverBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // APK Upload Simulator trigger
  const handleApkFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setApkName(file.name);
    // Calculate readable size
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setApkSizeVal(`${sizeMb} MB`);

    setApkState('uploading');
    setApkProgress(0);

    const interval = setInterval(() => {
      setApkProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setApkState('finished');
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handlePublishLaunch = () => {
    if (!appTitle || !packageName) {
      alert('App title and package ID are required details.');
      setStep(1);
      return;
    }

    if (!iconBase64) {
      alert('An App Icon image is required in Step 2.');
      setStep(2);
      return;
    }

    if (!apkName) {
      alert('Please upload an APK file in Step 3.');
      setStep(3);
      return;
    }

    // Trigger Play Protect Security Scanner Simulation
    setIsScanning(true);
    setScanProgress(0);

    const checkstages = [
      { prg: 15, msg: 'Decompressing APK manifest bytecode...' },
      { prg: 40, msg: 'Analyzing target dependencies & API SDK levels...' },
      { prg: 70, msg: 'Play Protect performing virus signature audits...' },
      { prg: 90, msg: 'Decrypting package layout signatures...' },
      { prg: 100, msg: 'Signing APK container layout for distribution...' }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < checkstages.length) {
        setScanProgress(checkstages[currentStage].prg);
        setScanMessage(checkstages[currentStage].msg);
        currentStage++;
      } else {
        clearInterval(interval);
        // Process actual creation on the dynamic catalog
        launchAppIntoCatalog();
      }
    }, 850);
  };

  const launchAppIntoCatalog = () => {
    const state = getStoreState();
    
    // Use exactly the package name as the ID for clean URLs if possible (fallback if empty)
    const generatedId = packageName.trim().toLowerCase() || `app_${Date.now()}`;
    
    const newAppObj: AppItem = {
      id: generatedId,
      title: appTitle.trim(),
      subtitle: shortDesc.trim() || 'Custom sideloaded app from dev hub.',
      icon: iconBase64,
      image: coverBase64 || 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?auto=format&fit=crop&q=80&w=800',
      tag: tag,
      downloads: '100+', // newly published
      rating: '5.0',
      safety: 'Verified Safe',
      category: category,
      status: 'pending', // IMPORTANT: Keep pending until active
      // Metadata fields
      description: fullDesc.trim() || 'A standalone custom Android package created and distributed on ' + state.siteSettings.title + '.',
      screenshots: screenshots.length > 0 ? screenshots : [],
      versionName: versionName,
      versionCode: versionCode,
      apkUrl: '#sideloaded_binary', // No upload link required, uses local container upload binary
      apkSize: apkSizeVal,
      releaseTrack: track,
      developerName: currentUser?.name || 'Local Developer',
      developerEmail: currentUser?.email || 'dev@rapidapk.com',
      submittedBy: currentUser?.email
    };

    // Push into 'newReleases' list of global state
    if (!state.newReleases) state.newReleases = [];
    state.newReleases.unshift(newAppObj);
    saveStoreState(state);

    // Save submission records locally in developer submissions table
    const storedSubmissions = JSON.parse(localStorage.getItem('appstore_publisher_submissions') || '[]');
    storedSubmissions.push({
      ...newAppObj,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('appstore_publisher_submissions', JSON.stringify(storedSubmissions));

    // Finish Scanner Flow
    setIsScanning(false);
    setIsFinished(true);
    setDeployedAppId(generatedId);
  };

  const resetAllFields = () => {
    setStep(1);
    setAppTitle('');
    setPackageName('');
    setShortDesc('');
    setFullDesc('');
    setIconBase64('');
    setCoverBase64('');
    setScreenshots([]);
    setApkName('');
    setApkProgress(0);
    setApkState('idle');
    setVersionName('1.0.0');
    setVersionCode('1');
    setIsFinished(false);
  };

  if (!currentUser) {
    // If not logged-in, they see this block
    return (
      <div className="bg-white dark:bg-slate-950 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-xl p-6 sm:p-8 animate-in slide-in-from-bottom duration-300 text-center">
        <div className="text-center max-w-sm mx-auto py-5">
          <div className="w-14 h-14 bg-blue-50 border border-blue-105 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4.5 shadow-inner">
            <Lock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight">Deployment Locked</h2>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed mt-2 px-3">
            To prevent listing spam and malware, deploying applications requires an authenticated developer account. Please log in or sign up.
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/70 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 mt-6 space-y-3.5">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Developer Identity Verification</p>
            
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-2xl transition-all shadow-md active:scale-95 uppercase tracking-wider"
            >
              Log In
            </button>

            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-slate-200/80 hover:bg-slate-300/90 text-slate-800 dark:text-slate-200 font-black text-xs py-3.5 rounded-2xl transition-all active:scale-95 uppercase tracking-wider"
            >
              Sign Up Developer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Play Console Wrapper */}
      {isFinished ? (
        <div className="bg-white dark:bg-slate-950 rounded-[2rem] border border-gray-100 dark:border-slate-800 p-8 text-center shadow-lg animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-amber-50 border border-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <BadgeCheck className="w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase">App Submission Successful!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">APP SUBMISSION RECEIVED (PENDING REVIEW)</p>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-2.5 px-4">
            Your application has been successfully submitted! It is currently pending review. Once an admin approves it, it will appear on the homepage.
          </p>

          <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-100 text-left mt-6 max-w-sm mx-auto space-y-2">
            <div className="flex gap-2.5 items-center">
              <img src={iconBase64} className="w-12 h-12 object-cover rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950" />
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-black text-gray-900 dark:text-gray-100 truncate leading-snug">{appTitle}</span>
                <span className="block text-[9px] font-mono text-gray-500 truncate mt-0.5">{packageName}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-400 uppercase">
              <span>Version: <strong className="text-gray-700 dark:text-gray-300">{versionName}</strong></span>
              <span>APK Size: <strong className="text-gray-700 dark:text-gray-300">{apkSizeVal}</strong></span>
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-center">
            <button 
              onClick={resetAllFields}
              className="px-5 py-2.5 rounded-full text-xs font-black text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 transition-colors uppercase tracking-wider"
            >
              Submit Another
            </button>
            <a 
              href={`/app/${deployedAppId}`}
              className="px-5 py-2.5 rounded-full text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md uppercase tracking-wider"
            >
              Preview Listing
            </a>
          </div>
        </div>
      ) : isScanning ? (
        <div className="bg-slate-900 text-white rounded-[2rem] p-8 text-center shadow-2xl space-y-6">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin"></div>
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase bg-blue-500/10 px-3 py-1.5 border border-blue-500/20 rounded-full inline-block">
              Google Play Protect Evaluation
            </span>
            <h3 className="text-lg font-black mt-4 uppercase">Sandbox Security Scanning... {scanProgress}%</h3>
            <p className="text-xs text-slate-400 font-mono mt-2 min-h-12 flex items-center justify-center px-4 leading-relaxed bg-slate-950 p-3 rounded-2xl border border-slate-800 mt-2">
              &gt; {scanMessage}
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white p-6 relative">
            <span className="text-[9px] bg-white/20 dark:bg-slate-950/20 border border-white/20 text-white font-black px-3 py-1.5 rounded-full uppercase tracking-wider block w-fit mb-2 blur-none">
              Play Console Studio
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight">App Submission Studio</h3>
            <p className="text-xs text-white/80 font-medium leading-relaxed mt-1">Multi-step launch wizard following Android Play distribution compliance.</p>
          </div>

          {/* Stepper Wizard Row */}
          <div className="grid grid-cols-4 bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 text-center text-[10px] font-black uppercase text-gray-400">
            <div className={`py-3.5 border-r border-gray-100 dark:border-slate-800/60 transition-colors ${step >= 1 ? 'text-blue-600 bg-blue-50/40' : ''}`} onClick={() => setStep(1)}>1. Metadata</div>
            <div className={`py-3.5 border-r border-gray-100 dark:border-slate-800/60 transition-colors ${step >= 2 ? 'text-blue-600 bg-blue-50/40' : ''}`} onClick={() => appTitle && setStep(2)}>2. Graphics</div>
            <div className={`py-3.5 border-r border-gray-100 dark:border-slate-800/60 transition-colors ${step >= 3 ? 'text-blue-600 bg-blue-50/40' : ''}`} onClick={() => appTitle && iconBase64 && setStep(3)}>3. Binary APK</div>
            <div className={`py-3.5 transition-colors ${step >= 4 ? 'text-blue-600 bg-blue-50/40' : ''}`} onClick={() => appTitle && iconBase64 && apkState === 'finished' && setStep(4)}>4. Launch</div>
          </div>

          <div className="p-6 space-y-4">
            {/* Step 1: Metadata */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-gray-50 pb-2 mb-2">
                  <h4 className="font-extrabold text-sm text-gray-950 uppercase flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-500" /> Store listing details
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Your app's listing metadata will be featured in search and category rankings.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">App Title Name *</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Clean Optimizer"
                      value={appTitle}
                      onChange={e => setAppTitle(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/55 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:bg-slate-950 rounded-2xl px-4 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">Package ID *</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. com.studio.optim"
                      value={packageName}
                      onChange={e => setPackageName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/55 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:bg-slate-950 rounded-2xl px-4 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 font-mono outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">Short Description (Slogan Highlight) *</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. High-speed Android cache cleaning utility."
                      value={shortDesc}
                      onChange={e => setShortDesc(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/55 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:bg-slate-950 rounded-2xl px-4 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">Full Detailed description</label>
                    <textarea 
                      placeholder="Provide comprehensive details about features, usability, and capabilities of your application."
                      rows={3}
                      value={fullDesc}
                      onChange={e => setFullDesc(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/55 border border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:bg-slate-950 rounded-2xl px-4 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">Category Classification</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/55 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-2xl cursor-pointer"
                    >
                      <option value="games">Games Catalog</option>
                      <option value="apps">Apps Collection</option>
                      <option value="productivity">Productivity Tools</option>
                      <option value="social">Social Media Platforms</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">Label Tag</label>
                    <select 
                      value={tag}
                      onChange={e => setTag(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/55 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-2xl cursor-pointer"
                    >
                      <option value="NEW">NEW RELEASE</option>
                      <option value="UPDATE">RECENT UPDATE</option>
                      <option value="HOT">IMMEDIATE MUST-HAVE</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="button"
                    disabled={!appTitle || !packageName}
                    onClick={() => setStep(2)}
                    className="bg-blue-600 disabled:opacity-40 hover:bg-blue-700 text-white font-black text-xs px-6 py-3 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    Next: Graphic Assets <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Graphics */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-gray-50 pb-2 mb-2">
                  <h4 className="font-extrabold text-sm text-gray-950 uppercase flex items-center gap-1.5">
                    <FileImage className="w-4 h-4 text-blue-500" /> App Visual Identifiers
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Upload high contrast icons, banners and real device screenshots (Compulsory).</p>
                </div>

                <div className="space-y-4">
                  {/* Icon Block */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-dashed border-slate-350 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-16 h-16 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                      {iconBase64 ? (
                        <img src={iconBase64} className="w-full h-full object-cover" />
                      ) : (
                        <Smartphone className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <span className="block text-xs font-black text-gray-900 dark:text-gray-100 uppercase">App Icon Asset (512x512) *</span>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">Select a square logo as the storefront launcher graphic.</p>
                      <input 
                        type="file" 
                        accept="image/*"
                        id="icon-upload-console"
                        className="hidden" 
                        onChange={e => handleImageUpload(e, 'icon')}
                      />
                      <label 
                        htmlFor="icon-upload-console"
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-950 hover:bg-gray-100 border border-gray-205 text-gray-700 dark:text-gray-300 rounded-full font-bold text-[10px] uppercase shadow-sm cursor-pointer active:scale-95 transition-all"
                      >
                        <Upload className="w-3 h-3 text-blue-500" /> Choose Image File
                      </label>
                    </div>
                  </div>

                  {/* Banner/Cover Block */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-dashed border-slate-350 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-14 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                      {coverBase64 ? (
                        <img src={coverBase64} className="w-full h-full object-cover" />
                      ) : (
                        <FileImage className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <span className="block text-xs font-black text-gray-900 dark:text-gray-100 uppercase">Store Feature Cover Banner (Promo Landscape)</span>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">Promotional landscape background image (1024x500).</p>
                      <input 
                        type="file" 
                        accept="image/*"
                        id="cover-upload-console"
                        className="hidden" 
                        onChange={e => handleImageUpload(e, 'cover')}
                      />
                      <label 
                        htmlFor="cover-upload-console"
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-950 hover:bg-gray-100 border border-gray-205 text-gray-700 dark:text-gray-300 rounded-full font-bold text-[10px] uppercase shadow-sm cursor-pointer active:scale-95 transition-all"
                      >
                        <Upload className="w-3 h-3 text-blue-500" /> Choose Landscape File
                      </label>
                    </div>
                  </div>

                  {/* Screenshots gallery select */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-550 mb-1 ml-1">Phone Device Screenshots (Selected: {screenshots.length}/5)</label>
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-dashed border-slate-350 rounded-3xl text-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        id="scr-upload-console"
                        className="hidden"
                        onChange={e => handleImageUpload(e, 'screenshots')}
                      />
                      <label 
                        htmlFor="scr-upload-console"
                        className="mx-auto block w-fit inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black text-[10px] uppercase shadow-md cursor-pointer active:scale-95 transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload Screen Promos
                      </label>
                      
                      {screenshots.length > 0 && (
                        <div className="flex gap-2 justify-center overflow-x-auto pt-4 border-t border-gray-200 dark:border-slate-700/50 mt-4">
                          {screenshots.map((scr, idx) => (
                            <div key={idx} className="w-12 h-20 bg-white dark:bg-slate-950 border rounded-lg overflow-hidden shrink-0 shadow-sm relative group">
                              <img src={scr} className="w-full h-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => setScreenshots(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center font-black text-white text-[8px] uppercase transition-opacity"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-full border border-gray-250 bg-white dark:bg-slate-950 text-gray-700 dark:text-gray-300 text-xs font-black flex items-center gap-1 hover:bg-gray-50 dark:bg-slate-900 active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button 
                    type="button"
                    disabled={!iconBase64}
                    onClick={() => setStep(3)}
                    className="bg-blue-600 disabled:opacity-45 hover:bg-blue-700 text-white font-black text-xs px-6 py-3 rounded-full flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    Next: Binary APK <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: APK details */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-gray-50 pb-2 mb-2">
                  <h4 className="font-extrabold text-sm text-gray-950 uppercase flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-blue-500" /> Package binary / Release Channel
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Sideload the executable Android application package file (APK/AAB).</p>
                </div>

                <div className="space-y-4">
                  {/* APK upload zone */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 border-2 border-dashed border-slate-300 rounded-[2rem] text-center">
                    {apkState === 'idle' ? (
                      <div>
                        <input 
                          type="file" 
                          accept=".apk"
                          id="apk-upload-console"
                          className="hidden"
                          onChange={handleApkFileSelect}
                        />
                        <label 
                          htmlFor="apk-upload-console"
                          className="mx-auto flex flex-col items-center justify-center p-4 cursor-pointer"
                        >
                          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                            <Upload className="w-5 h-5 animate-pulse" />
                          </div>
                          <span className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase">Select Target APK Executable</span>
                          <span className="text-[10px] text-gray-400 font-medium block mt-1">Accepts standalone bundle files up to 150MB</span>
                        </label>
                      </div>
                    ) : apkState === 'uploading' ? (
                      <div className="py-4">
                        <div className="w-12 h-12 bg-blue-50 border text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-spin">
                          <RefreshCw className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-gray-900 dark:text-gray-100 block uppercase">Uploading binary container to cloud: {apkProgress}%</span>
                        <div className="max-w-xs mx-auto bg-gray-200 rounded-full h-1.5 mt-3 overflow-hidden">
                          <div className="bg-blue-600 h-full transition-all duration-150" style={{ width: `${apkProgress}%` }}></div>
                        </div>
                        <span className="text-[9px] text-gray-400 font-semibold block mt-1">{apkName}</span>
                      </div>
                    ) : (
                      <div className="py-2 flex items-center justify-between bg-emerald-50 text-emerald-800 p-4 border border-emerald-150 rounded-2xl text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white dark:bg-slate-950 rounded-xl border border-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block text-xs font-black text-emerald-900 truncate max-w-[160px] leading-tight">{apkName}</span>
                            <span className="text-[9px] text-emerald-600 font-mono font-bold">{apkSizeVal} • Upload Completed</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setApkState('idle')}
                          className="text-xs text-blue-600 font-extrabold hover:underline"
                        >
                          Re-select
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Version info details */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 mt-2">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-gray-500 mb-1 ml-0.5">Version Name string *</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. 1.2.4"
                        value={versionName}
                        onChange={e => setVersionName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase text-gray-500 mb-1 ml-0.5">Version Code *</label>
                      <input 
                        type="number"
                        required
                        placeholder="e.g. 12"
                        value={versionCode}
                        onChange={e => setVersionCode(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[9px] font-black uppercase text-gray-500 mb-1 ml-0.5">Release Notes & highlights</label>
                      <input 
                        type="text"
                        placeholder="e.g. Fixed core service crashes, updated layout styles."
                        value={releaseNotes}
                        onChange={e => setReleaseNotes(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="px-5 py-3 rounded-full border border-gray-250 bg-white dark:bg-slate-950 text-gray-700 dark:text-gray-300 text-xs font-black flex items-center gap-1 hover:bg-gray-50 dark:bg-slate-900 active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button 
                    type="button"
                    disabled={apkState !== 'finished'}
                    onClick={() => setStep(4)}
                    className="bg-blue-600 disabled:opacity-45 hover:bg-blue-700 text-white font-black text-xs px-6 py-3 rounded-full flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    Next: Evaluate & Launch <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Compliance & Publish */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-gray-50 pb-2 mb-2">
                  <h4 className="font-extrabold text-sm text-gray-950 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Distribution evaluation and launch
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Evaluate metadata constraints before signing and pushing your APK into Production channels.</p>
                </div>

                {/* Final app brief preview card */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-3">
                  <div className="flex gap-3 items-center border-b border-gray-100 dark:border-slate-800 pb-3">
                    <img src={iconBase64} className="w-12 h-12 object-cover rounded-2xl border bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700" />
                    <div>
                      <h4 className="font-black text-sm text-gray-950 leading-tight">{appTitle}</h4>
                      <p className="text-[10px] text-gray-450 font-semibold font-mono leading-none mt-0.5">{packageName} (v{versionName})</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10px] uppercase font-bold text-gray-550 pt-1">
                    <div>Category: <span className="text-gray-900 dark:text-gray-100 block font-black mt-0.5">{category.toUpperCase()}</span></div>
                    <div>Installer Payload: <span className="text-gray-900 dark:text-gray-100 block font-black mt-0.5">{apkSizeVal}</span></div>
                    <div>Release Notes: <span className="text-gray-900 dark:text-gray-100 block font-extrabold mt-0.5 truncate leading-relaxed max-w-[130px]">{releaseNotes || 'Initial Release'}</span></div>
                    <div>Evaluation Signature: <span className="text-emerald-600 block font-black mt-0.5 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> APPROVED</span></div>
                  </div>
                </div>

                {/* Warning terms */}
                <p className="text-[9px] text-gray-400 leading-normal font-semibold pl-1">
                  By clicking Rollout, you certify this APK is signature-matched, completely virus-free, and contains zero location gathering telemetry code. Automated security checks will launch compile validations immediately.
                </p>

                <div className="pt-4 flex justify-between">
                  <button 
                    type="button" 
                    onClick={() => setStep(3)}
                    className="px-5 py-3 rounded-full border border-gray-250 bg-white dark:bg-slate-950 text-gray-700 dark:text-gray-300 text-xs font-black flex items-center gap-1 hover:bg-gray-50 dark:bg-slate-900 active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button 
                    type="button"
                    onClick={handlePublishLaunch}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-7 py-3 rounded-full flex items-center gap-1.5 shadow-lg active:scale-95 transition-all uppercase tracking-wide"
                  >
                    <Send className="w-4 h-4" /> Rollout to Production
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

export function PhotoUploader({ onFileSelect, file }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndPass = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Invalid format: Please provide a standard image (JPEG, PNG, WEBP).');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB statutory limit.');
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPass(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-300">
        Photographic Evidence (Exhaust / Plume / Waste Ingest)
      </label>

      {file ? (
        <div className="relative rounded border border-border-strong bg-app-surface p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded bg-app-bg border border-border-subtle flex items-center justify-center overflow-hidden">
              <img
                src={URL.createObjectURL(file)}
                alt="Upload preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-200 truncate max-w-[200px]">
                {file.name}
              </p>
              <div className="flex items-center gap-2 font-mono text-2xs text-slate-400 mt-0.5">
                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> VERIFIED FORMAT
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            title="Remove Photo"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-950/20'
              : 'border-border-subtle bg-app-surface hover:border-border-strong hover:bg-app-hover'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="hidden"
          />

          <UploadCloud className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-200">
            Drop emission incident photo or click to capture
          </p>
          <p className="text-2xs text-slate-400 mt-1">
            Supports JPEG, PNG, WEBP (Max 10MB) • Forensic EXIF timestamp preserved
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-2xs text-rose-400 font-mono">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

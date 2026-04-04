import { useState, useRef, useEffect } from 'react';
import { 
  Upload, X, CheckCircle2, Loader2, FileText, Image, AlertCircle, 
  Download, Files, File, Trash2, Eye, Paperclip, Maximize2 
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadMultipleSuccess?: (urls: string[]) => void;
  defaultValue?: string;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  helperText?: string;
  multiple?: boolean;
  className?: string;
  showPreview?: boolean;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
  url: string;
}

export function FileUpload({ 
  onUploadSuccess,
  onUploadMultipleSuccess,
  defaultValue, 
  label,
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt",
  maxSizeMB = 10,
  helperText,
  multiple = false,
  className,
  showPreview = true
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [previews, setPreviews] = useState<FileInfo[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultValue) {
      setPreview(defaultValue);
      const fileName = defaultValue.split('/').pop() || 'File';
      setFileInfo({
        name: fileName,
        size: 0,
        type: fileName.split('.').pop() || 'unknown',
        url: defaultValue
      });
    }
  }, [defaultValue]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string, fileType: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (fileType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <Image className="w-5 h-5" />;
    }
    
    if (['pdf'].includes(ext || '')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    
    if (['doc', 'docx'].includes(ext || '')) {
      return <FileText className="w-5 h-5 text-blue-500" />;
    }
    
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) {
      return <FileText className="w-5 h-5 text-green-500" />;
    }
    
    if (['txt', 'text'].includes(ext || '')) {
      return <FileText className="w-5 h-5 text-gray-500" />;
    }
    
    return <File className="w-5 h-5" />;
  };

  const validateFile = (file: File): boolean => {
    // Size validation
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-bold">{file.name}</p>
            <p className="text-sm opacity-90">Maximum size is {maxSizeMB}MB</p>
          </div>
        </div>,
        {
          duration: 4000,
          style: { 
            borderRadius: '16px', 
            background: '#ef4444', 
            color: '#fff',
            padding: '16px'
          }
        }
      );
      return false;
    }

    // Type validation
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const acceptedTypes = accept.split(',').map(type => 
      type.trim().replace('*', '').replace('.', '').toLowerCase()
    );
    
    const isAccepted = acceptedTypes.some(type => 
      fileExt === type || 
      (type === 'jpg' && fileExt === 'jpeg') ||
      (file.type.startsWith('image/') && accept.includes('image'))
    );

    if (!isAccepted && acceptedTypes.length > 0) {
      toast.error(
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-bold">Unsupported file type</p>
            <p className="text-sm opacity-90">Accepted: {accept}</p>
          </div>
        </div>,
        {
          duration: 4000,
          style: { 
            borderRadius: '16px', 
            background: '#ef4444', 
            color: '#fff',
            padding: '16px'
          }
        }
      );
      return false;
    }

    return true;
  };

  const handleUpload = async (files: FileList | File[]) => {
    const filesArray = Array.from(files);
    if (filesArray.length === 0) return;

    // Filter valid files
    const validFiles = filesArray.filter(validateFile);
    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();

    try {
      if (multiple) {
        // Multi-file upload
        validFiles.forEach(file => formData.append('files', file));
        
        const response = await api.post('/upload/multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        });

        const urls = response.data.data.urls || [];
        
        // Create file info objects
        const newFiles: FileInfo[] = validFiles.map((file, index) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: urls[index]
        }));

        setPreviews(prev => [...prev, ...newFiles]);
        
        if (onUploadMultipleSuccess) {
          onUploadMultipleSuccess(urls);
        } else {
          urls.forEach((url: string) => onUploadSuccess(url));
        }

        toast.success(
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <p className="font-bold">Upload Complete!</p>
              <p className="text-sm opacity-90">{validFiles.length} files uploaded successfully</p>
            </div>
          </div>,
          {
            duration: 3000,
            style: { 
              borderRadius: '16px', 
              background: '#10b981', 
              color: '#fff',
              padding: '16px'
            }
          }
        );
      } else {
        // Single file upload
        const file = validFiles[0];
        formData.append('file', file);
        
        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        });

        const url = response.data.data.url;
        setPreview(url);
        setFileInfo({
          name: file.name,
          size: file.size,
          type: file.type,
          url
        });
        onUploadSuccess(url);

        toast.success(
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <p className="font-bold">Upload Complete!</p>
              <p className="text-sm opacity-90">{file.name}</p>
            </div>
          </div>,
          {
            duration: 3000,
            style: { 
              borderRadius: '16px', 
              background: '#10b981', 
              color: '#fff',
              padding: '16px'
            }
          }
        );
      }
    } catch (error: any) {
      console.error('Upload Error:', error);
      toast.error(
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-bold">Upload Failed</p>
            <p className="text-sm opacity-90">{error.response?.data?.message?.english || 'Please try again'}</p>
          </div>
        </div>,
        {
          duration: 4000,
          style: { 
            borderRadius: '16px', 
            background: '#ef4444', 
            color: '#fff',
            padding: '16px'
          }
        }
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files);
    }
  };

  const removeFile = () => {
    setPreview(null);
    setFileInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {label && (
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-[#B39371]" />
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {!multiple && preview && (
            <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
              Uploaded
            </span>
          )}
        </div>
      )}

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "relative group cursor-pointer transition-all duration-300",
          "min-h-[200px] flex flex-col items-center justify-center p-8",
          "rounded-2xl border-2 border-dashed",
          "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50",
          dragActive 
                ? "border-[#B39371] bg-[#B39371]/5 shadow-lg shadow-[#B39371]/20" 
            : "border-gray-200 dark:border-gray-700 hover:border-[#B39371] hover:bg-[#B39371]/5 hover:shadow-lg hover:shadow-[#B39371]/10",
          preview && !multiple && "border-emerald-500/30 bg-gradient-to-br from-emerald-50/30 to-transparent"
        )}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={onFileChange}
          disabled={isUploading}
        />

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#B39371]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#B39371]/5 rounded-full blur-3xl" />
        </div>

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-6 z-10"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-16 h-16 text-[#B39371]" />
                </motion.div>
                <div className="absolute inset-0 blur-2xl bg-[#B39371]/30 animate-pulse" />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  Uploading {multiple ? 'Files' : 'File'}...
                </p>
                <p className="text-sm text-gray-500">
                  {uploadProgress}% complete
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-gradient-to-r from-[#B39371] to-[#8B7355] rounded-full"
                />
              </div>
            </motion.div>
          ) : preview && !multiple ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full space-y-6 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-emerald-100 dark:border-emerald-500/20">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-md" />
                  <div className="relative w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 flex items-center justify-center">
                    {fileInfo?.type.startsWith('image/') ? (
                      fileInfo.url ? (
                        <img 
                          src={fileInfo.url} 
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Image className="w-7 h-7 text-emerald-600" />
                      )
                    ) : (
                      getFileIcon(fileInfo?.name || '', fileInfo?.type || '')
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {fileInfo?.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {fileInfo?.size > 0 && (
                      <>
                        <span className="text-xs text-gray-500 font-medium">
                          {formatFileSize(fileInfo.size)}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      </>
                    )}
                    <span className="text-xs text-emerald-600 font-medium">
                      Ready
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={preview.startsWith('http') ? preview : `${import.meta.env.VITE_API_BASE_URL}/${preview}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 hover:text-[#B39371] hover:bg-[#B39371]/10 transition-all"
                    title="View file"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    title="Remove file"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 py-2 px-4 rounded-full w-fit mx-auto"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">File uploaded successfully</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center space-y-6 z-10"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative"
                >
                  <div className="absolute inset-0 blur-3xl bg-[#B39371]/20 group-hover:bg-[#B39371]/30 transition-all" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#B39371]/10 to-[#8B7355]/5 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 group-hover:border-[#B39371]/30 transition-all">
                    {multiple ? (
                      <Files className="w-10 h-10 text-gray-400 group-hover:text-[#B39371] transition-colors" />
                    ) : (
                      <Upload className="w-10 h-10 text-gray-400 group-hover:text-[#B39371] transition-colors" />
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {multiple ? 'Drop files here or click to upload' : 'Drop file here or click to upload'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  {helperText || `Maximum file size: ${maxSizeMB}MB`}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {accept.split(',').map((type, i) => (
                  <span 
                    key={i}
                    className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full font-medium"
                  >
                    {type.trim()}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Multiple Files Preview */}
      <AnimatePresence>
        {multiple && previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Uploaded Files ({previews.length})
              </h4>
              <button
                onClick={() => setPreviews([])}
                className="text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {previews.map((file, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#B39371]/30 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B39371]/10 to-[#8B7355]/5 flex items-center justify-center">
                    {getFileIcon(file.name, file.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="text-xs text-emerald-600">Uploaded</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-gray-400 hover:text-[#B39371] hover:bg-[#B39371]/10 transition-all"
                      title="View file"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removePreview(idx)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
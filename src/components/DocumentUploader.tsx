import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn, formatFileSize } from './lib/utils';

interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'completed' | 'error';
}

interface DocumentUploaderProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: Record<string, string[]>;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
}

export function DocumentUploader({
  onFilesSelected,
  acceptedTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    'text/plain': ['.txt'],
  },
  maxFileSize = 100 * 1024 * 1024, // 100MB default
  maxFiles = 50,
  disabled = false,
}: DocumentUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        uploadProgress: 0,
        uploadStatus: 'pending' as const,
      })
    );
    
    setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles));
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxSize: maxFileSize,
    maxFiles: maxFiles - files.length,
    disabled,
  });

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
    const controller = abortControllers.current.get(fileName);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(fileName);
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        {isDragActive ? (
          <p className="mt-4 text-sm text-gray-600">Drop the files here...</p>
        ) : (
          <>
            <p className="mt-4 text-sm text-gray-600">
              Drag & drop files here, or click to select files
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Support for PDF, DOC, DOCX, XLS, XLSX, images (max {formatFileSize(maxFileSize)})
            </p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Selected Files ({files.length})</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    {file.uploadStatus === 'uploading' && (
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${file.uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.uploadStatus === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {file.uploadStatus === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <button
                    onClick={() => removeFile(file.name)}
                    className="text-gray-400 hover:text-red-500"
                    disabled={file.uploadStatus === 'uploading'}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

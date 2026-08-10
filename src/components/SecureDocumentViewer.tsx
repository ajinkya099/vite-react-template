import { useState, useEffect, useRef } from 'react';
import { Eye, Download, Printer, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Document, User, ViewerRestrictions } from '../types';
import { generateWatermarkText } from '../lib/utils';

interface SecureDocumentViewerProps {
  document: Document;
  user: User;
  restrictions: ViewerRestrictions;
  onClose: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onViewEvent?: (eventType: 'view' | 'download' | 'print', metadata?: any) => void;
}

export function SecureDocumentViewer({
  document,
  user,
  restrictions,
  onClose,
  onDownload,
  onPrint,
  onViewEvent,
}: SecureDocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewStartTime = useRef<Date>(new Date());

  // Block keyboard shortcuts for printing/saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        onViewEvent?.('view', { action: 'print_blocked' });
      }
      // Block Ctrl+S (Save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        onViewEvent?.('view', { action: 'save_blocked' });
      }
      // Block Ctrl+C (Copy)
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        onViewEvent?.('view', { action: 'copy_blocked' });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onViewEvent]);

  // Prevent right-click context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onViewEvent?.('view', { action: 'context_menu_blocked' });
    };

    if (viewerRef.current) {
      viewerRef.current.addEventListener('contextmenu', handleContextMenu);
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  }, [onViewEvent]);

  // Track view duration on unmount
  useEffect(() => {
    return () => {
      const viewDuration = (new Date().getTime() - viewStartTime.current.getTime()) / 1000;
      onViewEvent?.('view', { 
        duration: viewDuration,
        page: currentPage,
        zoom
      });
    };
  }, [currentPage, zoom, onViewEvent]);

  // Detect and block screenshots (limited browser support)
  useEffect(() => {
    if (restrictions.disableScreenshots) {
      document.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.key === 'PrintScreen') {
          onViewEvent?.('view', { action: 'screenshot_attempted' });
          // Note: Cannot actually block screenshots, but can log the attempt
        }
      });
    }
  }, [restrictions.disableScreenshots, onViewEvent]);

  const handleDownload = () => {
    if (!restrictions.viewOnly && onDownload) {
      onDownload();
      onViewEvent?.('download', {});
    } else {
      onViewEvent?.('view', { action: 'download_blocked' });
    }
  };

  const handlePrint = () => {
    if (!restrictions.viewOnly && onPrint) {
      onPrint();
      onViewEvent?.('print', {});
    } else {
      onViewEvent?.('view', { action: 'print_blocked' });
    }
  };

  const renderWatermark = () => {
    if (!restrictions.dynamicWatermark) return null;
    
    const watermarkText = generateWatermarkText(user, new Date());
    
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-gray-300/20 text-lg font-bold whitespace-nowrap transform -rotate-45"
            style={{
              top: `${i * 10}%`,
              left: `${(i % 2) * 50}%`,
            }}
          >
            {watermarkText}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">{document.name}</h2>
            <p className="text-sm text-gray-400">
              Viewer: {user.email} • Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <span className="text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          
          {!restrictions.viewOnly && (
            <>
              {onDownload && (
                <Button variant="ghost" size="icon" onClick={handleDownload}>
                  <Download className="h-5 w-5" />
                </Button>
              )}
              {onPrint && (
                <Button variant="ghost" size="icon" onClick={handlePrint}>
                  <Printer className="h-5 w-5" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Document Viewer */}
      <div 
        ref={viewerRef}
        className="flex-1 relative overflow-auto bg-gray-800"
        style={{
          userSelect: restrictions.disableCopy ? 'none' : 'auto',
          WebkitUserSelect: restrictions.disableCopy ? 'none' : 'auto',
        }}
      >
        {renderWatermark()}
        
        <div 
          className="relative h-full flex items-center justify-center p-8"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          {/* PDF/Document rendering would go here */}
          {/* For now, show a placeholder */}
          <div className="bg-white shadow-2xl rounded-lg p-8 max-w-4xl w-full min-h-[800px]">
            <div className="text-center text-gray-500">
              <Eye className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{document.name}</h3>
              <p>Document viewer with security features:</p>
              <ul className="mt-4 space-y-2 text-sm">
                {restrictions.disableScreenshots && (
                  <li>✓ Screenshot detection enabled</li>
                )}
                {restrictions.disableCopy && (
                  <li>✓ Copy/paste disabled</li>
                )}
                {restrictions.dynamicWatermark && (
                  <li>✓ Dynamic watermarking active</li>
                )}
                {restrictions.viewOnly && (
                  <li>✓ View-only mode (no download/print)</li>
                )}
              </ul>
              
              {/* Simulated pages */}
              <div className="mt-8 flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with security notice */}
      <div className="p-2 bg-gray-900 text-gray-400 text-xs text-center">
        CONFIDENTIAL DOCUMENT • Unauthorized distribution is prohibited • 
        Tracked viewer session for {user.email}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Signature, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { NDATemplate, NDAField } from '../types';

interface NDAFormProps {
  template: NDATemplate;
  viewerEmail: string;
  viewerName: string;
  viewerCompany?: string;
  onSign: (fields: Record<string, string>, signatureData?: string) => Promise<void>;
  onDecline: () => void;
}

export function NDAForm({
  template,
  viewerEmail,
  viewerName,
  viewerCompany,
  onSign,
  onDecline,
}: NDAFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    email: viewerEmail,
    name: viewerName,
    company: viewerCompany || '',
  });
  const [signatureCanvas, setSignatureCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const canvasRef = (canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
      setSignatureCanvas(canvas);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signatureCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !signatureCanvas) return;
    
    const ctx = signatureCanvas.getContext('2d');
    if (!ctx) return;

    const rect = signatureCanvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getSignatureData = () => {
    if (!signatureCanvas) return null;
    return signatureCanvas.toDataURL('image/png');
  };

  const validateForm = () => {
    for (const field of template.fields) {
      if (field.required && !formData[field.id]?.trim()) {
        setError(`${field.label} is required`);
        return false;
      }
    }
    
    const signatureField = template.fields.find(f => f.type === 'signature');
    if (signatureField && signatureField.required) {
      const signatureData = getSignatureData();
      if (!signatureData || signatureData === 'data:image/png;base64,') {
        setError('Please provide your signature');
        return false;
      }
    }
    
    if (!agreedToTerms) {
      setError('You must agree to the terms');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const signatureData = getSignatureData() || undefined;
      await onSign(formData, signatureData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign NDA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Signature className="h-6 w-6" />
            <span>Non-Disclosure Agreement</span>
          </CardTitle>
          <CardDescription>
            Please review and sign the NDA to access this document
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NDA Content */}
            <div 
              className="prose max-w-none p-6 bg-gray-50 rounded-lg border max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: template.content }}
            />
            
            {/* Form Fields */}
            <div className="space-y-4">
              {template.fields.filter(f => f.type !== 'signature').map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <Input
                    type={field.type === 'email' ? 'email' : field.type === 'date' ? 'date' : 'text'}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                </div>
              ))}
              
              {/* Signature Field */}
              {template.fields.find(f => f.type === 'signature') && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Signature <span className="text-red-500">*</span>
                  </label>
                  <div className="border rounded-lg p-4 bg-white">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={150}
                      className="border border-gray-300 rounded cursor-crosshair w-full"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearSignature}
                      className="mt-2"
                    >
                      Clear Signature
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                  I agree to the terms of this Non-Disclosure Agreement and understand that 
                  unauthorized disclosure of confidential information may result in legal action.
                </label>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onDecline}
                disabled={isLoading}
              >
                Decline
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !agreedToTerms}
              >
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Sign & Continue
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// components/DocumentManager.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Trash2, 
  Plus, 
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'legal_opinion' | 'court_document' | 'other';
  size: string;
  uploadedAt: string;
  status: 'pending' | 'signed' | 'reviewed' | 'archived';
  downloadUrl: string;
}

interface DocumentManagerProps {
  documents: Document[];
  onUpload: (file: File) => void;
  onDownload: (documentId: string) => void;
  onDelete: (documentId: string) => void;
}

export function DocumentManager({ 
  documents, 
  onUpload, 
  onDownload, 
  onDelete 
}: DocumentManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setIsUploading(true);
      onUpload(selectedFile);
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'legal_opinion': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'court_document': return <FileText className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gestão de Documentos</CardTitle>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              id="document-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="document-upload">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </label>
            <Button size="sm" onClick={handleUpload} disabled={!selectedFile || isUploading}>
              {isUploading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum documento enviado</p>
              <p className="text-sm text-gray-400 mt-1">Envie documentos jurídicos para armazenamento seguro</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(doc.type)}
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{doc.size}</span>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</span>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(doc.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
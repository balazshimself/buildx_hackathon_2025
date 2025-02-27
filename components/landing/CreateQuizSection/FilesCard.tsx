'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, X } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

interface FilesCardProps {
  files: File[];
  setFiles: (files: File[]) => void;
  hasError?: boolean;
}

export default function FilesCard({ files, setFiles, hasError = false }: FilesCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari && isDragging) {
      toast.error("Safari does not support drag & drop. Please use the file picker.");
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      const isValidType = [
        "application/pdf",
        "text/plain",
        "text/html",
        "text/css",
        "text/javascript",
        "application/json",
        "application/xml",
        "text/xml",
        "text/markdown",
      ].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only files under 5MB are allowed.");
    }
    setFiles([...files, ...validFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <Card 
      className={`w-full h-full ${hasError ? 'error-highlight border-red-500 border-2' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center rounded-lg bg-primary/5 border-2 border-dashed border-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <p className="font-medium">Drop your files here</p>
              <p className="text-sm text-muted-foreground">(PDF, TXT, HTML, etc.)</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardHeader>
        <CardTitle className="text-xl">Upload Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[200px]">
          <div 
            className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-3 transition-colors hover:border-muted-foreground/50 ${files.length > 0 ? 'h-20' : 'flex-grow'}`}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.txt,.html,.css,.js,.json,.xml,.md"
              className="absolute inset-0 opacity-0 cursor-pointer"
              multiple
            />
            <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              {files.length > 0 ? (
                <span className="font-medium">{`${files.length} file(s) ready. Click or drag to upload more!`}</span>
              ) : (
                <span>Drop your file(s) here or click to browse</span>
              )}
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2 overflow-y-auto flex-grow custom-scrollbar">
              {files.map((file, index) => (
                <div key={index} className="flex justify-between items-center bg-muted p-2 rounded">
                  <span className="text-sm truncate max-w-[75%]">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
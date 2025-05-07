
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateConsultationNotes } from '@/lib/ai';

interface ConsultationNotesProps {
  patientName: string;
  patientAge?: number;
  reason: string;
  onNotesGenerated?: (notes: string) => void;
}

const ConsultationNotes: React.FC<ConsultationNotesProps> = ({ 
  patientName, 
  patientAge = 30, // Default age if not provided
  reason,
  onNotesGenerated 
}) => {
  const [notes, setNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNotes = async () => {
    try {
      setIsGenerating(true);
      const generatedNotes = await generateConsultationNotes(patientName, patientAge, reason);
      setNotes(generatedNotes);
      if (onNotesGenerated) {
        onNotesGenerated(generatedNotes);
      }
    } catch (error) {
      console.error('Error generating notes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Consultation Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Patient: {patientName}</p>
          <p className="text-sm text-muted-foreground">Reason: {reason}</p>
        </div>
        
        <Textarea 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          placeholder="Enter notes or click generate to create AI-assisted notes"
          className="min-h-[200px]"
        />
        
        <div className="flex justify-end space-x-2">
          <Button 
            onClick={handleGenerateNotes}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate AI Notes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultationNotes;

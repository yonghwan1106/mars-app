'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { SiteWithRisk } from '@/types';
import { getSiteTypeLabel } from '@/data/sites';

interface PdfReportProps {
  site: SiteWithRisk;
}

export function PdfReportButton({ site }: PdfReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = async () => {
    setIsGenerating(true);

    try {
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();

      // 한글 폰트 대신 기본 폰트 사용 (PDF에서 한글 깨짐 방지를 위해 영문+숫자 위주로)
      let y = 20;

      // Header
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('MARS', 20, 20);
      doc.setFontSize(10);
      doc.text('Maritime AI Risk-prediction System', 20, 28);
      doc.text('Site Risk Report', 20, 35);

      y = 50;

      // Site Info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text(site.name, 20, y);
      y += 10;

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Location: ${site.location.address}`, 20, y);
      y += 6;
      doc.text(`Type: ${getSiteTypeLabel(site.type)}`, 20, y);
      y += 6;
      doc.text(`Manager: ${site.manager.name} (${site.manager.phone})`, 20, y);
      y += 6;
      doc.text(`Report Generated: ${new Date().toLocaleString('ko-KR')}`, 20, y);
      y += 15;

      // Risk Level Box
      const riskColor = site.risk.riskLevel === 'danger' ? [239, 68, 68] :
                        site.risk.riskLevel === 'caution' ? [234, 179, 8] : [34, 197, 94];

      doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
      doc.roundedRect(20, y, pageWidth - 40, 30, 3, 3, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      const riskLabel = site.risk.riskLevel === 'danger' ? 'DANGER' :
                        site.risk.riskLevel === 'caution' ? 'CAUTION' : 'SAFE';
      doc.text(`Risk Level: ${riskLabel}`, 30, y + 12);
      doc.setFontSize(20);
      doc.text(`Score: ${site.risk.overallScore}`, 30, y + 24);

      doc.setFontSize(10);
      doc.text(`AI Confidence: ${site.risk.aiConfidence.toFixed(1)}%`, pageWidth - 60, y + 18);

      y += 40;

      // Current Weather Data
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text('Current Weather & Ocean Conditions', 20, y);
      y += 8;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);

      const conditions = [
        ['Wind Speed', `${site.environment.weather.windSpeed.toFixed(1)} m/s`],
        ['Wave Height', `${site.environment.ocean.waveHeight.toFixed(1)} m`],
        ['Precipitation', `${site.environment.weather.precipitation.toFixed(1)} mm`],
        ['Visibility', `${site.environment.weather.visibility.toFixed(1)} km`],
        ['Temperature', `${site.environment.weather.temperature.toFixed(1)} °C`],
        ['Tidal Current', `${site.environment.ocean.tidalCurrent.toFixed(1)} knot`],
      ];

      conditions.forEach(([label, value], index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const xPos = 20 + col * 85;
        const yPos = y + row * 8;

        doc.setTextColor(100, 100, 100);
        doc.text(label + ':', xPos, yPos);
        doc.setTextColor(0, 0, 0);
        doc.text(value, xPos + 40, yPos);
      });

      y += 30;

      // Risk Factors
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text('Risk Factor Analysis', 20, y);
      y += 10;

      doc.setFontSize(10);
      const factors = [
        { name: 'Wind', factor: site.risk.factors.wind },
        { name: 'Wave', factor: site.risk.factors.wave },
        { name: 'Precipitation', factor: site.risk.factors.precipitation },
        { name: 'Visibility', factor: site.risk.factors.visibility },
        { name: 'Tidal', factor: site.risk.factors.tidal },
      ];

      factors.forEach((item, index) => {
        const yPos = y + index * 12;

        // Label
        doc.setTextColor(60, 60, 60);
        doc.text(item.name, 20, yPos);

        // Value
        doc.text(`${item.factor.value.toFixed(1)} ${item.factor.unit}`, 60, yPos);

        // Score bar background
        doc.setFillColor(229, 231, 235);
        doc.roundedRect(90, yPos - 4, 80, 6, 1, 1, 'F');

        // Score bar fill
        const barColor = item.factor.score >= 70 ? [239, 68, 68] :
                         item.factor.score >= 40 ? [234, 179, 8] : [34, 197, 94];
        doc.setFillColor(barColor[0], barColor[1], barColor[2]);
        doc.roundedRect(90, yPos - 4, Math.min(80, item.factor.score * 0.8), 6, 1, 1, 'F');

        // Score text
        doc.setTextColor(0, 0, 0);
        doc.text(`${item.factor.score}`, 175, yPos);
      });

      y += 70;

      // Recommendation
      doc.setFillColor(240, 249, 255);
      doc.roundedRect(20, y, pageWidth - 40, 25, 3, 3, 'F');

      doc.setTextColor(30, 64, 175);
      doc.setFontSize(12);
      doc.text('AI Recommendation', 25, y + 8);

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);

      // Word wrap for message
      const maxWidth = pageWidth - 50;
      const splitMessage = doc.splitTextToSize(site.risk.message, maxWidth);
      doc.text(splitMessage, 25, y + 16);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('MARS - Maritime AI Risk-prediction System', 20, 280);
      doc.text('Korea Fisheries Infrastructure Corporation Safety Innovation Contest 2025', 20, 285);

      // Save
      const fileName = `MARS_Report_${site.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generatePdf}
      disabled={isGenerating}
      className="gap-2"
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4" />
      )}
      PDF 리포트
    </Button>
  );
}

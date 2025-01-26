"use client";

import { QRCodeSVG } from "qrcode.react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Download } from "lucide-react";

interface QrCodeProps {
  data: string;
}

export function QrCode({ data }: QrCodeProps) {
  const downloadQrCode = () => {
    const svg = document.querySelector(".qr-code svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.download = "transaction-qr.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Transaction QR Code</h3>
        <div className="qr-code flex justify-center">
          <QRCodeSVG
            value={data}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <Button
          onClick={downloadQrCode}
          variant="bordered"
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </div>
    </Card>
  );
}
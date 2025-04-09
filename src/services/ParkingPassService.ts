import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

interface PassDetails {
  bookingId: string;
  facilityName: string;
  spotNumber: string;
  date: string;
  time: string;
  vehicleNumber: string;
}

export const ParkingPassService = {
  generatePassHTML(details: PassDetails): string {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .pass { max-width: 600px; margin: 0 auto; border: 2px solid #000; padding: 20px; }
            .header { text-align: center; font-size: 24px; margin-bottom: 20px; }
            .details { margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .booking-id { font-size: 20px; text-align: center; padding: 10px; background: #f0f0f0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="pass">
            <div class="header">Parking Pass</div>
            <div class="booking-id">${details.bookingId}</div>
            <div class="details">
              <div class="detail-row"><strong>Facility:</strong> ${details.facilityName}</div>
              <div class="detail-row"><strong>Spot Number:</strong> ${details.spotNumber}</div>
              <div class="detail-row"><strong>Date:</strong> ${details.date}</div>
              <div class="detail-row"><strong>Time:</strong> ${details.time}</div>
              <div class="detail-row"><strong>Vehicle Number:</strong> ${details.vehicleNumber}</div>
            </div>
            <div class="footer">
              Please show this pass at entry and exit
            </div>
          </div>
        </body>
      </html>
    `;
  },

  downloadPass(details: PassDetails): void {
    const html = this.generatePassHTML(details);
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `parking-pass-${details.bookingId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}; 
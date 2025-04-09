interface CalendarEvent {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
}

export const CalendarService = {
  addToCalendar(event: CalendarEvent): void {
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${this.formatDateForGoogle(
      event.startTime
    )}/${this.formatDateForGoogle(
      event.endTime
    )}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(event.location)}`;

    window.open(googleCalendarUrl, '_blank');
  },

  // Apple Calendar Integration (for iOS devices)
  async addToAppleCalendar(event: CalendarEvent) {
    const icsContent = this.generateICSFile(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'parking_reservation.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Helper function to format date for Google Calendar
  private formatDateForGoogle(dateString: string): string {
    const date = new Date(dateString);
    return date
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');
  },

  // Generate ICS file content for Apple Calendar
  private generateICSFile(event: CalendarEvent): string {
    return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${this.formatDateForGoogle(event.startTime)}
DTEND:${this.formatDateForGoogle(event.endTime)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
  }
}; 
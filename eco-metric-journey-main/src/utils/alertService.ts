// src/utils/alertService.ts
import { useToast } from "@/hooks/use-toast";

// Define thresholds for environmental readings
export const DEFAULT_THRESHOLDS = {
  TEMPERATURE: {
    HIGH: 27, // °C
    CRITICAL: 30 // °C
  },
  HUMIDITY: {
    HIGH: 65, // %
    CRITICAL: 80 // %
  },
  CO2: {
    HIGH: 800, // ppm
    CRITICAL: 1200 // ppm
  }
};

// Types for alert settings
export interface AlertSettings {
  enabled: boolean;
  alertMethod: 'email' | 'sms' | 'both';
  contactInfo: {
    email?: string;
    phone?: string;
    secondaryEmail?: string; // Added secondary email
    secondaryPhone?: string; // Added secondary phone
  };
  thresholds: {
    temperature: {
      high: number;
      critical: number;
    };
    humidity: {
      high: number;
      critical: number;
    };
    co2: {
      high: number;
      critical: number;
    };
  };
}

// Default alert settings
export const defaultAlertSettings: AlertSettings = {
  enabled: true,
  alertMethod: 'email',
  contactInfo: {
    email: '',
    phone: '',
    secondaryEmail: '', // Default empty
    secondaryPhone: '', // Default empty
  },
  thresholds: {
    temperature: {
      high: DEFAULT_THRESHOLDS.TEMPERATURE.HIGH,
      critical: DEFAULT_THRESHOLDS.TEMPERATURE.CRITICAL,
    },
    humidity: {
      high: DEFAULT_THRESHOLDS.HUMIDITY.HIGH,
      critical: DEFAULT_THRESHOLDS.HUMIDITY.CRITICAL,
    },
    co2: {
      high: DEFAULT_THRESHOLDS.CO2.HIGH,
      critical: DEFAULT_THRESHOLDS.CO2.CRITICAL,
    },
  },
};

// Load alert settings from localStorage
export const loadAlertSettings = (): AlertSettings => {
  const savedSettings = localStorage.getItem('alertSettings');
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings);
      // Ensure new fields exist in loaded settings
      return {
        ...defaultAlertSettings,
        ...parsedSettings,
        contactInfo: {
          ...defaultAlertSettings.contactInfo,
          ...parsedSettings.contactInfo,
          secondaryEmail: parsedSettings.contactInfo?.secondaryEmail ?? '',
          secondaryPhone: parsedSettings.contactInfo?.secondaryPhone ?? '',
        },
      };
    } catch (e) {
      console.error('Failed to parse alert settings:', e);
    }
  }
  return defaultAlertSettings;
};

// Save alert settings to localStorage
export const saveAlertSettings = (settings: AlertSettings): void => {
  localStorage.setItem('alertSettings', JSON.stringify(settings));
};

// Function to check readings against thresholds
export const checkThresholds = (
  readings: { temperature: number; humidity: number; co2: number },
  settings: AlertSettings
): { isAlert: boolean; alerts: Array<{ type: string; level: 'high' | 'critical'; value: number }> } => {
  const alerts = [];

  if (settings.enabled) {
    // Check temperature
    if (readings.temperature >= settings.thresholds.temperature.critical) {
      alerts.push({ type: 'temperature', level: 'critical', value: readings.temperature });
    } else if (readings.temperature >= settings.thresholds.temperature.high) {
      alerts.push({ type: 'temperature', level: 'high', value: readings.temperature });
    }

    // Check humidity
    if (readings.humidity >= settings.thresholds.humidity.critical) {
      alerts.push({ type: 'humidity', level: 'critical', value: readings.humidity });
    } else if (readings.humidity >= settings.thresholds.humidity.high) {
      alerts.push({ type: 'humidity', level: 'high', value: readings.humidity });
    }

    // Check CO2
    if (readings.co2 >= settings.thresholds.co2.critical) {
      alerts.push({ type: 'co2', level: 'critical', value: readings.co2 });
    } else if (readings.co2 >= settings.thresholds.co2.high) {
      alerts.push({ type: 'co2', level: 'high', value: readings.co2 });
    }
  }

  return { isAlert: alerts.length > 0, alerts };
};

// Mock function to send alerts with fallback to secondary contacts
export const sendAlert = async (
  alerts: Array<{ type: string; level: 'high' | 'critical'; value: number }>,
  settings: AlertSettings
): Promise<boolean> => {
  console.log('Sending alerts:', alerts);
  console.log('Alert method:', settings.alertMethod);
  console.log('Contact info:', settings.contactInfo);

  let emailSent = false;
  let smsSent = false;

  // Helper function to simulate sending an alert (with a chance of failure)
  const attemptSend = (method: 'email' | 'sms', contact: string, secondaryContact: string): boolean => {
    // Simulate a 30% chance of failure for primary contact
    const primarySuccess = Math.random() > 0.3;
    if (primarySuccess && contact) {
      console.log(`Successfully sent ${method} to ${contact}`);
      return true;
    } else if (contact) {
      console.log(`Failed to send ${method} to primary contact ${contact}, attempting secondary...`);
      // Try secondary contact if primary fails
      const secondarySuccess = Math.random() > 0.1; // 10% chance of failure for secondary
      if (secondarySuccess && secondaryContact) {
        console.log(`Successfully sent ${method} to secondary contact ${secondaryContact}`);
        return true;
      } else {
        console.log(`Failed to send ${method} to secondary contact ${secondaryContact}`);
        return false;
      }
    }
    return false;
  };

  // Send alerts based on the selected method
  if (settings.alertMethod === 'email' || settings.alertMethod === 'both') {
    emailSent = attemptSend('email', settings.contactInfo.email || '', settings.contactInfo.secondaryEmail || '');
  }

  if (settings.alertMethod === 'sms' || settings.alertMethod === 'both') {
    smsSent = attemptSend('sms', settings.contactInfo.phone || '', settings.contactInfo.secondaryPhone || '');
  }

  // Return true if at least one method succeeded
  const overallSuccess = emailSent || smsSent;
  if (!overallSuccess) {
    console.log('All alert methods failed.');
  }
  return overallSuccess;
};

// Hook to use alerts in components
export const useAlerts = () => {
  const { toast } = useToast();
  
  const notifyUser = async (
    readings: { temperature: number; humidity: number; co2: number }
  ) => {
    const settings = loadAlertSettings();
    const { isAlert, alerts } = checkThresholds(readings, settings);
    
    if (isAlert) {
      // Send alerts to backend/service
      const sent = await sendAlert(alerts, settings);
      
      // Show toast notification about the alert
      if (sent) {
        const alertTypes = alerts.map(a => a.type).join(', ');
        toast({
          title: "Alert Notification Sent",
          description: `An alert for elevated ${alertTypes} levels has been sent via ${settings.alertMethod}.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Alert Notification Failed",
          description: "Failed to send alert notification. Please check your contact information.",
          variant: "destructive",
        });
      }
    }
    
    return { isAlert, alerts };
  };
  
  return { notifyUser };
};
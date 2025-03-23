// src/components/AlertSettings.tsx
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { 
  AlertSettings as AlertSettingsType, 
  loadAlertSettings, 
  saveAlertSettings 
} from "@/utils/alertService";

export const AlertSettings = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<AlertSettingsType>({
    defaultValues: loadAlertSettings(),
  });
  
  useEffect(() => {
    // Load settings when component mounts
    const settings = loadAlertSettings();
    form.reset(settings);
  }, [form]);
  
  const onSubmit = (data: AlertSettingsType) => {
    saveAlertSettings(data);
    toast({
      title: "Settings Saved",
      description: "Your alert preferences have been updated.",
    });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 bg-primary/10 border-primary/30 hover:bg-primary/20"
        >
          <Bell className="h-4 w-4" />
          <span>Alert Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Alert Settings</SheetTitle>
          <SheetDescription>
            Configure when and how you want to receive alerts about environmental conditions.
          </SheetDescription>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Alerts</FormLabel>
                    <FormDescription>
                      Receive notifications when readings exceed thresholds
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="space-y-3">
              <FormLabel>Alert Method</FormLabel>
              <FormField
                control={form.control}
                name="alertMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-2"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="email" id="email" />
                          </FormControl>
                          <FormLabel htmlFor="email" className="font-normal cursor-pointer flex items-center gap-1">
                            <Mail className="h-4 w-4" /> Email
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="sms" id="sms" />
                          </FormControl>
                          <FormLabel htmlFor="sms" className="font-normal cursor-pointer flex items-center gap-1">
                            <Phone className="h-4 w-4" /> SMS
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="both" id="both" />
                          </FormControl>
                          <FormLabel htmlFor="both" className="font-normal cursor-pointer">
                            Both
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-3">
              <FormLabel>Contact Information</FormLabel>
              {(form.watch("alertMethod") === "email" || form.watch("alertMethod") === "both") && (
                <>
                  <FormField
                    control={form.control}
                    name="contactInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your.email@example.com" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactInfo.secondaryEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Email Address (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="backup.email@example.com" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              {(form.watch("alertMethod") === "sms" || form.watch("alertMethod") === "both") && (
                <>
                  <FormField
                    control={form.control}
                    name="contactInfo.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1 (555) 123-4567" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactInfo.secondaryPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1 (555) 987-6543" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            
            <div className="space-y-4">
              <FormLabel>Alert Thresholds</FormLabel>
              
              <div className="space-y-3 rounded-lg border p-3">
                <FormLabel>Temperature (°C)</FormLabel>
                <FormField
                  control={form.control}
                  name="thresholds.temperature.high"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>High Alert</FormLabel>
                        <span className="text-sm text-muted-foreground">{field.value}°C</span>
                      </div>
                      <FormControl>
                        <Input 
                          type="range" 
                          min="20" 
                          max="40" 
                          step="0.5"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="accent-temperature"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="thresholds.temperature.critical"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Critical Alert</FormLabel>
                        <span className="text-sm text-muted-foreground">{field.value}°C</span>
                      </div>
                      <FormControl>
                        <Input 
                          type="range" 
                          min="22" 
                          max="45" 
                          step="0.5"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="accent-red-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-3 rounded-lg border p-3">
                <FormLabel>Humidity (%)</FormLabel>
                <FormField
                  control={form.control}
                  name="thresholds.humidity.high"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>High Alert</FormLabel>
                        <span className="text-sm text-muted-foreground">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Input 
                          type="range" 
                          min="40" 
                          max="90" 
                          step="1"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="accent-humidity"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="thresholds.humidity.critical"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Critical Alert</FormLabel>
                        <span className="text-sm text-muted-foreground">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Input 
                          type="range" 
                          min="50" 
                          max="95" 
                          step="1"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="accent-red-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-3 rounded-lg border p-3">
                <FormLabel>CO₂ Level (ppm)</FormLabel>
                <FormField
                  control={form.control}
                  name="thresholds.co2.high"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>High Alert</FormLabel>
                        <span className="text-sm text-muted-foreground">{field.value} ppm</span>
                      </div>
                      <FormControl>
                        <Input 
                          type="range" 
                          min="400" 
                          max="2000" 
                          step="50"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="accent-co2"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="thresholds.co2.critical"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Critical Alert</FormLabel>
                        <span className="text-sm text-muted-foreground">{field.value} ppm</span>
                      </div>
                      <FormControl>
                        <Input 
                          type="range" 
                          min="600" 
                          max="5000" 
                          step="50"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="accent-red-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Settings</Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
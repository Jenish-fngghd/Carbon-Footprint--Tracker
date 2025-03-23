
import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
        duration: 5000
      });
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "info@carbonfootprinttracker.com",
      description: "For general inquiries and support"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 5pm EST"
    },
    {
      icon: MapPin,
      title: "Office",
      details: "123 Eco Street, Green City, EC 12345",
      description: "Come visit our sustainable office"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Get in Touch</span>
              <span className="block text-primary">We'd Love to Hear From You</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Have questions about our Carbon Footprint Tracker? Reach out to our team and we'll be happy to help.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {contactInfo.map((item, index) => (
              <Card key={index} className="p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="font-medium text-gray-900 dark:text-white mb-1">{item.details}</p>
                  <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Send Us a Message</h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <Card className="p-8 shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Message
                    </label>
                    <div className="mt-1">
                      <textarea
                        name="message"
                        id="message"
                        rows={6}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"} 
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Visit Our Office</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Our eco-friendly headquarters is located in the heart of Green City.
            </p>
          </div>
          
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <MapPin className="h-16 w-16 mb-4" />
              <p className="text-xl">Map placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

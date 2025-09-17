import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Leaf, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Send,
  Heart,
  ExternalLink,
  FileText,
  Shield,
  HelpCircle,
  BookOpen,
  Users,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface FooterProps {
  onNavigate?: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    message: '',
    type: 'feedback'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFeedbackForm({ name: '', email: '', message: '', type: 'feedback' });
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLinks = [
    { label: 'Dashboard', action: 'dashboard', icon: <Leaf className="h-4 w-4" /> },
    { label: 'Crop Detection', action: 'crop-detection', icon: <Leaf className="h-4 w-4" /> },
    { label: 'Pest Detection', action: 'pest-detection', icon: <Leaf className="h-4 w-4" /> },
    { label: 'Soil Detection', action: 'soil-detection', icon: <Leaf className="h-4 w-4" /> },
    { label: 'Government Schemes', action: 'government-schemes', icon: <FileText className="h-4 w-4" /> },
    { label: 'AI Assistant', action: 'chatbot', icon: <MessageSquare className="h-4 w-4" /> }
  ];

  const resources = [
    { label: 'Help Center', href: '#help', icon: <HelpCircle className="h-4 w-4" /> },
    { label: 'API Documentation', href: '#api-docs', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Setup Guide', href: '#setup', icon: <FileText className="h-4 w-4" /> },
    { label: 'Video Tutorials', href: '#tutorials', icon: <Youtube className="h-4 w-4" /> },
    { label: 'Community Forum', href: '#forum', icon: <Users className="h-4 w-4" /> },
    { label: 'Developer Resources', href: '#dev', icon: <BookOpen className="h-4 w-4" /> }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
    { label: 'Data Protection', href: '#data-protection' },
    { label: 'Accessibility', href: '#accessibility' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, href: '#facebook', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, href: '#twitter', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" />, href: '#linkedin', color: 'hover:text-blue-700' },
    { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, href: '#instagram', color: 'hover:text-pink-600' },
    { name: 'YouTube', icon: <Youtube className="h-5 w-5" />, href: '#youtube', color: 'hover:text-red-600' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-xl font-bold text-white">AgroWatch</span>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering farmers with AI-powered precision agriculture solutions. 
              From crop health detection to government scheme access, we're revolutionizing farming in India.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-500" />
                <a href="mailto:support@agrowatch.in" className="hover:text-white transition-colors">
                  support@agrowatch.in
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-500" />
                <a href="tel:+911800123456" className="hover:text-white transition-colors">
                  +91 1800-123-456
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                <address className="not-italic text-sm">
                  Agricultural Technology Hub<br />
                  IIIT Hyderabad, Gachibowli<br />
                  Hyderabad, Telangana 500032
                </address>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-sm">Mon-Fri: 9:00 AM - 6:00 PM IST</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => onNavigate?.(link.action)}
                    className="flex items-center space-x-2 text-sm hover:text-white transition-colors group"
                  >
                    <span className="text-green-500 group-hover:text-green-400 transition-colors">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.href}
                    className="flex items-center space-x-2 text-sm hover:text-white transition-colors group"
                  >
                    <span className="text-green-500 group-hover:text-green-400 transition-colors">
                      {resource.icon}
                    </span>
                    <span>{resource.label}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Feedback Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Send Feedback</h3>
            {submitSuccess ? (
              <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-300">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">Thank you for your feedback!</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <Input
                  placeholder="Your Name"
                  value={feedbackForm.name}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={feedbackForm.email}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
                <Textarea
                  placeholder="Your message or feedback..."
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[80px]"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest updates on new features, government schemes, and farming tips.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`text-gray-400 ${social.color} transition-colors`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-6">
              {legalLinks.slice(0, 3).map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>© 2024 AgroWatch. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-3 w-3 text-red-500" />
                <span>for Indian Farmers</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Secure & Trusted</span>
              </span>
              <span>•</span>
              <span>Version 1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Links Modal Trigger (Hidden for now) */}
      <div className="hidden">
        {legalLinks.map((link, index) => (
          <a key={index} href={link.href} className="text-xs text-gray-500">
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
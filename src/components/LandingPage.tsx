import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  Smartphone, 
  Brain, 
  Users, 
  TrendingUp, 
  Shield,
  Play,
  ChevronRight,
  Star,
  Quote,
  Award,
  Globe,
  Zap,
  Heart,
  CheckCircle,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  Mail
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useTranslation } from '@/lib/translations';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(language);
  
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Detection",
      description: "Advanced MATLAB models for crop health, pest identification, and soil analysis with 95%+ accuracy",
      color: "text-blue-600"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile-First Design",
      description: "Works perfectly on smartphones with offline capabilities for farmers in remote areas",
      color: "text-green-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Government Integration",
      description: "Direct access to 8+ government schemes with eligibility checking and application assistance",
      color: "text-orange-600"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Multi-Language Support",
      description: "Available in 7 Indian languages including Hindi, Tamil, Telugu, Bengali, Marathi, and Gujarati",
      color: "text-purple-600"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-Time Assistance",
      description: "24/7 AI chatbot providing instant farming advice, weather updates, and market information",
      color: "text-yellow-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Trusted",
      description: "Bank-grade security with Aadhaar verification and compliance with government data policies",
      color: "text-red-600"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Farmers Helped", icon: <Users className="h-5 w-5" /> },
    { number: "95%", label: "Detection Accuracy", icon: <TrendingUp className="h-5 w-5" /> },
    { number: "7", label: "Languages Supported", icon: <Globe className="h-5 w-5" /> },
    { number: "8+", label: "Government Schemes", icon: <Award className="h-5 w-5" /> }
  ];

  const testimonials = [
    {
      name: "राजेश कुमार",
      location: "उत्तर प्रदेश",
      role: "Wheat Farmer",
      content: "AgroWatch helped me identify wheat rust disease early and saved my entire crop. The government scheme information helped me get subsidies I didn't know existed.",
      rating: 5,
      image: "👨‍🌾"
    },
    {
      name: "प्रिया शर्मा",
      location: "महाराष्ट्र",
      role: "Cotton Farmer",
      content: "The pest detection feature is amazing! It identified bollworm in my cotton field and suggested organic treatment. My yield increased by 30% this season.",
      rating: 5,
      image: "👩‍🌾"
    },
    {
      name: "मुरुगन्",
      location: "तमिलनाडु",
      role: "Rice Farmer",
      content: "AI chatbot gives me weather updates and farming tips in Tamil. The soil analysis helped me improve my paddy field's productivity significantly.",
      rating: 5,
      image: "👨‍🌾"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Arvind Sharma",
      role: "Lead AI Researcher",
      expertise: "Computer Vision & Machine Learning",
      education: "PhD in Agricultural AI, IIT Delhi",
      image: "👨‍💼",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Priya Patel",
      role: "Full-Stack Developer",
      expertise: "React, Node.js, Firebase",
      education: "B.Tech CSE, IIIT Hyderabad",
      image: "👩‍💻",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Dr. Rajesh Kumar",
      role: "Agricultural Expert",
      expertise: "Crop Science & Pest Management",
      education: "PhD in Agriculture, IARI New Delhi",
      image: "👨‍🔬",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Anita Singh",
      role: "UX/UI Designer",
      expertise: "Mobile-First Design & Accessibility",
      education: "M.Des, NID Ahmedabad",
      image: "👩‍🎨",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    }
  ];

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    // In a real implementation, this would trigger video playback
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
                  <Leaf className="h-4 w-4 mr-2" />
                  AI-Powered Precision Agriculture
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Empowering
                  <span className="text-green-600"> Indian Farmers</span>
                  <br />with Smart Technology
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  From crop health detection to government scheme access, AgroWatch provides 
                  comprehensive AI-powered solutions for modern farming in India.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onGetStarted}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleVideoPlay}
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg rounded-lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center text-green-600 mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Video/Image */}
            <div className="relative">
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                {!isVideoPlaying ? (
                  <div className="relative aspect-video bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors" onClick={handleVideoPlay}>
                        <Play className="h-8 w-8 ml-1" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">See AgroWatch in Action</h3>
                      <p className="text-white/80">Watch how farmers are transforming their agriculture with AI</p>
                    </div>
                    
                    {/* Farmer Image Overlay */}
                    <div className="absolute bottom-4 left-4 flex items-center space-x-3 bg-black/50 rounded-lg px-4 py-2">
                      <div className="text-2xl">👨‍🌾</div>
                      <div className="text-white">
                        <div className="font-medium">राजेश कुमार</div>
                        <div className="text-sm text-white/80">Farmer from UP</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p>Loading video...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-green-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">Live Detection</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">AI Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Complete Farming Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything a modern farmer needs in one intelligent platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className={`${feature.color} mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by Farmers Across India
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Real stories from farmers who transformed their agriculture with AgroWatch
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-8">
                <div className="text-center">
                  <Quote className="h-12 w-12 text-white/60 mx-auto mb-6" />
                  <blockquote className="text-xl leading-relaxed mb-6">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-3xl">{testimonials[currentTestimonial].image}</div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
                      <div className="text-white/80">{testimonials[currentTestimonial].role}</div>
                      <div className="text-white/60 text-sm">{testimonials[currentTestimonial].location}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate technologists and agricultural experts working together to revolutionize farming
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600 mb-2">{member.expertise}</p>
                  <p className="text-xs text-gray-500 mb-4">{member.education}</p>
                  
                  <div className="flex justify-center space-x-3">
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                      <Twitter className="h-4 w-4" />
                    </a>
                    <a href={member.social.github} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Github className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of farmers already using AgroWatch to increase their productivity and income.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={onGetStarted}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-lg"
              >
                Start Free Today
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg rounded-lg"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Us
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
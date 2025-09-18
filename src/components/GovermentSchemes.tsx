import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Users, 
  Calendar, 
  IndianRupee,
  Wheat,
  Leaf,
  Tractor,
  Droplets,
  Shield,
  TrendingUp,
  Award,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface Scheme {
  id: string;
  name: string;
  description: string;
  category: string;
  eligibility: string;
  benefits: string;
  applicationProcess: string;
  documents: string[];
  deadline?: string;
  amount?: string;
  website: string;
  helpline: string;
  states: string[];
  crops: string[];
  featured: boolean;
}

interface GovernmentSchemesProps {
  onViewChange?: (view: string) => void;
}

const GovernmentSchemes: React.FC<GovernmentSchemesProps> = ({ onViewChange }) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);

  // Government schemes data
  const schemes: Scheme[] = [
    {
      id: 'pm-kisan',
      name: 'PM-KISAN Samman Nidhi',
      description: 'Direct income support of ₹6,000 per year to all farmer families across the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities as well as domestic needs.',
      category: 'income-support',
      eligibility: 'All landholding farmer families. Exclusions include institutional landholders, farmer families holding constitutional posts, income tax payers, and government employees.',
      benefits: '₹6,000 per year in three equal installments of ₹2,000 each directly transferred to bank accounts',
      applicationProcess: 'Apply online through PM-KISAN portal with Aadhaar card, bank account details, and land ownership documents. Verification done by local revenue officials.',
      documents: ['Aadhaar Card', 'Bank Account Details', 'Land Ownership Documents', 'Mobile Number'],
      amount: '₹6,000/year',
      website: 'https://pmkisan.gov.in',
      helpline: '155261',
      states: ['all'],
      crops: ['all'],
      featured: true
    },
    {
      id: 'fasal-bima',
      name: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss/damage arising out of unforeseen events like natural calamities, pests & diseases.',
      category: 'insurance',
      eligibility: 'All farmers growing notified crops in notified areas during the season who have insurable interest in the crop. Both loanee and non-loanee farmers are eligible.',
      benefits: 'Comprehensive risk cover against yield losses due to non-preventable natural risks',
      applicationProcess: 'Apply through banks, insurance companies, or online portal within the cutoff date. Premium rates: 2% for Kharif, 1.5% for Rabi crops.',
      documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records', 'Sowing Certificate'],
      website: 'https://pmfby.gov.in',
      helpline: '14447',
      states: ['all'],
      crops: ['rice', 'wheat', 'cotton', 'sugarcane'],
      featured: true
    },
    {
      id: 'soil-health-card',
      name: 'Soil Health Card Scheme',
      description: 'Provides soil health cards to farmers which carry crop-wise recommendations of nutrients and fertilizers required for the individual farms to help farmers improve productivity through judicious use of inputs.',
      category: 'soil-testing',
      eligibility: 'All farmers across the country are eligible. Priority given to small and marginal farmers.',
      benefits: 'Free soil testing and customized fertilizer recommendations for optimal crop yield',
      applicationProcess: 'Contact local agriculture extension officer or soil testing laboratory. Soil samples collected from farms and tested for 12 parameters including NPK, pH, organic carbon.',
      documents: ['Aadhaar Card', 'Land Records', 'Contact Details'],
      website: 'https://soilhealth.dac.gov.in',
      helpline: '18001801551',
      states: ['all'],
      crops: ['all'],
      featured: false
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: <FileText className="h-4 w-4" /> },
    { value: 'income-support', label: 'Income Support', icon: <IndianRupee className="h-4 w-4" /> },
    { value: 'insurance', label: 'Crop Insurance', icon: <Shield className="h-4 w-4" /> },
    { value: 'credit', label: 'Agricultural Credit', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'price-support', label: 'Price Support', icon: <Award className="h-4 w-4" /> },
    { value: 'marketing', label: 'Marketing Support', icon: <Users className="h-4 w-4" /> },
    { value: 'organic', label: 'Organic Farming', icon: <Leaf className="h-4 w-4" /> },
    { value: 'equipment', label: 'Farm Equipment', icon: <Tractor className="h-4 w-4" /> },
    { value: 'irrigation', label: 'Irrigation Support', icon: <Droplets className="h-4 w-4" /> },
    { value: 'development', label: 'Agricultural Development', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'soil-testing', label: 'Soil Testing', icon: <Wheat className="h-4 w-4" /> }
  ];

  const states = [
    { value: 'all', label: 'All States' },
    { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { value: 'west-bengal', label: 'West Bengal' }
  ];

  const crops = [
    { value: 'all', label: 'All Crops' },
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'sugarcane', label: 'Sugarcane' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'oilseeds', label: 'Oilseeds' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'spices', label: 'Spices' }
  ];

  // Filter schemes based on search and filters
  useEffect(() => {
    let filtered = schemes.filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
      
      const matchesState = selectedState === 'all' || 
                          scheme.states.includes('all') || 
                          scheme.states.includes(selectedState);
      
      const matchesCrop = selectedCrop === 'all' || 
                         scheme.crops.includes('all') || 
                         scheme.crops.includes(selectedCrop);

      return matchesSearch && matchesCategory && matchesState && matchesCrop;
    });

    // Sort featured schemes first
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    setFilteredSchemes(filtered);
  }, [searchTerm, selectedCategory, selectedState, selectedCrop]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedState('all');
    setSelectedCrop('all');
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData?.icon || <FileText className="h-4 w-4" />;
  };

  const getCategoryLabel = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData?.label || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-800 px-4 py-2">
            <Award className="h-4 w-4 mr-2" />
            Government of India Initiatives
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Government Schemes for Farmers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive database of Indian government schemes to support farmers with financial assistance, 
            insurance, and agricultural development programs.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Search className="h-5 w-5 mr-2 text-green-600" />
              Search & Filter Schemes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search schemes by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center">
                          {category.icon}
                          <span className="ml-2">{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select State
                </label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Crop
                </label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop) => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results and Clear Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-lg font-medium text-gray-700">
                Found {filteredSchemes.length} schemes
              </div>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schemes Grid */}
        {filteredSchemes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchemes.map((scheme) => (
              <Card key={scheme.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(scheme.category)}
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryLabel(scheme.category)}
                      </Badge>
                    </div>
                    {scheme.featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {scheme.name}
                  </CardTitle>
                  {scheme.amount && (
                    <div className="flex items-center text-green-600 font-semibold">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {scheme.amount}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {scheme.description}
                  </CardDescription>

                  {/* Key Information */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-green-600" />
                        Eligibility
                      </h4>
                      <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-600" />
                        How to Apply
                      </h4>
                      <p className="text-sm text-gray-600">{scheme.applicationProcess}</p>
                    </div>

                    {/* Required Documents */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Required Documents</h4>
                      <div className="flex flex-wrap gap-1">
                        {scheme.documents.slice(0, 3).map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                        {scheme.documents.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{scheme.documents.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.open(scheme.website, '_blank')}
                    >
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(`tel:${scheme.helpline}`, '_self')}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call Help
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => alert('Find nearest center feature coming soon!')}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Find Center
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No schemes found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or clear filters to see all available schemes.
              </p>
              <Button onClick={clearFilters} className="bg-green-600 hover:bg-green-700 text-white">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-12 shadow-lg border-0 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="text-center py-12">
            <HelpCircle className="h-16 w-16 mx-auto mb-6 text-white" />
            <h3 className="text-2xl font-bold mb-4">Need Help with Applications?</h3>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Our support team is here to help you navigate government schemes and complete your applications successfully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => window.open('tel:18001801551', '_self')}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Helpline: 1800-180-1551
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => alert('Find nearest center feature coming soon!')}
              >
                <MapPin className="h-5 w-5 mr-2" />
                Find Nearest Center
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GovernmentSchemes;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Clock,
  Star,
  Heart,
  Eye,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Zap,
  Target,
  Globe,
  Building,
  Scale,
  Lightbulb,
  Sprout,
  Sun,
  CloudRain,
  Wind,
  TreePine,
  Carrot,
  Apple,
  Grape,
  Cherry,
  Coffee,
  Fish,
  Milk,
  Egg,
  Beef,
  PiggyBank,
  CreditCard,
  Banknote,
  Calculator,
  ClipboardList,
  FileCheck,
  AlertTriangle,
  CheckSquare,
  XCircle,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  RefreshCw,
  Settings,
  BarChart3,
  PieChart,
  TrendingDown,
  Activity,
  Zap as Lightning,
  Grid,
  List
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
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'upcoming' | 'closed';
  lastUpdated: string;
  ministry: string;
  targetAudience: string[];
  successRate?: number;
  applicationFee?: string;
  processingTime?: string;
  renewalRequired?: boolean;
  renewalPeriod?: string;
  additionalInfo?: string;
  relatedSchemes?: string[];
  tags: string[];
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'priority' | 'successRate' | 'amount'>('priority');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Government schemes data
  const schemes: Scheme[] = [
    // Income Support Schemes
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
      featured: true,
      priority: 'high',
      status: 'active',
      lastUpdated: '2024-01-15',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      targetAudience: ['Small Farmers', 'Marginal Farmers', 'All Landholding Farmers'],
      successRate: 95,
      processingTime: '15-30 days',
      tags: ['Direct Benefit Transfer', 'Income Support', 'Financial Assistance']
    },
    {
      id: 'kisan-credit-card',
      name: 'Kisan Credit Card (KCC)',
      description: 'Provides adequate and timely credit support from the banking system under a single window with flexible and simplified procedure to the farmers for their cultivation and other needs.',
      category: 'credit',
      eligibility: 'All farmers including individual/ joint borrowers who are owner cultivators, tenant farmers, oral lessees, sharecroppers, etc.',
      benefits: 'Credit limit up to ₹3 lakhs at 4% interest rate, insurance coverage, and flexible repayment options',
      applicationProcess: 'Apply at any bank branch with land documents, Aadhaar card, and bank account details. Processing within 15 days.',
      documents: ['Aadhaar Card', 'Land Records', 'Bank Account Details', 'Passport Size Photo'],
      amount: 'Up to ₹3,00,000',
      website: 'https://www.nabard.org',
      helpline: '1800221818',
      states: ['all'],
      crops: ['all'],
      featured: true,
      priority: 'high',
      status: 'active',
      lastUpdated: '2024-01-10',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      targetAudience: ['All Farmers', 'Agricultural Laborers', 'Rural Artisans'],
      successRate: 88,
      applicationFee: '₹100',
      processingTime: '7-15 days',
      renewalRequired: true,
      renewalPeriod: '5 years',
      tags: ['Credit Facility', 'Low Interest', 'Insurance Coverage']
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
      featured: true,
      priority: 'high',
      status: 'active',
      lastUpdated: '2024-01-20',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      targetAudience: ['All Farmers', 'Crop Growers'],
      successRate: 92,
      processingTime: '30-45 days',
      tags: ['Crop Insurance', 'Risk Coverage', 'Natural Calamities']
    },
    {
      id: 'msp-procurement',
      name: 'Minimum Support Price (MSP) Procurement',
      description: 'Government guarantees minimum support prices for various crops to ensure farmers get remunerative prices for their produce.',
      category: 'price-support',
      eligibility: 'All farmers growing MSP notified crops. Must have valid land records and bank account.',
      benefits: 'Assured minimum price for crops, protection against price fluctuations',
      applicationProcess: 'Sell produce at designated procurement centers. Payment through DBT within 3 days.',
      documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records', 'Crop Certificate'],
      amount: 'As per MSP rates',
      website: 'https://www.fci.gov.in',
      helpline: '1800110001',
      states: ['all'],
      crops: ['rice', 'wheat', 'cotton', 'sugarcane', 'pulses', 'oilseeds'],
      featured: true,
      priority: 'high',
      status: 'active',
      lastUpdated: '2024-01-25',
      ministry: 'Ministry of Consumer Affairs, Food & Public Distribution',
      targetAudience: ['All Farmers', 'Crop Producers'],
      successRate: 90,
      processingTime: '1-3 days',
      tags: ['Price Support', 'MSP', 'Procurement', 'Price Stability']
    },
    {
      id: 'e-nam',
      name: 'National Agriculture Market (e-NAM)',
      description: 'Online trading platform for agricultural commodities to provide better price discovery and transparent trading.',
      category: 'marketing',
      eligibility: 'All farmers, traders, and commission agents registered on the platform.',
      benefits: 'Better price discovery, reduced transaction costs, transparent trading, wider market access',
      applicationProcess: 'Register on e-NAM portal with Aadhaar card and bank details. Complete KYC process.',
      documents: ['Aadhaar Card', 'Bank Account Details', 'PAN Card', 'Mobile Number'],
      website: 'https://www.enam.gov.in',
      helpline: '18004253838',
      states: ['all'],
      crops: ['all'],
      featured: true,
      priority: 'high',
      status: 'active',
      lastUpdated: '2024-01-18',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      targetAudience: ['All Farmers', 'Traders', 'Commission Agents'],
      successRate: 78,
      processingTime: '1-2 days',
      tags: ['Online Trading', 'Price Discovery', 'Market Access', 'Transparency']
    },
    {
      id: 'paramparagat-krishi',
      name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
      description: 'Promotes organic farming through cluster approach and PGS certification to improve soil health and reduce input costs.',
      category: 'organic',
      eligibility: 'Farmers willing to adopt organic farming practices. Minimum 50 farmers per cluster.',
      benefits: 'Financial assistance of ₹50,000 per hectare for 3 years, training, certification support',
      applicationProcess: 'Form clusters of 50 farmers, submit proposal through state agriculture department.',
      documents: ['Cluster Proposal', 'Farmer List', 'Land Records', 'Bank Account Details'],
      amount: '₹50,000/hectare',
      website: 'https://pgsindia-ncof.gov.in',
      helpline: '1800110001',
      states: ['all'],
      crops: ['all'],
      featured: true,
      priority: 'high',
      status: 'active',
      lastUpdated: '2024-01-22',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      targetAudience: ['Organic Farmers', 'Farmer Groups', 'Cooperatives'],
      successRate: 75,
      processingTime: '30-45 days',
      tags: ['Organic Farming', 'Sustainable Agriculture', 'PGS Certification', 'Cluster Approach']
    },
    {
      id: 'sub-mission-agriculture-mechanization',
      name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
      description: 'Promotes agricultural mechanization by providing financial assistance for purchase of farm machinery and equipment.',
      category: 'equipment',
      eligibility: 'Individual farmers, farmer groups, cooperatives, custom hiring centers.',
      benefits: 'Financial assistance up to 50% of cost for farm machinery, custom hiring centers, skill development',
      applicationProcess: 'Apply through state agriculture department or online portal with project proposal.',
      documents: ['Project Proposal', 'Quotation', 'Land Records', 'Bank Account Details'],
      amount: 'Up to ₹10 lakhs',
      website: 'https://www.agricoop.nic.in',
      helpline: '1800110001',
      states: ['all'],
      crops: ['all'],
      featured: true,
      priority: 'high',
      status: 'active',
      lastUpdated: '2024-01-20',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      targetAudience: ['All Farmers', 'Farmer Groups', 'Cooperatives', 'Custom Hiring Centers'],
      successRate: 85,
      processingTime: '30-45 days',
      tags: ['Farm Mechanization', 'Equipment Purchase', 'Custom Hiring', 'Skill Development']
    },
    {
      id: 'pm-ksy',
      name: 'Pradhan Mantri Krishi Sinchai Yojana (PMKSY)',
      description: 'Ensures water security through water conservation, water harvesting, and efficient water use in agriculture.',
      category: 'irrigation',
      eligibility: 'Farmers, farmer groups, water user associations, state governments.',
      benefits: 'Financial assistance for irrigation projects, water conservation, micro-irrigation systems',
      applicationProcess: 'Submit proposal through state agriculture department or irrigation department.',
      documents: ['Project Proposal', 'Land Records', 'Water Source Details', 'Bank Account Details'],
      amount: 'Up to ₹5 crores',
      website: 'https://pmksy.gov.in',
      helpline: '1800110001',
      states: ['all'],
      crops: ['all'],
      featured: true,
      priority: 'high',
      status: 'active',
      lastUpdated: '2024-01-24',
      ministry: 'Ministry of Water Resources, River Development & Ganga Rejuvenation',
      targetAudience: ['All Farmers', 'Farmer Groups', 'Water User Associations'],
      successRate: 82,
      processingTime: '60-90 days',
      tags: ['Irrigation', 'Water Conservation', 'Micro-irrigation', 'Water Security']
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
      featured: true,
      priority: 'high',
      status: 'active',
      lastUpdated: '2024-01-19',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      targetAudience: ['All Farmers', 'Small Farmers', 'Marginal Farmers'],
      successRate: 90,
      processingTime: '15-30 days',
      tags: ['Soil Testing', 'Fertilizer Recommendation', 'Soil Health', 'Nutrient Management']
    },
    {
      id: 'rashtriya-krishi-vikas-yojana',
      name: 'Rashtriya Krishi Vikas Yojana (RKVY)',
      description: 'Flexible funding scheme for states to plan and implement agriculture and allied sector schemes based on local needs and priorities.',
      category: 'development',
      eligibility: 'State governments, agricultural universities, research institutions, farmer groups.',
      benefits: 'Flexible funding for agriculture development projects, research, extension, and infrastructure',
      applicationProcess: 'Submit state agriculture plan through state agriculture department for approval.',
      documents: ['State Agriculture Plan', 'Project Proposals', 'Financial Details', 'Implementation Plan'],
      amount: 'Based on state allocation',
      website: 'https://www.agricoop.nic.in',
      helpline: '1800110001',
      states: ['all'],
      crops: ['all'],
      featured: true,
      priority: 'high',
      status: 'active',
      lastUpdated: '2024-01-21',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      targetAudience: ['State Governments', 'Agricultural Universities', 'Research Institutions'],
      successRate: 85,
      processingTime: '60-90 days',
      tags: ['Flexible Funding', 'State Planning', 'Agriculture Development', 'Research Support']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: <FileText className="h-4 w-4" />, count: schemes.length },
    { value: 'income-support', label: 'Income Support', icon: <IndianRupee className="h-4 w-4" />, count: schemes.filter(s => s.category === 'income-support').length },
    { value: 'insurance', label: 'Crop Insurance', icon: <Shield className="h-4 w-4" />, count: schemes.filter(s => s.category === 'insurance').length },
    { value: 'credit', label: 'Agricultural Credit', icon: <CreditCard className="h-4 w-4" />, count: schemes.filter(s => s.category === 'credit').length },
    { value: 'price-support', label: 'Price Support', icon: <Award className="h-4 w-4" />, count: schemes.filter(s => s.category === 'price-support').length },
    { value: 'marketing', label: 'Marketing Support', icon: <Globe className="h-4 w-4" />, count: schemes.filter(s => s.category === 'marketing').length },
    { value: 'organic', label: 'Organic Farming', icon: <Leaf className="h-4 w-4" />, count: schemes.filter(s => s.category === 'organic').length },
    { value: 'equipment', label: 'Farm Equipment', icon: <Tractor className="h-4 w-4" />, count: schemes.filter(s => s.category === 'equipment').length },
    { value: 'irrigation', label: 'Irrigation Support', icon: <Droplets className="h-4 w-4" />, count: schemes.filter(s => s.category === 'irrigation').length },
    { value: 'development', label: 'Agricultural Development', icon: <Building className="h-4 w-4" />, count: schemes.filter(s => s.category === 'development').length },
    { value: 'soil-testing', label: 'Soil Testing', icon: <Wheat className="h-4 w-4" />, count: schemes.filter(s => s.category === 'soil-testing').length }
  ];

  const states = [
    { value: 'all', label: 'All States' },
    { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
    { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
    { value: 'assam', label: 'Assam' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'chhattisgarh', label: 'Chhattisgarh' },
    { value: 'goa', label: 'Goa' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
    { value: 'jharkhand', label: 'Jharkhand' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'manipur', label: 'Manipur' },
    { value: 'meghalaya', label: 'Meghalaya' },
    { value: 'mizoram', label: 'Mizoram' },
    { value: 'nagaland', label: 'Nagaland' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'sikkim', label: 'Sikkim' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'tripura', label: 'Tripura' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { value: 'uttarakhand', label: 'Uttarakhand' },
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
    { value: 'spices', label: 'Spices' },
    { value: 'maize', label: 'Maize' },
    { value: 'barley', label: 'Barley' },
    { value: 'jowar', label: 'Jowar' },
    { value: 'bajra', label: 'Bajra' },
    { value: 'ragi', label: 'Ragi' },
    { value: 'groundnut', label: 'Groundnut' },
    { value: 'soybean', label: 'Soybean' },
    { value: 'sunflower', label: 'Sunflower' },
    { value: 'mustard', label: 'Mustard' },
    { value: 'sesame', label: 'Sesame' },
    { value: 'fish', label: 'Fish' },
    { value: 'aquaculture', label: 'Aquaculture' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'poultry', label: 'Poultry' },
    { value: 'livestock', label: 'Livestock' }
  ];

  // Filter schemes based on search and filters
  useEffect(() => {
    let filtered = schemes.filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scheme.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
      
      const matchesState = selectedState === 'all' || 
                          scheme.states.includes('all') || 
                          scheme.states.includes(selectedState);
      
      const matchesCrop = selectedCrop === 'all' || 
                         scheme.crops.includes('all') || 
                         scheme.crops.includes(selectedCrop);

      const matchesFavorites = !showFavoritesOnly || favorites.includes(scheme.id);

      return matchesSearch && matchesCategory && matchesState && matchesCrop && matchesFavorites;
    });

    // Sort schemes based on selected criteria
    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      } else if (sortBy === 'successRate') {
        return (b.successRate || 0) - (a.successRate || 0);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'amount') {
        // Simple amount comparison (this could be enhanced)
        return a.amount?.localeCompare(b.amount || '') || 0;
      }
      return 0;
    });

    setFilteredSchemes(filtered);
  }, [searchTerm, selectedCategory, selectedState, selectedCrop, showFavoritesOnly, favorites, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedState('all');
    setSelectedCrop('all');
    setShowFavoritesOnly(false);
    setSortBy('priority');
  };

  const toggleFavorite = (schemeId: string) => {
    setFavorites(prev => 
      prev.includes(schemeId) 
        ? prev.filter(id => id !== schemeId)
        : [...prev, schemeId]
    );
  };

  const openSchemeDetail = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setIsDetailOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Government of India Initiatives
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              {schemes.length} Schemes Available
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Updated Daily
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Government Schemes for Farmers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            Comprehensive database of Indian government schemes to support farmers with financial assistance, 
            insurance, and agricultural development programs.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{schemes.filter(s => s.featured).length}</div>
              <div className="text-sm text-gray-600">Featured Schemes</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{schemes.filter(s => s.priority === 'high').length}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">{favorites.length}</div>
              <div className="text-sm text-gray-600">Your Favorites</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-orange-600">{schemes.filter(s => s.status === 'active').length}</div>
              <div className="text-sm text-gray-600">Active Schemes</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center text-xl">
                <Search className="h-5 w-5 mr-2 text-green-600" />
                Search & Filter Schemes
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className="flex items-center"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites ({favorites.length})
                </Button>
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search schemes by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            {category.icon}
                            <span className="ml-2">{category.label}</span>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {category.count}
                          </Badge>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="successRate">Success Rate</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results and Clear Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-lg font-medium text-gray-700">
                Found {filteredSchemes.length} schemes
                {showFavoritesOnly && ` (${favorites.length} favorites)`}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="flex items-center"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.print()}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schemes Grid */}
        {filteredSchemes.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
            {filteredSchemes.map((scheme) => (
              <Card key={scheme.id} className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white/90 backdrop-blur-sm ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
                <CardHeader className={viewMode === 'list' ? 'md:w-1/3' : ''}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(scheme.category)}
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryLabel(scheme.category)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {scheme.featured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(scheme.id)}
                        className="h-8 w-8 p-0"
                      >
                        {favorites.includes(scheme.id) ? (
                          <Heart className="h-4 w-4 text-red-500 fill-current" />
                        ) : (
                          <Heart className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {scheme.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {scheme.amount && (
                      <div className="flex items-center text-green-600 font-semibold">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {scheme.amount}
                      </div>
                    )}
                    <Badge className={`text-xs ${getPriorityColor(scheme.priority)}`}>
                      {scheme.priority.toUpperCase()} PRIORITY
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(scheme.status)}`}>
                      {scheme.status.toUpperCase()}
                    </Badge>
                    {scheme.successRate && (
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {scheme.successRate}% Success
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className={`space-y-4 ${viewMode === 'list' ? 'md:w-2/3' : ''}`}>
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
                      <p className="text-sm text-gray-600 line-clamp-2">{scheme.eligibility}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-600" />
                        How to Apply
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{scheme.applicationProcess}</p>
                    </div>

                    {/* Tags */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {scheme.tags.slice(0, 4).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {scheme.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{scheme.tags.length - 4} more
                          </Badge>
                        )}
                      </div>
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
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => window.open(scheme.website, '_blank')}
                      >
                        Apply Now
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openSchemeDetail(scheme)}
                        className="px-3"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    
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

        {/* Detailed Scheme Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedScheme && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedScheme.name}
                      </DialogTitle>
                      <div className="flex items-center gap-2 mb-4">
                        {getCategoryIcon(selectedScheme.category)}
                        <Badge variant="secondary">
                          {getCategoryLabel(selectedScheme.category)}
                        </Badge>
                        <Badge className={`${getPriorityColor(selectedScheme.priority)}`}>
                          {selectedScheme.priority.toUpperCase()} PRIORITY
                        </Badge>
                        <Badge className={`${getStatusColor(selectedScheme.status)}`}>
                          {selectedScheme.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(selectedScheme.id)}
                      className="h-8 w-8 p-0"
                    >
                      {favorites.includes(selectedScheme.id) ? (
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      ) : (
                        <Heart className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedScheme.description}</p>
                  </div>

                  {/* Key Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Information</h3>
                      <div className="space-y-3">
                        {selectedScheme.amount && (
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="font-medium text-gray-700">Amount</span>
                            <span className="text-green-600 font-semibold flex items-center">
                              <IndianRupee className="h-4 w-4 mr-1" />
                              {selectedScheme.amount}
                            </span>
                          </div>
                        )}
                        {selectedScheme.successRate && (
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="font-medium text-gray-700">Success Rate</span>
                            <span className="text-blue-600 font-semibold">{selectedScheme.successRate}%</span>
                          </div>
                        )}
                        {selectedScheme.processingTime && (
                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <span className="font-medium text-gray-700">Processing Time</span>
                            <span className="text-purple-600 font-semibold">{selectedScheme.processingTime}</span>
                          </div>
                        )}
                        {selectedScheme.applicationFee && (
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <span className="font-medium text-gray-700">Application Fee</span>
                            <span className="text-orange-600 font-semibold">{selectedScheme.applicationFee}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Globe className="h-4 w-4 mr-3 text-blue-600" />
                          <a href={selectedScheme.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Official Website
                          </a>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-4 w-4 mr-3 text-green-600" />
                          <a href={`tel:${selectedScheme.helpline}`} className="text-green-600 hover:underline">
                            {selectedScheme.helpline}
                          </a>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Building className="h-4 w-4 mr-3 text-purple-600" />
                          <span className="text-gray-700">{selectedScheme.ministry}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Eligibility Criteria</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedScheme.eligibility}</p>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedScheme.benefits}</p>
                  </div>

                  {/* Application Process */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Process</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedScheme.applicationProcess}</p>
                  </div>

                  {/* Required Documents */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedScheme.documents.map((doc, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <FileCheck className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-gray-700">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedScheme.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Audience</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedScheme.targetAudience.map((audience, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.open(selectedScheme.website, '_blank')}
                    >
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(`tel:${selectedScheme.helpline}`, '_self')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Help
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => alert('Share feature coming soon!')}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GovernmentSchemes;
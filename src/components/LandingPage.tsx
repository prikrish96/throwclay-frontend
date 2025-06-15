import { useState } from 'react';
import { ArrowRight, CheckCircle, Star, Users, BarChart3, Palette, MessageCircle, Calendar, Camera, Shield, Zap, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onPageChange: (page: string) => void;
}

export function LandingPage({ onGetStarted, onLogin, onPageChange }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'studio' | 'artist'>('studio');

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with Throw Clay',
      features: [
        '2 projects',
        '3 throws per project',
        'Basic pottery journal',
        'Community access'
      ],
      cta: 'Demo',
      popular: false
    },
    {
      name: 'Passion Projects',
      price: '$12',
      period: 'month',
      description: 'Ideal for individual pottery artists',
      features: [
        '15 projects',
        '6 throws per project',
        'Advanced pottery journal',
        'Photo uploads & editing',
        'Community access',
        'Project folders',
        'Export capabilities'
      ],
      cta: 'Choose Passion',
      popular: true
    },
    {
      name: 'Artist/Small Studio',
      price: '$39',
      period: 'month',
      description: 'Perfect for small studios and teaching artists',
      features: [
        '30 projects (themes)',
        '8 throws per project',
        'Up to 2 manager profiles',
        'Max 50 member profiles',
        'Class management',
        'Basic analytics',
        'Student progress tracking',
        'Commerce features'
      ],
      cta: 'Choose Artist',
      popular: false
    },
    {
      name: 'Studio Pro',
      price: 'Custom',
      period: 'contact sales',
      description: 'Enterprise solution for large studios',
      features: [
        'Unlimited projects',
        'Unlimited throws',
        'Unlimited member profiles',
        'Advanced analytics',
        'White label options',
        'API access',
        'Priority support',
        'Custom integrations'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const studioFeatures = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Class & Workshop Management',
      description: 'Schedule classes, manage enrollments, and track student progress with built-in communication tools.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Member Management',
      description: 'Handle memberships, track attendance, and build a thriving pottery community.'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Inventory & Kiln Tracking',
      description: 'Monitor glaze inventory, schedule firings, and track kiln usage with live camera integration.'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Community Engagement',
      description: 'Foster community with group chats, announcements, and event management tools.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Commerce Integration',
      description: 'Enable artists to sell their work with customizable commission rates and automated payments.'
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'Live Kiln Monitoring',
      description: 'Monitor your kilns 24/7 with Ring camera integration and automated firing alerts.'
    }
  ];

  const artistFeatures = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Digital Pottery Journal',
      description: 'Document every throw with photos, sketches, notes, and technique tracking.'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Professional Portfolio',
      description: 'Showcase your work with customizable artist profiles and integrated social media.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Marketplace Access',
      description: 'Sell your pottery through our integrated marketplace with location-based discovery.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Studio Connections',
      description: 'Find and connect with pottery studios in your area, join classes, and build relationships.'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Progress Tracking',
      description: 'Track your pottery journey with detailed analytics and milestone celebrations.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Project Organization',
      description: 'Organize your work into themed projects and folders for better creative management.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Studio Owner',
      studio: 'Mountain View Ceramics',
      content: 'Throw Clay transformed how we manage our studio. The kiln monitoring alone has saved us countless hours.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c35d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Independent Artist',
      content: 'As a solo artist, Throw Clay helps me stay organized and connected to the pottery community. The journal feature is incredible.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emma Thompson',
      role: 'Pottery Instructor',
      studio: 'Riverside Clay Co.',
      content: 'My students love being able to track their progress and share their work. The class management tools are intuitive.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Throw Clay</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm hover:text-primary">Features</a>
              <a href="#pricing" className="text-sm hover:text-primary">Pricing</a>
              <Button variant="ghost" onClick={() => onPageChange('studios')} className="text-sm">
                Find Studios
              </Button>
              <Button variant="ghost" onClick={() => onPageChange('ceramics')} className="text-sm">
                Ceramics Marketplace
              </Button>
              <Button variant="outline" onClick={onLogin}>Demo</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">The All-in-One Pottery Platform</Badge>
              <h1 className="text-4xl lg:text-6xl mb-6">
                Throw Clay is the only all-in-one platform for growing your pottery studio
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Manage bookings, memberships, inventory, sales, and community engagement from a single intuitive dashboard. 
                Focus on your craft while Throw Clay handles the rest.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={onGetStarted} className="flex items-center space-x-2">
                  <span>Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Always free to start • No credit card required • Upgrade anytime
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop"
                  alt="Pottery studio workspace"
                  className="rounded-2xl shadow-2xl w-full h-full object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Kiln firing complete</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Tabs */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4">Built for Every Potter</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you're managing a studio or growing as an individual artist
            </p>
            <div className="flex justify-center">
              <div className="bg-background rounded-lg p-1 flex">
                <Button
                  variant={activeTab === 'studio' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('studio')}
                  className="px-6"
                >
                  Studio Management
                </Button>
                <Button
                  variant={activeTab === 'artist' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('artist')}
                  className="px-6"
                >
                  Individual Artists
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeTab === 'studio' ? studioFeatures : artistFeatures).map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your pottery journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={onGetStarted}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl mb-4">Loved by Potters Worldwide</h2>
            <p className="text-xl text-muted-foreground">
              See what pottery studios and artists are saying about Throw Clay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <ImageWithFallback
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}{testimonial.studio && `, ${testimonial.studio}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-6">Ready to Transform Your Pottery Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of potters already using Throw Clay to manage their studios and track their artistic growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="flex items-center space-x-2">
              <span>Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Questions? <a href="mailto:hello.throwclay@gmail.com" className="text-primary hover:underline">Contact our team</a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Throw Clay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

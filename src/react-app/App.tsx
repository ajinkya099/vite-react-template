// src/react-app/App.tsx
import { useState } from "react";
import { 
  Shield, 
  FileText, 
  Users, 
  BarChart3, 
  CreditCard, 
  Settings,
  Lock,
  Eye,
  Download,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
  Building2,
  FolderOpen,
  Activity
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { DocumentUploader } from "../components/DocumentUploader";
import { SecureDocumentViewer } from "../components/SecureDocumentViewer";
import { NDAForm } from "../components/NDAForm";
import { cn } from "../lib/utils";

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vdrs' | 'documents' | 'analytics' | 'billing' | 'settings'>('dashboard');
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showNDAForm, setShowNDAForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'vdrs', label: 'Virtual Data Rooms', icon: FolderOpen },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { name: 'Total VDRs', value: '12', change: '+2 this month', icon: FolderOpen },
    { name: 'Active Users', value: '48', change: '+12% from last week', icon: Users },
    { name: 'Documents Shared', value: '234', change: '+45 today', icon: FileText },
    { name: 'Security Score', value: '98%', change: 'Excellent', icon: Shield },
  ];

  const recentActivity = [
    { action: 'NDA Signed', user: 'john@example.com', time: '2 minutes ago', type: 'success' },
    { action: 'Document Viewed', user: 'sarah@company.com', time: '15 minutes ago', type: 'info' },
    { action: 'Access Revoked', user: 'mike@external.com', time: '1 hour ago', type: 'warning' },
    { action: 'New VDR Created', user: 'admin@yourorg.com', time: '3 hours ago', type: 'info' },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: ['Up to 3 VDRs', '1GB Storage', 'Basic Watermarking', 'Email Support'],
      popular: false,
    },
    {
      name: 'Starter',
      price: '$49',
      period: '/month',
      features: ['Up to 10 VDRs', '10GB Storage', 'Advanced Watermarking', 'NDA Management', 'Priority Support'],
      popular: true,
    },
    {
      name: 'Professional',
      price: '$149',
      period: '/month',
      features: ['Unlimited VDRs', '100GB Storage', 'Dynamic Watermarking', 'Custom Branding', 'Analytics Dashboard', 'API Access'],
      popular: false,
    },
    {
      name: 'Enterprise',
      price: '$499',
      period: '/month',
      features: ['Everything in Professional', 'Unlimited Storage', 'SSO Integration', 'Dedicated Support', 'Custom Integrations', 'SLA'],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">VDR Platform</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("transition-all duration-300", sidebarOpen ? "ml-64" : "ml-0")}>
        {/* Top Bar */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Help</Button>
              <Button>Upgrade Plan</Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here's what's happening with your VDRs.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <Card key={stat.name}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">{stat.name}</CardTitle>
                      <stat.icon className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions across your Virtual Data Rooms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {activity.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {activity.type === 'info' && <Activity className="h-5 w-5 text-blue-500" />}
                          {activity.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.user}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('vdrs')}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <FolderOpen className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                      <h3 className="font-semibold mb-2">Create New VDR</h3>
                      <p className="text-sm text-gray-500">Set up a secure data room for your documents</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('documents')}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto text-green-600 mb-4" />
                      <h3 className="font-semibold mb-2">Upload Documents</h3>
                      <p className="text-sm text-gray-500">Add files to your existing data rooms</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('analytics')}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                      <h3 className="font-semibold mb-2">View Analytics</h3>
                      <p className="text-sm text-gray-500">Track document views and user activity</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Pricing Plans</h1>
                <p className="text-gray-500">Choose the perfect plan for your organization</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pricingPlans.map((plan) => (
                  <Card key={plan.name} className={cn(
                    "relative",
                    plan.popular && "border-blue-500 shadow-lg"
                  )}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle>{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-gray-500">{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full mt-6" variant={plan.popular ? 'default' : 'outline'}>
                        {plan.name === 'Free' ? 'Get Started' : 'Subscribe'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'vdrs' || activeTab === 'documents' || activeTab === 'analytics' || activeTab === 'settings') && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold capitalize">{activeTab.replace('-', ' ')}</h1>
                <p className="text-gray-500">Manage your {activeTab} here</p>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      This feature is under development. The full implementation includes database integration, 
                      real-time updates, and complete CRUD operations for production use.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Document Viewer Modal */}
      {showDocumentViewer && (
        <SecureDocumentViewer
          document={{
            id: 'demo-doc-1',
            vdrId: 'demo-vdr-1',
            name: 'Confidential Agreement.pdf',
            originalName: 'agreement.pdf',
            mimeType: 'application/pdf',
            size: 1024000,
            storageKey: 'demo-key',
            version: 1,
            isFolder: false,
            path: '/docs/agreement.pdf',
            uploadedBy: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            checksum: 'abc123',
            virusScanStatus: 'clean',
            processingStatus: 'completed',
          }}
          user={{
            id: 'user-1',
            email: 'viewer@example.com',
            name: 'Demo Viewer',
            role: 'viewer',
            organizationId: 'org-1',
            createdAt: new Date(),
          }}
          restrictions={{
            disableScreenshots: true,
            disableCopy: true,
            dynamicWatermark: true,
            viewOnly: false,
          }}
          onClose={() => setShowDocumentViewer(false)}
          onViewEvent={(eventType, metadata) => {
            console.log('Analytics event:', eventType, metadata);
          }}
        />
      )}

      {/* NDA Form Modal */}
      {showNDAForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <NDAForm
            template={{
              id: 'template-1',
              organizationId: 'org-1',
              name: 'Standard NDA',
              content: '<p>This Non-Disclosure Agreement protects confidential information...</p>',
              fields: [
                { id: 'name', label: 'Full Name', type: 'text', required: true },
                { id: 'email', label: 'Email Address', type: 'email', required: true },
                { id: 'company', label: 'Company', type: 'text', required: false },
                { id: 'signature', label: 'Signature', type: 'signature', required: true },
              ],
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            }}
            viewerEmail="viewer@example.com"
            viewerName="Demo Viewer"
            onSign={async (fields, signature) => {
              console.log('NDA signed:', fields, signature);
              setShowNDAForm(false);
            }}
            onDecline={() => setShowNDAForm(false)}
          />
        </div>
      )}
    </div>
  );
}

export default App;

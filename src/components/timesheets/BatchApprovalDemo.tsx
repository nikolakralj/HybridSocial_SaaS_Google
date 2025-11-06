import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BatchApprovalView } from './BatchApprovalView';
import { 
  Users, 
  Building2, 
  Briefcase,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  ArrowLeft,
  Menu
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

export function BatchApprovalDemo() {
  const [selectedRole, setSelectedRole] = useState<'company-owner' | 'agency-owner' | 'manager'>('company-owner');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <h2 className="font-semibold">Batch Approval Demo</h2>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Menu className="w-4 h-4" />
                Navigate
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Go to Demo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                const event = new CustomEvent('navigate', { detail: 'feed' });
                window.dispatchEvent(event);
              }}>
                Feed Home
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const event = new CustomEvent('navigate', { detail: 'timesheet-demo' });
                window.dispatchEvent(event);
              }}>
                Timesheet Demo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const event = new CustomEvent('navigate', { detail: 'multi-task-demo' });
                window.dispatchEvent(event);
              }}>
                Multi-Task Demo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const event = new CustomEvent('navigate', { detail: 'enhanced-modal-demo' });
                window.dispatchEvent(event);
              }}>
                Enhanced Modal Demo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                const event = new CustomEvent('navigate', { detail: 'landing' });
                window.dispatchEvent(event);
              }}>
                Back to Landing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold">Batch Approval System</h1>
              <p className="text-blue-100 mt-2">
                Approve multiple timesheets 10x faster with intelligent batch operations
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <Clock className="w-4 h-4" />
                Time Savings
              </div>
              <div className="text-3xl font-semibold">94%</div>
              <div className="text-sm text-white/70 mt-1">Faster approvals</div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <Users className="w-4 h-4" />
                Multi-Select
              </div>
              <div className="text-3xl font-semibold">∞</div>
              <div className="text-sm text-white/70 mt-1">No limit on selection</div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <CheckCircle className="w-4 h-4" />
                Smart Filters
              </div>
              <div className="text-3xl font-semibold">4</div>
              <div className="text-sm text-white/70 mt-1">Filter criteria</div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <TrendingUp className="w-4 h-4" />
                Real-time
              </div>
              <div className="text-3xl font-semibold">Live</div>
              <div className="text-sm text-white/70 mt-1">Instant updates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selector */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">View as:</span>
            <div className="flex gap-2">
              <Button
                variant={selectedRole === 'company-owner' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole('company-owner')}
                className="gap-2"
              >
                <Building2 className="w-4 h-4" />
                Company Owner
              </Button>
              <Button
                variant={selectedRole === 'agency-owner' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole('agency-owner')}
                className="gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Agency Owner
              </Button>
              <Button
                variant={selectedRole === 'manager' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole('manager')}
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                Manager
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="demo" className="max-w-7xl mx-auto p-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>

        {/* Live Demo Tab */}
        <TabsContent value="demo" className="space-y-6">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Demo Mode Active</h3>
                <p className="text-sm text-blue-700 mt-1">
                  This is a demonstration with sample data. In production, this would connect to your real timesheet data via Supabase.
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">Role: {selectedRole}</Badge>
                  <Badge variant="secondary">
                    Rate Visibility: {selectedRole === 'manager' ? 'Limited' : 'Full'}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <BatchApprovalView
            companyId="demo-company-123"
            userRole={selectedRole}
            showRates={selectedRole !== 'manager'}
            demoMode={true}
          />
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Multi-Select Approval</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Select multiple contractors with checkboxes and approve all their timesheets with a single click.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Individual or bulk selection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Visual feedback on selection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Instant total calculations</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">Smart Filtering</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Powerful filters to quickly find the timesheets that need your attention.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Filter by status (submitted, approved, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Search by contractor name</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Date range selection (week, month)</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">Real-time Totals</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                See cumulative hours and billing amounts update instantly as you make selections.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span>Total hours across all selected</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span>Total billable amount (role-based)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span>Pending approval count</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg">Batch Rejection</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Reject multiple timesheets at once with a clear reason for contractors to review.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <span>Mandatory rejection reason</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <span>Automatic notification to contractors</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <span>Reason appended to entry notes</span>
                </li>
              </ul>
            </Card>
          </div>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Typical Approval Workflow</h3>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Filter to Submitted Timesheets</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the status filter to show only timesheets awaiting your approval. This eliminates noise from drafts and already-approved entries.
                  </p>
                  <Badge variant="secondary" className="mt-2">Filter: Submitted</Badge>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Review and Select Contractors</h4>
                  <p className="text-sm text-muted-foreground">
                    Click checkboxes next to contractors whose hours look reasonable. Use "Select All" if you're confident about all submissions.
                  </p>
                  <Badge variant="secondary" className="mt-2">Quick scan: Hours + Amount</Badge>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Check Cumulative Totals</h4>
                  <p className="text-sm text-muted-foreground">
                    The batch approval bar shows total hours and billing amounts. Verify these match your project budgets and expectations.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">Total: 200h</Badge>
                    <Badge variant="secondary">Amount: $15,000</Badge>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-semibold">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Approve All at Once</h4>
                  <p className="text-sm text-muted-foreground">
                    Click "Approve (X)" button to approve all selected timesheets simultaneously. Instant notification sent to contractors.
                  </p>
                  <Badge variant="default" className="mt-2 bg-green-600">✓ Approved 5 timesheets</Badge>
                </div>
              </div>

              {/* Alternative Step */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">
                    ⚠
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Alternative: Batch Rejection</h4>
                  <p className="text-sm text-muted-foreground">
                    If you find issues, select problematic timesheets and click "Reject (X)". Provide a clear reason so contractors know what to fix.
                  </p>
                  <Badge variant="destructive" className="mt-2">Rejection reason required</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Time Comparison */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <h3 className="font-semibold text-lg mb-4">Time Savings Breakdown</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">❌ Old Way (Individual)</h4>
                <ul className="space-y-2 text-sm">
                  <li>1. Open timesheet → <span className="text-muted-foreground">10 sec</span></li>
                  <li>2. Review entries → <span className="text-muted-foreground">20 sec</span></li>
                  <li>3. Click approve → <span className="text-muted-foreground">5 sec</span></li>
                  <li>4. Close modal → <span className="text-muted-foreground">5 sec</span></li>
                  <li className="pt-2 border-t font-semibold">
                    Total per person: <span className="text-destructive">40 seconds</span>
                  </li>
                  <li className="font-semibold">
                    For 10 people: <span className="text-destructive">6.7 minutes</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">✅ New Way (Batch)</h4>
                <ul className="space-y-2 text-sm">
                  <li>1. Filter to submitted → <span className="text-muted-foreground">2 sec</span></li>
                  <li>2. Click "Select All" → <span className="text-muted-foreground">1 sec</span></li>
                  <li>3. Review totals → <span className="text-muted-foreground">5 sec</span></li>
                  <li>4. Click approve → <span className="text-muted-foreground">1 sec</span></li>
                  <li className="pt-2 border-t font-semibold">
                    Total for batch: <span className="text-green-600">9 seconds</span>
                  </li>
                  <li className="font-semibold">
                    For 10 people: <span className="text-green-600">9 seconds</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t text-center">
              <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-lg border-2 border-green-500">
                <Zap className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <p className="text-2xl font-semibold text-green-600">94% faster</p>
                  <p className="text-sm text-muted-foreground">Save 6+ minutes every approval cycle</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

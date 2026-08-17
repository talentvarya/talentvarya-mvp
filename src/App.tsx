/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';

// Public Pages
import { LandingPage } from './components/public/LandingPage';
import { JobSearchPage } from './components/public/JobSearchPage';
import { JobDetailsPage } from './components/public/JobDetailsPage';
import { PricingPage } from './components/public/PricingPage';
import { HelpCenterPage } from './components/public/HelpCenterPage';

// Candidate Pages
import { CandidateDashboard } from './components/candidate/CandidateDashboard';
import { CandidateApplications } from './components/candidate/CandidateApplications';

// Employer Pages
import { EmployerDashboard } from './components/employer/EmployerDashboard';
import { ManageJobsPage } from './components/employer/ManageJobsPage';
import { CandidatesPipeline } from './components/employer/CandidatesPipeline';

// Admin Page
import { AdminCentre } from './components/admin/AdminCentre';

// Modals & Drawers
import { AuthModal } from './components/auth/AuthModal';
import { ApplyModal } from './components/public/ApplyModal';
import { ProfileSetupModal } from './components/candidate/ProfileSetupModal';
import { EmployerRegistrationModal } from './components/employer/EmployerRegistrationModal';
import { PostJobModal } from './components/employer/PostJobModal';
import { CandidateReviewDrawer } from './components/employer/CandidateReviewDrawer';
import { PlacementDetailsDrawer } from './components/admin/PlacementDetailsDrawer';
import { BannerManagerModal } from './components/employer/BannerManagerModal';
import { MockEmailInboxModal } from './components/common/MockEmailInboxModal';
import { ChatbotWidget } from './components/common/ChatbotWidget';

const MainContent: React.FC = () => {
  const { currentPage, userRole } = useApp();

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage />;
      case 'jobs':
        return <JobSearchPage />;
      case 'job-details':
        return <JobDetailsPage />;
      case 'pricing':
        return <PricingPage />;
      case 'help-center':
        return <HelpCenterPage />;
      case 'candidate-dashboard':
        return userRole === 'candidate' ? <CandidateDashboard /> : <LandingPage />;
      case 'candidate-applications':
        return userRole === 'candidate' ? <CandidateApplications /> : <LandingPage />;
      case 'employer-dashboard':
        return userRole === 'employer' ? <EmployerDashboard /> : <LandingPage />;
      case 'employer-jobs':
        return userRole === 'employer' ? <ManageJobsPage /> : <LandingPage />;
      case 'employer-candidates':
        return userRole === 'employer' ? <CandidatesPipeline /> : <LandingPage />;
      case 'admin-centre':
        return userRole === 'admin' ? <AdminCentre /> : <LandingPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Global Header */}
      <Header />

      {/* Main Viewport */}
      <main className="flex-1 w-full">
        {renderCurrentView()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <AuthModal />
      <ApplyModal />
      <ProfileSetupModal />
      <EmployerRegistrationModal />
      <PostJobModal />
      <CandidateReviewDrawer />
      <PlacementDetailsDrawer />
      <BannerManagerModal />
      <MockEmailInboxModal />
      <ChatbotWidget />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

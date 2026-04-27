import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/hooks/useRedux";
import NotFound from "@/pages/not-found";

import { NewPassword } from "@/pages/auth-pages/NewPassword";
import { Login } from "@/pages/auth-pages/Login";
import CreateContract from "@/pages/contracts/CreateContract";
import { Loading } from "@/pages/Loading";

import { ResetPassword } from "@/pages/auth-pages/ResetPassword";
import { Verify } from "@/pages/auth-pages/Verify";
import Templates from "@/pages/templates/Templates";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/projects/Projects";
import Apartments from "@/pages/apartments/Apartments";
import CreateApartment from "@/pages/apartments/CreateApartment";
import UpdateApartment from "@/pages/apartments/UpdateApartment";
import ViewApartment from "@/pages/apartments/ViewApartment";
import CreateProject from "@/pages/projects/CreateProject";
import AddProjectMedia from "@/pages/projects/AddProjectMedia";
import AddProjectStage from "@/pages/projects/AddProjectStage";
import ProjectProfile from "@/pages/ProjectProfile";
import UpdateProject from "@/pages/projects/UpdateProject";
import Materials from "@/pages/materials/Materials";
import CreateMaterial from "@/pages/materials/CreateMaterial";
import UpdateMaterial from "@/pages/materials/UpdateMaterial";
import ViewMaterial from "@/pages/materials/ViewMaterial";
 import CreateLegality from "@/pages/legality/CreateLegality";
import UpdateLegality from "@/pages/legality/UpdateLegality";
import ViewLegality from "@/pages/legality/ViewLegality";
import CreateTemplate from "@/pages/templates/CreateTemplate";
import ViewTemplate from "@/pages/templates/ViewTemplate";
import UpdateTemplate from "@/pages/templates/UpdateTemplate";
import Legality from "./pages/legality/Legality";
import Users from "./pages/users/Users";
import CreateUser from "./pages/users/CreateUser";
import Roles from "./pages/roles/Roles";
import CreateRole from "./pages/roles/CreateRole";
import UpdateRole from "./pages/roles/UpdateRole";
import Countries from "./pages/countries/Countries";
import CreateCountry from "./pages/countries/CreateCountry";
import UpdateCountry from "./pages/countries/UpdateCountry";
import Cities from "./pages/cities/Cities";
import CreateCity from "./pages/cities/CreateCity";
import UpdateCity from "./pages/cities/UpdateCity";
import Banks from "./pages/finance/Banks";
import CreateBank from "./pages/finance/CreateBank";
import UpdateBank from "@/pages/finance/UpdateBank";
import Clients from "@/pages/clients/Clients";
import CreateClient from "@/pages/clients/CreateClient";
import UpdateClient from "@/pages/clients/UpdateClient";
import ViewClient from "@/pages/clients/ViewClient";
import Contracts from "@/pages/contracts/Contracts";
import ApproveContracts from "@/pages/contracts/ApproveContracts";


import Salesman from "@/pages/salesman/Salesman";
import CreateSalesman from "@/pages/salesman/CreateSalesman";
import UpdateSalesman from "@/pages/salesman/UpdateSalesman";
import ViewSalesman from "@/pages/salesman/ViewSalesman";
import FinanceDashboard from "@/pages/finance/FinanceDashboard";

import { useLocation } from "wouter";

function ProtectedRoute({ component: Component, resource, action = 'READ', ...rest }: any) {
  const token = localStorage.getItem("token");
  const { user } = useAppSelector((state: any) => state.auth);
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  if (!token) {
    setLocation("/");
    return null;
  }

  if (resource) {
    const hasPermission = user?.role?.permissions?.some((p: any) => {
      const normalizedResource = p.resource.includes(':') ? p.resource.split(':')[1] : p.resource;
      return (normalizedResource === resource || p.resource === resource || p.resource === `${action.toLowerCase()}:${resource}`) &&
             p.actions?.includes(action);
    });

    if (!hasPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-10 text-center">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {t('common.accessDenied')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {t('common.accessDeniedDesc')}
            </p>
            <button 
              onClick={() => setLocation('/dashboard')}
              className="w-full h-12 flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              {t('common.goDashboard')}
            </button>
          </div>
        </div>
      );
    }
  }

  return <Component {...rest} />;
}

function PublicRoute({ component: Component, ...rest }: any) {
  const token = localStorage.getItem("token");
  const [, setLocation] = useLocation();

  if (token) {
    setLocation("/dashboard");
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/">
        <PublicRoute component={Login} />
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard}   resource="resources-dashboard"/>
      </Route>
      
      <Route path="/templates">
        <ProtectedRoute component={Templates} resource="template" />
      </Route>
      <Route path="/templates/new">
        <ProtectedRoute component={CreateTemplate} resource="template" action="CREATE" />
      </Route>
      <Route path="/templates/:id">
        <ProtectedRoute component={ViewTemplate} resource="template" />
      </Route>
      <Route path="/templates/:id/edit">
        <ProtectedRoute component={UpdateTemplate} resource="template" action="UPDATE" />
      </Route>
      
      <Route path="/legality">
        <ProtectedRoute component={Legality} resource="legality" />
      </Route>
      <Route path="/legality/new">
        <ProtectedRoute component={CreateLegality} resource="legality" action="CREATE" />
      </Route>
      <Route path="/legality/:id">
        <ProtectedRoute component={ViewLegality} resource="legality" />
      </Route>
      <Route path="/legality/:id/edit">
        <ProtectedRoute component={UpdateLegality} resource="legality" action="UPDATE" />
      </Route>
      
      <Route path="/users">
        <ProtectedRoute component={Users} resource="user" />
      </Route>
      <Route path="/users/new">
        <ProtectedRoute component={CreateUser} resource="user" action="CREATE" />
      </Route>
      
      <Route path="/salesman">
        <ProtectedRoute component={Salesman} resource="salesman" />
      </Route>
      <Route path="/salesman/new">
        <ProtectedRoute component={CreateSalesman} resource="salesman" action="CREATE" />
      </Route>
      <Route path="/salesman/:id/edit">
        <ProtectedRoute component={UpdateSalesman} resource="salesman" action="UPDATE" />
      </Route>
      <Route path="/salesman/:id">
        <ProtectedRoute component={ViewSalesman} resource="salesman" />
      </Route>
      
      <Route path="/roles">
        <ProtectedRoute component={Roles} resource="role-permission" />
      </Route>
      <Route path="/roles/new">
        <ProtectedRoute component={CreateRole} resource="role-permission" action="CREATE" />
      </Route>
      <Route path="/roles/:id/edit">
        <ProtectedRoute component={UpdateRole} resource="role-permission" action="UPDATE" />
      </Route>
      
      <Route path="/countries">
        <ProtectedRoute component={Countries} resource="country" />
      </Route>
      <Route path="/countries/new">
        <ProtectedRoute component={CreateCountry} resource="country" action="CREATE" />
      </Route>
      <Route path="/countries/:id/edit">
        <ProtectedRoute component={UpdateCountry} resource="country" action="UPDATE" />
      </Route>
      
      <Route path="/cities">
        <ProtectedRoute component={Cities} resource="city" />
      </Route>
      <Route path="/cities/new">
        <ProtectedRoute component={CreateCity} resource="city" action="CREATE" />
      </Route>
      <Route path="/cities/:id/edit">
        <ProtectedRoute component={UpdateCity} resource="city" action="UPDATE" />
      </Route>
      
      <Route path="/banks">
        <ProtectedRoute component={Banks} resource="bank" />
      </Route>
      <Route path="/banks/new">
        <ProtectedRoute component={CreateBank} resource="bank" action="CREATE" />
      </Route>
      <Route path="/banks/:id/edit">
        <ProtectedRoute component={UpdateBank} resource="bank" action="UPDATE" />
      </Route>
      
      <Route path="/finance-dashboard">
        <ProtectedRoute component={FinanceDashboard} resource="finance-dashboard" />
      </Route>
      
      <Route path="/clients">
        <ProtectedRoute component={Clients} resource="client" />
      </Route>
      <Route path="/clients/new">
        <ProtectedRoute component={CreateClient} resource="client" action="CREATE" />
      </Route>
      <Route path="/clients/:id/edit">
        <ProtectedRoute component={UpdateClient} resource="client" action="UPDATE" />
      </Route>
      <Route path="/clients/:id">
        <ProtectedRoute component={ViewClient} resource="client" />
      </Route>
      
      <Route path="/contracts">
        <ProtectedRoute component={Contracts} resource="contract" />
      </Route>
      <Route path="/approve-contracts">
        <ProtectedRoute component={ApproveContracts} resource="contract-approval" action="UPDATE" />
      </Route>
      <Route path="/contracts/new">
        <ProtectedRoute component={CreateContract} resource="contract" action="CREATE" />
      </Route>
 
      <Route path="/projects">
        <ProtectedRoute component={Projects} resource="project" />
      </Route>
      <Route path="/apartments">
        <ProtectedRoute component={Apartments} resource="apartment" />
      </Route>
      <Route path="/apartments/new">
        <ProtectedRoute component={CreateApartment} resource="apartment" action="CREATE" />
      </Route>
      <Route path="/apartments/:id">
        <ProtectedRoute component={ViewApartment} resource="apartment" />
      </Route>
      <Route path="/apartments/:id/edit">
        <ProtectedRoute component={UpdateApartment} resource="apartment" action="UPDATE" />
      </Route>
      <Route path="/projects/new">
        <ProtectedRoute component={CreateProject} resource="project" action="CREATE" />
      </Route>
      <Route path="/projects/:id/edit">
        <ProtectedRoute component={UpdateProject} resource="project" action="UPDATE" />
      </Route>
      <Route path="/projects/:id">
        <ProtectedRoute component={ProjectProfile} resource="project" />
      </Route>
      <Route path="/projects/:id/media">
        <ProtectedRoute component={AddProjectMedia} resource="project" action="UPDATE" />
      </Route>
      <Route path="/projects/:id/stages">
        <ProtectedRoute component={AddProjectStage} resource="project" action="UPDATE" />
      </Route>
      
      <Route path="/materials">
        <ProtectedRoute component={Materials} resource="material" />
      </Route>
      <Route path="/materials/new">
        <ProtectedRoute component={CreateMaterial} resource="material" action="CREATE" />
      </Route>
      <Route path="/materials/:id/edit">
        <ProtectedRoute component={UpdateMaterial} resource="material" action="UPDATE" />
      </Route>
      <Route path="/materials/:id">
        <ProtectedRoute component={ViewMaterial} resource="material" />
      </Route>

      <Route path="/loading">
        <ProtectedRoute component={Loading} />
      </Route>
      
      <Route path="/reset-password">
        <PublicRoute component={ResetPassword} />
      </Route>
      <Route path="/verify">
        <PublicRoute component={Verify} />
      </Route>
      <Route path="/new-password">
        <PublicRoute component={NewPassword} />
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}



function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <HotToaster position="top-right" reverseOrder={false} />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

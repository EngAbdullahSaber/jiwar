import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
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


import Salesman from "@/pages/salesman/Salesman";
import CreateSalesman from "@/pages/salesman/CreateSalesman";
import UpdateSalesman from "@/pages/salesman/UpdateSalesman";

import { useLocation } from "wouter";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const token = localStorage.getItem("token");
  const [, setLocation] = useLocation();

  if (!token) {
    setLocation("/");
    return null;
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
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/templates">
        <ProtectedRoute component={Templates} />
      </Route>
      <Route path="/templates/new">
        <ProtectedRoute component={CreateTemplate} />
      </Route>
      <Route path="/templates/:id">
        <ProtectedRoute component={ViewTemplate} />
      </Route>
      <Route path="/templates/:id/edit">
        <ProtectedRoute component={UpdateTemplate} />
      </Route>
      
      <Route path="/legality">
        <ProtectedRoute component={Legality} />
      </Route>
      <Route path="/legality/new">
        <ProtectedRoute component={CreateLegality} />
      </Route>
      <Route path="/legality/:id">
        <ProtectedRoute component={ViewLegality} />
      </Route>
      <Route path="/legality/:id/edit">
        <ProtectedRoute component={UpdateLegality} />
      </Route>
      
      <Route path="/users">
        <ProtectedRoute component={Users} />
      </Route>
      <Route path="/users/new">
        <ProtectedRoute component={CreateUser} />
      </Route>
      
      <Route path="/salesman">
        <ProtectedRoute component={Salesman} />
      </Route>
      <Route path="/salesman/new">
        <ProtectedRoute component={CreateSalesman} />
      </Route>
      <Route path="/salesman/:id/edit">
        <ProtectedRoute component={UpdateSalesman} />
      </Route>
      
      <Route path="/roles">
        <ProtectedRoute component={Roles} />
      </Route>
      <Route path="/roles/new">
        <ProtectedRoute component={CreateRole} />
      </Route>
      <Route path="/roles/:id/edit">
        <ProtectedRoute component={UpdateRole} />
      </Route>
      
      <Route path="/countries">
        <ProtectedRoute component={Countries} />
      </Route>
      <Route path="/countries/new">
        <ProtectedRoute component={CreateCountry} />
      </Route>
      <Route path="/countries/:id/edit">
        <ProtectedRoute component={UpdateCountry} />
      </Route>
      
      <Route path="/cities">
        <ProtectedRoute component={Cities} />
      </Route>
      <Route path="/cities/new">
        <ProtectedRoute component={CreateCity} />
      </Route>
      <Route path="/cities/:id/edit">
        <ProtectedRoute component={UpdateCity} />
      </Route>
      
      <Route path="/banks">
        <ProtectedRoute component={Banks} />
      </Route>
      <Route path="/banks/new">
        <ProtectedRoute component={CreateBank} />
      </Route>
      <Route path="/banks/:id/edit">
        <ProtectedRoute component={UpdateBank} />
      </Route>
      
      <Route path="/clients">
        <ProtectedRoute component={Clients} />
      </Route>
      <Route path="/clients/new">
        <ProtectedRoute component={CreateClient} />
      </Route>
      <Route path="/clients/:id/edit">
        <ProtectedRoute component={UpdateClient} />
      </Route>
      <Route path="/clients/:id">
        <ProtectedRoute component={ViewClient} />
      </Route>
      
      <Route path="/contracts">
        <ProtectedRoute component={Contracts} />
      </Route>
      <Route path="/contracts/new">
        <ProtectedRoute component={CreateContract} />
      </Route>

      <Route path="/projects">
        <ProtectedRoute component={Projects} />
      </Route>
      <Route path="/apartments">
        <ProtectedRoute component={Apartments} />
      </Route>
      <Route path="/apartments/new">
        <ProtectedRoute component={CreateApartment} />
      </Route>
      <Route path="/projects/new">
        <ProtectedRoute component={CreateProject} />
      </Route>
      <Route path="/projects/:id/edit">
        <ProtectedRoute component={UpdateProject} />
      </Route>
      <Route path="/projects/:id">
        <ProtectedRoute component={ProjectProfile} />
      </Route>
      <Route path="/projects/:id/media">
        <ProtectedRoute component={AddProjectMedia} />
      </Route>
      <Route path="/projects/:id/stages">
        <ProtectedRoute component={AddProjectStage} />
      </Route>
      
      <Route path="/materials">
        <ProtectedRoute component={Materials} />
      </Route>
      <Route path="/materials/new">
        <ProtectedRoute component={CreateMaterial} />
      </Route>
      <Route path="/materials/:id/edit">
        <ProtectedRoute component={UpdateMaterial} />
      </Route>
      <Route path="/materials/:id">
        <ProtectedRoute component={ViewMaterial} />
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

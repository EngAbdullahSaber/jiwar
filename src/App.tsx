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

import Salesman from "@/pages/salesman/Salesman";
import CreateSalesman from "@/pages/salesman/CreateSalesman";
import UpdateSalesman from "@/pages/salesman/UpdateSalesman";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/templates" component={Templates} />
      <Route path="/templates/new" component={CreateTemplate} />
      <Route path="/templates/:id" component={ViewTemplate} />
      <Route path="/templates/:id/edit" component={UpdateTemplate} />
      <Route path="/legality" component={Legality} />
      <Route path="/legality/new" component={CreateLegality} />
      <Route path="/legality/:id" component={ViewLegality} />
      <Route path="/legality/:id/edit" component={UpdateLegality} />
      <Route path="/users" component={Users} />
      <Route path="/salesman" component={Salesman} />
      <Route path="/salesman/new" component={CreateSalesman} />
      <Route path="/salesman/:id/edit" component={UpdateSalesman} />
      <Route path="/users/new" component={CreateUser} />
      <Route path="/roles" component={Roles} />
      <Route path="/roles/new" component={CreateRole} />
      <Route path="/roles/:id/edit" component={UpdateRole} />
      <Route path="/countries" component={Countries} />
      <Route path="/countries/new" component={CreateCountry} />
      <Route path="/countries/:id/edit" component={UpdateCountry} />
      <Route path="/cities" component={Cities} />
      <Route path="/cities/new" component={CreateCity} />
      <Route path="/cities/:id/edit" component={UpdateCity} />
      <Route path="/banks" component={Banks} />
      <Route path="/banks/new" component={CreateBank} />
      <Route path="/banks/:id/edit" component={UpdateBank} />
      <Route path="/clients" component={Clients} />
      <Route path="/clients/new" component={CreateClient} />
      <Route path="/clients/:id/edit" component={UpdateClient} />
       <Route path="/projects" component={Projects} />
      <Route path="/apartments" component={Apartments} />
      <Route path="/apartments/new" component={CreateApartment} />
      <Route path="/projects/new" component={CreateProject} />
      <Route path="/projects/:id/edit" component={UpdateProject} />
      <Route path="/projects/:id" component={ProjectProfile} />
      <Route path="/projects/:id/media" component={AddProjectMedia} />
      <Route path="/projects/:id/stages" component={AddProjectStage} />
      <Route path="/materials" component={Materials} />
      <Route path="/materials/new" component={CreateMaterial} />
      <Route path="/materials/:id/edit" component={UpdateMaterial} />
      <Route path="/materials/:id" component={ViewMaterial} />
      <Route path="/loading" component={Loading} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/verify" component={Verify} />
      <Route path="/new-password" component={NewPassword} />
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

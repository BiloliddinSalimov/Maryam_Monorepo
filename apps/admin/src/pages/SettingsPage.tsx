import { User, Shield, Languages, Settings } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHero from "@/components/shared/PageHero";
import ProfileTab   from "@/components/settings/ProfileTab";
import SecurityTab  from "@/components/settings/SecurityTab";
import LanguagesTab from "@/components/settings/LanguagesTab";

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10">
      <PageHero icon={Settings} title="Sozlamalar" />

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3 h-10 p-1 mb-5 bg-zinc-100 rounded-xl">
          <TabsTrigger
            value="profile"
            className="rounded-lg text-[13px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-zinc-800 text-zinc-500"
          >
            <User size={14} className="mr-1.5" />
            Profil
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-lg text-[13px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-zinc-800 text-zinc-500"
          >
            <Shield size={14} className="mr-1.5" />
            Xavfsizlik
          </TabsTrigger>
          <TabsTrigger
            value="languages"
            className="rounded-lg text-[13px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-zinc-800 text-zinc-500"
          >
            <Languages size={14} className="mr-1.5" />
            Tillar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile"   className="mt-0"><ProfileTab /></TabsContent>
        <TabsContent value="security"  className="mt-0"><SecurityTab /></TabsContent>
        <TabsContent value="languages" className="mt-0"><LanguagesTab /></TabsContent>
      </Tabs>
    </div>
  );
}

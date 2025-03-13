
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serviceCategories } from "@/data/serviceCategories";
import { ServiceCard } from "./ServiceCard";

export const ServiceCategoryTabs = () => {
  const [selectedCategory, setSelectedCategory] = useState("general");

  const getCategoryIcon = (categoryId: string) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : null;
  };

  return (
    <Tabs 
      defaultValue="general" 
      value={selectedCategory}
      onValueChange={setSelectedCategory}
      className="w-full"
    >
      <div className="relative mb-10">
        <TabsList className="flex flex-wrap justify-center gap-2">
          {serviceCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="px-4 py-3 data-[state=active]:bg-primary/10 rounded-full flex items-center gap-2"
            >
              <category.icon className={`h-5 w-5 text-${category.color}`} />
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {serviceCategories.map((category) => (
        <TabsContent key={category.id} value={category.id} className="animate-fade-in mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.services.map((service, idx) => (
              <ServiceCard 
                key={idx}
                service={service} 
                categoryIcon={getCategoryIcon(selectedCategory)} 
                index={idx} 
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

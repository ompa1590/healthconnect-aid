
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { allTreatments, healthCategories } from "@/data/serviceCategories";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AllTreatments = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredTreatments = selectedCategory 
    ? allTreatments.filter(treatment => treatment.category === selectedCategory)
    : allTreatments;

  const getCategoryIcon = (categoryId: string) => {
    const category = healthCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : null;
  }

  const getCategoryColor = (categoryId: string) => {
    const category = healthCategories.find(cat => cat.id === categoryId);
    return category ? category.color : "primary";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 mb-8">
        <Button 
          variant={selectedCategory === null ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="rounded-full"
        >
          All
        </Button>
        {healthCategories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="rounded-full flex gap-2"
          >
            <category.icon className="h-4 w-4" />
            {category.title}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTreatments.map((treatment) => {
          const CategoryIcon = getCategoryIcon(treatment.category);
          const categoryColor = getCategoryColor(treatment.category);
          
          return (
            <div
              key={treatment.id}
              className="relative"
              onMouseEnter={() => setHoveredId(treatment.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer border-muted/50 h-full">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{treatment.title}</h3>
                  </div>
                  {CategoryIcon && (
                    <div className={`rounded-full bg-${categoryColor}/10 p-1.5`}>
                      <CategoryIcon className={`h-3.5 w-3.5 text-${categoryColor}`} />
                    </div>
                  )}
                </div>
              </Card>

              <AnimatePresence>
                {hoveredId === treatment.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-10"
                  >
                    <Card className="p-4 border shadow-md h-full flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-base font-semibold">{treatment.title}</h4>
                        {CategoryIcon && (
                          <div className={`rounded-full bg-${categoryColor}/10 p-1.5`}>
                            <CategoryIcon className={`h-3.5 w-3.5 text-${categoryColor}`} />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{treatment.description}</p>
                      
                      <div className="mt-auto space-y-2">
                        <h5 className="text-xs font-medium text-muted-foreground">Treatment options:</h5>
                        <div className="flex flex-wrap gap-1.5">
                          {treatment.treatments.slice(0, 3).map((option, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                          {treatment.treatments.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{treatment.treatments.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <Button size="sm" className="w-full mt-2" asChild>
                          <Link to={treatment.path}>
                            Learn More
                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllTreatments;

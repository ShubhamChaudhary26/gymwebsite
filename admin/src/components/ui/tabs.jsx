// components/ui/tabs.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext({});

const Tabs = ({ value, onValueChange, defaultValue, children, className }) => {
  const [selected, setSelected] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  const handleValueChange = (newValue) => {
    setSelected(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ selected, handleValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className }) => {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, children, className }) => {
  const { selected, handleValueChange } = React.useContext(TabsContext);
  const isSelected = selected === value;

  return (
    <button
      type="button"
      onClick={() => handleValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected && "bg-background text-foreground shadow-sm",
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, className }) => {
  const { selected } = React.useContext(TabsContext);

  if (selected !== value) return null;

  return <div className={cn("mt-2", className)}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };

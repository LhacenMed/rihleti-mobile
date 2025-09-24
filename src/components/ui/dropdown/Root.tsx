import React, { createContext, useContext, useState, useCallback } from "react";

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<any>;
  contentRef: React.RefObject<any>;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdown must be used within a DropdownMenu.Root");
  }
  return context;
};

interface RootProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Root: React.FC<RootProps> = ({
  children,
  defaultOpen = false,
  open,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const triggerRef = React.useRef(null);
  const contentRef = React.useRef(null);

  // Use controlled or uncontrolled state
  const isOpen = open !== undefined ? open : internalOpen;

  const setIsOpen = useCallback(
    (newOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [open, onOpenChange]
  );

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        setIsOpen,
        triggerRef,
        contentRef,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

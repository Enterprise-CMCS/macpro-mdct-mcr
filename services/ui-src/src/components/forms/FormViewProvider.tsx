import { useEffect, useState, createContext, ReactNode, useMemo } from "react";
import { useLocation } from "react-router";
import { mcparRoutes } from "forms/mcpar";

export const FormViewContext = createContext<any>({
  form: {} as any,
  fetchForm: Function,
});

export const FormViewProvider = ({ children }: Props) => {
  const [formView, setFormView] = useState<any>();

  const fetchFormView = async (path: string) => {
    const form = mcparRoutes.filter((report: any) => report.path === path)[0];
    setFormView(form);
  };

  const { pathname } = useLocation();

  useEffect(() => {
    if (
      pathname.includes("/mcpar") &&
      pathname !== "/mcpar/get-started" &&
      pathname !== "/mcpar/dashboard"
    ) {
      fetchFormView(pathname);
    }
  }, [pathname]);

  const providerValue = useMemo(
    () => ({
      formView,
      fetchFormView,
    }),
    [formView]
  );

  return (
    <FormViewContext.Provider value={providerValue}>
      {children}
    </FormViewContext.Provider>
  );
};

interface Props {
  children?: ReactNode;
}

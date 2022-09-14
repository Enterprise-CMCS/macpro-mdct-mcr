import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom"
// components
import { ReportContext } from "components";
// utils
import { AnyObject } from "types";
import {
  flattenReportRoutesArray,
  getFormTemplate,
  writeFormTemplate,
  findRoutes,
} from "utils";
// verbiage
import { formTemplateErrors } from "verbiage/errors";

export const TemplateContext = createContext<AnyObject>({
  formRoutes: undefined,
  formTemplate: undefined,
  fetchFormTemplate: Function,
  saveFormTemplate: Function,
  routesLoaded: undefined,
  previousRoute: undefined,
  nextRoute: undefined,
  errorMessage: undefined,
});

export const TemplateProvider = ({ children }: Props) => {
  const [formRoutes, setFormRoutes] = useState<AnyObject>();
  const [formTemplate, setFormTemplate] = useState<AnyObject>();
  const [error, setError] = useState<string>();
  const [routesLoaded, setRoutesLoaded] = useState<boolean>(false);
  const [previousRoute, setPreviousRoute] = useState<string>();
  const [nextRoute, setNextRoute] = useState<string>();

  const { report } = useContext(ReportContext);

  const fetchFormTemplate = async (formTemplateId: string) => {
    try {
      const result = await getFormTemplate(formTemplateId);
      const formTemplate = result.formTemplate;
      setFormTemplate(formTemplate);
      // flatten and set routes
      const routes = flattenReportRoutesArray(formTemplate.routes);
      setFormRoutes(routes);
      setRoutesLoaded(true);
    } catch (e: any) {
      setError(formTemplateErrors.GET_FORM_TEMPLATE_FAILED);
    }
  };

  const saveFormTemplate = async (object: AnyObject) => {
    try {
      await writeFormTemplate(object);
    } catch (e: any) {
      setError(formTemplateErrors.SET_FORM_TEMPLATE_FAILED);
    }
  };

  useEffect(() => {
    if (report?.formTemplateId) {
      fetchFormTemplate(report.formTemplateId);
    }
  }, [report]);

  const { pathname } = useLocation();

  useEffect(() => {
    if (formRoutes && formTemplate?.basePath) {
      const { previousRoute: foundPreviousRoute, nextRoute: foundNextRoute } = findRoutes(
        pathname,
        formRoutes,
        formTemplate.basePath
      );
      setPreviousRoute(foundPreviousRoute);
      setNextRoute(foundNextRoute);
    }
  }, [formRoutes, formTemplate])

  const providerValue = useMemo(
    () => ({
      formRoutes,
      formTemplate,
      fetchFormTemplate,
      saveFormTemplate,
      routesLoaded,
      previousRoute,
      nextRoute,
      errorMessage: error,
    }),
    [formRoutes, formTemplate, error, routesLoaded, previousRoute, nextRoute]
  );

  return (
    <TemplateContext.Provider value={providerValue}>
      {children}
    </TemplateContext.Provider>
  );
};

interface Props {
  children?: ReactNode;
}

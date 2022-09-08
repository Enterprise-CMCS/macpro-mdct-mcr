import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// components
import { ReportContext } from "components";
// utils
import { AnyObject } from "types";
import {
  flattenReportRoutesArray,
  getFormTemplate,
  writeFormTemplate,
} from "utils";
// verbiage
import { formTemplateErrors } from "verbiage/errors";

export const TemplateContext = createContext<AnyObject>({
  formRoutes: undefined,
  formTemplate: undefined,
  fetchFormTemplate: Function,
  saveFormTemplate: Function,
  errorMessage: undefined,
});

export const TemplateProvider = ({ children }: Props) => {
  const [formRoutes, setFormRoutes] = useState<AnyObject>();
  const [formTemplate, setFormTemplate] = useState<AnyObject>();
  const [error, setError] = useState<string>();

  const { report } = useContext(ReportContext);

  const fetchFormTemplate = async (formTemplateId: string) => {
    try {
      const result = await getFormTemplate(formTemplateId);
      const formTemplate = result.formTemplate;
      setFormTemplate(formTemplate);
      // flatten and set routes
      const routes = flattenReportRoutesArray(formTemplate.routes);
      setFormRoutes(routes);
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

  const providerValue = useMemo(
    () => ({
      formRoutes,
      formTemplate,
      fetchFormTemplate,
      saveFormTemplate,
      errorMessage: error,
    }),
    [formRoutes, formTemplate, error]
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

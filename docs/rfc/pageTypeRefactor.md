# Report Page Type Refactoring Plan

## Goals
1. A single report page type 
2. The ability to specify the specific UI wrappers for various forms (e.g., drawer, modal) at the route level, instead of the component level
3. Flexible component composition that allows for the separation of form fields and the UI that contains those form fields
4. Abstraction of entity management

## Current State 
The codebase currently has 5 distinct report page types based on UI patterns:

1. **StandardReportPage** (simplest)
   - Single form submission
   - No entity management
   - Direct navigation after save

2. **DrawerReportPage** (most complex)
   - Entity CRUD operations
   - Drawer UI for editing entities
   - Complex business logic (analysis methods, standards, ILOs)
   - Conditional rendering based on report type
   - Multiple form configurations (standard form, custom entity form)

3. **ModalDrawerReportPage** 
   - Modal for add/edit entity
   - Drawer for viewing/editing entity details
   - Entity card display

4. **ModalOverlayReportPage** 
   - Modal for add/edit entity
   - Full-screen overlay for entity details
   - Table-based entity display

5. **OverlayReportPage** (336 lines)
   - Table view of entities
   - Multiform overlay for complex entity editing
   - No add/edit modal

| Page Type | Lines | Entities | Modal | Drawer | Overlay | Complexity |
|-----------|-------|----------|-------|--------|---------|------------|
| Standard | 150 | No | No | No | No | Low |
| Drawer | 350 | Yes | No | Yes | No | High |
| ModalDrawer | 350 | Yes | Yes | Yes | No | High |
| ModalOverlay | 334 | Yes | Yes | No | Yes | High |
| Overlay | 300 | Yes | No | No | Yes | Medium |

## Proposed state
1. A new pageType "report"
2. A new ReportPage component
3. The addition of a pageConfig property to the route object, which will define which UI components need to appear at that path, as well as the form fields to pass to those components

### New pageType
- Add a new pageType to the existing PageTypes enum
- Proposed name: "report" (generic enough to serve as the template for any route in a report)

### ReportPage component
- Component will be responsible for parsing the page configuration defined for the route
- Determine which UI components are needed based on the page configuration, along with the necessary handlers. Areas of complexity:
  - How (and where) to handle disclosures and functions for opening, closing, editing, deleting
  - The appropriate level of abstraction for entity display (e.g., entity rows, cards) and entity forms (e.g., modal, drawer, overlay) and where to put the logic and JSX. These could be pulled into separate components that return existing components (e.g., AddEditEntityModal) based on the configuration.
  - Ensuring that entity state management and report state are appropriately in sync
- Update the ReportPageWrapper to display the new component

```
const renderPageSection = (route: ReportRoute) => {
  switch (route.pageType) {
    case PageTypes.REPORT:
      return (
        <ReportPage
          route={route as ReportPageShapeBase}
          validateOnRender={false}
        />
      );
    ...
  }
}
```


### ReportPageConfig

```
interface ReportPageConfig {
  // Display entities
  entityDisplay?: {
    variant: 'rows' | 'cards' | 'table'
    showCount?: boolean
    emptyMessage?: string
  }

  // Entity form configuration
  entityForm?: {
    variant: 'drawer' | 'overlay' | 'modal'
    addForm?: FormJson
    editForm?: FormJson
  }

  // Standard form (non-entity pages)
  standardForm?: FormJson

  // Misc features
  features?: {
    canAddEntities?: boolean
    canDeleteEntities?: boolean
    requiresStandardForm?: boolean
    hidesSidebar?: boolean
  }
}
```

### Adding configuration to the form template

An example of how the configuration might appear in the mcpar.json:

```
{
  path: "/mcpar/plan-level-indicators/ilos",
  pageType: PageTypes.REPORT,
  pageConfig: {
    entityDisplay: {
      variant: 'rows',
      showCount: true
    },
    entityForm: {
      variant: 'drawer',
      editForm: ilosForm
    },
    features: {
      canAddEntities: true,
      canDeleteEntities: true
    }
  },
  entityType: EntityType.ILOS,
  verbiage: { /* ... */ }
}
```

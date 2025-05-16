import { Choice } from "prompts";

export const backToMenu = {
  title: "Back to Menu",
  value: "back",
};

export const generateChoices = (type: string): Choice[] => {
  const choices = [
    {
      title: `Create base ${type}`,
      value: `create${type}`,
    },
    {
      title: `Create filled ${type}`,
      value: `createFilled${type}`,
    },
    {
      title: `Create submitted ${type}`,
      value: `createSubmitted${type}`,
    },
    {
      title: `Create archived ${type}`,
      value: `createArchived${type}`,
    },
    backToMenu,
  ];

  return choices;
};

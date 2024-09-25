import { ColorPrimaryLibrary } from "@/interface/frontendStyle";

export interface QuestDST {
  id: number;
  element: QuestDSTElement[];
}

export interface QuestDSTElement {
  type: 'QUEST_INFO_CARD',
  top: {
    topRowText: string;
    bottomRowText: string;
  },
  right: {
    topRowText: string;
    bottomRowText: string;
  },
  left: {
    topRowText: string;
    bottomRowText: string;
  },
  bottom: {
    percent: number;
    color: ColorPrimaryLibrary.FAIL | ColorPrimaryLibrary.SAFE
  }
}
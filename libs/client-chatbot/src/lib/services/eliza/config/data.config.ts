import { elizaFinals, TElisaFinals } from './finals.config';
import { elizaInitials, TElisaInitials } from './initials.config';
import { elizaKeywords, IKeyword } from './keywords.config';
import { elizaPostTransforms, IElisaPostTransform } from './post-transforms.config';
import { elizaPosts, TElisaPosts } from './posts.config';
import { elizaPres, TElisaPres } from './pres.config';
import { elizaQuits, TElisaQuits } from './quits.config';
import { elizaSynonyms, TElisaSynonyms } from './synonyms.config';

export interface IElizaData {
  initials: TElisaInitials;
  finals: TElisaFinals;
  quits: TElisaQuits;
  pres: TElisaPres;
  posts: TElisaPosts;
  synonyms: TElisaSynonyms;
  keywords: IKeyword[];
  postTransforms: IElisaPostTransform[];
}

export const elizaData: IElizaData = {
  initials: elizaInitials,
  finals: elizaFinals,
  quits: elizaQuits,
  pres: elizaPres,
  posts: elizaPosts,
  synonyms: elizaSynonyms,
  keywords: elizaKeywords,
  postTransforms: elizaPostTransforms,
};

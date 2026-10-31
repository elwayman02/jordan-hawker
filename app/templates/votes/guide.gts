import VoteGuidePage from "#components/votes/vote-guide-page.gts";

import type { TOC } from "@ember/component/template-only";

const GuideTemplate: TOC<{ Args: { model: { slug: string } } }> = <template>
  <VoteGuidePage @slug={{@model.slug}} />
</template>;

export default GuideTemplate;

import CurrentlyReading from "#components/reads/currently-reading.gts";
import ReadsStats from "#components/reads/reads-stats.gts";
import type { Book, Reads } from "#shared/api.ts";

import type { TOC } from "@ember/component/template-only";

import "./reads.css";

interface ReadingNowSignature {
  Args: {
    current: Book[];
    stats: Reads["stats"];
  };
}

/** What I'm reading, with my reading stats beside it (or alone, between books) */
const ReadingNow: TOC<ReadingNowSignature> = <template>
  <div class="reading-now {{unless @current.length 'reading-now--between-books'}}">
    {{#if @current.length}}
      <CurrentlyReading @books={{@current}} />
    {{/if}}
    <ReadsStats @stats={{@stats}} />
  </div>
</template>;

export default ReadingNow;

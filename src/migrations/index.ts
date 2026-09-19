import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260918_153830 from './20260918_153830';
import * as migration_20260919_032852_allow_insights_body_null from './20260919_032852_allow_insights_body_null';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20260918_153830.up,
    down: migration_20260918_153830.down,
    name: '20260918_153830',
  },
  {
    up: migration_20260919_032852_allow_insights_body_null.up,
    down: migration_20260919_032852_allow_insights_body_null.down,
    name: '20260919_032852_allow_insights_body_null'
  },
];

import { storiesOf } from '@storybook/vue'
import {
  boolean,
  text,
  select,
  radios,
} from '@storybook/addon-knobs';
import { template } from '../../templates/badge/default.template';
import documentation from '../../documentation/badge.md'
import {
  iconsList,
  withoutCustomEntity,
} from '../../utils/props-options';
import {
  BADGE_FILL,
  BADGE_TYPES,
} from '../../../src/components/badge/types';

storiesOf('Components|Badge', module).add('Default', () => ({
  template,
  props: {
    type: {
      default: select('Type', withoutCustomEntity(Object.values(BADGE_TYPES)), BADGE_TYPES.BLOCK),
    },
    text: {
      default: text('Text', 'Badge text'),
    },
    icon: {
      default: select('Icon', iconsList, iconsList[0]),
    },
    fill: {
      default: radios('Fill', Object.values(BADGE_FILL), BADGE_FILL.FULL),
    },
    round: {
      default: boolean('Round', false),
    },
  },
  data() {
    return {}
  },
}), {
  notes: { markdown: documentation },
});

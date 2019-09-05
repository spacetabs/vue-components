import { storiesOf } from '@storybook/vue'
import { boolean, text, array, select, number } from '@storybook/addon-knobs';
import { template } from '../../templates/notifications/default.template';
import notificationsDocumentation from '../../documentation/notifications.md'
import { iconsList } from '../../utils/props-options';

const notificationTypes = [
  'info',
  'warning',
  'success',
  'error',
];
const positionValues = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

storiesOf('Components|Notifications', module).add('Default', () => ({
  template,
  props: {
    position: {
      default: select('Position', positionValues, 'bottom-right'),
    },
    type: {
      default: select('Type', notificationTypes, notificationTypes[0]),
    },
    title: {
      default: text('Title', 'Notification title'),
    },
    message: {
      default: text('Message', 'Notification message'),
    },
    closeable: {
      default: boolean('Closeable', true),
    },
    duration: {
      default: number('Duration', 4500),
    },
    icon: {
      default: select('Icon', iconsList, iconsList[0]),
    },
  },
  data() {
    return {}
  },
  methods: {
    callNotification() {
      this.$stNotification({
        type: this.type,
        title: this.title,
        message: this.message,
        closeable: this.closeable,
        duration: this.duration,
        icon: this.icon,
      });
    }
  }
}), {
  notes: { markdown: notificationsDocumentation },
});
import debounce from 'lodash/debounce';
import merge from 'lodash/merge';
import {
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';

import StDropdownOption from '../dropdown-option/index.vue';
import StDropdown from '../dropdown/index.vue';
import StDropdownScript from '../dropdown/script';
import {
  PopperBindProperties,
  PopperPlacement,
  TriggerType,
} from '../popper/types';
import {
  DebounceGetSuggestions,
  FetchSuggestions,
  Suggestion,
} from './types';


@Component({
  name: 'StAutocomplete',
  components: {
    StDropdown,
    StDropdownOption,
  },
})
export default class StAutocomplete extends Vue {
  @Prop({ type: String, default: '' })
  value!: string;

  @Prop({ type: Function, required: true })
  fetchSuggestions!: FetchSuggestions<Suggestion>;

  @Prop({ type: Number, default: 300 })
  fetchSuggestionsDelay!: number;

  @Prop(Boolean)
  fetchOnFocus!: boolean;

  @Prop({ type: Number, default: 1 })
  queryMinLength!: number;

  @Prop({ type: Boolean, default: true })
  closeOnSelect!: boolean;

  @Prop({ type: Boolean, default: true })
  closeOnClear!: boolean;

  @Prop(String)
  prefixIcon!: string;

  @Prop(String)
  suffixIcon!: string;

  @Prop({ type: Boolean, default: true })
  clearable!: boolean;

  @Prop(Boolean)
  required!: boolean;

  @Prop(Boolean)
  disabled!: boolean;

  @Prop(Boolean)
  readonly!: boolean;

  @Prop(String)
  placeholder!: string;

  @Prop(Boolean)
  loading!: boolean;

  @Prop({ type: Object, default: () => ({}) })
  popperProps!: PopperBindProperties;

  extendedPopperProps: PopperBindProperties = {
    arrowVisible: false,
    placement: PopperPlacement.bottom,
    trigger: TriggerType.manual,
    boundariesSelector: 'body',
    appendToBody: false,
  };

  inputValue: string = '';

  suggestions: Suggestion[] = [];

  debounceGetSuggestions: DebounceGetSuggestions = () => {};

  searchLoading: boolean = false;

  popperVisibility: boolean = false;

  @Watch('value', { immediate: true })
  onValueChange(value: string): void {
    this.inputValue = value;
  }

  @Watch('popperVisibility')
  onPopperVisibilityChange(value: boolean): void {
    if (value) {
      this.onDropdownShow();
    } else {
      this.onDropdownHide();
    }
  }

  beforeMount(): void {
    merge(this.extendedPopperProps, this.popperProps);
  }

  mounted(): void {
    this.debounceGetSuggestions = debounce(
      (query: string) => { this.getSuggestions(query); },
      this.fetchSuggestionsDelay,
    );
  }

  checkQueryConditions(query: string): boolean {
    return query.length >= this.queryMinLength;
  }

  togglePopperVisibility(value: boolean): void {
    this.popperVisibility = value;
  }

  getSuggestions(query: string): void {
    if (!this.checkQueryConditions(query)) {
      this.togglePopperVisibility(false);
      return;
    }
    this.searchLoading = true;
    this.suggestions = [];
    this.togglePopperVisibility(true);
    this.fetchSuggestions(query, (suggestions: Suggestion[]) => {
      this.searchLoading = false;
      this.suggestions = suggestions;
    });
  }

  handleInput(value: string): void {
    this.debounceGetSuggestions(value);
    this.$emit('type', value);
  }

  handleFocus(): void {
    if (this.fetchOnFocus && !this.readonly) {
      this.debounceGetSuggestions(this.inputValue);
    }
    this.$emit('focus');
  }

  handleBlur(): void {
    this.$emit('blur');
  }

  onDropdownShow(): void {
    this.$emit('dropdown-show');
  }

  onDropdownHide(): void {
    this.$emit('dropdown-hide');
  }

  onClear(): void {
    if (!this.checkQueryConditions(this.inputValue) || this.closeOnClear) {
      this.togglePopperVisibility(false);
    }
    this.suggestions = [];
    this.$emit('input', '');
    this.$emit('clear');
  }

  selectSuggestion(suggestion: Suggestion): void {
    if (this.closeOnSelect) {
      this.togglePopperVisibility(false);
    }
    this.$emit('input', suggestion);
    this.$emit('select', suggestion);
  }

  openDropdown(): void {
    (this.$refs.dropdown as StDropdownScript).open();
  }

  closeDropdown(): void {
    (this.$refs.dropdown as StDropdownScript).close();
  }
}
export const template = `
  <div class="storybook-components storybook-components--tabs">
    <st-tabs :tabs="tabs"
             @select="selectedTabId = $event.id" />
    <div class="section">
      Selected tab data:<br> 
      {{ getTabById(selectedTabId) }}  
    </div>
  </div>
`;

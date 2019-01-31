# Convext
A ContextAPI-like package for Vue.js modules and dependency injection


This package creates mixins for dependency injection in Vue js components. Other ContextAPI
attempt to mimic the original functionality. This module attempts to leverage the 
Provide/Inject api of Vue and creates Mixins so you can quickly add reactive data to your
Vue app.

To use Convext you only need to import it:

```javascript
// name-convext.js
import Convext from 'convext'

export default Convext('name',{defaultValue:'Sally'});
```

Then to add the reactive properties you can simply add it to your components.

```vue
<!-- get-name.vue -->
<template>
  <div>
    <label for="name">Name</label>
    <input type="text" id="name" v-model="name">
    <name-display />
  </div>
</template>
<script>
  import NameConvext from "./name-convext"
  import NameDisplay from "./name-display"
  export default {
    // since this is Parent we want to Provide the data.
    mixins:[NameConvext.provideMixin()],
    components:{NameDisplay}
  }
</script>
```

```vue
<!-- name-display.vue -->
<template>
  <p>Hi, my name is {{ name }}</p>
</template>
<script>
  import NameConvext from "./name-convext.js"
  export default {
    // since this is a child component we want to inject the data.
    mixins:[NameConvext.injectMixin()]
  }
</script>
```


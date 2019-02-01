import cuid from "cuid"

function defaultOptions(userOptions){
  let userOpts = typeof userOptions === 'object'?userOptions:{};
  let defaultOptions = {
    useProps:false,
    defaultValue:undefined,
    removeTag: true,
    provideTag: 'div',
  };
  let options = Object.assign(defaultOptions,userOpts);
  return options;
}



function getKeys(key, baseID){
  return {
    setKey : key + "Setter-"+baseID,
    getKey : key + "Getter-" + baseID,
    nameKey : key + '-' + baseID,
  }
}

function makeProvideMixin(key, baseID, {useProps, defaultValue}){

  let {setKey, getKey} = getKeys(key, baseID);

  let mixin = {};
  if(useProps){
    mixin = {
      props:{
        [key]:defaultValue,
      },
      provide(){
        return {
          [setKey]:(data)=>{this.$emit('update:'+key,data)},
          [getKey]:()=>this[key],
        }
      }
    }
  }else{
    mixin = {
      data() {
        return {
          [key]: defaultValue,
        };
      },
      provide() {
        return {
          [setKey]:(d)=>{this[key] = d},
          [getKey]:()=>this[key],
        };
      }
    };
  }

  return mixin;
}

function makeInjectMixin(key,baseID, options){
  let {setKey, getKey, nameKey} = getKeys(key,baseID);
  return {
    inject: [getKey, setKey],
    computed: {
      [key]: {
        get() {
          return this[getKey]();
        },
        set(data) {
          this[setKey](data);
        }
      },
      [nameKey]: {
        get() {
          return this[getKey]();
        },
        set(data) {
          this[setKey](data);
        }
      }
    }
  };
}

function makeProvideComponent(key, baseID, {defaultValue, removeTag, provideTag}){

  let {setKey, getKey} = getKeys(key, baseID);

  return {
    props:{
      [key]:defaultValue,
    },
    provide(){
      return {
        [setKey]:(d)=>{this.$emit('update:'+key,d)},
        [getKey]:()=>this[key],
      }
    },
    methods:{
      removeProvideTag(){
        if(!this.elementChildren) this.elementChildren = this.$el.childNodes;
        if(!this.elementParent) this.elementParent = this.$el.parentNode;
        if(!this.element){
          this.elementChildren.forEach(e=>this.elementParent.insertBefore(e, this.$el));
          this.element = this.elementParent.removeChild(this.$el);
        }
      }
    },
    mounted(){
      if(removeTag){this.$nextTick(this.removeProvideTag);}
    },
    updated(){
      if(removeTag){this.$nextTick(this.removeProvideTag);}
    },
    render(h){
      return h(provideTag,this.$slots.default);
    }
  }
}

function makeInjectComponent(key, baseID, options){
  let {setKey, getKey, nameKey} = getKeys(key,baseID);
  return {
    functional:true,
    inject:[setKey, getKey],
    render(h,ctx){
      let slotScope = {
        [key]:ctx.injections[getKey](),
        ['set_'+key]:ctx.injections[setKey],
        [nameKey]:ctx.injections[getKey](),
        ['set_'+nameKey]: ctx.injections[setKey],
      };
      return ctx.data.scopedSlots.default
        ? ctx.data.scopedSlots.default(slotScope)
        :ctx.slots().default
    }
  }
}

export default function(key, userOptions) {
  let options = defaultOptions(userOptions);
  let baseID = cuid();
  return {
    key,
    baseID,
    provideMixin: ()=>makeProvideMixin(key, baseID, options),
    injectMixin: ()=>makeInjectMixin(key, baseID, options),
    provideComponent: ()=>makeProvideComponent(key, baseID, options),
    injectComponent: ()=>makeInjectComponent(key, baseID, options),
    ...getKeys(key, baseID),
  };
}